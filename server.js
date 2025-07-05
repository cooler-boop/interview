/**
 * AI面试助手后端服务
 * 集成职位搜索API和简历分析API
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { body, validationResult } from 'express-validator'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import axios from 'axios'

// 导入简历解析服务
import './server/resumeParser.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 安全中间件
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100次请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
})
app.use('/api/', limiter)

// 文件上传配置
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads')
    try {
      await fs.mkdir(uploadDir, { recursive: true })
      cb(null, uploadDir)
    } catch (error) {
      cb(error)
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件格式'), false)
    }
  }
})

/**
 * 职位搜索API
 */
app.post('/api/search-jobs', 
  [
    body('query').notEmpty().withMessage('搜索关键词不能为空'),
    body('location').optional(),
    body('adapters').optional().isArray(),
    body('limit').optional().isInt({ min: 1, max: 100 })
  ],
  async (req, res) => {
    try {
      // 验证请求
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: '请求参数错误',
          details: errors.array()
        })
      }

      const { query, location = '', adapters = ['jobspy', 'linkedin', 'jobapis'], limit = 20 } = req.body
      
      // 并行搜索多个平台
      const searchPromises = adapters.map(adapter => searchJobsByAdapter(adapter, query, location, limit))
      
      const results = await Promise.allSettled(searchPromises)
      
      // 收集成功的结果
      const successfulResults = []
      const errors = []
      
      results.forEach((result, index) => {
        const adapterName = adapters[index]
        
        if (result.status === 'fulfilled') {
          successfulResults.push({
            adapter: adapterName,
            jobs: result.value,
            count: result.value.length
          })
        } else {
          errors.push({
            adapter: adapterName,
            error: result.reason.message
          })
          console.warn(`Adapter ${adapterName} failed:`, result.reason)
        }
      })

      // 合并结果
      const allJobs = []
      successfulResults.forEach(result => {
        allJobs.push(...result.jobs)
      })
      
      // 去重
      const uniqueJobs = deduplicateJobs(allJobs)
      
      // 排序
      uniqueJobs.sort((a, b) => {
        // 优先级：有薪资信息 > 最近发布 > 来源可靠性
        const aScore = calculateJobScore(a)
        const bScore = calculateJobScore(b)
        return bScore - aScore
      })
      
      res.json({
        success: true,
        jobs: uniqueJobs.slice(0, limit),
        totalCount: uniqueJobs.length,
        sources: successfulResults.map(r => ({
          adapter: r.adapter,
          count: r.count
        })),
        errors,
        searchTime: Date.now(),
        algorithm: 'enterprise_parallel_v1.0'
      })
      
    } catch (error) {
      console.error('职位搜索API错误:', error)
      res.status(500).json({
        success: false,
        error: '搜索失败',
        message: error.message
      })
    }
  }
)

/**
 * LinkedIn职位搜索API
 */
app.post('/api/linkedin-jobs', 
  [
    body('keyword').notEmpty().withMessage('搜索关键词不能为空'),
    body('location').optional(),
    body('limit').optional().isInt({ min: 1, max: 100 })
  ],
  async (req, res) => {
    try {
      // 验证请求
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: '请求参数错误',
          details: errors.array()
        })
      }

      const { keyword, location = '', limit = 20 } = req.body
      
      // 调用LinkedIn Jobs API
      const jobs = await searchLinkedInJobs(keyword, location, limit)
      
      res.json(jobs)
      
    } catch (error) {
      console.error('LinkedIn职位搜索API错误:', error)
      res.status(500).json({
        success: false,
        error: '搜索失败',
        message: error.message
      })
    }
  }
)

/**
 * 健康检查API
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      resumeParser: 'online',
      jobSearch: 'online'
    }
  })
})

/**
 * 静态文件服务
 */
app.use(express.static(path.join(__dirname, 'dist')))

/**
 * 所有其他路由返回前端应用
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

/**
 * 错误处理中间件
 */
app.use((error, req, res, next) => {
  console.error('服务器错误:', error)
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: '文件大小超过限制（最大10MB）'
      })
    }
  }
  
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: error.message
  })
})

/**
 * 启动服务器
 */
app.listen(PORT, () => {
  console.log(`🚀 AI面试助手后端服务启动成功`)
  console.log(`📡 服务地址: http://localhost:${PORT}`)
  console.log(`📋 API文档: http://localhost:${PORT}/api/health`)
})

/**
 * 辅助函数
 */

/**
 * 根据适配器搜索职位
 */
async function searchJobsByAdapter(adapter, query, location, limit) {
  switch (adapter) {
    case 'jobspy':
      return await searchJobSpyJobs(query, location, limit)
    case 'linkedin':
      return await searchLinkedInJobs(query, location, limit)
    case 'jobapis':
      return await searchJobApisJobs(query, location, limit)
    default:
      throw new Error(`未知的适配器: ${adapter}`)
  }
}

