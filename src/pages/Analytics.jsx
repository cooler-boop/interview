import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award,
  Clock,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const Analytics = () => {
  const stats = [
    {
      title: '总面试次数',
      value: '24',
      change: '+3',
      changeType: 'increase',
      icon: MessageCircle,
      color: 'bg-blue-500'
    },
    {
      title: '平均得分',
      value: '85.2',
      change: '+5.2',
      changeType: 'increase',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: '总练习时长',
      value: '12.5h',
      change: '+2.1h',
      changeType: 'increase',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      title: '完成率',
      value: '92%',
      change: '+8%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'bg-orange-500'
    }
  ]

  const recentInterviews = [
    {
      id: 1,
      title: 'JavaScript高级面试',
      date: '2024-01-15',
      score: 88,
      duration: '45分钟',
      status: 'completed'
    },
    {
      id: 2,
      title: '产品经理行为面试',
      date: '2024-01-12',
      score: 92,
      duration: '38分钟',
      status: 'completed'
    },
    {
      id: 3,
      title: '系统设计案例分析',
      date: '2024-01-10',
      score: 76,
      duration: '52分钟',
      status: 'completed'
    }
  ]

  const skillsAnalysis = [
    { skill: '技术能力', score: 85, maxScore: 100 },
    { skill: '沟通表达', score: 78, maxScore: 100 },
    { skill: '逻辑思维', score: 92, maxScore: 100 },
    { skill: '问题解决', score: 88, maxScore: 100 },
    { skill: '团队协作', score: 82, maxScore: 100 }
  ]

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">数据分析</h1>
          <p className="text-gray-600">
            详细的面试表现分析，帮你找到提升方向
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'increase' ? '+' : ''}{stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.title}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 技能分析 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">技能分析</h2>
              </div>
              
              <div className="space-y-4">
                {skillsAnalysis.map((skill, index) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">{skill.skill}</span>
                      <span className={`font-semibold ${getScoreColor(skill.score)}`}>
                        {skill.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.score / skill.maxScore) * 100}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                        className={`h-2 rounded-full ${getScoreBg(skill.score)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">改进建议</h3>
                    <p className="text-blue-700 text-sm">
                      建议加强沟通表达能力的练习，可以通过更多的行为面试题来提升。
                      同时保持技术能力的持续学习。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 最近面试记录 */}
          <div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Award className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">最近面试</h2>
              </div>

              <div className="space-y-4">
                {recentInterviews.map((interview) => (
                  <div key={interview.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{interview.title}</h3>
                      <span className={`text-lg font-bold ${getScoreColor(interview.score)}`}>
                        {interview.score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{interview.date}</span>
                      <span>{interview.duration}</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${getScoreBg(interview.score)}`}
                          style={{ width: `${interview.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                查看全部记录
              </button>
            </motion.div>

            {/* 成就徽章 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6 mt-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">成就徽章</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-medium text-yellow-800">连续练习</div>
                  <div className="text-xs text-yellow-600">7天</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-medium text-green-800">高分达人</div>
                  <div className="text-xs text-green-600">90+分</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Analytics