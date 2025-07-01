import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  BarChart3, 
  MessageCircle, 
  BookOpen, 
  User, 
  FileText, 
  Target, 
  Briefcase,
  Settings,
  Menu,
  X,
  ChevronDown,
  Zap,
  Brain,
  TrendingUp,
  Award,
  HelpCircle,
  Lock,
  LogOut,
  Cpu,
  Database
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import AIConfigModal from '../components/AIConfigModal'
import MCPConfigPanel from '../components/MCPConfigPanel'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState(null)
  const [scrollY, setScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAIConfig, setShowAIConfig] = useState(false)
  const [showMCPConfig, setShowMCPConfig] = useState(false)

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 导航菜单分组
  const navigationGroups = [
    {
      id: 'main',
      title: '主要功能',
      icon: Home,
      items: [
        { path: '/', name: '首页', icon: Home, description: '欢迎页面' },
        { path: '/dashboard', name: '控制台', icon: BarChart3, description: '数据概览' }
      ]
    },
    {
      id: 'practice',
      title: '面试练习',
      icon: MessageCircle,
      items: [
        { path: '/interview', name: 'AI面试', icon: MessageCircle, description: '智能模拟面试' },
        { path: '/practice', name: '题库练习', icon: BookOpen, description: '海量题库' }
      ]
    },
    {
      id: 'analysis',
      title: '分析工具',
      icon: Brain,
      items: [
        { path: '/resume-analysis', name: '简历分析', icon: FileText, description: 'AI简历优化' },
        { path: '/analytics', name: '数据分析', icon: TrendingUp, description: '表现分析' }
      ]
    },
    {
      id: 'career',
      title: '职业发展',
      icon: Target,
      items: [
        { path: '/career-planning', name: '职业规划', icon: Target, description: '规划未来' },
        { path: '/job-matching', name: '职位匹配', icon: Briefcase, description: '智能推荐' }
      ]
    },
    {
      id: 'personal',
      title: '个人中心',
      icon: User,
      items: [
        { path: '/profile', name: '个人设置', icon: User, description: '账户管理' },
        { path: '/privacy', name: '隐私安全', icon: Lock, description: '隐私设置' },
        { path: '/help', name: '帮助中心', icon: HelpCircle, description: '使用指南' }
      ]
    }
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const getActiveGroup = () => {
    for (const group of navigationGroups) {
      for (const item of group.items) {
        if (isActive(item.path)) {
          return group.id
        }
      }
    }
    return null
  }

  const currentActiveGroup = getActiveGroup()

  const handleGroupToggle = (groupId) => {
    setActiveGroup(activeGroup === groupId ? null : groupId)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
    setActiveGroup(null)
  }
  
  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  // 动态背景效果
  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  }

  // 侧边栏动画
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  // 菜单项动画
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      x: 8,
      transition: { duration: 0.2 }
    }
  }

  // 分组展开动画
  const groupVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* 动态背景装饰 */}
      <motion.div
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl transform translate-y-1/2" />
      </motion.div>

      {/* 顶部导航栏 */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20' 
            : 'bg-transparent'
        }`}
        style={{
          transform: `translateY(${Math.max(-100, -scrollY * 0.5)}px)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI面试助手
                </h1>
                <p className="text-xs text-gray-500">v2.1.0 高级算法版</p>
              </div>
            </motion.div>

            {/* 桌面端导航 */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationGroups.map((group) => (
                <div key={group.id} className="relative">
                  <motion.button
                    onClick={() => handleGroupToggle(group.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      currentActiveGroup === group.id
                        ? 'bg-primary-100 text-primary-700 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <group.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{group.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      activeGroup === group.id ? 'rotate-180' : ''
                    }`} />
                  </motion.button>

                  {/* 下拉菜单 */}
                  <AnimatePresence>
                    {activeGroup === group.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 overflow-hidden z-50"
                      >
                        {group.items.map((item, index) => (
                          <motion.button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                              isActive(item.path)
                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            variants={menuItemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            custom={index}
                          >
                            <item.icon className="w-5 h-5" />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* 用户信息和移动端菜单按钮 */}
            <div className="flex items-center space-x-4">
              {/* AI配置按钮 */}
              <motion.button
                onClick={() => setShowAIConfig(true)}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="AI模型配置"
              >
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">AI配置</span>
              </motion.button>

              {/* MCP配置按钮 */}
              <motion.button
                onClick={() => setShowMCPConfig(true)}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 hover:from-green-500/20 hover:to-blue-500/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="MCP协议配置"
              >
                <Cpu className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">MCP配置</span>
              </motion.button>

              {/* 用户信息 */}
              <motion.div 
                className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{user?.name || '用户'}</div>
                  <div className="text-xs text-gray-500">
                    {user?.isTrialUser ? '试用账户' : '正式用户'}
                  </div>
                </div>
              </motion.div>

              {/* 移动端菜单按钮 */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* 移动端侧边栏 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* 移动端头部 */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">AI面试助手</h2>
                      <p className="text-xs text-gray-500">v2.1.0</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 用户信息 */}
                <motion.div 
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user?.name || '用户'}</div>
                    <div className="text-sm text-gray-500">
                      {user?.isTrialUser ? '试用账户' : '正式用户'}
                    </div>
                  </div>
                </motion.div>

                {/* 配置按钮 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <motion.button
                    onClick={() => {
                      setShowAIConfig(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Brain className="w-6 h-6 text-purple-600 mb-1" />
                    <span className="text-xs font-medium">AI配置</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setShowMCPConfig(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Cpu className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="text-xs font-medium">MCP配置</span>
                  </motion.button>
                </div>

                {/* 移动端导航菜单 */}
                <nav className="space-y-2">
                  {navigationGroups.map((group, groupIndex) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (groupIndex + 1) }}
                    >
                      <button
                        onClick={() => handleGroupToggle(group.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                          currentActiveGroup === group.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <group.icon className="w-5 h-5" />
                          <span className="font-medium">{group.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeGroup === group.id ? 'rotate-180' : ''
                        }`} />
                      </button>

                      <motion.div
                        variants={groupVariants}
                        initial="collapsed"
                        animate={activeGroup === group.id ? "expanded" : "collapsed"}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-2 space-y-1">
                          {group.items.map((item, itemIndex) => (
                            <motion.button
                              key={item.path}
                              onClick={() => handleNavigation(item.path)}
                              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                                isActive(item.path)
                                  ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-500'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                              variants={menuItemVariants}
                              initial="hidden"
                              animate="visible"
                              custom={itemIndex}
                              whileHover="hover"
                            >
                              <item.icon className="w-4 h-4" />
                              <div>
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                  
                  {/* 退出登录按钮 */}
                  <motion.button
                    onClick={handleLogout}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">退出登录</span>
                  </motion.button>
                </nav>

                {/* 移动端底部信息 */}
                <motion.div 
                  className="mt-8 p-4 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4" />
                    <span>AI算法增强版本</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Award className="w-4 h-4" />
                    <span>支持400+AI模型</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <main className="pt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </main>

      {/* 点击外部关闭下拉菜单 */}
      {activeGroup && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setActiveGroup(null)}
        />
      )}

      {/* 浮动配置按钮 (移动端) */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 lg:hidden z-40">
        <motion.button
          onClick={() => setShowAIConfig(true)}
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.button>
        
        <motion.button
          onClick={() => setShowMCPConfig(true)}
          className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Cpu className="w-6 h-6 text-white" />
        </motion.button>
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
    </div>
  )
}

export default Layout