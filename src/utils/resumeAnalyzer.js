/**
 * 智能简历分析器 - 基于目标岗位的精准分析
 */

export class ResumeAnalyzer {
  constructor() {
    this.apiConfig = null
    this.jobCategories = {
      '数据分析师': {
        keywords: ['数据分析', '数据挖掘', 'SQL', 'Python', 'R', 'Excel', 'Tableau', 'Power BI', '统计学', '机器学习', 'pandas', 'numpy', 'matplotlib', 'seaborn'],
        skills: ['数据清洗', '数据可视化', '统计分析', '业务分析', '报表制作', 'A/B测试', '用户画像', '数据建模'],
        experience: ['数据分析项目', '业务指标分析', '用户行为分析', '销售数据分析', '运营数据分析'],
        education: ['统计学', '数学', '计算机科学', '经济学', '数据科学'],
        certifications: ['数据分析师认证', 'Tableau认证', 'Google Analytics认证', 'Microsoft认证']
      },
      '前端工程师': {
        keywords: ['JavaScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'TypeScript', 'Node.js', 'Webpack', 'Vite'],
        skills: ['前端开发', '响应式设计', '组件开发', '性能优化', '用户体验', '跨浏览器兼容'],
        experience: ['Web应用开发', '移动端适配', '组件库开发', '前端架构设计', '性能优化项目'],
        education: ['计算机科学', '软件工程', '信息技术'],
        certifications: ['前端开发认证', 'React认证', 'Vue认证']
      },
      '后端工程师': {
        keywords: ['Java', 'Python', 'Go', 'Node.js', 'Spring', 'Django', 'MySQL', 'Redis', 'Docker', 'Kubernetes'],
        skills: ['后端开发', '数据库设计', 'API开发', '微服务架构', '系统设计', '性能调优'],
        experience: ['后端服务开发', '数据库优化', 'API设计', '系统架构', '高并发处理'],
        education: ['计算机科学', '软件工程', '信息技术'],
        certifications: ['Java认证', 'AWS认证', 'Docker认证']
      },
      '产品经理': {
        keywords: ['产品设计', '用户研究', '需求分析', '项目管理', 'Axure', 'Figma', '数据分析', 'A/B测试'],
        skills: ['产品规划', '用户体验设计', '需求管理', '项目协调', '数据驱动决策', '竞品分析'],
        experience: ['产品规划', '功能设计', '用户调研', '产品迭代', '跨部门协作'],
        education: ['产品管理', '工商管理', '计算机科学', '心理学', '设计学'],
        certifications: ['PMP认证', '产品经理认证', 'Scrum认证']
      },
      'UI/UX设计师': {
        keywords: ['UI设计', 'UX设计', 'Sketch', 'Figma', 'Adobe', '用户体验', '交互设计', '视觉设计'],
        skills: ['界面设计', '用户体验设计', '交互原型', '视觉规范', '用户研究', '可用性测试'],
        experience: ['界面设计项目', '用户体验优化', '设计系统建设', '用户研究', '原型设计'],
        education: ['设计学', '视觉传达', '交互设计', '心理学'],
        certifications: ['Adobe认证', 'UX设计认证', '交互设计认证']
      }
    }
  }

  /**
   * 设置API配置
   */
  setApiConfig(config) {
    this.apiConfig = config
  }

  /**
   * 智能简历分析
   * @param {string} resumeText - 简历文本
   * @param {string} targetPosition - 目标岗位
   * @returns {Promise<Object>} 分析结果
   */
  async analyzeResume(resumeText, targetPosition) {
    try {
      // 获取岗位配置
      const jobConfig = this.jobCategories[targetPosition] || this.jobCategories['前端工程师']
      
      // 基础分析
      const basicAnalysis = this.performBasicAnalysis(resumeText, jobConfig)
      
      // AI深度分析
      const aiAnalysis = await this.performAIAnalysis(resumeText, targetPosition, jobConfig)
      
      // 合并分析结果
      const finalResult = this.mergeAnalysisResults(basicAnalysis, aiAnalysis, targetPosition)
      
      return finalResult
      
    } catch (error) {
      console.error('简历分析失败:', error)
      // 降级到基础分析
      const jobConfig = this.jobCategories[targetPosition] || this.jobCategories['前端工程师']
      return this.performBasicAnalysis(resumeText, jobConfig)
    }
  }

  /**
   * 基础分析（规则引擎）
   */
  performBasicAnalysis(resumeText, jobConfig) {
    const text = resumeText.toLowerCase()
    
    // 技能匹配分析
    const skillMatches = this.analyzeSkillMatches(text, jobConfig)
    
    // 关键词匹配分析
    const keywordMatches = this.analyzeKeywordMatches(text, jobConfig)
    
    // 经验匹配分析
    const experienceMatches = this.analyzeExperienceMatches(text, jobConfig)
    
    // 教育背景分析
    const educationMatches = this.analyzeEducationMatches(text, jobConfig)
    
    // 计算综合匹配度
    const matchScore = this.calculateMatchScore({
      skillMatches,
      keywordMatches,
      experienceMatches,
      educationMatches
    })
    
    return {
      matchScore,
      skills: skillMatches.matched.map(skill => ({
        name: skill,
        level: Math.floor(Math.random() * 20) + 70,
        matched: true
      })),
      strengths: this.generateStrengths(skillMatches, experienceMatches),
      improvements: this.generateImprovements(skillMatches, keywordMatches),
      keywordAnalysis: {
        matched: keywordMatches.matched,
        missing: keywordMatches.missing,
        coverage: keywordMatches.coverage
      },
      experienceAnalysis: {
        relevant: experienceMatches.matched,
        suggestions: experienceMatches.suggestions
      },
      analysisType: 'basic',
      overallScore: matchScore
    }
  }

  /**
   * AI深度分析
   */
  async performAIAnalysis(resumeText, targetPosition, jobConfig) {
    if (!this.apiConfig) {
      console.warn('未配置AI API，跳过AI分析')
      return null
    }

    try {
      const prompt = this.buildAnalysisPrompt(resumeText, targetPosition, jobConfig)
      
      const response = await fetch('https://apixiaoyun.deno.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer AlzaSyBAsW3Wb1DV5-oPQpv4QLMwyXmhrHLGXtE`
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash-preview-04-17-thinking',
          messages: [
            {
              role: 'system',
              content: `你是一位资深的${targetPosition}招聘专家和简历分析师。请基于目标岗位要求，对简历进行专业、客观的分析。`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 1.0
        })
      })

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content

      if (aiResponse) {
        return this.parseAIResponse(aiResponse)
      }

      return null
    } catch (error) {
      console.error('AI分析失败:', error)
      return null
    }
  }

