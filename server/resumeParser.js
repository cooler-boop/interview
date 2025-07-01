/**
 * 企业级简历解析服务
 * 支持PDF、DOC、DOCX、TXT格式
 * 集成NLP处理和中文优化
 */

import express from 'express'
import multer from 'multer'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { body, validationResult } from 'express-validator'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import ResumeParser from 'resume-parser'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { NlpManager } from 'node-nlp'

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

// NLP管理器初始化
const nlpManager = new NlpManager({ languages: ['zh', 'en'] })

// 训练中文简历关键词识别
async function initializeNLP() {
  // 教育背景相关
  nlpManager.addNamedEntityText('education', 'education_degree', ['zh'], ['学士', '硕士', '博士', '本科', '研究生', '专科', '大专'])
  nlpManager.addNamedEntityText('education', 'education_school', ['zh'], ['大学', '学院', '学校', '院校'])
  
  // 工作经验相关
  nlpManager.addNamedEntityText('experience', 'job_title', ['zh'], ['工程师', '经理', '主管', '总监', '专员', '助理', '实习生'])
  nlpManager.addNamedEntityText('experience', 'company_type', ['zh'], ['有限公司', '股份公司', '科技公司', '集团'])
  
  // 技能相关
  nlpManager.addNamedEntityText('skills', 'tech_skills', ['zh'], ['JavaScript', 'Python', 'Java', 'React', 'Vue', 'Node.js'])
  
  await nlpManager.train()
  console.log('NLP模型训练完成')
}

// 企业级简历解析器
class EnterpriseResumeParser {
  constructor() {
    this.chineseKeywords = {
      personal: ['姓名', '性别', '年龄', '出生', '电话', '邮箱', '地址', '联系方式'],
      education: ['教育背景', '教育经历', '学历', '毕业院校', '专业', '学位', '毕业时间'],
      experience: ['工作经历', '工作经验', '实习经历', '项目经验', '职业经历', '任职'],
      skills: ['技能', '技术栈', '专业技能', '掌握技术', '熟悉', '精通', '了解'],
      projects: ['项目经验', '项目经历', '参与项目', '负责项目', '主要项目'],
      certifications: ['证书', '认证', '资格证', '获奖', '荣誉'],
      languages: ['语言能力', '外语水平', '语言技能']
    }
  }

  /**
   * 解析简历文件
   */
  async parseResume(filePath, originalName, targetPosition = '') {
    try {
      const ext = path.extname(originalName).toLowerCase()
      let text = ''
      
      // 根据文件类型提取文本
      switch (ext) {
        case '.pdf':
          text = await this.extractPDFText(filePath)
          break
        case '.docx':
          text = await this.extractDocxText(filePath)
          break
        case '.doc':
          text = await this.extractDocText(filePath)
          break
        case '.txt':
          text = await this.extractTxtText(filePath)
          break
        default:
          throw new Error('不支持的文件格式')
      }

      // 使用resume-parser进行基础解析
      const basicParsed = await this.parseWithResumeParser(filePath)
      
      // 使用自定义NLP进行中文优化解析
      const enhancedParsed = await this.enhanceWithNLP(text, basicParsed)
      
      // 计算与目标职位的匹配度
      const matchAnalysis = await this.calculateJobMatch(enhancedParsed, targetPosition)
      
      // 生成改进建议
      const improvements = this.generateImprovements(enhancedParsed, targetPosition)
      
      return {
        success: true,
        data: {
          ...enhancedParsed,
          matchAnalysis,
          improvements,
          originalFileName: originalName,
          parsedAt: new Date().toISOString()
        }
      }
      
    } catch (error) {
      console.error('简历解析失败:', error)
      throw error
    } finally {
      // 清理临时文件
      try {
        await fs.unlink(filePath)
      } catch (cleanupError) {
        console.warn('清理临时文件失败:', cleanupError)
      }
    }
  }

