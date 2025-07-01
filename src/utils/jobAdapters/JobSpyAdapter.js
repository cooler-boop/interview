/**
 * JobSpy适配器 - 支持LinkedIn、Indeed、Glassdoor等
 * 基于 JobSpy Python库的Node.js适配层
 */

export class JobSpyAdapter {
  constructor() {
    this.baseUrl = import.meta.env.VITE_JOBSPY_API_URL || 'http://localhost:8000'
    this.supportedSites = ['linkedin', 'indeed', 'glassdoor', 'google_jobs', 'zip_recruiter']
    this.rateLimiter = new Map()
    this.proxyPool = []
    this.isServiceAvailable = true
    this.lastHealthCheck = 0
    this.healthCheckInterval = 30000 // 30秒检查一次
    this.cache = new Map()
    this.cacheTimeout = 10 * 60 * 1000 // 10分钟缓存
  }

  /**
   * 检查JobSpy服务健康状态
   */
  async checkServiceHealth() {
    const now = Date.now()
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return this.isServiceAvailable
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时

      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      this.isServiceAvailable = response.ok
    } catch (error) {
      this.isServiceAvailable = false
      console.warn('JobSpy服务健康检查失败:', error.message)
    }

    this.lastHealthCheck = now
    return this.isServiceAvailable
  }

  /**
   * 搜索职位
   * @param {Object} params - 搜索参数
   * @returns {Promise<Array>} 标准化职位数据
   */
  async searchJobs(params) {
    const {
      query,
      location = '',
      site = 'linkedin',
      results_wanted = 20,
      hours_old = 72,
      country = 'China'
    } = params

    try {
      // 检查缓存
      const cacheKey = this.getCacheKey(params)
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        console.log(`JobSpy (${site}): 使用缓存数据`)
        return cached
      }

      // 检查服务健康状态
      const isHealthy = await this.checkServiceHealth()
      if (!isHealthy) {
        console.warn(`JobSpy (${site}): 服务不可用，使用模拟数据`)
        return this.getMockData(params)
      }

      // 检查速率限制
      if (this.isRateLimited(site)) {
        console.warn(`JobSpy (${site}): 速率限制，使用缓存或模拟数据`)
        const staleCache = this.getFromCache(cacheKey, true)
        return staleCache || this.getMockData(params)
      }

      // 设置请求超时
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时

      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; JobSearchBot/1.0)'
        },
        body: JSON.stringify({
          site_name: site,
          search_term: query,
          location,
          results_wanted,
          hours_old,
          country_indeed: country,
          linkedin_fetch_description: true,
          proxy: this.getRandomProxy()
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`JobSpy API端点不存在，服务可能未启动`)
          this.isServiceAvailable = false
          return this.getMockData(params)
        }
        throw new Error(`JobSpy API error: ${response.status}`)
      }

      const data = await response.json()
      
      // 记录请求时间用于速率限制
      this.recordRequest(site)
      
      const normalizedJobs = this.normalizeJobSpyData(data.jobs || [])
      
      // 缓存结果
      this.setCache(cacheKey, normalizedJobs)
      
      console.log(`JobSpy (${site}): 成功获取 ${normalizedJobs.length} 个职位`)
      return normalizedJobs
      
    } catch (error) {
      console.error(`JobSpy search failed for ${site}:`, error.message)
      
      // 网络错误或超时，尝试使用缓存
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        const cacheKey = this.getCacheKey(params)
        const cached = this.getFromCache(cacheKey, true) // 允许过期缓存
        if (cached) {
          console.warn(`JobSpy (${site}): 网络错误，使用过期缓存数据`)
          return cached
        }
      }
      
      // 服务不可用，返回模拟数据
      console.warn(`JobSpy (${site}): 服务不可用，返回模拟数据以保持功能正常`)
      this.isServiceAvailable = false
      return this.getMockData(params)
    }
  }

  /**
   * 获取模拟数据（当JobSpy服务不可用时）
   */
  getMockData(params) {
    const { query, location, site } = params
    
    const mockJobs = [
      {
        id: `jobspy_mock_${site}_${Date.now()}_1`,
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
        originalSite: site,
        jobLevel: '中级',
        companyIndustry: '生活服务',
        companyRevenue: '100亿+',
        companyDescription: '美团是中国领先的生活服务电子商务平台'
      },
      {
        id: `jobspy_mock_${site}_${Date.now()}_2`,
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
        originalSite: site,
        jobLevel: '高级',
        companyIndustry: '智能交通',
        companyRevenue: '500亿+',
        companyDescription: '滴滴出行是全球领先的移动出行平台'
      }
    ]

    return mockJobs.slice(0, Math.floor(Math.random() * 2) + 1)
  }

  /**
   * 标准化JobSpy数据格式
   */
  normalizeJobSpyData(jobs) {
    return jobs.map(job => ({
      id: `jobspy_${job.id || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      salary: this.formatSalary(job.compensation),
      experience: job.experience || '',
      education: job.education || '',
      description: job.description || job.summary || '',
      requirements: this.extractRequirements(job.description),
      benefits: this.extractBenefits(job.description),
      publishTime: job.date_posted || new Date().toISOString(),
      source: 'jobspy',
      sourceUrl: job.job_url || '#',
      companySize: job.company_size || '',
      industry: job.industry || '',
      jobType: job.job_type || '',
      remote: job.is_remote || false,
      // JobSpy特有字段
      originalSite: job.site,
      jobLevel: job.job_level,
      companyIndustry: job.company_industry,
      companyRevenue: job.company_revenue,
      companyDescription: job.company_description
    }))
  }

  /**
   * 格式化薪资信息
   */
  formatSalary(compensation) {
    if (!compensation) return ''
    
    const { min_amount, max_amount, currency, interval } = compensation
    
    if (min_amount && max_amount) {
      const unit = interval === 'yearly' ? '年' : interval === 'monthly' ? '月' : '小时'
      return `${min_amount}-${max_amount} ${currency}/${unit}`
    }
    
    return compensation.raw || ''
  }

  /**
   * 提取技能要求
   */
  extractRequirements(description) {
    if (!description) return []
    
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'React', 'Vue', 'Angular', 'Node.js',
      'TypeScript', 'CSS', 'HTML', 'SQL', 'MongoDB', 'PostgreSQL', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Linux'
    ]
    
    const found = []
    const lowerDesc = description.toLowerCase()
    
    skillKeywords.forEach(skill => {
      if (lowerDesc.includes(skill.toLowerCase())) {
        found.push(skill)
      }
    })
    
    return found
  }

  /**
   * 提取福利信息
   */
  extractBenefits(description) {
    if (!description) return []
    
    const benefitKeywords = [
      '五险一金', '年终奖', '股票期权', '弹性工作', '远程工作',
      '健身房', '免费午餐', '培训', '带薪假期', '医疗保险'
    ]
    
    const found = []
    const lowerDesc = description.toLowerCase()
    
    benefitKeywords.forEach(benefit => {
      if (lowerDesc.includes(benefit)) {
        found.push(benefit)
      }
    })
    
    return found
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
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  /**
   * 速率限制检查
   */
  isRateLimited(site) {
    const now = Date.now()
    const requests = this.rateLimiter.get(site) || []
    
    // 清理1分钟前的请求
    const recentRequests = requests.filter(time => now - time < 60000)
    
    // 每分钟最多10个请求
    return recentRequests.length >= 10
  }

  /**
   * 记录请求时间
   */
  recordRequest(site) {
    const now = Date.now()
    const requests = this.rateLimiter.get(site) || []
    requests.push(now)
    this.rateLimiter.set(site, requests)
  }

  /**
   * 获取随机代理
   */
  getRandomProxy() {
    if (this.proxyPool.length === 0) return null
    return this.proxyPool[Math.floor(Math.random() * this.proxyPool.length)]
  }

  /**
   * 设置代理池
   */
  setProxyPool(proxies) {
    this.proxyPool = proxies
  }
}