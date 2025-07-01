import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Video, 
  FileText, 
  Search,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  ThumbsUp,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [expandedFaqs, setExpandedFaqs] = useState([])
  
  // 帮助中心分类
  const categories = [
    { id: 'getting-started', name: '入门指南', icon: Book },
    { id: 'interview', name: '面试功能', icon: MessageCircle },
    { id: 'resume', name: '简历分析', icon: FileText },
    { id: 'job-search', name: '职位搜索', icon: Search },
    { id: 'account', name: '账户管理', icon: HelpCircle }
  ]
  
  // 常见问题数据
  const faqs = {
    'getting-started': [
      {
        id: 'gs-1',
        question: '如何开始使用AI面试助手？',
        answer: '开始使用AI面试助手非常简单！首先，在首页点击"开始AI面试"按钮，系统会引导您完成简单的注册流程。注册后，您可以上传简历进行分析，或直接开始模拟面试练习。我们建议先上传简历，这样系统可以根据您的背景提供更个性化的面试体验。'
      },
      {
        id: 'gs-2',
        question: '系统支持哪些功能？',
        answer: 'AI面试助手提供多种功能帮助您准备面试：\n\n1. **AI模拟面试**：与智能面试官进行真实对话\n2. **题库练习**：海量面试题库，涵盖各行业各岗位\n3. **简历分析**：AI分析简历并提供优化建议\n4. **职位搜索**：多平台聚合的企业级职位搜索\n5. **数据分析**：面试表现分析和改进建议\n6. **职业规划**：个性化职业发展路径'
      },
      {
        id: 'gs-3',
        question: '如何获得最佳使用体验？',
        answer: '为获得最佳体验，我们建议：\n\n1. 使用最新版Chrome、Edge或Firefox浏览器\n2. 确保网络连接稳定\n3. 允许浏览器使用麦克风和摄像头权限（用于视频面试）\n4. 上传完整、最新的简历\n5. 明确设定目标职位\n6. 定期练习并查看分析报告'
      },
      {
        id: 'gs-4',
        question: '系统是如何保护我的数据的？',
        answer: 'AI面试助手高度重视用户数据安全：\n\n1. 所有数据传输采用TLS/SSL加密\n2. 简历和个人信息存储在安全的云服务器\n3. 严格的访问控制和权限管理\n4. 定期安全审计和漏洞扫描\n5. 符合GDPR和相关数据保护法规\n6. 用户可随时删除账户及所有相关数据'
      }
    ],
    'interview': [
      {
        id: 'int-1',
        question: '如何开始AI模拟面试？',
        answer: '开始AI模拟面试的步骤：\n\n1. 在导航菜单中点击"面试练习"\n2. 选择"AI面试"选项\n3. 选择面试类型（技术面、行为面等）\n4. 设置面试时长和难度\n5. 点击"开始面试"按钮\n6. 允许浏览器使用麦克风和摄像头（如需）\n7. 按照AI面试官的提示进行回答'
      },
      {
        id: 'int-2',
        question: 'AI面试评分标准是什么？',
        answer: 'AI面试系统使用多维度评分标准：\n\n1. **内容相关性**（30%）：回答与问题的相关程度\n2. **逻辑结构**（20%）：回答的条理性和逻辑性\n3. **表达清晰度**（15%）：语言表达的清晰度和流畅度\n4. **专业深度**（20%）：专业知识的深度和准确性\n5. **案例支撑**（15%）：是否有具体案例支持观点\n\n系统会根据这些维度给出综合评分和具体改进建议。'
      },
      {
        id: 'int-3',
        question: '如何查看面试历史记录？',
        answer: '查看面试历史记录的方法：\n\n1. 登录您的账户\n2. 在导航菜单中点击"数据分析"\n3. 在分析页面中，您可以看到所有历史面试记录\n4. 点击任意记录查看详细分析报告\n5. 您可以比较不同时间的面试表现，查看进步情况\n\n系统会保存最近30次面试记录，您可以随时查看和复习。'
      },
      {
        id: 'int-4',
        question: '面试过程中遇到技术问题怎么办？',
        answer: '如果在面试过程中遇到技术问题：\n\n1. **麦克风/摄像头问题**：检查浏览器权限设置，确保已允许使用\n2. **语音识别不准确**：尝试在安静环境中清晰发音，或切换到文字输入模式\n3. **页面卡顿**：刷新页面或清除浏览器缓存\n4. **连接中断**：系统会自动保存进度，重新连接后可继续\n\n如问题持续，请点击页面右下角的"帮助"按钮联系客服。'
      }
    ],
    'resume': [
      {
        id: 'res-1',
        question: '如何上传简历进行分析？',
        answer: '上传简历进行分析的步骤：\n\n1. 在导航菜单中点击"简历分析"\n2. 在上传页面，输入您的目标职位\n3. 点击上传区域或拖拽文件到指定区域\n4. 选择您的简历文件（支持PDF、DOC、DOCX、TXT格式）\n5. 等待系统分析（通常需要10-30秒）\n6. 查看分析结果和优化建议'
      },
      {
        id: 'res-2',
        question: '简历分析支持哪些文件格式？',
        answer: '我们的企业级简历分析系统支持以下文件格式：\n\n1. **PDF**（推荐，保留最完整的格式）\n2. **DOC/DOCX**（Microsoft Word文档）\n3. **TXT**（纯文本文件）\n\n为获得最佳分析效果，我们建议使用PDF格式，并确保文件大小不超过10MB。如果您的简历包含特殊字体或复杂排版，PDF格式能最大程度保留原始格式。'
      },
      {
        id: 'res-3',
        question: '简历分析的技术原理是什么？',
        answer: '我们的简历分析系统采用先进的AI技术：\n\n1. **文档解析**：使用专业解析引擎提取不同格式文件的文本内容\n2. **自然语言处理(NLP)**：分析文本结构，识别关键信息\n3. **命名实体识别**：提取姓名、教育、工作经历等关键信息\n4. **技能匹配算法**：将简历中的技能与目标职位要求进行匹配\n5. **机器学习模型**：基于大量真实简历和招聘数据训练的模型\n6. **行业知识图谱**：理解不同行业的专业术语和技能关联\n\n系统会持续学习和优化，提供越来越精准的分析结果。'
      },
      {
        id: 'res-4',
        question: '如何根据分析结果优化简历？',
        answer: '根据分析结果优化简历的建议：\n\n1. **关注匹配分数**：重点优化匹配度较低的部分\n2. **技能调整**：突出与目标职位高度相关的技能，弱化不相关技能\n3. **关键词优化**：在简历中自然融入分析结果中推荐的关键词\n4. **结构改进**：按照建议调整简历结构，使重要信息更突出\n5. **量化成就**：添加具体数据和成果，增强说服力\n6. **针对性修改**：为不同职位准备不同版本的简历\n\n完成修改后，可以再次上传分析，直到达到满意的匹配度。'
      }
    ],
    'job-search': [
      {
        id: 'job-1',
        question: '如何使用企业级职位搜索功能？',
        answer: '使用企业级职位搜索功能的步骤：\n\n1. 在导航菜单中点击"职位匹配"\n2. 在搜索框中输入关键词（如职位名称、技能、公司名）\n3. 可选择地点、薪资范围等筛选条件\n4. 点击"搜索"按钮或按Enter键\n5. 浏览搜索结果，查看职位详情\n6. 使用"智能匹配"模式可获得基于您简历的个性化推荐\n\n系统会实时从多个平台聚合最新职位信息，确保数据全面性。'
      },
      {
        id: 'job-2',
        question: '职位数据来源于哪些平台？',
        answer: '我们的企业级职位搜索系统整合了多个平台的数据：\n\n1. **JobSpy**：覆盖LinkedIn、Indeed、Glassdoor等6+平台\n2. **LinkedIn Jobs API**：直接集成LinkedIn官方数据\n3. **JobApis**：支持Monster、ZipRecruiter、Craigslist等5+平台\n4. **Adzuna**：国际职位平台\n\n系统使用智能去重和数据标准化技术，确保搜索结果准确无重复。所有数据每15分钟更新一次，保证信息时效性。'
      },
      {
        id: 'job-3',
        question: '什么是智能匹配算法？',
        answer: '智能匹配算法是我们的核心技术，它通过8个维度分析您的简历与职位的匹配度：\n\n1. **技能匹配**（35%）：技术技能与职位要求的匹配程度\n2. **经验匹配**（20%）：工作年限与职位要求的匹配度\n3. **地点匹配**（15%）：地理位置偏好的匹配程度\n4. **薪资匹配**（10%）：期望薪资与职位薪资的匹配度\n5. **公司匹配**（8%）：公司规模和类型的匹配度\n6. **行业匹配**（7%）：行业背景的相符度\n7. **文化匹配**（3%）：工作方式偏好的匹配度\n8. **职业发展**（2%）：职业目标的一致性\n\n算法会生成一个0-100的匹配分数，并提供具体的匹配理由和改进建议。'
      },
      {
        id: 'job-4',
        question: '如何提高职位匹配度？',
        answer: '提高职位匹配度的有效方法：\n\n1. **完善简历**：确保简历包含完整的技能、经验和教育信息\n2. **技能关键词**：在简历中使用与目标职位相关的技术关键词\n3. **设置偏好**：在个人中心完善地点、薪资等偏好设置\n4. **针对性调整**：根据特定职位要求调整简历内容\n5. **学习推荐技能**：关注系统推荐的需要提升的技能\n6. **扩展搜索范围**：适当放宽地点、薪资等筛选条件\n7. **定期更新**：保持简历和技能信息的及时更新\n\n系统会根据您的操作和反馈不断优化匹配算法，提供越来越精准的推荐。'
      }
    ],
    'account': [
      {
        id: 'acc-1',
        question: '如何修改个人信息？',
        answer: '修改个人信息的步骤：\n\n1. 点击右上角的用户头像\n2. 在下拉菜单中选择"个人中心"\n3. 在左侧菜单中选择"个人信息"\n4. 点击相应信息旁的"编辑"按钮\n5. 修改完成后点击"保存"\n\n您可以修改的信息包括：姓名、头像、联系方式、地址、职业信息等。某些核心信息（如注册邮箱）可能需要额外验证。'
      },
      {
        id: 'acc-2',
        question: '如何管理隐私设置？',
        answer: '管理隐私设置的方法：\n\n1. 点击右上角的用户头像\n2. 在下拉菜单中选择"个人中心"\n3. 在左侧菜单中选择"隐私"\n4. 在隐私设置页面，您可以：\n   - 控制个人资料的可见性\n   - 管理数据收集和使用权限\n   - 设置第三方应用访问权限\n   - 查看和管理登录设备\n   - 下载或删除您的数据\n\n我们建议定期检查隐私设置，确保它符合您的偏好。'
      },
      {
        id: 'acc-3',
        question: '如何更改密码或重置密码？',
        answer: '更改密码的步骤：\n\n1. 点击右上角的用户头像\n2. 在下拉菜单中选择"个人中心"\n3. 在左侧菜单中选择"设置"\n4. 点击"更改密码"\n5. 输入当前密码和新密码\n6. 点击"保存"\n\n如果忘记密码需要重置：\n1. 在登录页面点击"忘记密码"\n2. 输入注册邮箱\n3. 按照邮件中的指引重置密码\n\n为安全起见，建议使用强密码并定期更换。'
      },
      {
        id: 'acc-4',
        question: '如何删除账户？',
        answer: '删除账户的步骤：\n\n1. 点击右上角的用户头像\n2. 在下拉菜单中选择"个人中心"\n3. 在左侧菜单中选择"设置"\n4. 滚动到页面底部，点击"删除账户"\n5. 阅读并确认删除账户的影响\n6. 输入密码确认\n7. 点击"永久删除账户"\n\n**请注意**：\n- 账户删除是不可逆的操作\n- 所有数据（包括面试记录、简历分析等）将被永久删除\n- 删除过程可能需要14天完成\n- 删除期间您可以通过登录取消删除请求'
      }
    ]
  }
  
  // 处理FAQ展开/收起
  const toggleFaq = (faqId) => {
    if (expandedFaqs.includes(faqId)) {
      setExpandedFaqs(expandedFaqs.filter(id => id !== faqId))
    } else {
      setExpandedFaqs([...expandedFaqs, faqId])
    }
  }
  
  // 搜索过滤FAQ
  const filteredFaqs = searchQuery
    ? Object.values(faqs).flat().filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[activeCategory]
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            帮助中心
          </h1>
          <p className="text-gray-600">
            获取AI面试助手的使用指南和常见问题解答
          </p>
        </div>
        
        {/* 搜索框 */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索帮助文档和常见问题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>
        </div>
        
        {/* 主体内容 */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左侧分类导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">帮助分类</h3>
              <nav className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id)
                        setSearchQuery('')
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeCategory === category.id && !searchQuery
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  )
                })}
              </nav>
              
              {/* 联系支持 */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">需要更多帮助？</h4>
                <div className="space-y-3">
                  <a href="mailto:support@example.com" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600">
                    <Mail className="w-4 h-4" />
                    <span>发送邮件</span>
                  </a>
                  <a href="tel:+1234567890" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600">
                    <Phone className="w-4 h-4" />
                    <span>电话支持</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>在线客服</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧内容 */}
          <div className="lg:col-span-3">
            {/* 搜索结果提示 */}
            {searchQuery && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">
                      "{searchQuery}" 的搜索结果 ({filteredFaqs.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    清除搜索
                  </button>
                </div>
              </div>
            )}
            
            {/* 分类标题 */}
            {!searchQuery && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h2>
                <p className="text-gray-600">
                  {activeCategory === 'getting-started' && '了解如何开始使用AI面试助手，快速上手各项功能'}
                  {activeCategory === 'interview' && '关于AI模拟面试功能的详细指南和常见问题'}
                  {activeCategory === 'resume' && '简历分析功能的使用方法和技巧'}
                  {activeCategory === 'job-search' && '如何使用企业级职位搜索功能找到理想工作'}
                  {activeCategory === 'account' && '账户管理、隐私设置和安全相关的帮助'}
                </p>
              </div>
            )}
            
            {/* FAQ列表 */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      {expandedFaqs.includes(faq.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedFaqs.includes(faq.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="px-5 pb-5 bg-gray-50"
                      >
                        <div className="prose prose-sm max-w-none">
                          {faq.answer.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                        
                        {/* 反馈按钮 */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            这条回答对您有帮助吗？
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button className="text-sm text-gray-500 hover:text-blue-600">
                              报告问题
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关帮助内容</h3>
                  <p className="text-gray-600 mb-4">
                    尝试使用不同的搜索词，或浏览其他分类
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    查看所有帮助
                  </button>
                </div>
              )}
            </div>
            
            {/* 视频教程 */}
            {!searchQuery && activeCategory === 'getting-started' && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2 text-blue-600" />
                  视频教程
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: '新手入门指南',
                      duration: '5:24',
                      thumbnail: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=600',
                      views: '2.5k'
                    },
                    {
                      title: '如何进行AI模拟面试',
                      duration: '8:12',
                      thumbnail: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=600',
                      views: '1.8k'
                    },
                    {
                      title: '简历优化技巧',
                      duration: '6:45',
                      thumbnail: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=600',
                      views: '3.2k'
                    },
                    {
                      title: '企业级职位搜索功能详解',
                      duration: '7:30',
                      thumbnail: 'https://images.pexels.com/photos/8867265/pexels-photo-8867265.jpeg?auto=compress&cs=tinysrgb&w=600',
                      views: '1.5k'
                    }
                  ].map((video, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Video className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-1">{video.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{video.views} 次观看</span>
                          <span className="mx-2">•</span>
                          <span>2024-06-15</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 相关文档 */}
            {!searchQuery && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  相关文档
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: '用户手册',
                      description: '详细的功能使用说明和最佳实践',
                      icon: Book
                    },
                    {
                      title: '隐私政策',
                      description: '了解我们如何保护您的数据和隐私',
                      icon: HelpCircle
                    },
                    {
                      title: '服务条款',
                      description: '使用AI面试助手的条款和条件',
                      icon: FileText
                    }
                  ].map((doc, index) => {
                    const Icon = doc.icon
                    return (
                      <a 
                        key={index}
                        href="#"
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-start space-x-3"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                            {doc.title}
                            <ExternalLink className="w-3 h-3 ml-1 text-gray-400" />
                          </h4>
                          <p className="text-sm text-gray-600">{doc.description}</p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* 常见问题快速链接 */}
            {!searchQuery && activeCategory === 'getting-started' && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">常见问题快速链接</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { question: '如何开始AI模拟面试？', category: 'interview', id: 'int-1' },
                    { question: '如何上传简历进行分析？', category: 'resume', id: 'res-1' },
                    { question: '如何使用企业级职位搜索功能？', category: 'job-search', id: 'job-1' },
                    { question: '如何修改个人信息？', category: 'account', id: 'acc-1' }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveCategory(item.category)
                        setExpandedFaqs([...expandedFaqs, item.id])
                      }}
                      className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{item.question}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 用户反馈 */}
            {!searchQuery && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                  帮助我们改进
                </h3>
                <p className="text-gray-600 mb-4">
                  没有找到您需要的答案？请告诉我们您的问题或建议，我们会尽快回复。
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="输入您的问题或建议..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                    提交反馈
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Help