  /**
   * 构建分析提示词
   */
  buildAnalysisPrompt(resumeText, targetPosition, jobConfig) {
    return `请分析以下简历，目标岗位是：${targetPosition}

简历内容：
${resumeText}

岗位要求的核心技能：
${jobConfig.keywords.join(', ')}

岗位要求的核心能力：
${jobConfig.skills.join(', ')}

请从以下维度进行分析：

1. **技能匹配度分析**（0-100分）
   - 分析简历中提到的技能与岗位要求的匹配程度
   - 列出匹配的技能和缺失的关键技能

2. **经验相关性分析**（0-100分）
   - 评估工作经验与目标岗位的相关性
   - 分析项目经验的质量和深度

3. **教育背景匹配度**（0-100分）
   - 评估教育背景与岗位要求的匹配程度

4. **简历质量评估**（0-100分）
   - 简历结构、表达清晰度、量化指标使用等

5. **优势总结**
   - 列出候选人的3-5个核心优势

6. **改进建议**
   - 提供3-5条具体的改进建议

7. **综合评分**（0-100分）
   - 基于以上分析给出综合评分

请以JSON格式返回分析结果：
{
  "skillMatch": 85,
  "experienceMatch": 78,
  "educationMatch": 90,
  "resumeQuality": 82,
  "overallScore": 84,
  "strengths": ["优势1", "优势2", "优势3"],
  "improvements": ["建议1", "建议2", "建议3"],
  "detailedAnalysis": "详细分析文本",
  "matchedSkills": ["技能1", "技能2"],
  "missingSkills": ["缺失技能1", "缺失技能2"]
}`
  }

  /**
   * 解析AI响应
   */
  parseAIResponse(response) {
    try {
      // 尝试提取JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          aiAnalysis: parsed,
          rawResponse: response
        }
      }
      
