/**
 * 企业级职位搜索服务
 * 整合多个职位数据源，提供统一的搜索接口
 */

import { JobSpyAdapter } from './jobAdapters/JobSpyAdapter.js'
import { LinkedInAdapter } from './jobAdapters/LinkedInAdapter.js'
import { JobApisAdapter } from './jobAdapters/JobApisAdapter.js'

export class EnterpriseJobSearchService {
  constructor() {
    this.adapters = {
      jobspy: new JobSpyAdapter(),
      linkedin: new LinkedInAdapter(),
      jobapis: new JobApisAdapter()
    }
    
    this.config = {
      enabledAdapters: ['jobspy', 'linkedin', 'jobapis'],
      maxResultsPerAdapter: 20,
      searchTimeout: 30000, // 30秒超时
      enableParallelSearch: true,
      enableResultMerging: true,
      enableDeduplication: true,
      cacheResults: true,
      cacheTimeout: 10 * 60 * 1000 // 10分钟缓存
    }
    
    this.cache = new Map()
    this.searchMetrics = {
      totalSearches: 0,
      successfulSearches: 0,
      avgResponseTime: 0,
      adapterStats: {}
    }
  }

  /**
   * 企业级职位搜索
   * @param {Object} params - 搜索参数
   * @returns {Promise<Object>} 搜索结果
   */
  async searchJobs(params) {
    const startTime = Date.now()
    
    try {
      // 参数验证和预处理
      const processedParams = this.preprocessSearchParams(params)
      
      // 检查缓存
      const cacheKey = this.getCacheKey(processedParams)
      const cachedResult = this.getFromCache(cacheKey)
      if (cachedResult) {
        this.updateMetrics(startTime, true)
        return cachedResult
      }

      // 执行搜索
      const searchResult = await this.performSearch(processedParams)
      
      // 缓存结果
      if (this.config.cacheResults) {
        this.setCache(cacheKey, searchResult)
      }
      
      // 更新指标
      this.updateMetrics(startTime, false)
      
      return searchResult
      
    } catch (error) {
      console.error('Enterprise job search failed:', error)
      this.searchMetrics.totalSearches++
      throw error
    }
  }

  /**
   * 执行搜索
   */
  async performSearch(params) {
    const { adapters = this.config.enabledAdapters } = params
    
    if (this.config.enableParallelSearch) {
      return await this.parallelSearch(params, adapters)
    } else {
      return await this.sequentialSearch(params, adapters)
    }
  }

