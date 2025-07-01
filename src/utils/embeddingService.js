/**
 * 嵌入向量服务 - 支持多种嵌入模型
 */

export class EmbeddingService {
  constructor() {
    this.provider = 'openai' // 默认使用OpenAI
    this.cache = new Map()
    this.batchSize = 100
  }

  /**
   * 设置嵌入提供商
   * @param {string} provider - 提供商名称
   * @param {Object} config - 配置信息
   */
  setProvider(provider, config = {}) {
    this.provider = provider
    this.config = config
  }

  /**
   * 生成文本嵌入向量
   * @param {string|Array} texts - 文本或文本数组
   * @returns {Promise<Array>} 嵌入向量
   */
  async embed(texts) {
    const textArray = Array.isArray(texts) ? texts : [texts]
    const results = []
    
    // 检查缓存
    const uncachedTexts = []
    const cachedResults = []
    
    textArray.forEach((text, index) => {
      const cacheKey = this.getCacheKey(text)
      if (this.cache.has(cacheKey)) {
        cachedResults[index] = this.cache.get(cacheKey)
      } else {
        uncachedTexts.push({ text, index })
      }
    })
    
    // 批量处理未缓存的文本
    if (uncachedTexts.length > 0) {
      const batches = this.createBatches(uncachedTexts, this.batchSize)
      
      for (const batch of batches) {
        const batchResults = await this.embedBatch(batch.map(item => item.text))
        
        batch.forEach((item, batchIndex) => {
          const embedding = batchResults[batchIndex]
          results[item.index] = embedding
          
          // 缓存结果
          const cacheKey = this.getCacheKey(item.text)
          this.cache.set(cacheKey, embedding)
        })
      }
    }
    
    // 合并缓存和新结果
    textArray.forEach((text, index) => {
      if (cachedResults[index]) {
        results[index] = cachedResults[index]
      }
    })
    
    return Array.isArray(texts) ? results : results[0]
  }

  /**
   * 批量嵌入
   * @param {Array} texts - 文本数组
   * @returns {Promise<Array>} 嵌入向量数组
   */
  async embedBatch(texts) {
    switch (this.provider) {
      case 'openai':
        return await this.embedWithOpenAI(texts)
      case 'local':
        return await this.embedWithLocal(texts)
      default:
        throw new Error(`Unsupported embedding provider: ${this.provider}`)
    }
  }

  /**
   * 使用OpenAI API生成嵌入
   */
  async embedWithOpenAI(texts) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model || 'text-embedding-3-small',
          input: texts,
          encoding_format: 'float'
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data.map(item => item.embedding)
    } catch (error) {
      console.error('OpenAI embedding failed:', error)
      // 降级到本地嵌入
      return await this.embedWithLocal(texts)
    }
  }

  /**
   * 本地嵌入实现（简化版）
   */
  async embedWithLocal(texts) {
    return texts.map(text => this.simpleEmbedding(text))
  }

  /**
   * 简单嵌入算法（用于降级）
   */
  simpleEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/)
    const vector = new Array(384).fill(0) // 384维向量
    
    words.forEach((word, index) => {
      const hash = this.hashString(word)
      for (let i = 0; i < 384; i++) {
        vector[i] += Math.sin(hash + i) * 0.1
      }
    })
    
    // 归一化
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return vector.map(val => val / norm)
  }

  /**
   * 字符串哈希
   */
  hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return hash
  }

  /**
   * 创建批次
   */
  createBatches(items, batchSize) {
    const batches = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }

  /**
   * 生成缓存键
   */
  getCacheKey(text) {
    return `${this.provider}:${this.hashString(text)}`
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      memoryUsage: `${(this.cache.size * 384 * 8 / 1024 / 1024).toFixed(2)} MB`
    }
  }
}

// 全局嵌入服务实例
export const embeddingService = new EmbeddingService()