/**
 * 前端简历解析服务
 * 与后端简历解析API交互
 */

export class ResumeParserService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_RESUME_PARSER_URL || 'http://localhost:3001'
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5分钟缓存
  }

  /**
   * 解析简历文件
   * @param {File} file - 简历文件
   * @param {string} targetPosition - 目标职位
   * @returns {Promise<Object>} 解析结果
   */
  async parseResume(file, targetPosition = '') {
    try {
      // 验证文件
      this.validateFile(file)
      
      // 检查缓存
      const cacheKey = this.getCacheKey(file, targetPosition)
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return cached
      }

      // 构建FormData
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('targetPosition', targetPosition)

      // 发送请求
      const response = await fetch(`${this.baseUrl}/api/parse-resume`, {
        method: 'POST',
        body: formData,
        // 不设置Content-Type，让浏览器自动设置multipart/form-data
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '解析失败')
      }

      // 缓存结果
      this.setCache(cacheKey, result.data)
      
      return result.data

    } catch (error) {
      console.error('简历解析失败:', error)
      
      // 如果后端服务不可用，使用本地模拟解析
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        console.warn('后端服务不可用，使用本地模拟解析')
        return this.fallbackParse(file, targetPosition)
      }
      
      throw error
    }
  }

  /**
   * 验证文件
   */
  validateFile(file) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('不支持的文件格式，请上传PDF、DOC、DOCX或TXT文件')
    }
    
    if (file.size > maxSize) {
      throw new Error('文件大小超过限制，请上传小于10MB的文件')
    }
  }

  /**
   * 本地模拟解析（降级方案）
   */
  async fallbackParse(file, targetPosition) {
    // 模拟解析延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 基于文件名和目标职位生成模拟数据
    const fileName = file.name.replace(/\.[^/.]+$/, '')
    
    return {
      personalInfo: {
        name: this.extractNameFromFileName(fileName),
        email: 'example@email.com',
        phone: '138****8888'
      },
      education: {
        degrees: ['本科'],
        schools: ['某某大学'],
        majors: ['计算机科学与技术'],
        raw: '教育背景：本科毕业于某某大学计算机科学与技术专业'
      },
      experience: {
        companies: ['某科技公司'],
        positions: [targetPosition || '软件工程师'],
        times: ['2020-2023'],
        raw: `工作经历：2020-2023年在某科技公司担任${targetPosition || '软件工程师'}`
      },
      skills: {
        technical: this.getSkillsByPosition(targetPosition),
        raw: '技能：JavaScript, React, Node.js等'
      },
      projects: {
        projects: ['电商平台开发', '管理系统优化'],
        raw: '项目经验：参与电商平台开发和管理系统优化'
      },
      matchAnalysis: {
        overallScore: Math.floor(Math.random() * 30) + 70,
        skillMatch: Math.floor(Math.random() * 40) + 60,
        experienceMatch: Math.floor(Math.random() * 40) + 60,
        educationMatch: Math.floor(Math.random() * 30) + 70,
        details: {
          strengths: ['技术基础扎实', '学习能力强'],
          weaknesses: ['项目经验可以更丰富']
        }
      },
      improvements: [
        {
          category: '技能提升',
          suggestion: '建议深入学习相关技术栈',
          priority: 'high'
        },
        {
          category: '项目经验',
          suggestion: '建议参与更多实际项目',
          priority: 'medium'
        }
      ],
      originalFileName: file.name,
      parsedAt: new Date().toISOString(),
      source: 'fallback'
    }
  }

  /**
   * 从文件名提取姓名
   */
  extractNameFromFileName(fileName) {
    // 简单的姓名提取逻辑
    const cleanName = fileName.replace(/简历|resume|cv/gi, '').trim()
    return cleanName || '用户'
  }

  /**
   * 根据职位获取相关技能
   */
  getSkillsByPosition(position) {
    const skillMap = {
      '前端工程师': ['JavaScript', 'React', 'Vue', 'CSS', 'HTML'],
      '后端工程师': ['Java', 'Python', 'Node.js', 'MySQL', 'Redis'],
      '全栈工程师': ['JavaScript', 'React', 'Node.js', 'MySQL'],
      '数据分析师': ['Python', 'SQL', 'Excel', 'Tableau'],
      '产品经理': ['产品设计', '用户研究', 'Axure', 'Figma']
    }
    
    return skillMap[position] || ['JavaScript', 'Python', 'SQL']
  }

  /**
   * 缓存管理
   */
  getCacheKey(file, targetPosition) {
    return `${file.name}_${file.size}_${targetPosition}`
  }

  getFromCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
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
    
    // 限制缓存大小
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  /**
   * 检查服务状态
   */
  async checkServiceHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        timeout: 5000
      })
      
      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear()
  }
}

// 全局简历解析服务实例
export const resumeParserService = new ResumeParserService()