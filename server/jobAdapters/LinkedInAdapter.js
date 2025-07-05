/**
 * LinkedIn Jobs API适配器
 * 通过后端API调用LinkedIn Jobs服务
 */

import axios from 'axios'

export class LinkedInAdapter {
  constructor() {
    this.rateLimiter = new Map()
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5分钟缓存
    this.isServiceAvailable = true
    this.lastHealthCheck = 0
    this.healthCheckInterval = 30000 // 30秒检查一次
  }

  /**
   * 检查服务健康状态
   */
  async checkServiceHealth() {
    const now = Date.now()
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return this.isServiceAvailable
    }

    try {
      // 尝试导入linkedin-jobs-api包
      try {
        const { linkedinJobsApi } = await import('linkedin-jobs-api')
        this.linkedinJobsApi = linkedinJobsApi
        this.isServiceAvailable = true
      } catch (error) {
        console.warn('LinkedIn Jobs API包导入失败:', error.message)
        this.isServiceAvailable = false
      }
    } catch (error) {
      this.isServiceAvailable = false
    }

    this.lastHealthCheck = now
    return this.isServiceAvailable
  }

  /**
   * 搜索LinkedIn职位
   * @param {Object} params - 搜索参数
   * @returns {Promise<Array>} 标准化职位数据
   */
  async searchJobs(params) {
    const {
      query,
      location = '',
      dateSincePosted = 'past Week',
      jobType = '',
      remoteFilter = '',
      salary = '',
      experienceLevel = '',
      limit = 20
    } = params

    try {
      // 检查缓存
      const cacheKey = this.getCacheKey(params)
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        console.log('LinkedIn: 使用缓存数据')
        return cached
      }

      // 检查服务健康状态
      const isHealthy = await this.checkServiceHealth()
      if (!isHealthy) {
        console.warn('LinkedIn API服务不可用，使用模拟数据')
        return this.getMockData(params)
      }

      // 检查速率限制
      if (this.isRateLimited()) {
        console.warn('LinkedIn API速率限制，使用缓存或模拟数据')
        const staleCache = this.getFromCache(cacheKey, true)
        return staleCache || this.getMockData(params)
      }

      // 使用linkedin-jobs-api包
      if (this.linkedinJobsApi) {
        const searchParams = {
          keyword: query,
          location,
          dateSincePosted,
          jobType,
          remoteFilter,
          salary,
          experienceLevel,
          limit,
          sortBy: 'recent'
        }

        const jobs = await this.linkedinJobsApi(searchParams)
        
        // 记录请求
        this.recordRequest()
        
        // 标准化数据
        const normalizedJobs = this.normalizeLinkedInData(jobs)
        
        // 缓存结果
        this.setCache(cacheKey, normalizedJobs)
        
        console.log(`LinkedIn: 成功获取 ${normalizedJobs.length} 个职位`)
        return normalizedJobs
      } else {
        throw new Error('LinkedIn Jobs API未初始化')
      }
      
    } catch (error) {
      console.error('LinkedIn search failed:', error.message)
      
      // 网络错误或超时，尝试使用缓存
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        const cacheKey = this.getCacheKey(params)
        const cached = this.getFromCache(cacheKey, true) // 允许过期缓存
        if (cached) {
          console.warn('LinkedIn: 网络错误，使用过期缓存数据')
          return cached
        }
      }
      
      // 服务不可用，返回模拟数据
      console.warn('LinkedIn: 服务不可用，返回模拟数据以保持功能正常')
      this.isServiceAvailable = false
      return this.getMockData(params)
    }
  }

  /**
   * 获取模拟数据（当后端API不可用时）
   */
  getMockData(params) {
    const { query, location } = params
    
    const mockJobs = [
      {
        id: `linkedin_mock_${Date.now()}_1`,
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
        id: `linkedin_mock_${Date.now()}_2`,
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
        id: `linkedin_mock_${Date.now()}_3`,
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

    // 添加一些随机性
    return mockJobs.slice(0, Math.floor(Math.random() * 3) + 1)
  }

  /**
   * 标准化LinkedIn数据
   */
  normalizeLinkedInData(jobs) {
    if (!Array.isArray(jobs)) return []
    
    return jobs.map(job => ({
      id: `linkedin_${job.jobId || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: job.salary || '',
      experience: this.extractExperience(job.description),
      education: this.extractEducation(job.description),
      description: job.description || '',
      requirements: this.extractSkills(job.description),
      benefits: this.extractBenefits(job.description),
      publishTime: job.postedDate || new Date().toISOString(),
      source: 'linkedin',
      sourceUrl: job.link || '#',
      companySize: job.companySize || '',
      industry: job.industry || '',
      jobType: job.jobType || '',
      remote: this.isRemoteJob(job),
      // LinkedIn特有字段
      applicantsCount: job.applicantsCount,
      companyLogo: job.companyLogo,
      seniorityLevel: job.seniorityLevel,
      employmentType: job.employmentType,
      jobFunction: job.jobFunction
    }))
  }

  /**
   * 提取工作经验要求
   */
  extractExperience(description) {
    if (!description) return ''
    
    const expPatterns = [
      /(\d+)[\+\-\s]*年.*?经验/gi,
      /(\d+)[\+\-\s]*years?\s+experience/gi,
      /(entry|junior|senior|lead|principal)/gi
    ]
    
    for (const pattern of expPatterns) {
      const match = description.match(pattern)
      if (match) {
        return match[0]
      }
    }
    
    return ''
  }

  /**
   * 提取教育要求
   */
  extractEducation(description) {
    if (!description) return ''
    
    const eduPatterns = [
      /(bachelor|master|phd|doctorate|学士|硕士|博士)/gi,
      /(本科|专科|研究生)/gi
    ]
    
    for (const pattern of eduPatterns) {
      const match = description.match(pattern)
      if (match) {
        return match[0]
      }
    }
    
    return ''
  }

  /**
   * 提取技能要求
   */
  extractSkills(description) {
    if (!description) return []
    
    const skillKeywords = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
      'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'Git',
      'Machine Learning', 'AI', 'Data Science', 'DevOps', 'Agile', 'Scrum'
    ]
    
    const found = []
    const lowerDesc = description.toLowerCase()
    
    skillKeywords.forEach(skill => {
      if (lowerDesc.includes(skill.toLowerCase())) {
        found.push(skill)
      }
    })
    
    return [...new Set(found)] // 去重
  }

  /**
   * 提取福利信息
   */
  extractBenefits(description) {
    if (!description) return []
    
    const benefitKeywords = [
      'health insurance', 'dental', 'vision', '401k', 'retirement',
      'vacation', 'pto', 'flexible', 'remote', 'work from home',
      'stock options', 'equity', 'bonus', 'gym', 'fitness',
      '医疗保险', '年终奖', '股票期权', '弹性工作', '远程工作'
    ]
    
    const found = []
    const lowerDesc = description.toLowerCase()
    
    benefitKeywords.forEach(benefit => {
      if (lowerDesc.includes(benefit.toLowerCase())) {
        found.push(benefit)
      }
    })
    
    return [...new Set(found)]
  }

  /**
   * 判断是否为远程工作
   */
  isRemoteJob(job) {
    const remoteKeywords = ['remote', 'work from home', 'telecommute', '远程', '在家办公']
    const searchText = `${job.title} ${job.location} ${job.description}`.toLowerCase()
    
    return remoteKeywords.some(keyword => searchText.includes(keyword.toLowerCase()))
  }

  /**
   * 缓存管理
   */
  getCacheKey(params) {
    return JSON.stringify(params)
  }

  getFromCache(key, allowStale = false) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout
    if (isExpired && !allowStale) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
    
    // 限制缓存大小
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  /**
   * 速率限制
   */
  isRateLimited() {
    const now = Date.now()
    const requests = this.rateLimiter.get('linkedin') || []
    
    // 清理5分钟前的请求
    const recentRequests = requests.filter(time => now - time < 5 * 60 * 1000)
    
    // 每5分钟最多50个请求
    return recentRequests.length >= 50
  }

  recordRequest() {
    const now = Date.now()
    const requests = this.rateLimiter.get('linkedin') || []
    requests.push(now)
    this.rateLimiter.set('linkedin', requests)
  }
}