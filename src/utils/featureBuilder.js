/**
 * 特征构建器 - 生成排序特征矩阵
 */

export class FeatureBuilder {
  constructor() {
    this.features = new Map()
    this.featureNames = []
  }

  /**
   * 构建特征矩阵
   * @param {Object} userProfile - 用户画像
   * @param {Array} jobs - 职位列表
   * @param {Array} searchResults - 搜索结果
   * @returns {Array} 特征矩阵
   */
  buildFeatures(userProfile, jobs, searchResults = []) {
    const featureMatrix = []
    
    jobs.forEach((job, index) => {
      const features = this.extractFeatures(userProfile, job, searchResults[index])
      featureMatrix.push(features)
    })
    
    return {
      features: featureMatrix,
      featureNames: this.featureNames
    }
  }

  /**
   * 提取单个职位的特征
   * @param {Object} userProfile - 用户画像
   * @param {Object} job - 职位信息
   * @param {Object} searchResult - 搜索结果
   * @returns {Array} 特征向量
   */
  extractFeatures(userProfile, job, searchResult = {}) {
    const features = []
    
    // 1. 关键词匹配特征
    const keywordFeatures = this.extractKeywordFeatures(userProfile, job)
    features.push(...keywordFeatures)
    
    // 2. 语义相似度特征
    const semanticFeatures = this.extractSemanticFeatures(userProfile, job, searchResult)
    features.push(...semanticFeatures)
    
    // 3. 简历属性特征
    const resumeFeatures = this.extractResumeFeatures(userProfile)
    features.push(...resumeFeatures)
    
    // 4. 职位属性特征
    const jobFeatures = this.extractJobFeatures(job)
    features.push(...jobFeatures)
    
    // 5. 行为特征
    const behaviorFeatures = this.extractBehaviorFeatures(userProfile, job)
    features.push(...behaviorFeatures)
    
    // 6. 交互特征
    const interactionFeatures = this.extractInteractionFeatures(userProfile, job)
    features.push(...interactionFeatures)
    
    return features
  }

  /**
   * 关键词匹配特征
   */
  extractKeywordFeatures(userProfile, job) {
    const userSkills = userProfile.skills || []
    const jobRequirements = job.requirements || []
    
    // 精确匹配数量
    const exactMatches = userSkills.filter(skill => 
      jobRequirements.some(req => 
        skill.toLowerCase() === req.toLowerCase()
      )
    ).length
    
    // 部分匹配数量
    const partialMatches = userSkills.filter(skill => 
      jobRequirements.some(req => 
        skill.toLowerCase().includes(req.toLowerCase()) ||
        req.toLowerCase().includes(skill.toLowerCase())
      )
    ).length
    
    // 关键词覆盖率
    const coverageRate = jobRequirements.length > 0 ? 
      exactMatches / jobRequirements.length : 0
    
    // 技能匹配分数
    const skillScore = this.calculateSkillMatchScore(userSkills, jobRequirements)
    
    return [exactMatches, partialMatches, coverageRate, skillScore]
  }

  /**
   * 语义相似度特征
   */
  extractSemanticFeatures(userProfile, job, searchResult) {
    // 从搜索结果中获取相似度分数
    const vectorSimilarity = searchResult.vectorScore || 0
    const keywordSimilarity = searchResult.keywordScore || 0
    const finalSimilarity = searchResult.finalScore || 0
    
    // 职位描述相似度
    const descriptionSimilarity = this.calculateTextSimilarity(
      userProfile.summary || '', 
      job.description || ''
    )
    
    return [vectorSimilarity, keywordSimilarity, finalSimilarity, descriptionSimilarity]
  }

  /**
   * 简历属性特征
   */
  extractResumeFeatures(userProfile) {
    const experience = this.parseExperience(userProfile.experience)
    const education = this.parseEducation(userProfile.education)
    const skillCount = (userProfile.skills || []).length
    const projectCount = (userProfile.projects || []).length
    
    return [experience, education, skillCount, projectCount]
  }

  /**
   * 职位属性特征
   */
  extractJobFeatures(job) {
    const salaryMin = this.parseSalary(job.salary, 'min')
    const salaryMax = this.parseSalary(job.salary, 'max')
    const experienceRequired = this.parseExperience(job.experienceRequired)
    const companySize = this.parseCompanySize(job.companySize)
    
    return [salaryMin, salaryMax, experienceRequired, companySize]
  }

  /**
   * 行为特征
   */
  extractBehaviorFeatures(userProfile, job) {
    // 用户历史行为数据
    const lastAppliedDays = this.getLastAppliedDays(userProfile)
    const historicalCTR = this.getHistoricalCTR(userProfile)
    const categoryPreference = this.getCategoryPreference(userProfile, job.category)
    const locationPreference = this.getLocationPreference(userProfile, job.location)
    
    return [lastAppliedDays, historicalCTR, categoryPreference, locationPreference]
  }

  /**
   * 交互特征
   */
  extractInteractionFeatures(userProfile, job) {
    // 用户与职位的交互特征
    const salaryGap = this.calculateSalaryGap(userProfile.expectedSalary, job.salary)
    const locationMatch = this.calculateLocationMatch(userProfile.preferredLocations, job.location)
    const industryMatch = this.calculateIndustryMatch(userProfile.industry, job.industry)
    const companySizeMatch = this.calculateCompanySizeMatch(userProfile.preferredCompanySize, job.companySize)
    
    return [salaryGap, locationMatch, industryMatch, companySizeMatch]
  }

  /**
   * 计算技能匹配分数
   */
  calculateSkillMatchScore(userSkills, jobRequirements) {
    if (jobRequirements.length === 0) return 0
    
    const weights = {
      'JavaScript': 1.0,
      'React': 0.9,
      'Vue': 0.9,
      'Node.js': 0.8,
      'Python': 0.8,
      'Java': 0.7,
      'TypeScript': 0.9
    }
    
    let totalScore = 0
    let maxScore = 0
    
    jobRequirements.forEach(req => {
      const weight = weights[req] || 0.5
      maxScore += weight
      
      const matched = userSkills.find(skill => 
        skill.toLowerCase().includes(req.toLowerCase()) ||
        req.toLowerCase().includes(skill.toLowerCase())
      )
      
      if (matched) {
        totalScore += weight
      }
    })
    
    return maxScore > 0 ? totalScore / maxScore : 0
  }

  /**
   * 计算文本相似度
   */
  calculateTextSimilarity(text1, text2) {
    // 简化的文本相似度计算
    const words1 = new Set(text1.toLowerCase().split(/\s+/))
    const words2 = new Set(text2.toLowerCase().split(/\s+/))
    
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    
    return union.size > 0 ? intersection.size / union.size : 0
  }

  /**
   * 解析工作经验
   */
  parseExperience(experience) {
    if (!experience) return 0
    const match = experience.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  /**
   * 解析教育水平
   */
  parseEducation(education) {
    const levels = {
      '高中': 1,
      '专科': 2,
      '本科': 3,
      '硕士': 4,
      '博士': 5
    }
    
    if (!education) return 0
    
    for (const [level, score] of Object.entries(levels)) {
      if (education.includes(level)) {
        return score
      }
    }
    
    return 0
  }

  /**
   * 解析薪资
   */
  parseSalary(salary, type = 'min') {
    if (!salary) return 0
    
    const numbers = salary.match(/\d+/g)
    if (!numbers) return 0
    
    const values = numbers.map(n => parseInt(n))
    return type === 'min' ? Math.min(...values) : Math.max(...values)
  }

  /**
   * 解析公司规模
   */
  parseCompanySize(size) {
    const sizeMap = {
      '初创': 1,
      '小型': 2,
      '中型': 3,
      '大型': 4,
      '超大型': 5
    }
    
    if (!size) return 0
    
    for (const [key, value] of Object.entries(sizeMap)) {
      if (size.includes(key)) {
        return value
      }
    }
    
    return 0
  }

  /**
   * 获取最后申请天数
   */
  getLastAppliedDays(userProfile) {
    const lastApplied = userProfile.lastAppliedDate
    if (!lastApplied) return 999
    
    const days = Math.floor((Date.now() - new Date(lastApplied)) / (1000 * 60 * 60 * 24))
    return Math.min(days, 999)
  }

  /**
   * 获取历史点击率
   */
  getHistoricalCTR(userProfile) {
    const history = userProfile.clickHistory || []
    if (history.length === 0) return 0
    
    const clicks = history.filter(item => item.clicked).length
    return clicks / history.length
  }

  /**
   * 获取类别偏好
   */
  getCategoryPreference(userProfile, jobCategory) {
    const preferences = userProfile.categoryPreferences || {}
    return preferences[jobCategory] || 0
  }

  /**
   * 获取地点偏好
   */
  getLocationPreference(userProfile, jobLocation) {
    const preferredLocations = userProfile.preferredLocations || []
    return preferredLocations.includes(jobLocation) ? 1 : 0
  }

  /**
   * 计算薪资差距
   */
  calculateSalaryGap(expectedSalary, jobSalary) {
    const expected = this.parseSalary(expectedSalary, 'min')
    const offered = this.parseSalary(jobSalary, 'min')
    
    if (expected === 0 || offered === 0) return 0
    
    return Math.abs(expected - offered) / expected
  }

  /**
   * 计算地点匹配度
   */
  calculateLocationMatch(preferredLocations, jobLocation) {
    if (!preferredLocations || preferredLocations.length === 0) return 0.5
    
    return preferredLocations.some(loc => 
      jobLocation.includes(loc) || loc.includes(jobLocation)
    ) ? 1 : 0
  }

  /**
   * 计算行业匹配度
   */
  calculateIndustryMatch(userIndustry, jobIndustry) {
    if (!userIndustry || !jobIndustry) return 0.5
    return userIndustry === jobIndustry ? 1 : 0
  }

  /**
   * 计算公司规模匹配度
   */
  calculateCompanySizeMatch(preferredSize, jobCompanySize) {
    if (!preferredSize || !jobCompanySize) return 0.5
    return preferredSize === jobCompanySize ? 1 : 0
  }

  /**
   * 获取特征名称
   */
  getFeatureNames() {
    return [
      // 关键词匹配特征
      'exact_matches', 'partial_matches', 'coverage_rate', 'skill_score',
      // 语义相似度特征
      'vector_similarity', 'keyword_similarity', 'final_similarity', 'description_similarity',
      // 简历属性特征
      'experience_years', 'education_level', 'skill_count', 'project_count',
      // 职位属性特征
      'salary_min', 'salary_max', 'experience_required', 'company_size',
      // 行为特征
      'last_applied_days', 'historical_ctr', 'category_preference', 'location_preference',
      // 交互特征
      'salary_gap', 'location_match', 'industry_match', 'company_size_match'
    ]
  }
}

// 全局特征构建器实例
export const featureBuilder = new FeatureBuilder()