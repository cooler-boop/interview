import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  Zap, 
  Target, 
  Award,
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Briefcase,
  Brain,
  CheckCircle,
  Globe,
  Shield,
  FileText
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI模拟面试',
      description: '真实的面试场景模拟，智能AI面试官提供专业反馈',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: '题库练习',
      description: '海量面试题库，涵盖各行业各岗位的常见问题',
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      title: '数据分析',
      description: '详细的面试表现分析，帮你找到提升方向',
      color: 'bg-purple-500'
    },
    {
      icon: Target,
      title: '个性化建议',
      description: '基于你的表现提供针对性的改进建议',
      color: 'bg-orange-500'
    },
    {
      icon: Briefcase,
      title: '职位搜索',
      description: '多平台聚合的企业级职位搜索，智能匹配最适合你的岗位',
      color: 'bg-indigo-500'
    },
    {
      icon: Brain,
      title: '简历分析',
      description: 'AI智能分析简历，提供专业的优化建议和改进方向',
      color: 'bg-pink-500'
    }
  ]

  const stats = [
    { label: '用户数量', value: '10,000+', icon: Users },
    { label: '面试次数', value: '50,000+', icon: MessageCircle },
    { label: '成功率提升', value: '85%', icon: TrendingUp },
    { label: '满意度', value: '4.9/5', icon: Award }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl transform translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI智能面试助手
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                利用人工智能技术，为你提供专业的面试准备和练习平台。
                提升面试技能，增强求职信心，助你获得理想工作。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/interview"
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  <Play className="w-5 h-5 mr-2" />
                  开始面试
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/job-matching"
                  className="inline-flex items-center px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-300 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  搜索职位
                </Link>
              </div>
              
              {/* 特色标签 */}
              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center">
                  <Brain className="w-3 h-3 mr-1" />
                  AI驱动
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  多平台职位
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  专业反馈
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  企业级架构
                </span>
              </div>
            </motion.div>
            
            {/* 右侧图形 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="w-full h-80 md:h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">AI面试助手</h3>
                      <p className="text-gray-600 mt-2">企业级面试准备平台</p>
                    </div>
                  </div>
                  
                  {/* 装饰元素 */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-blue-500/20 rounded-lg"></div>
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-purple-500/20 rounded-lg"></div>
                  <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-green-500/20 rounded-full transform -translate-y-1/2"></div>
                  <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-orange-500/20 rounded-full"></div>
                </div>
                
                {/* 浮动卡片 */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-lg shadow-lg p-4 w-48">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">面试通过率</div>
                      <div className="text-lg font-bold text-green-600">+45%</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-5 -right-5 bg-white rounded-lg shadow-lg p-4 w-48">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">职位匹配</div>
                      <div className="text-lg font-bold text-blue-600">15+ 平台</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 shadow-md">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                全方位面试准备解决方案
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                我们提供完整的面试准备工具链，帮助你在求职路上脱颖而出
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-xl mb-4 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <Link 
                    to={feature.title === 'AI模拟面试' ? '/interview' : 
                        feature.title === '题库练习' ? '/practice' :
                        feature.title === '数据分析' ? '/analytics' :
                        feature.title === '个性化建议' ? '/career-planning' :
                        feature.title === '职位搜索' ? '/job-matching' : 
                        '/resume-analysis'}
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    了解更多
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                如何使用AI面试助手
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                简单三步，开启你的面试成功之旅
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '上传简历',
                description: 'AI分析你的简历，识别技能和经验，生成个性化面试计划',
                icon: FileText,
                color: 'bg-blue-500'
              },
              {
                step: '02',
                title: '模拟面试',
                description: 'AI面试官根据你的背景提供真实面试体验，实时评估和反馈',
                icon: MessageCircle,
                color: 'bg-purple-500'
              },
              {
                step: '03',
                title: '职位匹配',
                description: '基于你的技能和表现，智能匹配最适合的职位，直接申请',
                icon: Briefcase,
                color: 'bg-green-500'
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="relative"
                >
                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 h-full">
                    <div className="absolute -top-5 -left-5">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${item.color} rounded-2xl mb-6 shadow-md`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                用户反馈
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                看看其他求职者如何通过AI面试助手提升面试表现
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: '张先生',
                role: '前端工程师',
                company: '某互联网公司',
                testimonial: 'AI面试助手帮我发现了简历中的不足，通过模拟面试练习，我的表现明显提升。最终成功拿到了理想公司的offer！',
                rating: 5
              },
              {
                name: '李女士',
                role: '产品经理',
                company: '某科技公司',
                testimonial: '企业级职位搜索功能太强大了，帮我找到了很多匹配度高的职位。面试准备功能也非常实用，强烈推荐！',
                rating: 5
              },
              {
                name: '王先生',
                role: '数据分析师',
                company: '某金融机构',
                testimonial: '通过AI面试助手的行为面试练习，我学会了如何更好地表达自己的经历和能力。数据分析功能也帮我找到了提升点。',
                rating: 4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.testimonial}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}，{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              准备好开始你的面试之旅了吗？
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              立即开始使用AI智能面试助手，提升你的面试技能
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/interview"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-blue-700 font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl group"
              >
                <Play className="w-5 h-5 mr-2" />
                开始AI面试
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/resume-analysis"
                className="inline-flex items-center px-8 py-4 bg-blue-500/30 hover:bg-blue-500/40 text-white font-medium rounded-xl transition-colors duration-200 border border-white/20"
              >
                <FileText className="w-5 h-5 mr-2" />
                分析我的简历
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

// Star icon component
const Star = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default Home