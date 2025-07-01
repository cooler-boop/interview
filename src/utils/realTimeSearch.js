/**
 * 实时搜索引擎 - 参考Algolia、Elasticsearch等成熟方案
 * 实现毫秒级响应的智能搜索体验
 */

class RealTimeSearchEngine {
  constructor() {
    this.searchIndex = new Map() // 搜索索引
    this.suggestionTrie = new TrieNode() // 前缀树用于自动补全
    this.searchHistory = new Map() // 搜索历史
    this.popularQueries = new Map() // 热门搜索
    this.cache = new Map() // 搜索结果缓存
    this.debounceTimers = new Map() // 防抖定时器
    this.isInitialized = false
    
    // 配置参数
    this.config = {
      debounceDelay: 150, // 防抖延迟
      cacheSize: 1000, // 缓存大小
      suggestionLimit: 8, // 建议数量
      minQueryLength: 1, // 最小查询长度
      maxCacheAge: 5 * 60 * 1000, // 缓存过期时间 5分钟
      enableFuzzySearch: true, // 启用模糊搜索
      enableHighlight: true, // 启用高亮
      enableAnalytics: true // 启用搜索分析
    }
    
    // 搜索分析数据
    this.analytics = {
      totalSearches: 0,
      avgResponseTime: 0,
      popularTerms: new Map(),
      searchTrends: []
    }
  }

  /**
   * 初始化搜索引擎
   */
  async initialize() {
    try {
      // 加载已保存的数据
      await this.loadPersistedData()
      
      // 构建搜索索引
      await this.buildSearchIndex()
      
      // 初始化热门搜索
      this.initializePopularQueries()
      
      this.isInitialized = true
      console.log('RealTimeSearchEngine initialized successfully')
    } catch (error) {
      console.error('Failed to initialize search engine:', error)
    }
  }

  /**
   * 实时搜索主入口
   * @param {string} query - 搜索查询
   * @param {Object} options - 搜索选项
   * @returns {Promise<Object>} 搜索结果
   */
  async search(query, options = {}) {
    const startTime = performance.now()
    
    try {
      // 参数验证
      if (!query || query.length < this.config.minQueryLength) {
        return this.getEmptyResult()
      }

      // 查询预处理
      const processedQuery = this.preprocessQuery(query)
      const cacheKey = this.getCacheKey(processedQuery, options)

      // 缓存检查
      const cachedResult = this.getFromCache(cacheKey)
      if (cachedResult) {
        this.recordAnalytics(query, performance.now() - startTime, true)
        return cachedResult
      }

      // 执行搜索
      const searchResult = await this.performSearch(processedQuery, options)
      
      // 缓存结果
      this.setCache(cacheKey, searchResult)
      
      // 记录搜索历史和分析
      this.recordSearch(query, searchResult)
      this.recordAnalytics(query, performance.now() - startTime, false)
      
      return searchResult
      
    } catch (error) {
      console.error('Search failed:', error)
      return this.getErrorResult(error)
    }
  }

  /**
   * 实时搜索建议
   * @param {string} query - 查询字符串
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消函数
   */
  searchWithSuggestions(query, callback) {
    const searchId = Date.now().toString()
    
    // 清除之前的防抖定时器
    if (this.debounceTimers.has('suggestions')) {
      clearTimeout(this.debounceTimers.get('suggestions'))
    }
    
    // 设置新的防抖定时器
    const timer = setTimeout(async () => {
      try {
        // 模拟搜索结果
        const results = this.getMockResults(query)
        const suggestions = this.getMockSuggestions(query)
        
        callback({
          searchId,
          query,
          results,
          suggestions,
          totalHits: results.length,
          processingTime: 50,
          timestamp: Date.now()
        })
      } catch (error) {
        callback({
          searchId,
          query,
          error: error.message,
          timestamp: Date.now()
        })
      }
    }, this.config.debounceDelay)
    
    this.debounceTimers.set('suggestions', timer)
    
    // 返回取消函数
    return () => {
      clearTimeout(timer)
      this.debounceTimers.delete('suggestions')
    }
  }

