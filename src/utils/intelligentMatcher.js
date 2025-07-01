/**
 * 智能职位匹配器 - 基于用户画像的个性化匹配
 */

export class IntelligentMatcher {
  constructor() {
    this.userProfile = null
    this.matchingRules = new Map()
    this.learningData = new Map()
    this.initializeMatchingRules()
  }

  /**
   * 设置用户画像
   * @param {Object} profile - 用户画像数据
   */
  setUserProfile(profile) {
    this.userProfile = {
      skills: profile.skills || [],
      experience: profile.experience || '',
      education: profile.education || '',
      preferredLocations: profile.preferredLocations || [],
      expectedSalary: profile.expectedSalary || '',
      preferredCompanySize: profile.preferredCompanySize || '',
      preferredIndustry: profile.preferredIndustry || '',
      careerGoals: profile.careerGoals || [],
      workStyle: profile.workStyle || '',
      // 从简历分析中获取的数据
      resumeAnalysis: profile.resumeAnalysis || null,
      // 从面试记录中获取的数据
      interviewHistory: profile.interviewHistory || [],
      // 用户行为数据
      searchHistory: profile.searchHistory || [],
      clickHistory: profile.clickHistory || [],
      applicationHistory: profile.applicationHistory || []
    }
  }

  /**
   * 智能匹配职位
   * @param {Array} jobs - 职位列表
   * @returns {Array} 匹配后的职位列表
   */
  async matchJobs(jobs) {
    if (!this.userProfile) {
      throw new Error('请先设置用户画像')
    }

    const matchedJobs = []

    for (const job of jobs) {
      const matchResult = await this.calculateJobMatch(job)
      
      if (matchResult.score > 30) { // 最低匹配阈值
        matchedJobs.push({
          ...job,
          matchScore: matchResult.score,
          matchDetails: matchResult.details,
          reasons: matchResult.reasons,
          improvements: matchResult.improvements
        })
      }
    }

    // 按匹配分数排序
    return matchedJobs.sort((a, b) => b.matchScore - a.matchScore)
  }

  /**
   * 计算单个职位的匹配度
   * @param {Object} job - 职位信息
   * @returns {Object} 匹配结果
   */
  async calculateJobMatch(job) {
    const matchDetails = {
      skillMatch: this.calculateSkillMatch(job),
      experienceMatch: this.calculateExperienceMatch(job),
      locationMatch: this.calculateLocationMatch(job),
      salaryMatch: this.calculateSalaryMatch(job),
      companyMatch: this.calculateCompanyMatch(job),
      industryMatch: this.calculateIndustryMatch(job),
      cultureMatch: this.calculateCultureMatch(job),
      careerMatch: this.calculateCareerMatch(job)
    }

    // 权重配置
    const weights = {
      skillMatch: 0.35,      // 技能匹配最重要
      experienceMatch: 0.20,  // 经验匹配
      locationMatch: 0.15,    // 地点匹配
      salaryMatch: 0.10,      // 薪资匹配
      companyMatch: 0.08,     // 公司匹配
      industryMatch: 0.07,    // 行业匹配
      cultureMatch: 0.03,     // 文化匹配
      careerMatch: 0.02       // 职业发展匹配
    }

    // 计算加权总分
    let totalScore = 0
    for (const [key, score] of Object.entries(matchDetails)) {
      totalScore += score * weights[key]
    }

    // 生成推荐理由和改进建议
    const reasons = this.generateReasons(matchDetails, weights)
    const improvements = this.generateImprovements(matchDetails, job)

    return {
      score: Math.round(totalScore),
      details: matchDetails,
      reasons,
      improvements
    }
  }

  /**
   * 计算技能匹配度
   */
  calculateSkillMatch(job) {
    const userSkills = this.userProfile.skills.map(s => typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase())
    const jobRequirements = (job.requirements || []).map(r => r.toLowerCase())
    
    if (jobRequirements.length === 0) return 50 // 默认分数

    // 根据目标岗位获取技能权重映射
    const skillWeights = this.getSkillWeightsByPosition(this.userProfile.resumeAnalysis?.targetPosition || '')

    let matchedSkills = 0
    let totalWeight = 0
    
    for (const requirement of jobRequirements) {
      const weight = skillWeights[requirement] || 0.5
      totalWeight += weight
      
      // 精确匹配
      if (userSkills.includes(requirement)) {
        matchedSkills += weight
      } else {
        // 模糊匹配
        const fuzzyMatch = userSkills.find(skill => 
          skill.includes(requirement) || requirement.includes(skill)
        )
        if (fuzzyMatch) {
          matchedSkills += weight * 0.7
        }
      }
    }

    return totalWeight > 0 ? Math.min(100, (matchedSkills / totalWeight) * 100) : 0
  }

  /**
   * 根据目标岗位获取技能权重映射
   */
  getSkillWeightsByPosition(targetPosition) {
    // 默认权重
    const defaultWeights = {
      'javascript': 1.0,
      'react': 0.9,
      'vue': 0.9,
      'angular': 0.9,
      'node.js': 0.8,
      'python': 0.8,
      'java': 0.7,
      'typescript': 0.9,
      'css': 0.6,
      'html': 0.5
    }
    
    // 根据目标岗位调整权重
    const positionWeights = {
      '前端工程师': {
        'javascript': 1.0,
        'react': 0.9,
        'vue': 0.9,
        'angular': 0.9,
        'typescript': 0.9,
        'css': 0.8,
        'html': 0.8,
        'webpack': 0.7,
        'sass': 0.6
      },
      '后端工程师': {
        'java': 1.0,
        'python': 0.9,
        'node.js': 0.9,
        'go': 0.8,
        'c#': 0.8,
        'mysql': 0.8,
        'mongodb': 0.7,
        'redis': 0.7,
        'spring': 0.8,
        'express': 0.7
      },
      '全栈工程师': {
        'javascript': 0.9,
        'typescript': 0.9,
        'react': 0.8,
        'vue': 0.8,
        'node.js': 0.9,
        'python': 0.7,
        'mysql': 0.7,
        'mongodb': 0.7,
        'docker': 0.6
      },
      '数据分析师': {
        'python': 1.0,
        'r': 0.9,
        'sql': 0.9,
        'excel': 0.8,
        'tableau': 0.8,
        'power bi': 0.8,
        '数据分析': 1.0,
        '数据可视化': 0.8,
        '统计学': 0.9,
        'pandas': 0.8,
        'numpy': 0.7
      },
      '产品经理': {
        '产品设计': 1.0,
        '用户研究': 0.9,
        '需求分析': 0.9,
        '原型设计': 0.8,
        'axure': 0.7,
        'figma': 0.7,
        '数据分析': 0.8,
        '项目管理': 0.8,
        'jira': 0.6
      }
    }
    
    // 根据目标岗位返回对应的权重映射
    return positionWeights[targetPosition] || defaultWeights
  }

  /**
   * 计算经验匹配度
   */
  calculateExperienceMatch(job) {
    const userExp = this.parseExperience(this.userProfile.experience)
    const jobExp = this.parseExperience(job.experience)
    
    if (jobExp === 0) return 80 // 无经验要求

    if (userExp >= jobExp) {
      // 经验充足，但不要过度匹配
      const overQualified = userExp - jobExp
      if (overQualified <= 2) return 100
      if (overQualified <= 5) return 90
      return 70 // 过度匹配可能导致薪资期望不符
    } else {
      // 经验不足
      const gap = jobExp - userExp
      if (gap <= 1) return 85
      if (gap <= 2) return 60
      if (gap <= 3) return 30
      return 10
    }
  }

  /**
   * 计算地点匹配度
   */
  calculateLocationMatch(job) {
    const preferredLocations = this.userProfile.preferredLocations
    
    if (!preferredLocations || preferredLocations.length === 0) {
      return 70 // 无偏好时给中等分数
    }

    const jobLocation = job.location.toLowerCase()
    
    for (const preferred of preferredLocations) {
      if (jobLocation.includes(preferred.toLowerCase()) || 
          preferred.toLowerCase().includes(jobLocation)) {
        return 100
      }
    }

    return 20 // 地点不匹配
  }

  /**
   * 计算薪资匹配度
   */
  calculateSalaryMatch(job) {
    const expectedSalary = this.parseSalary(this.userProfile.expectedSalary)
    const jobSalary = this.parseSalary(job.salary)
    
    if (!expectedSalary.min || !jobSalary.min) return 70

    const expectedMin = expectedSalary.min
    const expectedMax = expectedSalary.max || expectedMin * 1.5
    const jobMin = jobSalary.min
    const jobMax = jobSalary.max || jobMin * 1.3

    // 计算重叠区间
    const overlapMin = Math.max(expectedMin, jobMin)
    const overlapMax = Math.min(expectedMax, jobMax)
    
    if (overlapMax <= overlapMin) {
      // 无重叠
      if (jobMax < expectedMin) {
        // 薪资过低
        const gap = (expectedMin - jobMax) / expectedMin
        return Math.max(0, 100 - gap * 200)
      } else {
        // 薪资过高（不太可能是问题）
        return 90
      }
    } else {
      // 有重叠
      const overlapRatio = (overlapMax - overlapMin) / (expectedMax - expectedMin)
      return Math.min(100, 70 + overlapRatio * 30)
    }
  }

  /**
   * 计算公司匹配度
   */
  calculateCompanyMatch(job) {
    let score = 50 // 基础分数

    // 公司规模匹配
    if (this.userProfile.preferredCompanySize) {
      if (job.companySize && 
          job.companySize.includes(this.userProfile.preferredCompanySize)) {
        score += 20
      }
    }

    // 公司知名度（基于简单的关键词）
    const famousCompanies = ['腾讯', '阿里', '百度', '字节', '美团', '滴滴', '京东', '网易']
    if (famousCompanies.some(company => job.company.includes(company))) {
      score += 15
    }

    // 基于用户历史偏好
    const searchHistory = this.userProfile.searchHistory || []
    const hasSearchedSimilar = searchHistory.some(search => 
      search.includes(job.company) || job.company.includes(search)
    )
    if (hasSearchedSimilar) {
      score += 10
    }

    return Math.min(100, score)
  }

  /**
   * 计算行业匹配度
   */
  calculateIndustryMatch(job) {
    if (!this.userProfile.preferredIndustry || !job.industry) {
      return 60
    }

    if (job.industry.includes(this.userProfile.preferredIndustry) ||
        this.userProfile.preferredIndustry.includes(job.industry)) {
      return 100
    }

    // 相关行业匹配
    const relatedIndustries = {
      '互联网': ['电商', '游戏', '社交', '搜索'],
      '金融': ['银行', '保险', '证券', '支付'],
      '教育': ['在线教育', '培训', '知识付费']
    }

    for (const [main, related] of Object.entries(relatedIndustries)) {
      if (this.userProfile.preferredIndustry.includes(main) &&
          related.some(r => job.industry.includes(r))) {
        return 80
      }
    }

    return 30
  }

  /**
   * 计算文化匹配度
   */
  calculateCultureMatch(job) {
    let score = 50

    // 基于福利待遇判断公司文化
    const benefits = job.benefits || []
    const userWorkStyle = this.userProfile.workStyle

    if (userWorkStyle === 'flexible') {
      if (benefits.some(b => b.includes('弹性') || b.includes('远程'))) {
        score += 30
      }
    }

    if (userWorkStyle === 'stable') {
      if (benefits.some(b => b.includes('五险一金') || b.includes('年终奖'))) {
        score += 20
      }
    }

    return Math.min(100, score)
  }

  /**
   * 计算职业发展匹配度
   */
  calculateCareerMatch(job) {
    const careerGoals = this.userProfile.careerGoals || []
    
    if (careerGoals.length === 0) return 60

    let score = 40

    // 检查职位是否符合职业发展目标
    for (const goal of careerGoals) {
      if (job.title.toLowerCase().includes(goal.toLowerCase()) ||
          job.description.toLowerCase().includes(goal.toLowerCase())) {
        score += 20
      }
    }

    return Math.min(100, score)
  }

  /**
   * 生成推荐理由
   */
  generateReasons(matchDetails, weights) {
    const reasons = []
    
    // 按权重和分数排序，选择最重要的匹配点
    const sortedMatches = Object.entries(matchDetails)
      .map(([key, score]) => ({ key, score, weight: weights[key] }))
      .sort((a, b) => (b.score * b.weight) - (a.score * a.weight))

    for (const match of sortedMatches.slice(0, 3)) {
      if (match.score >= 70) {
        switch (match.key) {
          case 'skillMatch':
            reasons.push('技能高度匹配')
            break
          case 'experienceMatch':
            reasons.push('经验要求符合')
            break
          case 'locationMatch':
            reasons.push('地点偏好一致')
            break
          case 'salaryMatch':
            reasons.push('薪资期望合理')
            break
          case 'companyMatch':
            reasons.push('公司类型匹配')
            break
          case 'industryMatch':
            reasons.push('行业背景相符')
            break
        }
      }
    }

    if (reasons.length === 0) {
      reasons.push('基于算法推荐')
    }

    return reasons
  }

  /**
   * 生成改进建议
   */
  generateImprovements(matchDetails, job) {
    const improvements = []

    if (matchDetails.skillMatch < 60) {
      const missingSkills = this.findMissingSkills(job)
      if (missingSkills.length > 0) {
        improvements.push(`建议学习: ${missingSkills.slice(0, 3).join(', ')}`)
      }
    }

    if (matchDetails.experienceMatch < 50) {
      improvements.push('建议积累更多相关项目经验')
    }

    if (matchDetails.salaryMatch < 40) {
      improvements.push('可考虑调整薪资期望或提升技能水平')
    }

    return improvements
  }

  /**
   * 查找缺失技能
   */
  findMissingSkills(job) {
    const userSkills = this.userProfile.skills.map(s => typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase())
    const jobRequirements = (job.requirements || []).map(r => r.toLowerCase())
    
    return jobRequirements.filter(req => 
      !userSkills.some(skill => 
        skill.includes(req) || req.includes(skill)
      )
    )
  }

  /**
   * 解析经验年限
   */
  parseExperience(experience) {
    if (!experience) return 0
    const match = experience.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  /**
   * 解析薪资范围
   */
  parseSalary(salary) {
    if (!salary) return { min: 0, max: 0 }
    
    const numbers = salary.match(/(\d+)/g)
    if (!numbers) return { min: 0, max: 0 }
    
    if (numbers.length === 1) {
      const value = parseInt(numbers[0])
      return { min: value, max: value }
    } else {
      return {
        min: parseInt(numbers[0]),
        max: parseInt(numbers[1])
      }
    }
  }

  /**
   * 初始化匹配规则
   */
  initializeMatchingRules() {
    // 可以在这里定义更复杂的匹配规则
    this.matchingRules.set('tech_stack_bonus', {
      'react+typescript': 10,
      'vue+typescript': 10,
      'node+mongodb': 8,
      'python+django': 8
    })
  }

  /**
   * 学习用户偏好
   * @param {Object} interaction - 用户交互数据
   */
  learnFromInteraction(interaction) {
    const { jobId, action, job } = interaction
    
    // 记录用户行为
    if (!this.learningData.has('interactions')) {
      this.learningData.set('interactions', [])
    }
    
    this.learningData.get('interactions').push({
      jobId,
      action, // 'click', 'apply', 'save', 'skip'
      job,
      timestamp: Date.now()
    })

    // 基于行为调整匹配权重
    this.adjustMatchingWeights(interaction)
  }

  /**
   * 调整匹配权重
   */
  adjustMatchingWeights(interaction) {
    // 简化的学习逻辑
    // 实际应用中可以使用更复杂的机器学习算法
    
    if (interaction.action === 'apply') {
      // 用户申请了职位，增加相似职位的权重
      // 这里可以实现更复杂的学习逻辑
    }
  }

  /**
   * 获取用户画像建议
   */
  getProfileSuggestions() {
    const suggestions = []

    if (!this.userProfile.skills || this.userProfile.skills.length === 0) {
      suggestions.push('建议完善技能信息以获得更精准的职位推荐')
    }

    if (!this.userProfile.preferredLocations || this.userProfile.preferredLocations.length === 0) {
      suggestions.push('建议设置期望工作地点')
    }

    if (!this.userProfile.expectedSalary) {
      suggestions.push('建议设置期望薪资范围')
    }

    return suggestions
  }
}

// 全局智能匹配器实例
export const intelligentMatcher = new IntelligentMatcher()