  /**
   * PDF文本提取
   */
  async extractPDFText(filePath) {
    const dataBuffer = await fs.readFile(filePath)
    const data = await pdfParse(dataBuffer)
    return data.text
  }

  /**
   * DOCX文本提取
   */
  async extractDocxText(filePath) {
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value
  }

  /**
   * DOC文本提取（需要安装catdoc）
   */
  async extractDocText(filePath) {
    // 降级到resume-parser处理
    return ''
  }

  /**
   * TXT文本提取
   */
  async extractTxtText(filePath) {
    return await fs.readFile(filePath, 'utf-8')
  }

  /**
   * 使用resume-parser进行基础解析
   */
  async parseWithResumeParser(filePath) {
    return new Promise((resolve, reject) => {
      ResumeParser.parseResumeFile(filePath, (data, err) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  /**
   * 使用NLP增强解析结果
   */
  async enhanceWithNLP(text, basicParsed) {
    const nlpResult = await nlpManager.process('zh', text)
    
    // 提取个人信息
    const personalInfo = this.extractPersonalInfo(text)
    
    // 提取教育背景
    const education = this.extractEducation(text, basicParsed.education)
    
    // 提取工作经验
    const experience = this.extractExperience(text, basicParsed.experience)
    
    // 提取技能
    const skills = this.extractSkills(text, basicParsed.skills)
    
    // 提取项目经验
    const projects = this.extractProjects(text)
    
    return {
      personalInfo: {
        ...basicParsed.personalInfo,
        ...personalInfo
      },
      education,
      experience,
      skills,
      projects,
      rawText: text,
      nlpEntities: nlpResult.entities
    }
  }

  /**
   * 提取个人信息
   */
  extractPersonalInfo(text) {
    const info = {}
    
    // 提取邮箱
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g
    const emails = text.match(emailRegex)
    if (emails) info.email = emails[0]
    
    // 提取电话
    const phoneRegex = /1[3-9]\d{9}|(\d{3,4}[-\s]?)?\d{7,8}/g
    const phones = text.match(phoneRegex)
    if (phones) info.phone = phones[0]
    
    // 提取姓名（简单规则）
    const nameRegex = /姓\s*名[:：]\s*([^\n\r]{2,4})/
    const nameMatch = text.match(nameRegex)
    if (nameMatch) info.name = nameMatch[1].trim()
    
    return info
  }

  /**
   * 提取教育背景
   */
  extractEducation(text, basicEducation = []) {
    const educationSection = this.extractSection(text, this.chineseKeywords.education)
    
    // 提取学位信息
    const degreeRegex = /(学士|硕士|博士|本科|研究生|专科|大专)/g
    const degrees = educationSection.match(degreeRegex) || []
    
    // 提取学校信息
    const schoolRegex = /([^\n\r]*(?:大学|学院|学校)[^\n\r]*)/g
    const schools = educationSection.match(schoolRegex) || []
    
    // 提取专业信息
    const majorRegex = /专业[:：]\s*([^\n\r]+)/g
    const majors = educationSection.match(majorRegex) || []
    
    return {
      degrees,
      schools,
      majors,
      raw: educationSection,
      basic: basicEducation
    }
  }

  /**
   * 提取工作经验
   */
  extractExperience(text, basicExperience = []) {
    const experienceSection = this.extractSection(text, this.chineseKeywords.experience)
    
    // 提取公司信息
    const companyRegex = /([^\n\r]*(?:公司|集团|科技|有限)[^\n\r]*)/g
    const companies = experienceSection.match(companyRegex) || []
    
    // 提取职位信息
    const positionRegex = /([^\n\r]*(?:工程师|经理|主管|总监|专员)[^\n\r]*)/g
    const positions = experienceSection.match(positionRegex) || []
    
    // 提取时间信息
    const timeRegex = /(\d{4}[\.\-\/年]\d{1,2}[\.\-\/月]?\d{0,2}[日]?)/g
    const times = experienceSection.match(timeRegex) || []
    
    return {
      companies,
      positions,
      times,
      raw: experienceSection,
      basic: basicExperience
    }
  }

  /**
   * 提取技能信息
   */
  extractSkills(text, basicSkills = []) {
    const skillsSection = this.extractSection(text, this.chineseKeywords.skills)
    
    // 技术技能关键词
    const techSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Go', 'Rust',
      'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Spring',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Linux'
    ]
    
    const foundSkills = []
    techSkills.forEach(skill => {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        foundSkills.push(skill)
      }
    })
    
    return {
      technical: foundSkills,
      raw: skillsSection,
      basic: basicSkills
    }
  }

  /**
   * 提取项目经验
   */
  extractProjects(text) {
    const projectSection = this.extractSection(text, this.chineseKeywords.projects)
    
    // 提取项目名称
    const projectRegex = /项目[:：]\s*([^\n\r]+)/g
    const projects = []
    let match
    
    while ((match = projectRegex.exec(projectSection)) !== null) {
      projects.push(match[1].trim())
    }
    
    return {
      projects,
      raw: projectSection
    }
  }

  /**
   * 提取文本段落
   */
  extractSection(text, keywords) {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=(?:${this.chineseKeywords.personal.join('|')}|${this.chineseKeywords.education.join('|')}|${this.chineseKeywords.experience.join('|')}|${this.chineseKeywords.skills.join('|')})|$)`, 'i')
      const match = text.match(regex)
      if (match) {
        return match[0]
      }
    }
    return ''
  }

  /**
   * 计算职位匹配度
   */
  async calculateJobMatch(parsedData, targetPosition) {
    if (!targetPosition) {
      return {
        overallScore: 0,
        skillMatch: 0,
        experienceMatch: 0,
        educationMatch: 0,
        details: '未提供目标职位'
      }
    }

    // 技能匹配度
    const skillMatch = this.calculateSkillMatch(parsedData.skills, targetPosition)
    
    // 经验匹配度
    const experienceMatch = this.calculateExperienceMatch(parsedData.experience, targetPosition)
    
    // 教育背景匹配度
    const educationMatch = this.calculateEducationMatch(parsedData.education, targetPosition)
    
    // 综合评分
    const overallScore = Math.round(
      skillMatch * 0.5 + 
      experienceMatch * 0.3 + 
      educationMatch * 0.2
    )

    return {
      overallScore,
      skillMatch,
      experienceMatch,
      educationMatch,
      details: {
        strengths: this.identifyStrengths(parsedData, targetPosition),
        weaknesses: this.identifyWeaknesses(parsedData, targetPosition)
      }
    }
  }

  /**
   * 计算技能匹配度
   */
  calculateSkillMatch(skills, targetPosition) {
    const positionSkillMap = {
      '前端工程师': ['JavaScript', 'React', 'Vue', 'CSS', 'HTML', 'TypeScript'],
      '后端工程师': ['Java', 'Python', 'Node.js', 'MySQL', 'Redis', 'Spring'],
      '全栈工程师': ['JavaScript', 'React', 'Node.js', 'MySQL', 'Python'],
      '数据分析师': ['Python', 'SQL', 'Excel', 'Tableau', 'R'],
      '产品经理': ['产品设计', '用户研究', '数据分析', 'Axure', 'Figma']
    }
    
    const requiredSkills = positionSkillMap[targetPosition] || []
    if (requiredSkills.length === 0) return 50
    
    const userSkills = skills.technical || []
    const matchedSkills = requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    )
    
    return Math.round((matchedSkills.length / requiredSkills.length) * 100)
  }

  /**
   * 计算经验匹配度
   */
  calculateExperienceMatch(experience, targetPosition) {
    // 简化实现，基于职位关键词匹配
    const experienceText = experience.raw || ''
    const positionKeywords = targetPosition.split(/[工程师|经理|专员|助理]/)
    
    let matchScore = 0
    positionKeywords.forEach(keyword => {
      if (keyword && experienceText.includes(keyword)) {
        matchScore += 20
      }
    })
    
    return Math.min(matchScore, 100)
  }

  /**
   * 计算教育背景匹配度
   */
  calculateEducationMatch(education, targetPosition) {
    const degrees = education.degrees || []
    const schools = education.schools || []
    
    let score = 50 // 基础分
    
    // 学位加分
    if (degrees.some(degree => ['本科', '学士'].includes(degree))) score += 20
    if (degrees.some(degree => ['硕士', '研究生'].includes(degree))) score += 30
    if (degrees.some(degree => ['博士'].includes(degree))) score += 40
    
    // 知名学校加分
    const famousSchools = ['清华', '北大', '复旦', '交大', '浙大']
    if (schools.some(school => famousSchools.some(famous => school.includes(famous)))) {
      score += 20
    }
    
    return Math.min(score, 100)
  }

  /**
   * 识别优势
   */
  identifyStrengths(parsedData, targetPosition) {
    const strengths = []
    
    if (parsedData.skills.technical.length > 5) {
      strengths.push('技术栈丰富，掌握多种开发技能')
    }
    
    if (parsedData.experience.companies.length > 2) {
      strengths.push('工作经验丰富，有多家公司经历')
    }
    
    if (parsedData.projects.projects.length > 3) {
      strengths.push('项目经验充足，参与过多个项目')
    }
    
    return strengths
  }

  /**
   * 识别不足
   */
  identifyWeaknesses(parsedData, targetPosition) {
    const weaknesses = []
    
    if (parsedData.skills.technical.length < 3) {
      weaknesses.push('技术技能相对较少，建议补充相关技能')
    }
    
    if (parsedData.experience.companies.length === 0) {
      weaknesses.push('缺乏工作经验，建议增加实习或项目经历')
    }
    
    return weaknesses
  }

  /**
   * 生成改进建议
   */
  generateImprovements(parsedData, targetPosition) {
    const improvements = []
    
    // 技能改进建议
    if (parsedData.skills.technical.length < 5) {
      improvements.push({
        category: '技能提升',
        suggestion: '建议学习更多与目标职位相关的技术技能',
        priority: 'high'
      })
    }
    
    // 经验改进建议
    if (parsedData.experience.companies.length < 2) {
      improvements.push({
        category: '经验积累',
        suggestion: '建议增加实习经历或参与更多项目',
        priority: 'medium'
      })
    }
    
    // 简历格式建议
    improvements.push({
      category: '简历优化',
      suggestion: '建议使用更清晰的段落结构和关键词',
      priority: 'low'
    })
    
    return improvements
  }
}

// 初始化解析器
const resumeParser = new EnterpriseResumeParser()

// API路由
app.use(express.json())

/**
 * 简历解析API
 */
app.post('/api/parse-resume', 
  upload.single('resume'),
  [
    body('targetPosition').optional().isString().trim()
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

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: '请上传简历文件'
        })
      }

      const { targetPosition = '' } = req.body
      
      // 解析简历
      const result = await resumeParser.parseResume(
        req.file.path,
        req.file.originalname,
        targetPosition
      )
      
      res.json(result)
      
    } catch (error) {
      console.error('简历解析API错误:', error)
      res.status(500).json({
        success: false,
        error: '简历解析失败',
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
    service: 'resume-parser'
  })
})

// 错误处理中间件
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
    error: '服务器内部错误'
  })
})

// 启动服务器
async function startServer() {
  try {
    await initializeNLP()
    
    app.listen(PORT, () => {
      console.log(`🚀 企业级简历解析服务启动成功`)
      console.log(`📡 服务地址: http://localhost:${PORT}`)
      console.log(`📋 API文档: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('服务启动失败:', error)
    process.exit(1)
  }
}

startServer()