  /**
   * 获取模拟搜索结果
   */
  getMockResults(query) {
    if (!query) return []
    
    const mockJobs = [
      {
        id: 'job_001',
        title: `${query}工程师`,
        company: '字节跳动',
        location: '北京',
        salary: '25K-45K',
        experience: '3-5年',
        description: `负责${query}相关技术开发，要求有扎实的技术基础和项目经验。`,
        requirements: [query, 'JavaScript', 'React'],
        benefits: ['五险一金', '年终奖', '弹性工作'],
        publishTime: new Date().toISOString(),
        source: 'jobspy',
        sourceUrl: '#',
        companySize: '10000+人',
        industry: '互联网',
        matchScore: 85,
        reasons: ['关键词匹配', '地点符合']
      },
      {
        id: 'job_002',
        title: `高级${query}开发`,
        company: '腾讯',
        location: '深圳',
        salary: '30K-50K',
        experience: '5-8年',
        description: `负责${query}核心模块开发，参与架构设计和技术选型。`,
        requirements: [query, 'TypeScript', 'Node.js'],
        benefits: ['六险一金', '股票期权', '免费三餐'],
        publishTime: new Date().toISOString(),
        source: 'linkedin',
        sourceUrl: '#',
        companySize: '10000+人',
        industry: '互联网',
        matchScore: 78,
        reasons: ['技能匹配', '薪资符合']
      },
      {
        id: 'job_003',
        title: `${query}架构师`,
        company: '阿里巴巴',
        location: '杭州',
        salary: '40K-60K',
        experience: '8-10年',
        description: `负责${query}相关技术架构设计和团队管理，推动技术创新。`,
        requirements: [query, 'Java', 'Spring Boot', '微服务'],
        benefits: ['六险一金', '股票期权', '租房补贴'],
        publishTime: new Date().toISOString(),
        source: 'jobapis',
        sourceUrl: '#',
        companySize: '10000+人',
        industry: '电商',
        matchScore: 92,
        reasons: ['经验匹配', '技能匹配', '薪资符合']
      }
    ]
    
    return mockJobs.slice(0, 3)
  }

  /**
   * 获取模拟搜索建议
   */
  getMockSuggestions(query) {
    if (!query) return this.getPopularSuggestions()
    
    const suggestions = [
      `${query} 工程师`,
      `${query} 开发`,
      `高级 ${query}`,
      `${query} 架构师`,
      `${query} 实习`
    ]
    
    return suggestions
  }

  /**
   * 获取搜索建议
   * @param {string} query - 查询字符串
   * @returns {Array} 建议列表
   */
  async getSuggestions(query) {
    if (!query || query.length < this.config.minQueryLength) {
      return this.getPopularSuggestions()
    }

    const suggestions = []
    
    // 1. 前缀匹配建议
    const prefixSuggestions = this.suggestionTrie.search(query.toLowerCase())
    suggestions.push(...prefixSuggestions.slice(0, 4))
    
    // 2. 历史搜索建议
    const historySuggestions = this.getHistorySuggestions(query)
    suggestions.push(...historySuggestions.slice(0, 2))
    
    // 3. 热门搜索建议
    const popularSuggestions = this.getPopularSuggestions(query)
    suggestions.push(...popularSuggestions.slice(0, 2))
    
    // 去重并限制数量
    const uniqueSuggestions = [...new Set(suggestions)]
    return uniqueSuggestions.slice(0, this.config.suggestionLimit)
  }

  /**
   * 获取历史搜索建议
   */
  getHistorySuggestions(query) {
    const suggestions = []
    const queryLower = query.toLowerCase()
    
    for (const [historyQuery] of this.searchHistory) {
      if (historyQuery.toLowerCase().includes(queryLower) && historyQuery !== query) {
        suggestions.push(historyQuery)
      }
    }
    
    return suggestions.slice(0, 3)
  }

  /**
   * 获取热门搜索建议
   */
  getPopularSuggestions(query = '') {
    const suggestions = []
    const queryLower = query.toLowerCase()
    
    // 按热度排序
    const sortedPopular = Array.from(this.popularQueries.entries())
      .sort((a, b) => b[1] - a[1])
    
    for (const [popularQuery] of sortedPopular) {
      if (!query || popularQuery.toLowerCase().includes(queryLower)) {
        suggestions.push(popularQuery)
      }
    }
    
    return suggestions.slice(0, 5)
  }

  /**
   * 初始化热门搜索
   */
  initializePopularQueries() {
    const defaultPopular = [
      '前端工程师',
      'React开发',
      'Vue.js',
      'Node.js',
      'Python',
      'Java开发',
      '全栈工程师',
      '产品经理',
      'UI设计师',
      '数据分析'
    ]
    
    defaultPopular.forEach((query, index) => {
      this.popularQueries.set(query, 10 - index)
    })
  }

  /**
   * 加载持久化数据
   */
  async loadPersistedData() {
    try {
      const savedData = localStorage.getItem('realtime-search-data')
      if (savedData) {
        const data = JSON.parse(savedData)
        
        if (data.searchHistory) {
          this.searchHistory = new Map(data.searchHistory)
        }
        
        if (data.popularQueries) {
          this.popularQueries = new Map(data.popularQueries)
        }
        
        if (data.analytics) {
          this.analytics = { ...this.analytics, ...data.analytics }
          this.analytics.popularTerms = new Map(data.analytics.popularTerms || [])
        }
      }
    } catch (error) {
      console.error('Failed to load persisted search data:', error)
    }
  }

