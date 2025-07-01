import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  Database, 
  Server, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Download
} from 'lucide-react'

const Privacy = () => {
  const [activeTab, setActiveTab] = useState('privacy-settings')
  const [expandedSections, setExpandedSections] = useState(['data-collection', 'account-privacy'])
  
  const toggleSection = (section) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section))
    } else {
      setExpandedSections([...expandedSections, section])
    }
  }
  
  const privacySettings = [
    {
      id: 'data-collection',
      title: '数据收集与使用',
      description: '控制我们如何收集和使用您的数据',
      icon: Database,
      settings: [
        {
          id: 'usage-data',
          title: '使用数据',
          description: '允许收集使用数据以改进服务',
          enabled: true
        },
        {
          id: 'analytics',
          title: '分析数据',
          description: '允许收集匿名分析数据',
          enabled: true
        },
        {
          id: 'personalization',
          title: '个性化推荐',
          description: '基于您的活动提供个性化内容',
          enabled: true
        },
        {
          id: 'third-party',
          title: '第三方数据共享',
          description: '与合作伙伴共享数据以提供相关服务',
          enabled: false
        }
      ]
    },
    {
      id: 'account-privacy',
      title: '账户隐私',
      description: '管理您的账户隐私设置',
      icon: Lock,
      settings: [
        {
          id: 'profile-visibility',
          title: '个人资料可见性',
          description: '控制谁可以查看您的个人资料',
          options: ['所有人', '仅注册用户', '仅自己'],
          selected: '仅注册用户'
        },
        {
          id: 'resume-visibility',
          title: '简历可见性',
          description: '控制谁可以查看您的简历',
          options: ['所有人', '仅注册用户', '仅自己'],
          selected: '仅自己'
        },
        {
          id: 'search-indexing',
          title: '搜索引擎索引',
          description: '允许搜索引擎索引您的个人资料',
          enabled: false
        }
      ]
    },
    {
      id: 'communication',
      title: '通信偏好',
      description: '管理我们如何与您联系',
      icon: Globe,
      settings: [
        {
          id: 'email-notifications',
          title: '电子邮件通知',
          description: '接收有关账户活动的电子邮件',
          enabled: true
        },
        {
          id: 'marketing-emails',
          title: '营销邮件',
          description: '接收有关新功能和优惠的邮件',
          enabled: false
        },
        {
          id: 'push-notifications',
          title: '推送通知',
          description: '接收移动设备推送通知',
          enabled: true
        }
      ]
    },
    {
      id: 'security',
      title: '安全设置',
      description: '增强您账户的安全性',
      icon: Shield,
      settings: [
        {
          id: 'two-factor',
          title: '两步验证',
          description: '使用额外的验证步骤保护您的账户',
          enabled: false
        },
        {
          id: 'login-alerts',
          title: '登录提醒',
          description: '当检测到新设备登录时收到提醒',
          enabled: true
        },
        {
          id: 'session-management',
          title: '会话管理',
          description: '查看和管理活动会话',
          action: '管理会话'
        }
      ]
    },
    {
      id: 'data-export',
      title: '数据导出与删除',
      description: '导出或删除您的数据',
      icon: Download,
      settings: [
        {
          id: 'export-data',
          title: '导出数据',
          description: '下载您的个人数据副本',
          action: '导出数据'
        },
        {
          id: 'delete-data',
          title: '删除数据',
          description: '永久删除您的账户和所有相关数据',
          action: '删除数据',
          warning: true
        }
      ]
    }
  ]
  
  const privacyPolicy = {
    lastUpdated: '2024年6月15日',
    sections: [
      {
        title: '数据收集',
        content: '我们收集的信息包括：\n\n- **账户信息**：注册时提供的姓名、电子邮件、密码等\n- **简历数据**：您上传的简历内容\n- **使用数据**：您如何使用我们的服务，包括面试记录、搜索历史等\n- **设备信息**：IP地址、浏览器类型、操作系统等\n\n我们通过以下方式收集信息：\n\n1. 您直接提供的信息\n2. 自动收集的使用数据\n3. Cookie和类似技术\n4. 第三方服务提供商'
      },
      {
        title: '数据使用',
        content: '我们使用收集的信息用于：\n\n- 提供、维护和改进我们的服务\n- 个性化您的体验\n- 与您沟通\n- 开发新功能和服务\n- 保护我们的用户和服务\n- 遵守法律义务\n\n我们不会将您的个人信息出售给第三方。'
      },
      {
        title: '数据共享',
        content: '在以下情况下，我们可能会共享您的信息：\n\n- **服务提供商**：帮助我们提供服务的第三方（如云存储提供商）\n- **合规与法律要求**：应法律要求或保护我们的权利\n- **业务转让**：如果我们参与合并、收购或资产出售\n- **征得同意后**：在获得您的明确同意后\n\n所有数据共享都遵循严格的安全和隐私保护措施。'
      },
      {
        title: '数据安全',
        content: '我们采取多种安全措施保护您的数据：\n\n- 使用加密技术保护数据传输和存储\n- 实施访问控制限制数据访问\n- 定期安全审计和漏洞扫描\n- 员工安全培训和保密协议\n- 数据备份和灾难恢复计划\n\n尽管我们努力保护您的数据，但没有任何互联网传输或电子存储方法是100%安全的。'
      },
      {
        title: '您的权利',
        content: '根据适用的数据保护法律，您拥有以下权利：\n\n- **访问权**：获取我们持有的关于您的个人数据副本\n- **更正权**：更正不准确的个人数据\n- **删除权**：在特定情况下要求删除您的个人数据\n- **限制处理权**：在特定情况下限制我们处理您的数据\n- **数据可携权**：以结构化、常用和机器可读的格式接收您的数据\n- **反对权**：反对我们处理您的个人数据\n\n要行使这些权利，请通过privacy@example.com联系我们。'
      },
      {
        title: 'Cookie政策',
        content: '我们使用Cookie和类似技术来：\n\n- 保持您的登录状态\n- 记住您的偏好设置\n- 了解您如何使用我们的服务\n- 改进用户体验\n- 提供个性化内容\n\n您可以通过浏览器设置控制Cookie。但请注意，禁用Cookie可能会影响某些功能的可用性。'
      },
      {
        title: '儿童隐私',
        content: '我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果您是父母或监护人，并相信我们可能收集了您孩子的信息，请联系我们，我们将采取措施删除这些信息。'
      },
      {
        title: '国际数据传输',
        content: '我们可能在全球范围内处理、存储和传输您的信息。这意味着您的信息可能被传输到、存储在或访问自您所在国家/地区以外的国家/地区，这些国家/地区的数据保护法律可能与您所在国家/地区的法律不同。\n\n在这种情况下，我们将采取适当的保障措施确保您的数据得到充分保护。'
      },
      {
        title: '政策变更',
        content: '我们可能会不时更新本隐私政策。当我们进行重大更改时，我们将通过在我们的网站上发布新的隐私政策或通过其他通信渠道通知您。\n\n我们鼓励您定期查看本页面以了解最新信息。'
      },
      {
        title: '联系我们',
        content: '如果您对本隐私政策有任何疑问或顾虑，请联系我们：\n\n- 电子邮件：privacy@example.com\n- 邮寄地址：隐私团队，XX市XX区XX路XX号\n- 电话：+86 XXX XXXX XXXX\n\n我们将在收到您的请求后30天内回复。'
      }
    ]
  }
  
  const renderSettings = () => (
    <div className="space-y-8">
      {privacySettings.map((section) => {
        const Icon = section.icon
        const isExpanded = expandedSections.includes(section.id)
        
        return (
          <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-5 pb-5 border-t border-gray-100"
              >
                <div className="space-y-4 pt-4">
                  {section.settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{setting.title}</div>
                        <div className="text-sm text-gray-500">{setting.description}</div>
                      </div>
                      
                      {setting.enabled !== undefined && (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={setting.enabled}
                            onChange={() => {}}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                      
                      {setting.options && (
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                          {setting.options.map((option) => (
                            <option 
                              key={option} 
                              value={option}
                              selected={option === setting.selected}
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {setting.action && (
                        <button 
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            setting.warning 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          } transition-colors`}
                        >
                          {setting.action}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )
      })}
      
      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
          保存设置
        </button>
      </div>
    </div>
  )
  
  const renderPolicy = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Info className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">隐私政策</h3>
            <p className="text-gray-600 text-sm">
              最后更新时间：{privacyPolicy.lastUpdated}
            </p>
            <p className="text-gray-600 mt-2">
              本隐私政策说明了我们如何收集、使用、披露、传输和存储您的个人信息。请仔细阅读以了解我们的隐私实践。
            </p>
          </div>
        </div>
      </div>
      
      {/* 政策内容 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {privacyPolicy.sections.map((section, index) => (
            <div key={index} className="pb-6 border-b border-gray-100 last:border-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
              <div className="prose prose-sm max-w-none">
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 下载按钮 */}
      <div className="flex justify-center">
        <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>下载隐私政策PDF</span>
        </button>
      </div>
    </div>
  )
  
  const renderDevices = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">登录设备</h3>
        <div className="space-y-4">
          {[
            {
              device: 'Windows PC',
              browser: 'Chrome 114.0.5735',
              ip: '192.168.1.xxx',
              location: '北京',
              lastActive: '当前活动',
              current: true
            },
            {
              device: 'iPhone 13',
              browser: 'Safari Mobile 15.4',
              ip: '172.16.254.xxx',
              location: '上海',
              lastActive: '2天前'
            },
            {
              device: 'MacBook Pro',
              browser: 'Firefox 102.0',
              ip: '10.0.0.xxx',
              location: '广州',
              lastActive: '1周前'
            }
          ].map((session, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                session.current ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center">
                      {session.device}
                      {session.current && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          当前设备
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {session.browser}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div>IP: {session.ip}</div>
                      <div>位置: {session.location}</div>
                      <div>最后活动: {session.lastActive}</div>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors">
                    注销
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 安全提示 */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">安全提示</h3>
            <p className="text-gray-700 mb-3">
              如果您发现任何可疑活动，请立即更改密码并联系我们的支持团队。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>定期更改密码</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>启用两步验证</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>不要在公共设备上保持登录状态</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            隐私与安全
          </h1>
          <p className="text-gray-600">
            管理您的隐私设置和了解我们如何保护您的数据
          </p>
        </div>
        
        {/* 标签页 */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'privacy-settings', name: '隐私设置', icon: Lock },
                { id: 'privacy-policy', name: '隐私政策', icon: FileText },
                { id: 'devices', name: '登录设备', icon: Smartphone }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'privacy-settings' && renderSettings()}
            {activeTab === 'privacy-policy' && renderPolicy()}
            {activeTab === 'devices' && renderDevices()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Privacy