      // 如果没有JSON，解析文本
      return {
        aiAnalysis: this.parseTextResponse(response),
        rawResponse: response
      }
    } catch (error) {
      console.error('解析AI响应失败:', error)
      return {
        aiAnalysis: null,
        rawResponse: response
      }
    }
  }

  /**
   * 解析文本响应
   */
  parseTextResponse(response) {
    const lines = response.split('\n')
    const result = {
      overallScore: 75,
      strengths: [],
      improvements: [],
      detailedAnalysis: response
    }

    // 简单的文本解析逻辑
    let currentSection = null
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.includes('优势') || trimmed.includes('strengths')) {
        currentSection = 'strengths'
      } else if (trimmed.includes('建议') || trimmed.includes('improvements')) {
        currentSection = 'improvements'
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
        const content = trimmed.replace(/^[-•\d.]\s*/, '')
        if (content && currentSection) {
          result[currentSection].push(content)
        }
      }
    }

    return result
  }

  /**
   * 技能匹配分析
   */
  analyzeSkillMatches(text, jobConfig) {
    const matched = []
    const missing = []
    
    for (const skill of jobConfig.keywords) {
      if (text.includes(skill.toLowerCase())) {
        matched.push(skill)
      } else {
        missing.push(skill)
      }
    }
    
    const coverage = matched.length / jobConfig.keywords.length
    
    return { matched, missing, coverage }
  }

  /**
   * 关键词匹配分析
   */
  analyzeKeywordMatches(text, jobConfig) {
    const allKeywords = [...jobConfig.keywords, ...jobConfig.skills]
    const matched = []
    const missing = []
    
    for (const keyword of allKeywords) {
      if (text.includes(keyword.toLowerCase())) {
        matched.push(keyword)
      } else {
        missing.push(keyword)
      }
    }
    
    const coverage = matched.length / allKeywords.length
    
    return { matched, missing, coverage }
  }

  /**
   * 经验匹配分析
   */
  analyzeExperienceMatches(text, jobConfig) {
    const matched = []
    const suggestions = []
    
    for (const exp of jobConfig.experience) {
      if (text.includes(exp.toLowerCase())) {
        matched.push(exp)
      } else {
        suggestions.push(`建议增加${exp}相关经验描述`)
      }
    }
    
    return { matched, suggestions }
  }

  /**
   * 教育背景分析
   */
  analyzeEducationMatches(text, jobConfig) {
    const matched = []
    
    for (const edu of jobConfig.education) {
      if (text.includes(edu.toLowerCase())) {
        matched.push(edu)
      }
    }
    
    return { matched }
  }

  /**
   * 计算匹配分数
   */
  calculateMatchScore({ skillMatches, keywordMatches, experienceMatches, educationMatches }) {
    const skillScore = skillMatches.coverage * 40
    const keywordScore = keywordMatches.coverage * 30
    const experienceScore = Math.min(experienceMatches.matched.length / 3, 1) * 20
    const educationScore = Math.min(educationMatches.matched.length / 2, 1) * 10
    
    return Math.round(skillScore + keywordScore + experienceScore + educationScore)
  }

  /**
   * 生成优势描述
   */
  generateStrengths(skillMatches, experienceMatches) {
    const strengths = []
    
    if (skillMatches.coverage > 0.7) {
      strengths.push('技能匹配度高，具备岗位所需的核心技术能力')
    }
    
    if (experienceMatches.matched.length > 2) {
      strengths.push('相关工作经验丰富，项目实践能力强')
    }
    
    if (skillMatches.matched.length > 5) {
      strengths.push('技能栈全面，具备多元化的技术背景')
    }
    
    // 确保至少有3个优势
    while (strengths.length < 3) {
      const defaultStrengths = [
        '学习能力强，能够快速适应新技术和环境',
        '具备良好的沟通协作能力',
        '工作态度积极，责任心强'
      ]
      
      const newStrength = defaultStrengths[strengths.length % defaultStrengths.length]
      if (!strengths.includes(newStrength)) {
        strengths.push(newStrength)
      } else {
        break
      }
    }
    
    return strengths.slice(0, 5)
  }

  /**
   * 生成改进建议
   */
  generateImprovements(skillMatches, keywordMatches) {
    const improvements = []
    
    if (skillMatches.coverage < 0.5) {
      improvements.push(`建议补充以下关键技能：${skillMatches.missing.slice(0, 3).join('、')}`)
    }
    
    if (keywordMatches.coverage < 0.6) {
      improvements.push('建议在简历中增加更多与岗位相关的关键词描述')
    }
    
    improvements.push('建议增加具体的项目成果和量化数据')
    improvements.push('建议完善工作经历的详细描述，突出个人贡献')
    
    return improvements.slice(0, 5)
  }

  /**
   * 合并分析结果
   */
  mergeAnalysisResults(basicAnalysis, aiAnalysis, targetPosition) {
    if (!aiAnalysis || !aiAnalysis.aiAnalysis) {
      return {
        ...basicAnalysis,
        overallScore: basicAnalysis.matchScore,
        targetPosition,
        analysisType: 'basic',
        timestamp: new Date().toISOString()
      }
    }

    const ai = aiAnalysis.aiAnalysis
    
    return {
      matchScore: ai.overallScore || basicAnalysis.matchScore,
      overallScore: ai.overallScore || basicAnalysis.matchScore,
      skills: basicAnalysis.skills,
      strengths: ai.strengths || basicAnalysis.strengths,
      improvements: ai.improvements || basicAnalysis.improvements,
      targetPosition,
      analysisType: 'ai_enhanced',
      timestamp: new Date().toISOString(),
      detailedAnalysis: ai.detailedAnalysis,
      aiScores: {
        skillMatch: ai.skillMatch,
        experienceMatch: ai.experienceMatch,
        educationMatch: ai.educationMatch,
        resumeQuality: ai.resumeQuality
      },
      keywordAnalysis: basicAnalysis.keywordAnalysis,
      experienceAnalysis: basicAnalysis.experienceAnalysis,
      rawAiResponse: aiAnalysis.rawResponse
    }
  }

  /**
   * 获取支持的岗位列表
   */
  getSupportedPositions() {
    return Object.keys(this.jobCategories)
  }

  /**
   * 获取岗位配置
   */
  getJobConfig(position) {
    return this.jobCategories[position]
  }
}

// 全局简历分析器实例
export const resumeAnalyzer = new ResumeAnalyzer()