  /**
   * 构建搜索索引
   */
  async buildSearchIndex() {
    // 模拟索引构建
    console.log('Building search index...')
    
    // 添加一些示例职位数据到索引
    const sampleJobs = [
      { id: 'job_001', title: '前端工程师', company: '字节跳动', location: '北京' },
      { id: 'job_002', title: 'React开发工程师', company: '腾讯', location: '深圳' },
      { id: 'job_003', title: 'Vue.js工程师', company: '阿里巴巴', location: '杭州' },
      { id: 'job_004', title: 'Node.js后端工程师', company: '百度', location: '北京' },
      { id: 'job_005', title: 'Python开发工程师', company: '美团', location: '北京' },
      { id: 'job_006', title: 'Java开发工程师', company: '京东', location: '北京' },
      { id: 'job_007', title: '全栈工程师', company: '网易', location: '杭州' },
      { id: 'job_008', title: '产品经理', company: '小米', location: '北京' },
      { id: 'job_009', title: 'UI设计师', company: 'OPPO', location: '深圳' },
      { id: 'job_010', title: '数据分析师', company: '滴滴', location: '北京' }
    ]
    
    sampleJobs.forEach(job => {
      this.searchIndex.set(job.id, job)
      this.suggestionTrie.insert(job.title.toLowerCase())
    })
    
    console.log(`Built search index with ${this.searchIndex.size} documents`)
  }

  /**
   * 查询预处理
   */
  preprocessQuery(query) {
    return query
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
  }

  /**
   * 记录搜索
   */
  recordSearch(query, result) {
    // 记录搜索历史
    this.searchHistory.set(query, {
      query,
      timestamp: Date.now(),
      resultCount: result.totalHits
    })
    
    // 更新热门搜索
    const count = this.popularQueries.get(query) || 0
    this.popularQueries.set(query, count + 1)
    
    // 限制历史记录大小
    if (this.searchHistory.size > 1000) {
      const oldestKey = this.searchHistory.keys().next().value
      this.searchHistory.delete(oldestKey)
    }
  }

  /**
   * 记录分析数据
   */
  recordAnalytics(query, responseTime, fromCache) {
    if (!this.config.enableAnalytics) return
    
    this.analytics.totalSearches++
    this.analytics.avgResponseTime = (
      (this.analytics.avgResponseTime * (this.analytics.totalSearches - 1) + responseTime) / 
      this.analytics.totalSearches
    )
    
    // 记录热门搜索词
    const count = this.analytics.popularTerms.get(query) || 0
    this.analytics.popularTerms.set(query, count + 1)
    
    // 记录搜索趋势
    this.analytics.searchTrends.push({
      query,
      timestamp: Date.now(),
      responseTime,
      fromCache
    })
    
    // 限制趋势数据大小
    if (this.analytics.searchTrends.length > 10000) {
      this.analytics.searchTrends = this.analytics.searchTrends.slice(-5000)
    }
  }

  /**
   * 缓存管理
   */
  getCacheKey(query, options) {
    return `${query}:${JSON.stringify(options)}`
  }

  getFromCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.config.maxCacheAge) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  setCache(key, data) {
    if (this.cache.size >= this.config.cacheSize) {
      // 删除最旧的缓存
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 获取空结果
   */
  getEmptyResult() {
    return {
      hits: [],
      totalHits: 0,
      page: 0,
      hitsPerPage: 20,
      processingTime: 0,
      query: '',
      facets: {},
      exhaustiveNbHits: true
    }
  }

  /**
   * 获取错误结果
   */
  getErrorResult(error) {
    return {
      hits: [],
      totalHits: 0,
      page: 0,
      hitsPerPage: 20,
      processingTime: 0,
      query: '',
      facets: {},
      exhaustiveNbHits: true,
      error: error.message
    }
  }

  /**
   * 获取搜索分析
   */
  getAnalytics() {
    return {
      ...this.analytics,
      cacheHitRate: this.cache.size > 0 ? 
        Array.from(this.cache.values()).filter(c => c.hits > 0).length / this.cache.size : 0,
      indexSize: this.searchIndex.size,
      popularQueries: Array.from(this.popularQueries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    }
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear()
  }
}

/**
 * 前缀树节点
 */
class TrieNode {
  constructor() {
    this.children = new Map()
    this.isEndOfWord = false
    this.word = null
    this.frequency = 0
  }

  /**
   * 插入单词
   */
  insert(word) {
    let current = this
    
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode())
      }
      current = current.children.get(char)
    }
    
    current.isEndOfWord = true
    current.word = word
    current.frequency++
  }

  /**
   * 搜索前缀
   */
  search(prefix) {
    let current = this
    
    // 找到前缀节点
    for (const char of prefix) {
      if (!current.children.has(char)) {
        return []
      }
      current = current.children.get(char)
    }
    
    // 收集所有以该前缀开始的单词
    const results = []
    this.collectWords(current, results)
    
    // 按频率排序
    return results
      .sort((a, b) => b.frequency - a.frequency)
      .map(item => item.word)
  }

  /**
   * 收集单词
   */
  collectWords(node, results) {
    if (node.isEndOfWord) {
      results.push({
        word: node.word,
        frequency: node.frequency
      })
    }
    
    for (const child of node.children.values()) {
      this.collectWords(child, results)
    }
  }
}

// 全局实时搜索引擎实例
export const realTimeSearchEngine = new RealTimeSearchEngine()