// 高级算法库 - AI面试助手专用
// 包含简历分析、面试评分、职位匹配等核心算法

/**
 * 文本相似度算法 - 余弦相似度
 * @param {string} text1 - 文本1
 * @param {string} text2 - 文本2
 * @returns {number} 相似度分数 (0-1)
 */
export function cosineSimilarity(text1, text2) {
  const words1 = tokenize(text1)
  const words2 = tokenize(text2)
  
  const allWords = [...new Set([...words1, ...words2])]
  const vector1 = allWords.map(word => words1.filter(w => w === word).length)
  const vector2 = allWords.map(word => words2.filter(w => w === word).length)
  
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0)
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0))
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0))
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0
  return dotProduct / (magnitude1 * magnitude2)
}

/**
 * 文本分词器
 * @param {string} text - 输入文本
 * @returns {Array} 分词结果
 */
function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1)
}

/**
 * TF-IDF算法 - 关键词提取
 * @param {Array} documents - 文档数组
 * @param {number} topK - 返回前K个关键词
 * @returns {Array} 关键词及其权重
 */
export function extractKeywords(documents, topK = 10) {
  const allWords = new Set()
  const docWords = documents.map(doc => {
    const words = tokenize(doc)
    words.forEach(word => allWords.add(word))
    return words
  })
  
  const tfidfScores = {}
  
  allWords.forEach(word => {
    const tf = docWords[0].filter(w => w === word).length / docWords[0].length
    const df = docWords.filter(doc => doc.includes(word)).length
    const idf = Math.log(documents.length / df)
    tfidfScores[word] = tf * idf
  })
  
  return Object.entries(tfidfScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, topK)
    .map(([word, score]) => ({ word, score }))
}

/**
 * 简历技能匹配算法
 * @param {Array} resumeSkills - 简历技能
 * @param {Array} jobRequirements - 职位要求
 * @returns {Object} 匹配结果
 */
export function skillMatching(resumeSkills, jobRequirements) {
  const skillWeights = {
    'JavaScript': 1.0,
    'React': 0.9,
    'Vue': 0.9,
    'Node.js': 0.8,
    'Python': 0.8,
    'Java': 0.7,
    'TypeScript': 0.9,
    'CSS': 0.6,
    'HTML': 0.5,
    '项目管理': 0.7,
    '团队协作': 0.6,
    '沟通能力': 0.6
  }
  
  let totalScore = 0
  let maxScore = 0
  const matchedSkills = []
  const missingSkills = []
  
  jobRequirements.forEach(requirement => {
    const weight = skillWeights[requirement] || 0.5
    maxScore += weight
    
    const matched = resumeSkills.find(skill => 
      skill.toLowerCase().includes(requirement.toLowerCase()) ||
      requirement.toLowerCase().includes(skill.toLowerCase())
    )
    
    if (matched) {
      totalScore += weight
      matchedSkills.push({ skill: requirement, weight, matched: true })
    } else {
      missingSkills.push({ skill: requirement, weight, matched: false })
    }
  })
  
  const matchScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
  
  return {
    matchScore: Math.round(matchScore),
    matchedSkills,
    missingSkills,
    totalSkills: jobRequirements.length,
    matchedCount: matchedSkills.length
  }
}

/**
 * 面试回答评分算法
 * @param {string} question - 面试问题
 * @param {string} answer - 用户回答
 * @returns {Object} 评分结果
 */
export function scoreInterviewAnswer(question, answer) {
  const criteria = {
    length: scoreLength(answer),
    relevance: scoreRelevance(question, answer),
    structure: scoreStructure(answer),
    keywords: scoreKeywords(question, answer),
    clarity: scoreClarity(answer)
  }
  
  const weights = {
    length: 0.15,
    relevance: 0.30,
    structure: 0.20,
    keywords: 0.20,
    clarity: 0.15
  }
  
  const totalScore = Object.entries(criteria).reduce((sum, [key, score]) => {
    return sum + score * weights[key]
  }, 0)
  
  return {
    totalScore: Math.round(totalScore),
    criteria,
    feedback: generateFeedback(criteria, totalScore)
  }
}

