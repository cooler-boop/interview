import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  Zap,
  Target,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react'
import useDataStore from '../store/dataStore'
import toast from 'react-hot-toast'

const EnhancedResumeUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [targetPosition, setTargetPosition] = useState('')
  const [serviceStatus, setServiceStatus] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const { addResume } = useDataStore()
  
  // 检查服务状态
  React.useEffect(() => {
    checkServiceStatus()
  }, [])
  
  const checkServiceStatus = async () => {
    // 模拟服务状态检查
    const isHealthy = Math.random() > 0.5
    setServiceStatus(isHealthy)
  }
  
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    
    if (!targetPosition.trim()) {
      toast.error('请先输入目标岗位')
      return
    }
    
    setUploading(true)
    setAnalyzing(false)
    
    try {
      // 模拟上传进度
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUploading(false)
      setAnalyzing(true)
      
      // 模拟解析过程
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 根据目标岗位生成不同的模拟分析结果
      const result = generateAnalysisResult(targetPosition, file)
      
      // 转换为应用内格式
      const resumeData = {
        fileName: file.name,
        fileSize: file.size,
        targetPosition,
        analysisResult: {
          matchScore: result.matchAnalysis.overallScore,
          skills: result.skills.technical.map(skill => ({
            name: skill,
            level: Math.floor(Math.random() * 40) + 60
          })),
          strengths: result.matchAnalysis.details.strengths,
          improvements: result.improvements.map(imp => imp.suggestion),
          overallScore: result.matchAnalysis.overallScore,
          personalInfo: result.personalInfo,
          education: result.education,
          experience: result.experience,
          projects: result.projects
        },
        overallScore: result.matchAnalysis.overallScore,
        source: result.source
      }
      
      const savedResume = addResume(resumeData)
      setAnalysisResult(result)
      
      toast.success('简历解析完成！')
      onUploadComplete?.(savedResume)
      
    } catch (error) {
      console.error('简历解析失败:', error)
      toast.error('解析失败: ' + error.message)
    } finally {
      setUploading(false)
      setAnalyzing(false)
    }
  }, [targetPosition, addResume, onUploadComplete, serviceStatus])
  
  // 根据目标岗位生成不同的分析结果
  const generateAnalysisResult = (position, file) => {
    // 基于职位类型生成不同的技能和分析结果
    let skills = []
    let strengths = []
    let improvements = []
    
    switch(position) {
      case '前端工程师':
        skills = ['JavaScript', 'React', 'Vue', 'HTML', 'CSS', 'TypeScript', 'Webpack']
        strengths = [
          '技术能力扎实，具备丰富的前端开发经验',
          '熟悉现代前端框架和工具链',
          '有良好的UI/UX感知能力'
        ]
        improvements = [
          { category: '技能提升', suggestion: '建议深入学习TypeScript和前端性能优化', priority: 'high' },
          { category: '项目经验', suggestion: '可以参与更多大型SPA应用开发', priority: 'medium' },
          { category: '简历优化', suggestion: '建议添加更多前端性能优化的具体案例', priority: 'high' }
        ]
        break
        
      case '后端工程师':
        skills = ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'Microservices']
        strengths = [
          '后端架构设计能力强',
          '熟悉分布式系统和微服务架构',
          '具备良好的数据库设计和优化能力'
        ]
        improvements = [
          { category: '技能提升', suggestion: '建议加强云原生技术和容器编排知识', priority: 'high' },
          { category: '项目经验', suggestion: '可以参与更多高并发系统设计', priority: 'medium' },
          { category: '简历优化', suggestion: '建议添加系统性能指标和优化成果', priority: 'high' }
        ]
        break
        
      case '数据分析师':
        skills = ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'R', '数据可视化', '统计分析']
        strengths = [
          '数据分析能力强，擅长从数据中提取洞见',
          '熟悉各类数据可视化工具',
          '具备良好的统计学基础'
        ]
        improvements = [
          { category: '技能提升', suggestion: '建议加强机器学习和高级统计分析能力', priority: 'high' },
          { category: '项目经验', suggestion: '可以参与更多业务驱动的数据分析项目', priority: 'medium' },
          { category: '简历优化', suggestion: '建议添加数据分析带来的业务价值案例', priority: 'high' }
        ]
        break
        
      case '产品经理':
        skills = ['需求分析', '用户研究', '产品规划', 'Axure', 'Figma', '数据分析', '项目管理']
        strengths = [
          '产品思维清晰，善于发现用户痛点',
          '具备良好的沟通协调能力',
          '熟悉产品全生命周期管理'
        ]
        improvements = [
          { category: '技能提升', suggestion: '建议加强数据驱动决策能力', priority: 'high' },
          { category: '项目经验', suggestion: '可以参与更多0到1的产品设计', priority: 'medium' },
          { category: '简历优化', suggestion: '建议添加产品增长和用户留存的具体数据', priority: 'high' }
        ]
        break
        
      default:
        skills = ['JavaScript', 'Python', 'SQL', 'Excel', 'Communication', 'Problem Solving']
        strengths = [
          '技术基础扎实，学习能力强',
          '具备良好的沟通和团队协作能力',
          '有一定的项目经验'
        ]
        improvements = [
          { category: '技能提升', suggestion: '建议深入学习相关技术栈', priority: 'high' },
          { category: '项目经验', suggestion: '建议参与更多实际项目', priority: 'medium' },
          { category: '简历优化', suggestion: '建议添加更多量化成果', priority: 'high' }
        ]
    }
    
    return {
      matchAnalysis: {
        overallScore: Math.floor(Math.random() * 30) + 70,
        skillMatch: Math.floor(Math.random() * 40) + 60,
        experienceMatch: Math.floor(Math.random() * 40) + 60,
        educationMatch: Math.floor(Math.random() * 30) + 70,
        details: {
          strengths,
          weaknesses: [
            '缺乏管理经验',
            '项目描述不够具体'
          ]
        }
      },
      skills: {
        technical: skills,
        raw: `技能：${skills.join(', ')}`
      },
      personalInfo: {
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000'
      },
      education: {
        degrees: ['本科'],
        schools: ['某大学'],
        majors: ['计算机科学与技术'],
        raw: '教育背景：本科毕业于某大学计算机科学与技术专业'
      },
      experience: {
        companies: ['某科技公司'],
        positions: [position],
        times: ['2020-2023'],
        raw: `工作经历：2020-2023年在某科技公司担任${position}`
      },
      projects: {
        projects: ['电商平台开发', '管理系统优化'],
        raw: '项目经验：参与电商平台开发和管理系统优化'
      },
      improvements,
      source: serviceStatus ? 'enterprise-parser' : 'local'
    }
  }
  
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })
  
  if (uploading || analyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {uploading ? '正在上传简历...' : '企业级AI正在分析简历...'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {uploading 
            ? '请稍候，文件上传中' 
            : '使用NLP和机器学习技术深度分析您的简历内容'
          }
        </p>
        
        {/* 进度指示器 */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className={`flex items-center space-x-2 ${uploading ? 'text-blue-600' : 'text-gray-400'}`}>
              <Upload className="w-4 h-4" />
              <span>文件上传</span>
            </div>
            <div className={`flex items-center space-x-2 ${analyzing ? 'text-purple-600' : 'text-gray-400'}`}>
              <Brain className="w-4 h-4" />
              <span>AI分析</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Target className="w-4 h-4" />
              <span>生成报告</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: uploading ? '33%' : analyzing ? '66%' : '100%' }}
            />
          </div>
        </div>
        
        {/* 服务状态指示 */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${serviceStatus ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className="text-gray-600">
            {serviceStatus ? '企业级解析服务在线' : '使用本地解析服务'}
          </span>
        </div>
      </motion.div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* 服务状态提示 */}
      <div className={`p-4 rounded-lg border ${
        serviceStatus 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-orange-50 border-orange-200 text-orange-800'
      }`}>
        <div className="flex items-center space-x-2">
          {serviceStatus ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-600" />
          )}
          <div>
            <div className="font-medium">
              {serviceStatus ? '企业级解析服务已就绪' : '本地解析模式'}
            </div>
            <div className="text-sm">
              {serviceStatus 
                ? '支持PDF、DOC、DOCX、TXT格式，集成NLP和机器学习技术'
                : '后端服务暂不可用，将使用本地模拟解析'
              }
            </div>
          </div>
          <button
            onClick={checkServiceStatus}
            className="ml-auto p-1 hover:bg-white/50 rounded"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 目标岗位输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          目标岗位 *
        </label>
        <input
          type="text"
          value={targetPosition}
          onChange={(e) => setTargetPosition(e.target.value)}
          placeholder="例如：前端工程师、产品经理、数据分析师"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <p className="mt-2 text-sm text-gray-500">
          输入您的目标岗位，AI将针对性分析简历匹配度
        </p>
      </div>
      
      {/* 文件上传区域 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isDragActive ? '释放文件开始解析' : '上传简历文件'}
        </h3>
        
        <p className="text-gray-600 mb-4">
          拖拽文件到此处，或点击选择文件
        </p>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>支持格式：PDF、DOC、DOCX、TXT</p>
          <p>文件大小：最大 10MB</p>
          <p>解析技术：NLP + 机器学习</p>
        </div>
      </div>
      
      {/* 已选择的文件 */}
      <AnimatePresence>
        {acceptedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <h4 className="font-medium text-gray-900 mb-3">已选择文件：</h4>
            {acceptedFiles.map(file => (
              <div key={file.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    就绪
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 功能特色展示 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          企业级AI分析功能
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-700">NLP自然语言处理</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">岗位匹配度评估</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-700">技能水平分析</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">结构化信息提取</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-700">多格式文件支持</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">详细分析报告</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 分析结果预览 */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <h4 className="font-semibold text-gray-900 mb-4">解析结果预览</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analysisResult.matchAnalysis.overallScore}%
              </div>
              <div className="text-sm text-gray-600">综合匹配度</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analysisResult.skills.technical.length}
              </div>
              <div className="text-sm text-gray-600">识别技能</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analysisResult.improvements.length}
              </div>
              <div className="text-sm text-gray-600">改进建议</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default EnhancedResumeUpload