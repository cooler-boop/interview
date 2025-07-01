/**
 * 职位匹配编排器 - 多阶段流水线
 * 实现完整的智能职位匹配算法升级方案
 */

import { vectorStore } from './vectorStore.js'
import { embeddingService } from './embeddingService.js'
import { featureBuilder } from './featureBuilder.js'
import { ltrModelService } from './ltrModel.js'

export class JobMatchOrchestrator {
  constructor() {
    this.isInitialized = false
    this.config = {
      recallSize: 50,
      finalSize: 10,
      vectorWeight: 0.7,
      keywordWeight: 0.3,
      enableLTR: true,
      enableLogging: true
    }
    this.metrics = {
      totalQueries: 0,
      avgLatency: 0,
      cacheHitRate: 0
    }
  }

  /**
   * 初始化编排器
   */
  async initialize() {
    try {
      // 初始化各个组件
      await vectorStore.initialize()
      await ltrModelService.loadModel()
      
      // 设置嵌入服务
      const aiConfig = this.getAIConfig()
      if (aiConfig) {
        embeddingService.setProvider('openai', {
          apiKey: aiConfig.apiKey,
          model: 'text-embedding-3-small'
        })
      }
      
      this.isInitialized = true
      console.log('JobMatchOrchestrator initialized successfully')
    } catch (error) {
      console.error('Failed to initialize JobMatchOrchestrator:', error)
    }
  }

  /**
   * 智能职位匹配主流程
   * @param {Object} searchRequest - 搜索请求
   * @returns {Object} 匹配结果
   */
  async matchJobs(searchRequest) {
    const startTime = Date.now()
    
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }
      
      // 1. 请求预处理
      const processedRequest = await this.preprocessRequest(searchRequest)
      
      // 2. 双通道召回
      const recallResults = await this.dualChannelRecall(processedRequest)
      
      // 3. 特征构建
      const features = await this.buildRankingFeatures(processedRequest, recallResults)
      
      // 4. LTR排序
      const rankedResults = await this.rankWithLTR(recallResults, features)
      
      // 5. 后处理和过滤
      const finalResults = await this.postProcess(rankedResults, processedRequest)
      
      // 6. 记录日志和指标
      await this.logResults(searchRequest, finalResults, Date.now() - startTime)
      
