import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Award
} from 'lucide-react'
import useDataStore from '../store/dataStore'
import ResumeUpload from '../components/ResumeUpload'

const ResumeAnalysis = () => {
  const { resumes, removeResume } = useDataStore()
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedResume, setSelectedResume] = useState(null)
  
  const handleUploadComplete = (resume) => {
    setSelectedResume(resume)
    setActiveTab('analysis')
  }
  
  const handleDeleteResume = (id) => {
    if (window.confirm('确定要删除这份简历分析吗？')) {
      removeResume(id)
      if (selectedResume && selectedResume.id === id) {
        setSelectedResume(null)
      }
      toast.success('简历分析已删除')
    }
  }
  
  const renderSkillChart = (skills) => {
    return (
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{skill.level}%</span>
                {skill.matched && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                className={`h-2 rounded-full ${
                  skill.level >= 80 ? 'bg-green-500' : 
                  skill.level >= 60 ? 'bg-blue-500' : 
                  'bg-yellow-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-blue-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getAnalysisTypeIcon = (type) => {
    return type === 'ai_enhanced' ? (
      <div className="flex items-center space-x-1 text-purple-600">
        <Brain className="w-4 h-4" />
        <span className="text-xs">AI增强</span>
      </div>
    ) : (
      <div className="flex items-center space-x-1 text-blue-600">
        <Target className="w-4 h-4" />
        <span className="text-xs">基础分析</span>
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            智能简历分析系统
          </h1>
          <p className="text-gray-600">
            基于目标岗位的AI智能分析，提供专业的优化建议
          </p>
        </div>
        
        {/* 标签页 */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'upload', name: '上传简历', icon: Upload },
                { id: 'analysis', name: '分析结果', icon: BarChart3 },
                { id: 'history', name: '历史记录', icon: FileText }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'upload' && (
              <ResumeUpload onUploadComplete={handleUploadComplete} />
            )}
            
            {activeTab === 'analysis' && selectedResume && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 基本信息 */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    简历信息
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">文件名：</span>
                      <span className="font-medium">{selectedResume.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">目标岗位：</span>
                      <span className="font-medium text-blue-600">{selectedResume.targetPosition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">分析时间：</span>
                      <span className="font-medium">
                        {new Date(selectedResume.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">分析类型：</span>
                      {getAnalysisTypeIcon(selectedResume.analysisType)}
                    </div>
                  </div>
                </div>
                
                {/* 综合评分 */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`text-5xl font-bold ${getScoreColor(selectedResume.overallScore)}`}>
                        {selectedResume.overallScore}
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600 text-lg font-medium">综合评分</div>
                        <div className="text-sm text-gray-500">满分100分</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedResume.overallScore}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-4 rounded-full ${getScoreBg(selectedResume.overallScore)}`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-gray-500">匹配度</div>
                        <div className="font-semibold text-blue-600">
                          {selectedResume.analysisResult.matchScore || selectedResume.overallScore}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">技能匹配</div>
                        <div className="font-semibold text-green-600">
                          {selectedResume.analysisResult.aiScores?.skillMatch || '85'}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">经验匹配</div>
                        <div className="font-semibold text-orange-600">
                          {selectedResume.analysisResult.aiScores?.experienceMatch || '78'}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">简历质量</div>
                        <div className="font-semibold text-purple-600">
                          {selectedResume.analysisResult.aiScores?.resumeQuality || '82'}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI详细分析 */}
                {selectedResume.analysisResult.detailedAnalysis && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      AI深度分析报告
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-white rounded-lg p-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedResume.analysisResult.detailedAnalysis}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 技能分析 */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    技能分析
                  </h3>
                  {renderSkillChart(selectedResume.analysisResult.skills)}
                </div>

                {/* 关键词分析 */}
                {selectedResume.analysisResult.keywordAnalysis && (
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      关键词匹配分析
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-green-900 mb-3">匹配的关键词</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedResume.analysisResult.keywordAnalysis.matched.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-900 mb-3">缺失的关键词</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedResume.analysisResult.keywordAnalysis.missing.slice(0, 8).map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800">
                        关键词覆盖率: <span className="font-semibold">
                          {Math.round(selectedResume.analysisResult.keywordAnalysis.coverage * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 优势分析 */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-600" />
                    优势分析
                  </h3>
                  <div className="space-y-3">
                    {selectedResume.analysisResult.strengths.map((strength, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* 改进建议 */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-orange-600" />
                    改进建议
                  </h3>
                  <div className="space-y-3">
                    {selectedResume.analysisResult.improvements.map((improvement, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{improvement}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex justify-center space-x-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Download className="w-4 h-4 mr-2 inline" />
                    导出分析报告
                  </button>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    分析新简历
                  </button>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'analysis' && !selectedResume && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无分析结果</h3>
                <p className="text-gray-600 mb-4">请先上传简历进行智能分析</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  上传简历
                </button>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="space-y-4">
                {resumes.length > 0 ? (
                  resumes.map(resume => (
                    <motion.div 
                      key={resume.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileText className="w-10 h-10 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">{resume.fileName}</h4>
                            <p className="text-sm text-gray-500 flex items-center space-x-2">
                              <span>目标岗位: {resume.targetPosition}</span>
                              <span>•</span>
                              {getAnalysisTypeIcon(resume.analysisType)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(resume.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(resume.overallScore)}`}>
                              {resume.overallScore}
                            </div>
                            <div className="text-xs text-gray-500">综合评分</div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedResume(resume)
                                setActiveTab('analysis')
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="查看详情"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteResume(resume.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无历史记录</h3>
                    <p className="text-gray-600 mb-4">还没有分析过的简历</p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      开始分析
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ResumeAnalysis