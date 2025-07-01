/**
 * 向量存储服务 - 支持语义检索
 * 实现双通道召回：关键词倒排 + 向量检索
 */

export class VectorStore {
  constructor() {
    this.vectors = new Map() // 存储向量数据
    this.index = new Map()   // 倒排索引
    this.metadata = new Map() // 元数据
    this.isInitialized = false
    this.sampleDataLoaded = false
  }

  /**
   * 初始化向量存储
   */
  async initialize() {
    try {
      // 加载已保存的向量数据
      const savedVectors = localStorage.getItem('vector-store-data')
      if (savedVectors) {
        const data = JSON.parse(savedVectors)
        this.vectors = new Map(data.vectors)
        this.index = new Map(data.index.map(([key, value]) => [key, new Set(value)]))
        this.metadata = new Map(data.metadata)
        this.sampleDataLoaded = data.sampleDataLoaded || false
      }
      
      // 如果没有数据，加载示例数据
      if (this.vectors.size === 0 && !this.sampleDataLoaded) {
        await this.loadSampleData()
      }
      
      this.isInitialized = true
      console.log(`VectorStore initialized successfully with ${this.vectors.size} vectors`)
    } catch (error) {
      console.error('Failed to initialize VectorStore:', error)
      // 即使出错也要加载示例数据
      await this.loadSampleData()
      this.isInitialized = true
    }
  }

  /**
   * 加载示例数据
   */
  async loadSampleData() {
    console.log('Loading sample job data into vector store...')
    
    const sampleJobs = [
      {
        id: 'job_001',
        title: '高级前端工程师',
        company: '字节跳动',
        location: '北京',
        salary: '25K-45K',
        experience: '3-5年',
        description: '负责前端架构设计和开发，熟练掌握React、Vue、TypeScript等技术栈，具备良好的工程化思维和团队协作能力。',
        requirements: ['JavaScript', 'React', 'Vue', 'TypeScript', 'Webpack', 'Node.js'],
        benefits: ['五险一金', '年终奖', '股票期权', '弹性工作', '技术培训'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_002',
        title: 'React开发工程师',
        company: '腾讯',
        location: '深圳',
        salary: '20K-35K',
        experience: '2-4年',
        description: '参与大型Web应用开发，使用React技术栈构建高性能用户界面，负责组件库建设和性能优化。',
        requirements: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Ant Design'],
        benefits: ['五险一金', '年终奖', '餐补', '班车', '健身房'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_003',
        title: '全栈工程师',
        company: '阿里巴巴',
        location: '杭州',
        salary: '30K-50K',
        experience: '3-6年',
        description: '负责前后端全栈开发，具备完整的产品开发能力，熟悉微服务架构和云原生技术。',
        requirements: ['JavaScript', 'Node.js', 'React', 'MySQL', 'Redis', 'Docker'],
        benefits: ['五险一金', '年终奖', '股票期权', '免费三餐', '住房补贴'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_004',
        title: 'Vue.js开发工程师',
        company: '美团',
        location: '北京',
        salary: '18K-30K',
        experience: '2-4年',
        description: '使用Vue.js开发企业级应用，参与组件库和工具链建设，优化用户体验和开发效率。',
        requirements: ['Vue.js', 'JavaScript', 'Element UI', 'Vuex', 'Vue Router', 'Webpack'],
        benefits: ['五险一金', '年终奖', '餐补', '交通补贴', '团建活动'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_005',
        title: 'Node.js后端工程师',
        company: '滴滴',
        location: '北京',
        salary: '22K-38K',
        experience: '3-5年',
        description: '负责后端服务开发和维护，设计高并发、高可用的分布式系统，优化系统性能。',
        requirements: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'],
        benefits: ['五险一金', '年终奖', '股票期权', '弹性工作', '技术分享'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_006',
        title: 'Python开发工程师',
        company: '百度',
        location: '北京',
        salary: '20K-35K',
        experience: '2-5年',
        description: '使用Python开发后端服务和数据处理系统，参与AI算法工程化落地。',
        requirements: ['Python', 'Django', 'Flask', 'MySQL', 'Redis', 'TensorFlow'],
        benefits: ['五险一金', '年终奖', '免费午餐', '健身房', '技术培训'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_007',
        title: '前端架构师',
        company: '小米',
        location: '北京',
        salary: '35K-60K',
        experience: '5-8年',
        description: '负责前端技术架构设计，制定技术规范和最佳实践，指导团队技术发展方向。',
        requirements: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Webpack', '微前端'],
        benefits: ['五险一金', '年终奖', '股票期权', '弹性工作', '技术大会'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_008',
        title: 'Java开发工程师',
        company: '京东',
        location: '北京',
        salary: '25K-40K',
        experience: '3-6年',
        description: '负责Java后端开发，参与大型电商系统建设，具备高并发系统设计经验。',
        requirements: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka', 'Elasticsearch'],
        benefits: ['五险一金', '年终奖', '购物优惠', '健身房', '员工食堂'],
        industry: '电商',
        companySize: '大型'
      },
      {
        id: 'job_009',
        title: '移动端开发工程师',
        company: '华为',
        location: '深圳',
        salary: '20K-35K',
        experience: '2-5年',
        description: '负责Android/iOS应用开发，参与移动端架构设计和性能优化。',
        requirements: ['Android', 'iOS', 'React Native', 'Flutter', 'Java', 'Swift'],
        benefits: ['五险一金', '年终奖', '住房补贴', '班车', '技术培训'],
        industry: '通信',
        companySize: '大型'
      },
      {
        id: 'job_010',
        title: 'DevOps工程师',
        company: '网易',
        location: '杭州',
        salary: '25K-40K',
        experience: '3-6年',
        description: '负责CI/CD流水线建设，容器化部署和运维自动化，保障系统稳定运行。',
        requirements: ['Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'Prometheus', 'Grafana'],
        benefits: ['五险一金', '年终奖', '弹性工作', '技术分享', '团建活动'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_011',
        title: '数据分析师',
        company: '蚂蚁金服',
        location: '杭州',
        salary: '18K-30K',
        experience: '2-4年',
        description: '负责业务数据分析和挖掘，构建数据指标体系，支持业务决策。',
        requirements: ['Python', 'SQL', 'Tableau', 'Excel', 'R', '统计学'],
        benefits: ['五险一金', '年终奖', '股票期权', '免费三餐', '健身房'],
        industry: '金融科技',
        companySize: '大型'
      },
      {
        id: 'job_012',
        title: '产品经理',
        company: '快手',
        location: '北京',
        salary: '25K-45K',
        experience: '3-6年',
        description: '负责产品规划和设计，协调各部门资源，推动产品迭代和优化。',
        requirements: ['产品设计', '用户研究', '数据分析', '项目管理', 'Axure', 'Figma'],
        benefits: ['五险一金', '年终奖', '股票期权', '弹性工作', '产品培训'],
        industry: '互联网',
        companySize: '大型'
      },
      {
        id: 'job_013',
        title: 'UI/UX设计师',
        company: 'OPPO',
        location: '深圳',
        salary: '15K-25K',
        experience: '2-4年',
        description: '负责产品界面设计和用户体验优化，制定设计规范和组件库。',
        requirements: ['Sketch', 'Figma', 'Adobe Creative Suite', '用户体验', '交互设计', '视觉设计'],
        benefits: ['五险一金', '年终奖', '设计培训', '创意奖金', '弹性工作'],
        industry: '消费电子',
        companySize: '大型'
      },
      {
        id: 'job_014',
        title: '算法工程师',
        company: '商汤科技',
        location: '上海',
        salary: '30K-55K',
        experience: '3-6年',
        description: '负责机器学习算法研发和优化，参与AI产品的算法落地。',
        requirements: ['Python', 'TensorFlow', 'PyTorch', '机器学习', '深度学习', '计算机视觉'],
        benefits: ['五险一金', '年终奖', '股票期权', '技术大会', '论文奖励'],
        industry: '人工智能',
        companySize: '中型'
      },
      {
        id: 'job_015',
        title: '测试工程师',
        company: '携程',
        location: '上海',
        salary: '15K-25K',
        experience: '2-4年',
        description: '负责软件测试和质量保证，设计测试用例和自动化测试框架。',
        requirements: ['测试理论', 'Selenium', 'JMeter', 'Python', 'Java', 'SQL'],
        benefits: ['五险一金', '年终奖', '旅游福利', '弹性工作', '技术培训'],
        industry: '在线旅游',
        companySize: '大型'
      }
    ]

    // 为每个职位生成向量和索引
    for (const job of sampleJobs) {
      const vector = this.generateJobVector(job)
      await this.addVector(job.id, vector, job)
    }

    this.sampleDataLoaded = true
    await this.persist()
    
    console.log(`Loaded ${sampleJobs.length} sample jobs into vector store`)
  }

  /**
   * 生成职位向量（简化版）
   */
  generateJobVector(job) {
    // 创建384维向量（模拟embedding）
    const vector = new Array(384).fill(0)
    
    // 基于职位信息生成特征向量
    const text = `${job.title} ${job.description} ${job.requirements.join(' ')} ${job.company} ${job.location}`
    const words = this.extractKeywords(text)
    
    // 使用简单的哈希方法生成向量
    words.forEach((word, index) => {
      const hash = this.hashString(word)
      for (let i = 0; i < 384; i++) {
        vector[i] += Math.sin(hash + i + index) * 0.1
      }
    })
    
    // 归一化向量
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return vector.map(val => val / (norm || 1))
  }

  /**
   * 字符串哈希函数
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
   * 添加文档向量
   * @param {string} id - 文档ID
   * @param {Array} vector - 向量数据
   * @param {Object} metadata - 元数据
   */
  async addVector(id, vector, metadata = {}) {
    this.vectors.set(id, vector)
    this.metadata.set(id, metadata)
    
    // 构建倒排索引
    if (metadata.title || metadata.description) {
      const text = `${metadata.title || ''} ${metadata.description || ''} ${(metadata.requirements || []).join(' ')}`
      const keywords = this.extractKeywords(text)
      keywords.forEach(keyword => {
        if (!this.index.has(keyword)) {
          this.index.set(keyword, new Set())
        }
        this.index.get(keyword).add(id)
      })
    }
    
    // 不需要每次都持久化，批量操作时在外部调用
    if (this.isInitialized) {
      await this.persist()
    }
  }

  /**
   * 批量添加向量
   * @param {Array} items - 向量数据数组
   */
  async addVectorsBatch(items) {
    for (const item of items) {
      const { id, vector, metadata } = item
      this.vectors.set(id, vector)
      this.metadata.set(id, metadata)
      
      // 构建倒排索引
      if (metadata.title || metadata.description) {
        const text = `${metadata.title || ''} ${metadata.description || ''} ${(metadata.requirements || []).join(' ')}`
        const keywords = this.extractKeywords(text)
        keywords.forEach(keyword => {
          if (!this.index.has(keyword)) {
            this.index.set(keyword, new Set())
          }
          this.index.get(keyword).add(id)
        })
      }
    }
    
    await this.persist()
  }

  /**
   * 向量相似度搜索
   * @param {Array} queryVector - 查询向量
   * @param {number} topK - 返回前K个结果
   * @returns {Array} 相似度结果
   */
  async vectorSearch(queryVector, topK = 10) {
    const similarities = []
    
    for (const [id, vector] of this.vectors) {
      const similarity = this.cosineSimilarity(queryVector, vector)
      similarities.push({ 
        id, 
        similarity, 
        metadata: this.metadata.get(id),
        score: similarity
      })
    }
    
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
  }

  /**
   * 关键词搜索
   * @param {string} query - 查询文本
   * @param {number} topK - 返回前K个结果
   * @returns {Array} 搜索结果
   */
  async keywordSearch(query, topK = 50) {
    const keywords = this.extractKeywords(query)
    const candidates = new Map()
    
    keywords.forEach(keyword => {
      const docs = this.index.get(keyword)
      if (docs) {
        docs.forEach(docId => {
          candidates.set(docId, (candidates.get(docId) || 0) + 1)
        })
      }
    })
    
    return Array.from(candidates.entries())
      .map(([id, score]) => ({
        id,
        score: score / keywords.length, // 归一化分数
        metadata: this.metadata.get(id)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }

  /**
   * 混合搜索 - 关键词 + 向量
   * @param {string} query - 查询文本
   * @param {Array} queryVector - 查询向量
   * @param {number} topK - 返回前K个结果
   * @returns {Array} 混合搜索结果
   */
  async hybridSearch(query, queryVector, topK = 10) {
    // 关键词召回
    const keywordResults = await this.keywordSearch(query, 50)
    
    // 向量召回
    const vectorResults = await this.vectorSearch(queryVector, 50)
    
    // 合并去重
    const mergedResults = new Map()
    
    // 添加关键词结果
    keywordResults.forEach(result => {
      mergedResults.set(result.id, {
        ...result,
        keywordScore: result.score || 0,
        vectorScore: 0,
        source: 'keyword'
      })
    })
    
    // 添加向量结果
    vectorResults.forEach(result => {
      if (mergedResults.has(result.id)) {
        mergedResults.get(result.id).vectorScore = result.similarity || 0
        mergedResults.get(result.id).source = 'both'
      } else {
        mergedResults.set(result.id, {
          ...result,
          keywordScore: 0,
          vectorScore: result.similarity || 0,
          source: 'vector'
        })
      }
    })
    
    // 计算综合分数
    const finalResults = Array.from(mergedResults.values()).map(result => ({
      ...result,
      finalScore: result.keywordScore * 0.3 + result.vectorScore * 0.7
    }))
    
    return finalResults
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, topK)
  }

  /**
   * 余弦相似度计算
   */
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }
    
    if (normA === 0 || normB === 0) return 0
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  /**
   * 提取关键词
   */
  extractKeywords(text) {
    return text.toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1)
      .filter(word => !this.isStopWord(word))
  }

  /**
   * 停用词过滤
   */
  isStopWord(word) {
    const stopWords = ['的', '是', '在', '有', '和', '与', '或', '但', '而', '了', '着', '过', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    return stopWords.includes(word)
  }

  /**
   * 清空所有数据
   */
  async clearAll() {
    this.vectors.clear()
    this.index.clear()
    this.metadata.clear()
    this.sampleDataLoaded = false
    await this.persist()
  }

  /**
   * 重新加载示例数据
   */
  async reloadSampleData() {
    await this.clearAll()
    await this.loadSampleData()
  }

  /**
   * 持久化存储
   */
  async persist() {
    try {
      const data = {
        vectors: Array.from(this.vectors.entries()),
        index: Array.from(this.index.entries()).map(([key, value]) => [key, Array.from(value)]),
        metadata: Array.from(this.metadata.entries()),
        sampleDataLoaded: this.sampleDataLoaded
      }
      localStorage.setItem('vector-store-data', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to persist vector store:', error)
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      vectorCount: this.vectors.size,
      indexSize: this.index.size,
      metadataCount: this.metadata.size,
      memoryUsage: this.estimateMemoryUsage(),
      sampleDataLoaded: this.sampleDataLoaded,
      isInitialized: this.isInitialized
    }
  }

  /**
   * 估算内存使用
   */
  estimateMemoryUsage() {
    let size = 0
    for (const vector of this.vectors.values()) {
      size += vector.length * 8 // 假设每个数字8字节
    }
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  /**
   * 搜索建议
   */
  async searchSuggestions(query, limit = 5) {
    const keywords = this.extractKeywords(query)
    const suggestions = new Set()
    
    keywords.forEach(keyword => {
      // 查找包含该关键词的其他关键词
      for (const indexKey of this.index.keys()) {
        if (indexKey.includes(keyword) && indexKey !== keyword) {
          suggestions.add(indexKey)
        }
      }
    })
    
    return Array.from(suggestions).slice(0, limit)
  }
}

// 全局向量存储实例
export const vectorStore = new VectorStore()