  /**
   * 并行搜索
   */
  async parallelSearch(params, adapters) {
    const searchPromises = adapters.map(adapterName => 
      this.searchWithAdapter(adapterName, params)
    )

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
        
        // 更新适配器统计
        this.updateAdapterStats(adapterName, true, result.value.length)
      } else {
        errors.push({
          adapter: adapterName,
          error: result.reason.message
        })
        
        this.updateAdapterStats(adapterName, false, 0)
        console.warn(`Adapter ${adapterName} failed:`, result.reason)
      }
    })

    // 合并结果
    const mergedJobs = this.mergeResults(successfulResults)
    
    return {
      jobs: mergedJobs,
      totalCount: mergedJobs.length,
      sources: successfulResults.map(r => ({
        adapter: r.adapter,
        count: r.count
      })),
      errors,
      searchTime: Date.now(),
      algorithm: 'enterprise_parallel_v1.0'
    }
  }

  /**
   * 顺序搜索
   */
  async sequentialSearch(params, adapters) {
    const results = []
    const errors = []
    
    for (const adapterName of adapters) {
      try {
        const jobs = await this.searchWithAdapter(adapterName, params)
        results.push({
          adapter: adapterName,
          jobs,
          count: jobs.length
        })
        
        this.updateAdapterStats(adapterName, true, jobs.length)
        
        // 如果已经获得足够的结果，可以提前结束
        const totalJobs = results.reduce((sum, r) => sum + r.count, 0)
        if (totalJobs >= params.limit * 2) {
          break
        }
        
      } catch (error) {
        errors.push({
          adapter: adapterName,
          error: error.message
        })
        
        this.updateAdapterStats(adapterName, false, 0)
        console.warn(`Adapter ${adapterName} failed:`, error)
      }
    }

    const mergedJobs = this.mergeResults(results)
    
    return {
      jobs: mergedJobs,
      totalCount: mergedJobs.length,
      sources: results.map(r => ({
        adapter: r.adapter,
        count: r.count
      })),
      errors,
      searchTime: Date.now(),
      algorithm: 'enterprise_sequential_v1.0'
    }
  }

  /**
   * 使用指定适配器搜索
   */
  async searchWithAdapter(adapterName, params) {
    const adapter = this.adapters[adapterName]
    if (!adapter) {
      throw new Error(`Unknown adapter: ${adapterName}`)
    }

    // 设置超时
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${adapterName} search timeout`)), this.config.searchTimeout)
    })

    const searchPromise = adapter.searchJobs({
      ...params,
      limit: this.config.maxResultsPerAdapter
    })

    return await Promise.race([searchPromise, timeoutPromise])
  }

  /**
   * 合并搜索结果
   */
  mergeResults(results) {
    const allJobs = []
    
    // 收集所有职位
    results.forEach(result => {
      allJobs.push(...result.jobs)
    })
    
    if (!this.config.enableResultMerging) {
      return allJobs
    }

    // 去重
    let mergedJobs = allJobs
    if (this.config.enableDeduplication) {
      mergedJobs = this.deduplicateJobs(allJobs)
    }
    
    // 排序 - 按相关性和发布时间
    mergedJobs.sort((a, b) => {
      // 优先级：有薪资信息 > 最近发布 > 来源可靠性
      const aScore = this.calculateJobScore(a)
      const bScore = this.calculateJobScore(b)
      return bScore - aScore
    })
    
    return mergedJobs
  }

  /**
   * 计算职位评分
   */
  calculateJobScore(job) {
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
   * 职位去重
   */
  deduplicateJobs(jobs) {
    const seen = new Map()
    const duplicates = []
    
    return jobs.filter(job => {
      // 生成去重键
      const key = this.generateDeduplicationKey(job)
      
      if (seen.has(key)) {
        duplicates.push(job)
        return false
      }
      
      seen.set(key, job)
      return true
    })
  }

  /**
   * 生成去重键
   */
  generateDeduplicationKey(job) {
    // 标准化文本
    const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').trim()
    
    const title = normalize(job.title || '')
    const company = normalize(job.company || '')
    const location = normalize(job.location || '')
    
    return `${title}_${company}_${location}`
  }

  /**
   * 预处理搜索参数
   */
  preprocessSearchParams(params) {
    const {
      query = '',
      location = '',
      limit = 20,
      adapters = this.config.enabledAdapters,
      ...otherParams
    } = params

    return {
      query: query.trim(),
      location: location.trim(),
      limit: Math.min(limit, 100), // 限制最大结果数
      adapters: adapters.filter(name => this.adapters[name]), // 过滤无效适配器
      ...otherParams
    }
  }

  /**
   * 缓存管理
   */
  getCacheKey(params) {
    return JSON.stringify(params)
  }

  getFromCache(key) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.config.cacheTimeout) {
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
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  /**
   * 更新搜索指标
   */
  updateMetrics(startTime, fromCache) {
    this.searchMetrics.totalSearches++
    
    if (!fromCache) {
      this.searchMetrics.successfulSearches++
      
      const responseTime = Date.now() - startTime
      this.searchMetrics.avgResponseTime = (
        (this.searchMetrics.avgResponseTime * (this.searchMetrics.successfulSearches - 1) + responseTime) /
        this.searchMetrics.successfulSearches
      )
    }
  }

  /**
   * 更新适配器统计
   */
  updateAdapterStats(adapterName, success, resultCount) {
    if (!this.searchMetrics.adapterStats[adapterName]) {
      this.searchMetrics.adapterStats[adapterName] = {
        totalRequests: 0,
        successfulRequests: 0,
        totalResults: 0,
        avgResults: 0
      }
    }
    
    const stats = this.searchMetrics.adapterStats[adapterName]
    stats.totalRequests++
    
    if (success) {
      stats.successfulRequests++
      stats.totalResults += resultCount
      stats.avgResults = stats.totalResults / stats.successfulRequests
    }
  }

  /**
   * 获取系统状态
   */
  getSystemStatus() {
    return {
      config: this.config,
      metrics: this.searchMetrics,
      adapters: Object.keys(this.adapters),
      cacheSize: this.cache.size,
      uptime: Date.now()
    }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear()
  }
}

// 全局企业级职位搜索服务实例
export const enterpriseJobSearchService = new EnterpriseJobSearchService()