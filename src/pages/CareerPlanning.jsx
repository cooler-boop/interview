import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  BookOpen,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react'
import useDataStore from '../store/dataStore'

const CareerPlanning = () => {
  const { careerGoals, learningResources, addCareerGoal, addLearningResource } = useDataStore()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: ''
  })
  
  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetDate) {
      addCareerGoal(newGoal)
      setNewGoal({ title: '', description: '', targetDate: '' })
      setShowAddGoal(false)
    }
  }
  
  const mockLearningPlan = [
    {
      category: '技术技能',
      items: [
        { name: 'React高级特性', priority: 'high', estimatedTime: '2周' },
        { name: 'TypeScript深入学习', priority: 'medium', estimatedTime: '3周' },
        { name: '系统设计原理', priority: 'high', estimatedTime: '4周' }
      ]
    },
    {
      category: '软技能',
      items: [
        { name: '沟通表达能力', priority: 'medium', estimatedTime: '持续' },
        { name: '项目管理技能', priority: 'low', estimatedTime: '2周' },
        { name: '团队协作能力', priority: 'medium', estimatedTime: '持续' }
      ]
    }
  ]
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">职业规划</h1>
          <p className="text-gray-600">
            制定职业目标，规划学习路径，追踪成长进度
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 职业目标 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">职业目标</h2>
                </div>
                <button
                  onClick={() => setShowAddGoal(true)}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  添加目标
                </button>
              </div>
              
              {showAddGoal && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 mb-6"
                >
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="目标标题"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <textarea
                      placeholder="目标描述"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddGoal}
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setShowAddGoal(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-4">
                {careerGoals.length > 0 ? (
                  careerGoals.map(goal => (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">进度</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>还没有设定职业目标</p>
                    <button
                      onClick={() => setShowAddGoal(true)}
                      className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      立即添加
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* 学习计划 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">学习计划</h2>
              </div>
              
              <div className="space-y-6">
                {mockLearningPlan.map((category, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 mb-3">{category.category}</h3>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority === 'high' ? '高优先级' : 
                               item.priority === 'medium' ? '中优先级' : '低优先级'}
                            </span>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{item.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 技能差距分析 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">技能差距</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { skill: '系统设计', current: 60, target: 85, gap: 25 },
                  { skill: 'TypeScript', current: 70, target: 90, gap: 20 },
                  { skill: '项目管理', current: 50, target: 80, gap: 30 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-700">{item.skill}</span>
                      <span className="text-gray-500">{item.current}% → {item.target}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="relative h-2 rounded-full">
                        <div 
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: `${item.current}%` }}
                        />
                        <div 
                          className="absolute top-0 bg-primary-500 h-2 rounded-full opacity-30"
                          style={{ width: `${item.target}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 成就徽章 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">成就徽章</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: '目标达成者', icon: '🎯', earned: true },
                  { name: '学习达人', icon: '📚', earned: true },
                  { name: '技能专家', icon: '⚡', earned: false },
                  { name: '规划大师', icon: '🗺️', earned: false }
                ].map((badge, index) => (
                  <div 
                    key={index}
                    className={`text-center p-3 rounded-lg ${
                      badge.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className={`text-xs font-medium ${
                      badge.earned ? 'text-yellow-800' : 'text-gray-500'
                    }`}>
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CareerPlanning