/**
 * 搜索JobSpy职位
 */
async function searchJobSpyJobs(query, location, limit) {
  try {
    // 模拟API调用
    // 实际项目中，这里应该调用真实的JobSpy API
    return getMockJobSpyJobs(query, location, limit)
  } catch (error) {
    console.error('JobSpy搜索失败:', error)
    throw error
  }
}

/**
 * 搜索LinkedIn职位
 */
async function searchLinkedInJobs(query, location, limit) {
  try {
    // 模拟API调用
    // 实际项目中，这里应该调用linkedin-jobs-api包
    return getMockLinkedInJobs(query, location, limit)
  } catch (error) {
    console.error('LinkedIn搜索失败:', error)
    throw error
  }
}

/**
 * 搜索JobApis职位
 */
async function searchJobApisJobs(query, location, limit) {
  try {
    // 模拟API调用
    // 实际项目中，这里应该调用JobApis API
    return getMockJobApisJobs(query, location, limit)
  } catch (error) {
    console.error('JobApis搜索失败:', error)
    throw error
  }
}

/**
 * 职位去重
 */
function deduplicateJobs(jobs) {
  const seen = new Map()
  
  return jobs.filter(job => {
    // 生成去重键
    const key = generateDeduplicationKey(job)
    
    if (seen.has(key)) {
      return false
    }
    
    seen.set(key, job)
    return true
  })
}

/**
 * 生成去重键
 */
function generateDeduplicationKey(job) {
  // 标准化文本
  const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').trim()
  
  const title = normalize(job.title || '')
  const company = normalize(job.company || '')
  const location = normalize(job.location || '')
  
  return `${title}_${company}_${location}`
}

/**
 * 计算职位评分
 */
function calculateJobScore(job) {
  let score = 0
  
  // 薪资信息加分
  if (job.salary && job.salary !== '') score += 10
  
  // 发布时间加分（越新越好）
  const publishTime = new Date(job.publishTime)
  const daysSincePublished = (Date.now() - publishTime.getTime()) / (1000 * 60 * 60 * 24)
  if (daysSincePublished <= 1) score += 15
  else if (daysSincePublished <= 7) score += 10
  else if (daysSincePublished <= 30) score += 5
  
  // 描述完整性加分
  if (job.description && job.description.length > 100) score += 5
  
  // 技能要求加分
  if (job.requirements && job.requirements.length > 0) score += 5
  
  // 来源可靠性加分
  const sourceReliability = {
    'linkedin': 15,
    'jobspy': 10,
    'jobapis': 8
  }
  score += sourceReliability[job.source] || 5
  
  return score
}

/**
 * 获取模拟的JobSpy职位数据
 */
function getMockJobSpyJobs(query, location, limit) {
  const jobs = [
    {
      id: `jobspy_${Date.now()}_1`,
      title: `${query}开发工程师`,
      company: '美团',
      location: location || '北京',
      salary: '20-35K·14薪',
      experience: '3-5年',
      education: '本科',
      description: `我们正在寻找一位有经验的${query}开发工程师。你将参与核心产品的开发，与优秀的团队一起创造有影响力的产品。`,
      requirements: ['JavaScript', 'React', 'Node.js', 'MySQL'],
      benefits: ['五险一金', '年终奖', '股票期权', '弹性工作'],
      publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'jobspy',
      sourceUrl: '#',
      companySize: '10000+人',
      industry: '互联网',
      jobType: '全职',
      remote: false,
      originalSite: 'linkedin',
      jobLevel: '中级',
      companyIndustry: '生活服务',
      companyRevenue: '100亿+',
      companyDescription: '美团是中国领先的生活服务电子商务平台'
    },
    {
      id: `jobspy_${Date.now()}_2`,
      title: `高级${query}工程师`,
      company: '滴滴出行',
      location: location || '上海',
      salary: '28-45K·16薪',
      experience: '5-8年',
      education: '本科',
      description: `加入滴滴，成为${query}技术专家。我们提供具有挑战性的技术问题和广阔的发展空间。`,
      requirements: ['Python', 'Java', 'Kubernetes', 'Redis'],
      benefits: ['六险一金', '年终奖', '期权激励', '远程办公'],
      publishTime: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'jobspy',
      sourceUrl: '#',
      companySize: '10000+人',
      industry: '交通出行',
      jobType: '全职',
      remote: true,
      originalSite: 'indeed',
      jobLevel: '高级',
      companyIndustry: '智能交通',
      companyRevenue: '500亿+',
      companyDescription: '滴滴出行是全球领先的移动出行平台'
    }
  ]

  return jobs.slice(0, Math.min(limit, jobs.length))
}