/**
 * 回答长度评分
 */
function scoreLength(answer) {
  const wordCount = tokenize(answer).length
  if (wordCount < 10) return 20
  if (wordCount < 30) return 60
  if (wordCount < 100) return 90
  if (wordCount < 200) return 100
  return 85 // 太长可能冗余
}

/**
 * 相关性评分
 */
function scoreRelevance(question, answer) {
  const similarity = cosineSimilarity(question, answer)
  return Math.min(100, similarity * 150)
}

/**
 * 结构化评分
 */
function scoreStructure(answer) {
  const sentences = answer.split(/[.!?。！？]/).filter(s => s.trim().length > 0)
  const hasIntro = /^(首先|第一|我认为|我觉得|在我看来)/i.test(answer)
  const hasConclusion = /(总之|综上|因此|所以|最后)/i.test(answer)
  const hasExamples = /(例如|比如|举例|案例|经历)/i.test(answer)
  
  let score = 40
  if (sentences.length >= 3) score += 20
  if (hasIntro) score += 15
  if (hasConclusion) score += 15
  if (hasExamples) score += 10
  
  return Math.min(100, score)
}

/**
 * 关键词评分
 */
function scoreKeywords(question, answer) {
  const questionKeywords = extractKeywords([question], 5)
  const answerText = answer.toLowerCase()
  
  let matchCount = 0
  questionKeywords.forEach(({ word }) => {
    if (answerText.includes(word.toLowerCase())) {
      matchCount++
    }
  })
  
  return Math.min(100, (matchCount / Math.max(1, questionKeywords.length)) * 100)
}

/**
 * 清晰度评分
 */
function scoreClarity(answer) {
  const sentences = answer.split(/[.!?。！？]/).filter(s => s.trim().length > 0)
  const avgSentenceLength = sentences.reduce((sum, s) => sum + tokenize(s).length, 0) / sentences.length
  
  let score = 70
  if (avgSentenceLength > 5 && avgSentenceLength < 20) score += 20
  if (sentences.length >= 2) score += 10
  
  return Math.min(100, score)
}

/**
 * 生成反馈建议
 */
function generateFeedback(criteria, totalScore) {
  const feedback = []
  
  if (criteria.length < 60) {
    feedback.push("建议增加回答的详细程度，提供更多具体信息")
  }
  
  if (criteria.relevance < 70) {
    feedback.push("回答与问题的相关性可以提高，请更直接地回应问题要点")
  }
  
  if (criteria.structure < 70) {
    feedback.push("建议使用更清晰的结构，如：观点-论证-总结的方式组织回答")
  }
  
  if (criteria.keywords < 60) {
    feedback.push("可以在回答中包含更多与问题相关的关键词")
  }
  
  if (criteria.clarity < 70) {
    feedback.push("建议使用更简洁明了的表达方式，避免过长的句子")
  }
  
  if (totalScore >= 90) {
    feedback.push("优秀的回答！继续保持这种水平")
  } else if (totalScore >= 80) {
    feedback.push("很好的回答，稍作改进就能更加完美")
  } else if (totalScore >= 70) {
    feedback.push("回答基本符合要求，还有提升空间")
  } else {
    feedback.push("回答需要进一步改进，建议多练习类似问题")
  }
  
  return feedback
}

/**
 * 职位推荐算法
 * @param {Object} userProfile - 用户画像
 * @param {Array} jobs - 职位列表
 * @returns {Array} 推荐职位
 */
export function recommendJobs(userProfile, jobs) {
  const scoredJobs = jobs.map(job => {
    const skillScore = skillMatching(userProfile.skills, job.requirements).matchScore
    const experienceScore = calculateExperienceScore(userProfile.experience, job.experienceRequired)
    const locationScore = calculateLocationScore(userProfile.preferredLocations, job.location)
    const salaryScore = calculateSalaryScore(userProfile.expectedSalary, job.salary)
    
    const totalScore = (
      skillScore * 0.4 +
      experienceScore * 0.25 +
      locationScore * 0.2 +
      salaryScore * 0.15
    )
    
    return {
      ...job,
      recommendationScore: Math.round(totalScore),
      reasons: generateRecommendationReasons(skillScore, experienceScore, locationScore, salaryScore)
    }
  })
  
  return scoredJobs
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10)
}

/**
 * 计算经验匹配分数
 */
function calculateExperienceScore(userExp, requiredExp) {
  if (!requiredExp) return 100
  
  const userYears = parseInt(userExp) || 0
  const requiredYears = parseInt(requiredExp) || 0
  
  if (userYears >= requiredYears) {
    return Math.min(100, 100 - (userYears - requiredYears) * 5)
  } else {
    return Math.max(0, 100 - (requiredYears - userYears) * 20)
  }
}

/**
 * 计算地点匹配分数
 */
function calculateLocationScore(preferredLocations, jobLocation) {
  if (!preferredLocations || preferredLocations.length === 0) return 80
  
  const isMatch = preferredLocations.some(loc => 
    jobLocation.toLowerCase().includes(loc.toLowerCase()) ||
    loc.toLowerCase().includes(jobLocation.toLowerCase())
  )
  
  return isMatch ? 100 : 30
}

/**
 * 计算薪资匹配分数
 */
function calculateSalaryScore(expectedSalary, jobSalary) {
  if (!expectedSalary || !jobSalary) return 80
  
  const expected = parseInt(expectedSalary.replace(/[^\d]/g, '')) || 0
  const offered = parseInt(jobSalary.replace(/[^\d]/g, '')) || 0
  
  if (offered >= expected) {
    return Math.min(100, 100 + (offered - expected) / expected * 20)
  } else {
    return Math.max(0, 100 - (expected - offered) / expected * 50)
  }
}

/**
 * 生成推荐理由
 */
function generateRecommendationReasons(skillScore, experienceScore, locationScore, salaryScore) {
  const reasons = []
  
  if (skillScore >= 80) reasons.push("技能高度匹配")
  if (experienceScore >= 80) reasons.push("经验要求符合")
  if (locationScore >= 80) reasons.push("地点偏好匹配")
  if (salaryScore >= 80) reasons.push("薪资期望合理")
  
  return reasons
}

/**
 * 学习路径推荐算法
 * @param {Object} currentSkills - 当前技能
 * @param {Object} targetSkills - 目标技能
 * @returns {Array} 学习路径
 */
export function generateLearningPath(currentSkills, targetSkills) {
  const skillDependencies = {
    'React': ['JavaScript', 'HTML', 'CSS'],
    'Vue': ['JavaScript', 'HTML', 'CSS'],
    'Node.js': ['JavaScript'],
    'TypeScript': ['JavaScript'],
    'Express': ['Node.js'],
    'MongoDB': ['数据库基础'],
    'MySQL': ['数据库基础'],
    'Docker': ['Linux基础'],
    'Kubernetes': ['Docker'],
    'AWS': ['云计算基础'],
    '项目管理': ['团队协作'],
    '系统设计': ['数据库基础', '网络基础']
  }
  
  const learningPath = []
  const completed = new Set(currentSkills.map(skill => skill.name))
  
  // 拓扑排序生成学习路径
  const queue = []
  const inDegree = {}
  
  // 初始化入度
  Object.keys(skillDependencies).forEach(skill => {
    inDegree[skill] = 0
  })
  
  Object.entries(skillDependencies).forEach(([skill, deps]) => {
    deps.forEach(dep => {
      if (!completed.has(dep)) {
        inDegree[skill] = (inDegree[skill] || 0) + 1
      }
    })
  })
  
  // 找到入度为0的技能
  Object.entries(inDegree).forEach(([skill, degree]) => {
    if (degree === 0 && targetSkills.includes(skill) && !completed.has(skill)) {
      queue.push(skill)
    }
  })
  
  // 生成学习路径
  while (queue.length > 0) {
    const currentSkill = queue.shift()
    learningPath.push({
      skill: currentSkill,
      estimatedTime: getEstimatedLearningTime(currentSkill),
      difficulty: getSkillDifficulty(currentSkill),
      prerequisites: skillDependencies[currentSkill] || []
    })
    
    completed.add(currentSkill)
    
    // 更新依赖此技能的其他技能的入度
    Object.entries(skillDependencies).forEach(([skill, deps]) => {
      if (deps.includes(currentSkill)) {
        inDegree[skill]--
        if (inDegree[skill] === 0 && targetSkills.includes(skill) && !completed.has(skill)) {
          queue.push(skill)
        }
      }
    })
  }
  
  return learningPath
}

