import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  MessageCircle, 
  BarChart3, 
  Target,
  Clock,
  TrendingUp,
  Upload,
  Play,
  Settings,
  Award,
  Brain,
  Cpu
} from 'lucide-react'
import useDataStore from '../store/dataStore'
import useAuthStore from '../store/authStore'
import AIConfigModal from '../components/AIConfigModal'
import MCPConfigPanel from '../components/MCPConfigPanel'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { statistics, resumes, interviewSessions } = useDataStore()
  const [showAIConfig, setShowAIConfig] = useState(false)
  const [showMCPConfig, setShowMCPConfig] = useState(false)
  
  const quickActions = [
    {
      title: '上传第一份简历',
      description: '开始AI简历分析',
      icon: Upload,
      color: 'bg-blue-500',
      action: () => navigate('/resume-analysis'),
      show: statistics.totalResumes === 0
    },
    {
      title: '开始第一次练习',
      description: '体验AI面试练习',
      icon: Play,
      color: 'bg-green-500',
      action: () => navigate('/interview'),
      show: statistics.totalInterviews === 0
    },
    {
      title: '查看简历分析',
      description: '查看已分析的简历',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => navigate('/resume-analysis'),
      show: statistics.totalResumes > 0
    },
    {
      title: '继续面试练习',
      description: '提升面试技能',
      icon: MessageCircle,
      color: 'bg-orange-500',
      action: () => navigate('/interview'),
      show: statistics.totalInterviews > 0
    }
  ]
  
  const visibleActions = quickActions.filter(action => action.show)
  
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}小时${mins}分钟`
    }
    return `${mins}分钟`
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  欢迎回来，{user?.name || '用户'}！
                </h1>
                <p className="text-primary-100">
                  {user?.isTrialUser ? '试用账户' : '正式用户'} · 
                  {statistics.lastActivity 
                    ? ` 最后活动：${new Date(statistics.lastActivity).toLocaleDateString()}`
                    : ' 首次使用'
                  }
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAIConfig(true)}
                  className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors flex items-center space-x-2"
                  title="AI模型配置"
                >
                  <Brain className="w-5 h-5" />
                  <span className="hidden sm:inline">AI配置</span>
                </button>
                <button
                  onClick={() => setShowMCPConfig(true)}
                  className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors flex items-center space-x-2"
                  title="MCP协议配置"
                >
                  <Cpu className="w-5 h-5" />
                  <span className="hidden sm:inline">MCP配置</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: '简历分析',
              value: statistics.totalResumes,
              subtitle: statistics.averageResumeScore > 0 ? `平均分：${statistics.averageResumeScore.toFixed(1)}` : '暂无数据',
              icon: FileText,
              color: 'bg-blue-500'
            },
            {
              title: '面试练习',
              value: statistics.totalInterviews,
              subtitle: statistics.averageInterviewScore > 0 ? `平均分：${statistics.averageInterviewScore.toFixed(1)}` : '暂无数据',
              icon: MessageCircle,
              color: 'bg-green-500'
            },
            {
              title: '练习时长',
              value: formatTime(statistics.totalPracticeTime),
              subtitle: '累计练习时间',
              icon: Clock,
              color: 'bg-purple-500'
            },
            {
              title: '综合评分',
              value: statistics.totalResumes > 0 || statistics.totalInterviews > 0 
                ? Math.round((statistics.averageResumeScore + statistics.averageInterviewScore) / 2) || 'N/A'
                : 'N/A',
              subtitle: '整体表现',
              icon: Award,
              color: 'bg-orange-500'
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm mb-2">{stat.title}</div>
                <div className="text-xs text-gray-500">{stat.subtitle}</div>
              </motion.div>
            )
          })}
        </div>
        
        {/* 快速操作 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={action.action}
                  className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </motion.button>
              )
            })}
          </div>
        </div>
        
        {/* 配置卡片 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">系统配置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI配置卡片 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI模型配置</h3>
                    <p className="text-sm text-gray-500">配置AI模型和API密钥</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIConfig(true)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  配置
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <p>支持OpenAI、Claude、Gemini等400+模型</p>
                <p className="mt-1">配置AI模型可提升分析质量和面试体验</p>
              </div>
            </motion.div>

            {/* MCP配置卡片 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">MCP协议配置</h3>
                    <p className="text-sm text-gray-500">配置Model Context Protocol</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMCPConfig(true)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  配置
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <p>增强AI上下文理解和工具调用能力</p>
                <p className="mt-1">提供更精准的面试评估和职位匹配</p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* 最近活动 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 最近简历 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">最近简历</h3>
              <button
                onClick={() => navigate('/resume-analysis')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                查看全部
              </button>
            </div>
            
            {resumes.length > 0 ? (
              <div className="space-y-3">
                {resumes.slice(0, 3).map(resume => (
                  <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{resume.fileName}</div>
                        <div className="text-sm text-gray-500">{resume.targetPosition}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary-600">{resume.overallScore}</div>
                      <div className="text-xs text-gray-500">分数</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>还没有上传简历</p>
                <button
                  onClick={() => navigate('/resume-analysis')}
                  className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  立即上传
                </button>
              </div>
            )}
          </motion.div>
          
          {/* 最近面试 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">最近面试</h3>
              <button
                onClick={() => navigate('/interview')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                查看全部
              </button>
            </div>
            
            {interviewSessions.length > 0 ? (
              <div className="space-y-3">
                {interviewSessions.slice(0, 3).map(session => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{session.sessionName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{session.completedQuestions || 0}</div>
                      <div className="text-xs text-gray-500">题目</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>还没有面试记录</p>
                <button
                  onClick={() => navigate('/interview')}
                  className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  开始练习
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* AI配置模态框 */}
      <AIConfigModal 
        isOpen={showAIConfig}
        onClose={() => setShowAIConfig(false)}
      />

      {/* MCP配置模态框 */}
      <MCPConfigPanel 
        isOpen={showMCPConfig}
        onClose={() => setShowMCPConfig(false)}
      />
    </motion.div>
  )
}

export default Dashboard