/**
 * 获取模拟的LinkedIn职位数据
 */
function getMockLinkedInJobs(query, location, limit) {
  const jobs = [
    {
      id: `linkedin_${Date.now()}_1`,
      title: `高级${query}工程师`,
      company: '字节跳动',
      location: location || '北京',
      salary: '25-45K·14薪',
      experience: '3-5年',
      education: '本科',
      description: `我们正在寻找一位经验丰富的${query}工程师加入我们的团队。你将负责开发和维护高质量的软件产品，与跨职能团队合作，推动技术创新。`,
      requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'],
      benefits: ['五险一金', '年终奖', '股票期权', '弹性工作', '免费三餐'],
      publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'linkedin',
      sourceUrl: '#',
      companySize: '10000+人',
      industry: '互联网',
      jobType: '全职',
      remote: false,
      applicantsCount: '50+ 申请者',
      companyLogo: '',
      seniorityLevel: '高级',
      employmentType: '全职',
      jobFunction: '工程技术'
    },
    {
      id: `linkedin_${Date.now()}_2`,
      title: `${query}开发专家`,
      company: '腾讯',
      location: location || '深圳',
      salary: '30-50K·16薪',
      experience: '5-8年',
      education: '本科',
      description: `加入腾讯，成为${query}领域的技术专家。我们提供优秀的技术平台和成长机会，让你在这里实现职业突破。`,
      requirements: ['Python', 'Java', 'MySQL', 'Redis', 'Kubernetes'],
      benefits: ['六险一金', '年终奖', '期权激励', '远程办公', '健身房'],
      publishTime: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'linkedin',
      sourceUrl: '#',
      companySize: '10000+人',
      industry: '互联网',
      jobType: '全职',
      remote: true,
      applicantsCount: '100+ 申请者',
      companyLogo: '',
      seniorityLevel: '专家',
      employmentType: '全职',
      jobFunction: '工程技术'
    },
    {
      id: `linkedin_${Date.now()}_3`,
      title: `${query}架构师`,
      company: '阿里巴巴',
      location: location || '杭州',
      salary: '40-70K·16薪',
      experience: '8+年',
      education: '本科',
      description: `阿里巴巴诚聘${query}架构师，负责核心系统架构设计和技术决策。我们需要有丰富经验的技术专家来引领团队创新。`,
      requirements: ['系统架构', '微服务', 'Docker', 'AWS', '团队管理'],
      benefits: ['七险一金', '年终奖', '股票期权', '带薪假期', '培训津贴'],
      publishTime: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'linkedin',
      sourceUrl: '#',
      companySize: '10000+人',
      industry: '电商',
      jobType: '全职',
      remote: false,
      applicantsCount: '200+ 申请者',
      companyLogo: '',
      seniorityLevel: '架构师',
      employmentType: '全职',
      jobFunction: '工程技术'
    }
  ]

  return jobs.slice(0, Math.min(limit, jobs.length))
}

/**
 * 获取模拟的JobApis职位数据
 */
function getMockJobApisJobs(query, location, limit) {
  const jobs = [
    {
      id: `jobapis_monster_${Date.now()}_1`,
      title: `${query}工程师`,
      company: '京东',
      location: location || '北京',
      salary: '18-30K',
      experience: '2-4年',
      education: '本科',
      description: `京东科技诚聘${query}工程师，负责核心系统开发和维护。`,
      requirements: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
      benefits: ['五险一金', '年终奖', '购物优惠'],
      publishTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'jobapis',
      sourceUrl: '#',
      companySize: '10000+人',
      industry: '电商',
      jobType: '全职',
      remote: false,
      originalProvider: 'monster',
      jobId: `monster_${Date.now()}_1`,
      category: '技术',
      subcategory: '软件开发'
    },
    {
      id: `jobapis_ziprecruiter_${Date.now()}_1`,
      title: `${query}开发工程师`,
      company: '网易',
      location: location || '杭州',
      salary: '20-35K',
      experience: '3-5年',
      education: '本科',
      description: `网易游戏招聘${query}开发工程师，参与游戏核心功能开发。`,
      requirements: ['C++', 'Unity', 'Unreal', '游戏开发'],
      benefits: ['五险一金', '年终奖', '免费三餐'],
      publishTime: new Date(Date.now() - Math.random() * 8 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'jobapis',
      sourceUrl: '#',
      companySize: '5000-10000人',
      industry: '游戏',
      jobType: '全职',
      remote: false,
      originalProvider: 'ziprecruiter',
      jobId: `ziprecruiter_${Date.now()}_1`,
      category: '技术',
      subcategory: '游戏开发'
    }
  ]

  return jobs.slice(0, Math.min(limit, jobs.length))
}