/**
 * 获取技能学习时间估算
 */
function getEstimatedLearningTime(skill) {
  const timeMap = {
    'JavaScript': '4-6周',
    'React': '3-4周',
    'Vue': '3-4周',
    'Node.js': '2-3周',
    'TypeScript': '2-3周',
    'HTML': '1-2周',
    'CSS': '2-3周',
    'Python': '4-6周',
    'Java': '6-8周',
    'Docker': '2-3周',
    'Kubernetes': '4-6周',
    '项目管理': '3-4周',
    '系统设计': '6-8周'
  }
  
  return timeMap[skill] || '2-4周'
}

/**
 * 获取技能难度
 */
function getSkillDifficulty(skill) {
  const difficultyMap = {
    'HTML': '初级',
    'CSS': '初级',
    'JavaScript': '中级',
    'React': '中级',
    'Vue': '中级',
    'Node.js': '中级',
    'TypeScript': '中级',
    'Python': '中级',
    'Java': '中级',
    'Docker': '中级',
    'Kubernetes': '高级',
    '系统设计': '高级',
    '项目管理': '中级'
  }
  
  return difficultyMap[skill] || '中级'
}

/**
 * 数据分析算法 - 趋势分析
 * @param {Array} dataPoints - 数据点
 * @returns {Object} 趋势分析结果
 */
export function analyzeTrend(dataPoints) {
  if (dataPoints.length < 2) {
    return { trend: 'insufficient_data', slope: 0, correlation: 0 }
  }
  
  const n = dataPoints.length
  const xValues = dataPoints.map((_, index) => index)
  const yValues = dataPoints.map(point => point.value)
  
  // 计算线性回归
  const sumX = xValues.reduce((sum, x) => sum + x, 0)
  const sumY = yValues.reduce((sum, y) => sum + y, 0)
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0)
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  // 计算相关系数
  const meanX = sumX / n
  const meanY = sumY / n
  
  const numerator = xValues.reduce((sum, x, i) => sum + (x - meanX) * (yValues[i] - meanY), 0)
  const denomX = Math.sqrt(xValues.reduce((sum, x) => sum + (x - meanX) ** 2, 0))
  const denomY = Math.sqrt(yValues.reduce((sum, y) => sum + (y - meanY) ** 2, 0))
  
  const correlation = numerator / (denomX * denomY)
  
  let trend = 'stable'
  if (slope > 0.1) trend = 'increasing'
  else if (slope < -0.1) trend = 'decreasing'
  
  return {
    trend,
    slope,
    intercept,
    correlation,
    strength: Math.abs(correlation) > 0.7 ? 'strong' : Math.abs(correlation) > 0.3 ? 'moderate' : 'weak'
  }
}

/**
 * 异常检测算法 - Z-Score方法
 * @param {Array} values - 数值数组
 * @param {number} threshold - 异常阈值
 * @returns {Array} 异常值索引
 */
export function detectAnomalies(values, threshold = 2) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length
  const stdDev = Math.sqrt(variance)
  
  const anomalies = []
  values.forEach((value, index) => {
    const zScore = Math.abs((value - mean) / stdDev)
    if (zScore > threshold) {
      anomalies.push({ index, value, zScore })
    }
  })
  
  return anomalies
}

