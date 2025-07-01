import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle,
  LogOut,
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: '个人信息', icon: User },
    { id: 'settings', name: '设置', icon: Settings },
    { id: 'notifications', name: '通知', icon: Bell },
    { id: 'privacy', name: '隐私', icon: Shield },
    { id: 'help', name: '帮助', icon: HelpCircle }
  ]

  const userInfo = {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '+86 138 0013 8000',
    location: '北京市朝阳区',
    position: '前端工程师',
    company: '某科技公司',
    joinDate: '2024-01-01'
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* 头像和基本信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200">
              <Camera className="w-3 h-3 text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{userInfo.name}</h2>
            <p className="text-gray-600">{userInfo.position}</p>
            <p className="text-sm text-gray-500">{userInfo.company}</p>
          </div>
          <button className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium rounded-lg transition-colors duration-200">
            <Edit className="w-4 h-4 mr-2 inline" />
            编辑
          </button>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">详细信息</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">邮箱</div>
              <div className="font-medium">{userInfo.email}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">电话</div>
              <div className="font-medium">{userInfo.phone}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">位置</div>
              <div className="font-medium">{userInfo.location}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">加入时间</div>
              <div className="font-medium">{userInfo.joinDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 面试统计 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">面试统计</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">24</div>
            <div className="text-sm text-gray-500">总面试次数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">85.2</div>
            <div className="text-sm text-gray-500">平均得分</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">12.5h</div>
            <div className="text-sm text-gray-500">总练习时长</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">应用设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">深色模式</div>
              <div className="text-sm text-gray-500">切换应用主题</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">自动保存</div>
              <div className="text-sm text-gray-500">自动保存面试记录</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">语言设置</h3>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
        </select>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">通知设置</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">面试提醒</div>
              <div className="text-sm text-gray-500">面试开始前提醒</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">练习提醒</div>
              <div className="text-sm text-gray-500">每日练习提醒</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">成就通知</div>
              <div className="text-sm text-gray-500">获得新成就时通知</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'settings':
        return renderSettingsTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'privacy':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">隐私设置</h3>
            <p className="text-gray-600">隐私设置功能正在开发中...</p>
          </div>
        )
      case 'help':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">帮助中心</h3>
            <p className="text-gray-600">帮助文档正在完善中...</p>
          </div>
        )
      default:
        return renderProfileTab()
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">个人中心</h1>
          <p className="text-gray-600">
            管理你的个人信息和应用设置
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  )
                })}
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors duration-200">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">退出登录</span>
                </button>
              </nav>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile