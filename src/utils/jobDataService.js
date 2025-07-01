/**
 * 职位数据服务 - 集成真实职位API
 * 支持多个职位平台的数据聚合
 */

export class JobDataService {
  constructor() {
    this.apiEndpoints = {
      // 主要职位API
      lagou: 'https://www.lagou.com/lbs/search.json',
      zhipin: 'https://www.zhipin.com/wapi/zpgeek/search/joblist.json',
      liepin: 'https://api-c.liepin.com/api/com.liepin.searchfront4c.pc-search-job',
      job51: 'https://search.51job.com/list/000000,000000,0000,00,9,99,%2B,2,1.html',
      // 备用API
      github: 'https://jobs.github.com/positions.json',
      stackoverflow: 'https://stackoverflow.com/jobs/feed',
      // 聚合API
      adzuna: 'https://api.adzuna.com/v1/api/jobs/cn/search',
      reed: 'https://www.reed.co.uk/api/1.0/search'
    }
    
    this.cache = new Map()
    this.requestQueue = []
    this.isProcessing = false
    this.rateLimiter = new Map()
  }

  /**
   * 搜索真实职位
   * @param {Object} searchParams - 搜索参数
   * @returns {Promise<Array>} 职位列表
   */
  async searchRealJobs(searchParams) {
    const {
      query,
      location = '',
      salary = '',
      experience = '',
      company = '',
      page = 1,
      pageSize = 20
    } = searchParams

    try {
      // 检查用户认证
      if (!this.isUserAuthenticated()) {
        throw new Error('请先登录后使用职位搜索功能')
      }

      // 检查缓存
      const cacheKey = this.getCacheKey(searchParams)
      const cachedResult = this.getFromCache(cacheKey)
      if (cachedResult) {
        return cachedResult
      }

      // 并行搜索多个平台
      const searchPromises = [
        this.searchLagou(searchParams),
        this.searchZhipin(searchParams),
        this.searchLiepin(searchParams),
        this.searchAdzuna(searchParams)
      ]

      const results = await Promise.allSettled(searchPromises)
      
      // 合并和去重结果
      const allJobs = []
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allJobs.push(...result.value)
        } else {
          console.warn(`Platform ${index} search failed:`, result.reason)
        }
      })

      // 去重和标准化
      const uniqueJobs = this.deduplicateJobs(allJobs)
      const standardizedJobs = this.standardizeJobData(uniqueJobs)
      
      // 缓存结果
      this.setCache(cacheKey, standardizedJobs)
      
      return standardizedJobs

    } catch (error) {
      console.error('Real job search failed:', error)
      
      // 降级到本地数据
      return this.getFallbackJobs(searchParams)
    }
  }

  /**
   * 搜索拉勾网职位
   */
  async searchLagou(params) {
    try {
      // 由于CORS限制，这里需要通过代理服务器
      const proxyUrl = this.getProxyUrl('lagou')
      const response = await this.makeRequest(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          first: true,
          pn: params.page || 1,
          kd: params.query
        })
      })

      const data = await response.json()
      return this.parseLagouJobs(data)
    } catch (error) {
      console.error('Lagou search failed:', error)
      return []
    }
  }

  /**
   * 搜索Boss直聘职位
   */
  async searchZhipin(params) {
    try {
      const proxyUrl = this.getProxyUrl('zhipin')
      const response = await this.makeRequest(proxyUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      const data = await response.json()
      return this.parseZhipinJobs(data)
    } catch (error) {
      console.error('Zhipin search failed:', error)
      return []
    }
  }

  /**
   * 搜索猎聘职位
   */
  async searchLiepin(params) {
    try {
      const proxyUrl = this.getProxyUrl('liepin')
      const response = await this.makeRequest(proxyUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      const data = await response.json()
      return this.parseLiepinJobs(data)
    } catch (error) {
      console.error('Liepin search failed:', error)
      return []
    }
  }

  /**
   * 搜索Adzuna职位（国际平台）
   */
  async searchAdzuna(params) {
    try {
      // Adzuna API需要API Key
      const apiKey = this.getApiKey('adzuna')
      if (!apiKey) return []

      const url = `${this.apiEndpoints.adzuna}?app_id=${apiKey.appId}&app_key=${apiKey.appKey}&results_per_page=20&what=${encodeURIComponent(params.query)}`
      
      const response = await this.makeRequest(url)
      const data = await response.json()
      
      return this.parseAdzunaJobs(data)
    } catch (error) {
      console.error('Adzuna search failed:', error)
      return []
    }
  }

  /**
   * 解析拉勾网职位数据
   */
  parseLagouJobs(data) {
    if (!data.content || !data.content.positionResult) return []
    
    return data.content.positionResult.result.map(job => ({
      id: `lagou_${job.positionId}`,
      title: job.positionName,
      company: job.companyFullName,
      location: `${job.city}${job.district ? '-' + job.district : ''}`,
      salary: job.salary,
      experience: job.workYear,
      education: job.education,
      description: job.positionAdvantage,
      requirements: job.positionLables || [],
      benefits: job.benefitList || [],
      publishTime: job.createTime,
      source: 'lagou',
      sourceUrl: `https://www.lagou.com/jobs/${job.positionId}.html`,
      companySize: job.companySize,
      industry: job.industryField,
      jobNature: job.jobNature
    }))
  }

  /**
   * 解析Boss直聘职位数据
   */
  parseZhipinJobs(data) {
    if (!data.zpData || !data.zpData.jobList) return []
    
    return data.zpData.jobList.map(job => ({
      id: `zhipin_${job.encryptJobId}`,
      title: job.jobName,
      company: job.brandName,
      location: `${job.cityName}${job.areaDistrict ? '-' + job.areaDistrict : ''}`,
      salary: job.salaryDesc,
      experience: job.jobExperience,
      education: job.jobDegree,
      description: job.jobLabels ? job.jobLabels.join('，') : '',
      requirements: job.skills || [],
      benefits: job.welfareList || [],
      publishTime: job.lastModifyTime,
      source: 'zhipin',
      sourceUrl: `https://www.zhipin.com/job_detail/${job.encryptJobId}.html`,
      companySize: job.scaleName,
      industry: job.industryName
    }))
  }

  /**
   * 解析猎聘职位数据
   */
  parseLiepinJobs(data) {
    if (!data.data || !data.data.jobCardList) return []
    
    return data.data.jobCardList.map(job => ({
      id: `liepin_${job.job.jobId}`,
      title: job.job.title,
      company: job.comp.compName,
      location: job.job.dq,
      salary: job.job.salary,
      experience: job.job.requireWorkYears,
      education: job.job.requireEduLevel,
      description: job.job.jobDesc,
      requirements: job.job.labels || [],
      benefits: job.job.benefitList || [],
      publishTime: job.job.refreshTime,
      source: 'liepin',
      sourceUrl: `https://www.liepin.com/job/${job.job.jobId}.shtml`,
      companySize: job.comp.compScale,
      industry: job.comp.compIndustry
    }))
  }

  /**
   * 解析Adzuna职位数据
   */
  parseAdzunaJobs(data) {
    if (!data.results) return []
    
    return data.results.map(job => ({
      id: `adzuna_${job.id}`,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      salary: job.salary_min && job.salary_max ? `${job.salary_min}-${job.salary_max}` : '',
      experience: '',
      education: '',
      description: job.description,
      requirements: job.category ? [job.category.label] : [],
      benefits: [],
      publishTime: job.created,
      source: 'adzuna',
      sourceUrl: job.redirect_url,
      companySize: '',
      industry: job.category ? job.category.label : ''
    }))
  }

  /**
   * 职位数据标准化
   */
  standardizeJobData(jobs) {
    return jobs.map(job => ({
      ...job,
      // 标准化薪资格式
      salary: this.standardizeSalary(job.salary),
      // 标准化经验要求
      experience: this.standardizeExperience(job.experience),
      // 标准化教育要求
      education: this.standardizeEducation(job.education),
      // 添加匹配分数字段
      matchScore: 0,
      // 添加推荐理由
      reasons: [],
      // 标准化发布时间
      publishTime: this.standardizeTime(job.publishTime)
    }))
  }

  /**
   * 职位去重
   */
  deduplicateJobs(jobs) {
    const seen = new Set()
    const unique = []
    
    for (const job of jobs) {
      // 基于标题、公司、地点的组合进行去重
      const key = `${job.title}_${job.company}_${job.location}`.toLowerCase()
      
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(job)
      }
    }
    
    return unique
  }

  /**
   * 获取代理URL
   */
  getProxyUrl(platform) {
    // 在实际部署中，需要配置CORS代理服务器
    const proxyBase = process.env.VITE_PROXY_URL || 'https://cors-anywhere.herokuapp.com/'
    return `${proxyBase}${this.apiEndpoints[platform]}`
  }

  /**
   * 获取API密钥
   */
  getApiKey(platform) {
    const keys = {
      adzuna: {
        appId: process.env.VITE_ADZUNA_APP_ID,
        appKey: process.env.VITE_ADZUNA_APP_KEY
      }
    }
    return keys[platform]
  }

  /**
   * 发起HTTP请求（带限流）
   */
  async makeRequest(url, options = {}) {
    // 检查限流
    if (this.isRateLimited(url)) {
      throw new Error('请求过于频繁，请稍后再试')
    }
    
    // 记录请求时间
    this.recordRequest(url)
    
    const response = await fetch(url, {
      ...options,
      timeout: 10000 // 10秒超时
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response
  }

  /**
   * 检查用户认证状态
   */
  isUserAuthenticated() {
    try {
      const authData = localStorage.getItem('auth-storage')
      if (!authData) return false
      
      const { state } = JSON.parse(authData)
      return state.isAuthenticated
    } catch {
      return false
    }
  }

  /**
   * 限流检查
   */
  isRateLimited(url) {
    const domain = new URL(url).hostname
    const now = Date.now()
    const requests = this.rateLimiter.get(domain) || []
    
    // 清理1分钟前的请求记录
    const recentRequests = requests.filter(time => now - time < 60000)
    
    // 每分钟最多30个请求
    if (recentRequests.length >= 30) {
      return true
    }
    
    return false
  }

  /**
   * 记录请求
   */
  recordRequest(url) {
    const domain = new URL(url).hostname
    const now = Date.now()
    const requests = this.rateLimiter.get(domain) || []
    
    requests.push(now)
    this.rateLimiter.set(domain, requests)
  }

  /**
   * 降级数据
   */
  getFallbackJobs(params) {
    // 返回本地示例数据
    const fallbackJobs = [
      {
        id: 'fallback_001',
        title: `${params.query}工程师`,
        company: '示例科技公司',
        location: params.location || '北京',
        salary: '20K-35K',
        experience: '3-5年',
        education: '本科',
        description: `负责${params.query}相关技术开发，要求有扎实的技术基础和项目经验。`,
        requirements: [params.query, 'JavaScript', 'React'],
        benefits: ['五险一金', '年终奖', '弹性工作'],
        publishTime: new Date().toISOString(),
        source: 'fallback',
        sourceUrl: '#',
        companySize: '100-500人',
        industry: '互联网',
        matchScore: 85,
        reasons: ['关键词匹配', '地点符合']
      }
    ]
    
    return fallbackJobs
  }

  /**
   * 缓存管理
   */
  getCacheKey(params) {
    return JSON.stringify(params)
  }

  getFromCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < 300000) { // 5分钟缓存
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 数据标准化辅助方法
   */
  standardizeSalary(salary) {
    if (!salary) return ''
    // 统一薪资格式为 "XXK-XXK"
    return salary.replace(/[￥$,]/g, '').replace(/(\d+)k/gi, '$1K')
  }

  standardizeExperience(experience) {
    if (!experience) return ''
    // 统一经验格式
    return experience.replace(/年以上|年及以上/g, '年').replace(/经验/g, '')
  }

  standardizeEducation(education) {
    if (!education) return ''
    // 统一学历格式
    const eduMap = {
      '大专': '专科',
      '本科及以上': '本科',
      '硕士及以上': '硕士'
    }
    return eduMap[education] || education
  }

  standardizeTime(time) {
    if (!time) return new Date().toISOString()
    try {
      return new Date(time).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }
}

// 全局职位数据服务实例
export const jobDataService = new JobDataService()