/**
 * 聚类算法 - K-Means简化版
 * @param {Array} data - 数据点
 * @param {number} k - 聚类数量
 * @returns {Array} 聚类结果
 */
export function kMeansClustering(data, k = 3) {
  if (data.length < k) return data.map((point, index) => ({ ...point, cluster: index }))
  
  // 初始化聚类中心
  let centroids = []
  for (let i = 0; i < k; i++) {
    centroids.push(data[Math.floor(Math.random() * data.length)])
  }
  
  let iterations = 0
  const maxIterations = 100
  
  while (iterations < maxIterations) {
    // 分配数据点到最近的聚类中心
    const clusters = Array(k).fill().map(() => [])
    
    data.forEach(point => {
      let minDistance = Infinity
      let closestCluster = 0
      
      centroids.forEach((centroid, index) => {
        const distance = euclideanDistance(point, centroid)
        if (distance < minDistance) {
          minDistance = distance
          closestCluster = index
        }
      })
      
      clusters[closestCluster].push({ ...point, cluster: closestCluster })
    })
    
    // 更新聚类中心
    const newCentroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0] // 避免空聚类
      
      const avgX = cluster.reduce((sum, point) => sum + point.x, 0) / cluster.length
      const avgY = cluster.reduce((sum, point) => sum + point.y, 0) / cluster.length
      
      return { x: avgX, y: avgY }
    })
    
    // 检查收敛
    const converged = centroids.every((centroid, index) => 
      euclideanDistance(centroid, newCentroids[index]) < 0.01
    )
    
    centroids = newCentroids
    iterations++
    
    if (converged) break
  }
  
  // 返回聚类结果
  const result = []
  data.forEach(point => {
    let minDistance = Infinity
    let closestCluster = 0
    
    centroids.forEach((centroid, index) => {
      const distance = euclideanDistance(point, centroid)
      if (distance < minDistance) {
        minDistance = distance
        closestCluster = index
      }
    })
    
    result.push({ ...point, cluster: closestCluster })
  })
  
  return result
}

/**
 * 计算欧几里得距离
 */
function euclideanDistance(point1, point2) {
  const dx = point1.x - point2.x
  const dy = point1.y - point2.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * 情感分析算法 - 简化版
 * @param {string} text - 输入文本
 * @returns {Object} 情感分析结果
 */
export function analyzeSentiment(text) {
  const positiveWords = [
    '好', '优秀', '棒', '喜欢', '满意', '成功', '完美', '出色', '杰出', '卓越',
    '积极', '正面', '乐观', '开心', '高兴', '兴奋', '激动', '感谢', '赞赏', '认可'
  ]
  
  const negativeWords = [
    '坏', '差', '糟糕', '失败', '问题', '困难', '挑战', '不满', '失望', '沮丧',
    '消极', '负面', '悲观', '难过', '生气', '愤怒', '担心', '焦虑', '压力', '疲惫'
  ]
  
  const words = tokenize(text)
  let positiveScore = 0
  let negativeScore = 0
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++
    if (negativeWords.includes(word)) negativeScore++
  })
  
  const totalWords = words.length
  const positiveRatio = positiveScore / totalWords
  const negativeRatio = negativeScore / totalWords
  
  let sentiment = 'neutral'
  let confidence = 0.5
  
  if (positiveRatio > negativeRatio && positiveRatio > 0.1) {
    sentiment = 'positive'
    confidence = Math.min(0.9, 0.5 + positiveRatio)
  } else if (negativeRatio > positiveRatio && negativeRatio > 0.1) {
    sentiment = 'negative'
    confidence = Math.min(0.9, 0.5 + negativeRatio)
  }
  
  return {
    sentiment,
    confidence,
    positiveScore,
    negativeScore,
    details: {
      positiveWords: words.filter(word => positiveWords.includes(word)),
      negativeWords: words.filter(word => negativeWords.includes(word))
    }
  }
}