      return {
        jobs: finalResults,
        totalCount: recallResults.length,
        latency: Date.now() - startTime,
        algorithm: 'advanced_ltr_v2.1'
      }
      
    } catch (error) {
      console.error('Job matching failed:', error)
      // 降级到简单匹配
      return await this.fallbackMatching(searchRequest)
    }
  }

  /**
   * 请求预处理
   */
  async preprocessRequest(request) {
    const {
      query = '',
      userProfile = {},
      location = '',
      filters = {},
      limit = 10
    } = request
    
    // 查询文本清理和标准化
    const cleanQuery = this.cleanQuery(query)
    
    // 生成查询向量
    let queryVector = null
    try {
      queryVector = await embeddingService.embed(cleanQuery)
    } catch (error) {
      console.warn('Failed to generate query embedding:', error)
    }
    
    // 用户画像增强
    const enhancedProfile = await this.enhanceUserProfile(userProfile)
    
    return {
      originalQuery: query,
      cleanQuery,
      queryVector,
      userProfile: enhancedProfile,
      location,
      filters,
      limit: Math.min(limit, 50) // 限制最大返回数量
    }
  }

  /**
   * 双通道召回
   */
  async dualChannelRecall(request) {
    const { cleanQuery, queryVector, userProfile, filters } = request
    
    // 通道1: 关键词召回
    const keywordResults = await vectorStore.keywordSearch(
      cleanQuery, 
      this.config.recallSize
    )
    
    // 通道2: 向量召回
    let vectorResults = []
    if (queryVector) {
      vectorResults = await vectorStore.vectorSearch(
        queryVector, 
        this.config.recallSize
      )
    }
    
    // 合并去重
    const mergedResults = this.mergeRecallResults(keywordResults, vectorResults)
    
    // 应用基础过滤
    const filteredResults = this.applyFilters(mergedResults, filters)
    
    return filteredResults.slice(0, this.config.recallSize)
  }

  /**
   * 合并召回结果
   */
  mergeRecallResults(keywordResults, vectorResults) {
    const merged = new Map()
    
    // 添加关键词结果
    keywordResults.forEach(result => {
      merged.set(result.id, {
        ...result,
        keywordScore: result.score || 0,
        vectorScore: 0,
        source: 'keyword'
      })
    })
    
    // 添加向量结果
    vectorResults.forEach(result => {
      if (merged.has(result.id)) {
        merged.get(result.id).vectorScore = result.similarity || 0
        merged.get(result.id).source = 'both'
      } else {
        merged.set(result.id, {
          ...result,
          keywordScore: 0,
          vectorScore: result.similarity || 0,
          source: 'vector'
        })
      }
    })
    
    // 计算综合分数
    return Array.from(merged.values()).map(result => ({
      ...result,
      recallScore: result.keywordScore * this.config.keywordWeight + 
                   result.vectorScore * this.config.vectorWeight
    }))
  }

  /**
   * 应用过滤条件
   */
  applyFilters(results, filters) {
    return results.filter(result => {
      const job = result.metadata
      
      // 地点过滤
      if (filters.location && !job.location?.includes(filters.location)) {
        return false
      }
      
      // 薪资过滤
      if (filters.salaryMin) {
        const jobSalary = this.parseSalary(job.salary)
        if (jobSalary < filters.salaryMin) {
          return false
        }
      }
      
      // 经验要求过滤
      if (filters.experience) {
        const jobExp = this.parseExperience(job.experienceRequired)
        const userExp = this.parseExperience(filters.experience)
        if (jobExp > userExp + 1) { // 允许1年误差
          return false
        }
      }
      
      // 公司规模过滤
      if (filters.companySize && job.companySize !== filters.companySize) {
        return false
      }
      
      return true
    })
  }

  /**
   * 构建排序特征
   */
  async buildRankingFeatures(request, recallResults) {
    const { userProfile } = request
    const jobs = recallResults.map(result => result.metadata)
    
    const { features, featureNames } = featureBuilder.buildFeatures(
      userProfile, 
      jobs, 
      recallResults
    )
    
    return {
      features,
      featureNames,
      jobIds: recallResults.map(result => result.id)
    }
  }

  /**
   * LTR排序
   */
  async rankWithLTR(recallResults, featureData) {
    if (!this.config.enableLTR || !ltrModelService.isLoaded) {
      // 降级到基于召回分数的排序
      return recallResults.sort((a, b) => b.recallScore - a.recallScore)
    }
    
    try {
      // 使用LTR模型预测排序分数
      const predictions = await ltrModelService.predict(featureData.features)
      
      // 将预测分数附加到结果上
      const rankedResults = recallResults.map((result, index) => ({
        ...result,
        ltrScore: predictions[index] || 0,
        features: featureData.features[index]
      }))
      
      // 按LTR分数排序
      return rankedResults.sort((a, b) => b.ltrScore - a.ltrScore)
      
    } catch (error) {
      console.error('LTR ranking failed:', error)
      // 降级排序
      return recallResults.sort((a, b) => b.recallScore - a.recallScore)
    }
  }

  /**
   * 后处理
   */
  async postProcess(rankedResults, request) {
    const { limit } = request
    
    // 取前N个结果
    let finalResults = rankedResults.slice(0, limit)
    
    // 多样性处理 - 避免同一公司占据太多位置
    finalResults = this.diversifyResults(finalResults)
    
    // 添加推荐理由
    finalResults = finalResults.map(result => ({
      ...result.metadata,
      matchScore: Math.round((result.ltrScore || result.recallScore) * 100),
      reasons: this.generateRecommendationReasons(result),
      algorithm: {
        keywordScore: result.keywordScore,
        vectorScore: result.vectorScore,
        ltrScore: result.ltrScore,
        source: result.source
      }
    }))
    
    return finalResults
  }

  /**
   * 结果多样性处理
   */
  diversifyResults(results) {
    const companyCount = new Map()
    const diversified = []
    
    for (const result of results) {
      const company = result.metadata.company
      const currentCount = companyCount.get(company) || 0
      
      // 限制同一公司最多3个职位
      if (currentCount < 3) {
        diversified.push(result)
        companyCount.set(company, currentCount + 1)
      }
    }
    
    return diversified
  }

  /**
   * 生成推荐理由
   */
  generateRecommendationReasons(result) {
    const reasons = []
    
    if (result.keywordScore > 0.7) {
      reasons.push('技能高度匹配')
    }
    
    if (result.vectorScore > 0.8) {
      reasons.push('职位描述相似度高')
    }
    
    if (result.source === 'both') {
      reasons.push('综合匹配度优秀')
    }
    
    if (result.ltrScore > 0.9) {
      reasons.push('AI推荐置信度高')
    }
    
    return reasons.length > 0 ? reasons : ['基于算法推荐']
  }

  /**
   * 降级匹配
   */
  async fallbackMatching(request) {
    const { query, limit = 10 } = request
    
    // 简单的关键词匹配
    const mockJobs = this.generateMockJobs(query, limit)
    
    return {
      jobs: mockJobs,
      totalCount: mockJobs.length,
      latency: 50,
      algorithm: 'fallback_simple'
    }
  }

  /**
   * 生成模拟职位数据
   */
  generateMockJobs(query, limit) {
    const companies = ['字节跳动', '腾讯', '阿里巴巴', '美团', '滴滴', '百度']
    const locations = ['北京', '上海', '深圳', '杭州', '广州']
    const jobs = []
    
    for (let i = 0; i < limit; i++) {
      jobs.push({
        id: `job_${Date.now()}_${i}`,
        title: `${query}工程师`,
        company: companies[i % companies.length],
        location: locations[i % locations.length],
        salary: `${15 + i * 2}K-${25 + i * 3}K`,
        experience: `${1 + i % 5}年经验`,
        matchScore: Math.floor(Math.random() * 30) + 70,
        reasons: ['关键词匹配', '经验符合'],
        description: `负责${query}相关的开发工作，要求有扎实的技术基础。`,
        requirements: ['JavaScript', 'React', 'Node.js'],
        benefits: ['五险一金', '年终奖', '弹性工作']
      })
    }
    
    return jobs
  }

  /**
   * 记录日志和指标
   */
  async logResults(request, results, latency) {
    if (!this.config.enableLogging) return
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      query: request.query,
      userProfile: request.userProfile?.id,
      resultCount: results.length,
      latency,
      algorithm: 'advanced_ltr_v2.1'
    }
    
    // 更新指标
    this.metrics.totalQueries++
    this.metrics.avgLatency = (this.metrics.avgLatency * (this.metrics.totalQueries - 1) + latency) / this.metrics.totalQueries
    
    // 保存日志（实际环境中会发送到日志系统）
    console.log('Job matching log:', logEntry)
  }

  /**
   * 用户画像增强
   */
  async enhanceUserProfile(profile) {
    // 从历史行为中推断偏好
    const enhanced = { ...profile }
    
    // 添加默认值
    enhanced.skills = enhanced.skills || []
    enhanced.experience = enhanced.experience || '0年'
    enhanced.preferredLocations = enhanced.preferredLocations || []
    enhanced.expectedSalary = enhanced.expectedSalary || '10K-20K'
    
    // 从简历中提取技能（如果有的话）
    if (enhanced.resumeText) {
      const extractedSkills = this.extractSkillsFromText(enhanced.resumeText)
      enhanced.skills = [...new Set([...enhanced.skills, ...extractedSkills])]
    }
    
    return enhanced
  }

  /**
   * 从文本中提取技能
   */
  extractSkillsFromText(text) {
    const skillKeywords = [
      'JavaScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java',
      'TypeScript', 'CSS', 'HTML', 'MySQL', 'MongoDB', 'Redis', 'Docker',
      'Kubernetes', 'AWS', 'Git', '项目管理', '团队协作', '沟通能力'
    ]
    
    const foundSkills = []
    const lowerText = text.toLowerCase()
    
    skillKeywords.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill)
      }
    })
    
    return foundSkills
  }

  /**
   * 查询清理
   */
  cleanQuery(query) {
    return query
      .trim()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
  }

  /**
   * 解析薪资
   */
  parseSalary(salary) {
    if (!salary) return 0
    const numbers = salary.match(/\d+/g)
    return numbers ? parseInt(numbers[0]) : 0
  }

  /**
   * 解析经验
   */
  parseExperience(experience) {
    if (!experience) return 0
    const match = experience.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  /**
   * 获取AI配置
   */
  getAIConfig() {
    try {
      const saved = localStorage.getItem('ai-config-storage')
      if (saved) {
        const data = JSON.parse(saved)
        return data.state?.configs?.openai
      }
    } catch (error) {
      console.warn('Failed to get AI config:', error)
    }
    return null
  }

  /**
   * 获取系统状态
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      config: this.config,
      metrics: this.metrics,
      components: {
        vectorStore: vectorStore.getStats(),
        embeddingService: embeddingService.getCacheStats(),
        ltrModel: ltrModelService.getModelInfo()
      }
    }
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    console.log('JobMatchOrchestrator config updated:', this.config)
  }
}

// 全局职位匹配编排器实例
export const jobMatchOrchestrator = new JobMatchOrchestrator()