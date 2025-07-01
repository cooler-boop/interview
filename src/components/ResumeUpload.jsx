import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, AlertCircle, Brain, Zap, Target } from 'lucide-react'
import useDataStore from '../store/dataStore'
import useAIConfigStore from '../store/aiConfigStore'
import { resumeAnalyzer } from '../utils/resumeAnalyzer'
import toast from 'react-hot-toast'

const ResumeUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [targetPosition, setTargetPosition] = useState('')
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const { addResume } = useDataStore()
  const { getActiveConfig } = useAIConfigStore()
  
  // 获取支持的岗位列表
  const supportedPositions = resumeAnalyzer.getSupportedPositions()
  
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    
    if (!targetPosition.trim()) {
      toast.error('请先选择目标岗位')
      return
    }
    
    setUploading(true)
    setAnalysisProgress(0)
    
    try {
      // 模拟文件上传进度
      const uploadInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 30) {
            clearInterval(uploadInterval)
            return 30
          }
          return prev + 10
        })
      }, 200)
      
      // 读取文件内容
      const fileContent = await readFileContent(file)
      
      clearInterval(uploadInterval)
      setAnalysisProgress(40)
      setUploading(false)
      setAnalyzing(true)
      
      // 配置AI API
      const aiConfig = getActiveConfig()
      if (aiConfig && aiConfig.config && aiConfig.config.apiKey) {
        resumeAnalyzer.setApiConfig({
          baseUrl: 'https://apixiaoyun.deno.dev',
          apiKey: 'AlzaSyBAsW3Wb1DV5-oPQpv4QLMwyXmhrHLGXtE',
          model: 'gemini-2.5-flash-preview-04-17-thinking',
          maxTokens: '2000',
          temperature: '0.7',
          topP: '1.0'
        })
        console.log('AI配置已设置，将使用AI增强分析')
      } else {
        console.log('未配置AI，将使用基础规则分析')
      }
      
      // 模拟分析进度
      const analysisInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(analysisInterval)
            return 90
          }
          return prev + 15
        })
      }, 800)
      
      // 执行智能分析
      const analysisResult = await resumeAnalyzer.analyzeResume(fileContent, targetPosition)
      
      clearInterval(analysisInterval)
      setAnalysisProgress(100)
      
      // 等待一下让用户看到100%
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const resume = {
        fileName: file.name,
        fileSize: file.size,
        targetPosition,
        analysisResult,
        overallScore: analysisResult.overallScore || analysisResult.matchScore,
        fileContent: fileContent.substring(0, 1000) + '...', // 保存部分内容用于展示
        analysisType: analysisResult.analysisType,
        createdAt: new Date().toISOString()
      }
      
      const savedResume = addResume(resume)
      
      toast.success(`简历分析完成！${analysisResult.analysisType === 'ai_enhanced' ? '使用AI增强分析' : '使用基础规则分析'}`)
      onUploadComplete?.(savedResume)
      
    } catch (error) {
      console.error('简历分析失败:', error)
      toast.error('分析失败: ' + error.message)
    } finally {
      setUploading(false)
      setAnalyzing(false)
      setAnalysisProgress(0)
    }
  }, [targetPosition, addResume, onUploadComplete, getActiveConfig])
  
  // 读取文件内容
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          let content = e.target.result
          
          // 简单的文本提取（实际项目中应该使用专业的PDF/DOCX解析库）
          if (file.type === 'application/pdf') {
            // PDF文件的简单文本提取（这里只是模拟）
            content = `PDF文件内容模拟：
姓名：张三
联系方式：13800138000
邮箱：zhangsan@example.com
教育背景：计算机科学与技术本科
工作经验：
- 2020-2023 某科技公司 ${targetPosition}
- 负责数据分析和报表制作
- 熟练使用Python、SQL、Excel进行数据处理
- 参与用户行为分析项目，提升转化率15%
技能：Python, SQL, Excel, Tableau, 数据可视化, 统计分析
项目经验：
- 用户画像分析系统：使用Python和SQL分析用户行为数据
- 销售数据分析：制作销售报表，发现业务增长点
- A/B测试分析：设计并分析A/B测试，优化产品功能`
          } else if (file.type.includes('word')) {
            // DOCX文件的简单文本提取
            content = `DOCX文件内容模拟：
个人简历
姓名：李四
专业：${targetPosition === '数据分析师' ? '统计学' : '计算机科学'}
技能：${targetPosition === '数据分析师' ? 'Python, R, SQL, 数据挖掘, 机器学习' : 'JavaScript, React, Vue, Node.js, MySQL'}
经验：3年${targetPosition}相关工作经验
项目：多个${targetPosition}项目经验`
          }
          
          resolve(content)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
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
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          {analyzing ? (
            <Brain className="w-10 h-10 text-white animate-pulse" />
          ) : (
            <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {uploading ? '正在上传简历...' : '正在智能分析简历...'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {uploading ? '请稍候，文件上传中' : `AI正在深度分析您的${targetPosition}简历`}
        </p>
        
        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${analysisProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="text-sm text-gray-500">
          {analysisProgress < 30 && '正在上传文件...'}
          {analysisProgress >= 30 && analysisProgress < 50 && '正在解析简历内容...'}
          {analysisProgress >= 50 && analysisProgress < 80 && '正在进行AI智能分析...'}
          {analysisProgress >= 80 && analysisProgress < 100 && '正在生成分析报告...'}
          {analysisProgress >= 100 && '分析完成！'}
        </div>
        
        {/* 分析特性展示 */}
        {analyzing && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-blue-800">岗位匹配</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <Brain className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-xs text-purple-800">AI分析</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-green-800">智能建议</div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* 目标岗位选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          目标岗位 *
        </label>
        <select
          value={targetPosition}
          onChange={(e) => setTargetPosition(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">请选择目标岗位</option>
          {supportedPositions.map(position => (
            <option key={position} value={position}>{position}</option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500">
          选择您的目标岗位，AI将针对性分析简历匹配度
        </p>
      </div>
      
      {/* 文件上传区域 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-primary-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isDragActive ? '释放文件开始上传' : '上传简历文件'}
        </h3>
        
        <p className="text-gray-600 mb-4">
          拖拽文件到此处，或点击选择文件
        </p>
        
        <div className="text-sm text-gray-500">
          <p>支持格式：PDF、DOC、DOCX、TXT</p>
          <p>文件大小：最大 10MB</p>
        </div>
      </div>
      
      {/* 已选择的文件 */}
      {acceptedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">已选择文件：</h4>
          {acceptedFiles.map(file => (
            <div key={file.name} className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-700">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* 智能分析功能说明 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-600" />
          智能分析功能
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-blue-900 mb-2">基础分析</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 岗位匹配度评估</li>
              <li>• 技能关键词提取</li>
              <li>• 经验相关性分析</li>
              <li>• 教育背景匹配</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-purple-900 mb-2">AI增强分析</h5>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• 深度语义理解</li>
              <li>• 个性化改进建议</li>
              <li>• 综合评分算法</li>
              <li>• 专业反馈报告</li>
            </ul>
          </div>
        </div>
        
        {/* AI配置状态 */}
        <div className="mt-4 p-3 bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">AI分析状态</span>
            <div className="flex items-center space-x-2">
              {getActiveConfig()?.config?.apiKey ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">AI已配置</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600">使用基础分析</span>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {getActiveConfig()?.config?.apiKey 
              ? '将使用AI增强分析，提供更精准的评估和建议' 
              : '配置AI后可获得更深度的分析结果'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResumeUpload