import React from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Zap, Shield } from 'lucide-react'
import useAuthStore from '../store/authStore'

const AuthGuard = ({ children, feature = "职位搜索" }) => {
  const { isAuthenticated, user, createTrialAccount } = useAuthStore()

  if (isAuthenticated) {
    return children
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            登录后使用{feature}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {feature}功能需要登录后才能使用，这样我们可以为您提供个性化的职位推荐和匹配服务。
          </p>

          {/* 功能特色 */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center space-x-3 text-left">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-700">实时搜索真实职位</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <User className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">个性化智能匹配</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-700">数据安全保护</span>
            </div>
          </div>

          <button
            onClick={createTrialAccount}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            立即登录使用
          </button>

          <p className="text-xs text-gray-500 mt-4">
            点击登录即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default AuthGuard