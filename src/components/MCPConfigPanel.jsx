import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Download, 
  Settings, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Code,
  Zap,
  Brain,
  X,
  Copy,
  Eye
} from 'lucide-react'
import { mcpManager } from '../utils/mcpProtocol'
import toast from 'react-hot-toast'

const MCPConfigPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('import')
  const [configText, setConfigText] = useState('')
  const [isValidConfig, setIsValidConfig] = useState(null)
  const [mcpStatus, setMcpStatus] = useState(null)
  const fileInputRef = useRef(null)

  React.useEffect(() => {
    if (isOpen) {
      const status = mcpManager.getStatus()
      setMcpStatus(status)
    }
  }, [isOpen])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target.result
        const config = JSON.parse(content)
        setConfigText(JSON.stringify(config, null, 2))
        validateConfig(config)
      } catch (error) {
        toast.error('无效的JSON文件')
        setIsValidConfig(false)
      }
    }
    reader.readAsText(file)
  }

  const validateConfig = (config) => {
    try {
      const isValid = mcpManager.validateMCPConfig(config)
      setIsValidConfig(isValid)
      return isValid
    } catch (error) {
      setIsValidConfig(false)
      return false
    }
  }

  const handleConfigChange = (value) => {
    setConfigText(value)
    try {
      const config = JSON.parse(value)
      validateConfig(config)
    } catch (error) {
      setIsValidConfig(false)
    }
  }

  const handleImport = async () => {
    try {
      const config = JSON.parse(configText)
      if (!validateConfig(config)) {
        toast.error('配置格式无效')
        return
      }

      await mcpManager.importJSONConfig(config)
      toast.success('MCP配置导入成功！')
      
      // 更新状态
      const status = mcpManager.getStatus()
      setMcpStatus(status)
      
      onClose()
    } catch (error) {
      toast.error('导入失败: ' + error.message)
    }
  }

  const handleExport = () => {
    try {
      const sampleConfig = mcpManager.generateSampleConfig()
      const blob = new Blob([JSON.stringify(sampleConfig, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mcp-config.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('配置文件已导出')
    } catch (error) {
      toast.error('导出失败: ' + error.message)
    }
  }

  const generateSampleConfig = () => {
    const sampleConfig = mcpManager.generateSampleConfig()
    setConfigText(JSON.stringify(sampleConfig, null, 2))
    setIsValidConfig(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(configText)
    toast.success('已复制到剪贴板')
  }

  const tabs = [
    { id: 'import', name: '导入配置', icon: Upload },
    { id: 'status', name: '系统状态', icon: Settings },
    { id: 'export', name: '导出配置', icon: Download }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">MCP协议配置</h2>
                  <p className="text-sm text-gray-600">Model Context Protocol 管理中心</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 标签页 */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
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

            {/* 内容区域 */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'import' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">导入MCP配置</h3>
                    
                    {/* 文件上传 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        上传JSON配置文件
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>选择文件</span>
                        </button>
                        <button
                          onClick={generateSampleConfig}
                          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Code className="w-4 h-4" />
                          <span>生成示例</span>
                        </button>
                      </div>
                    </div>

                    {/* 配置编辑器 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          JSON配置内容
                        </label>
                        <div className="flex items-center space-x-2">
                          {isValidConfig !== null && (
                            <div className={`flex items-center space-x-1 text-sm ${
                              isValidConfig ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isValidConfig ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <AlertCircle className="w-4 h-4" />
                              )}
                              <span>{isValidConfig ? '配置有效' : '配置无效'}</span>
                            </div>
                          )}
                          <button
                            onClick={copyToClipboard}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="复制到剪贴板"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={configText}
                        onChange={(e) => handleConfigChange(e.target.value)}
                        placeholder="请输入或粘贴MCP配置JSON..."
                        className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      />
                    </div>

                    {/* 配置说明 */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">配置说明</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>mcpServers</strong>: MCP服务器配置</li>
                        <li>• <strong>tools</strong>: 可用工具定义</li>
                        <li>• <strong>resources</strong>: 资源配置</li>
                        <li>• <strong>prompts</strong>: 提示模板</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'status' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">系统状态</h3>
                    
                    {mcpStatus && (
                      <div className="space-y-4">
                        {/* 总体状态 */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-3 h-3 rounded-full ${
                              mcpStatus.initialized ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="font-medium">
                              {mcpStatus.initialized ? '系统已初始化' : '系统未初始化'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">服务器</div>
                              <div className="font-semibold">{mcpStatus.servers}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">工具</div>
                              <div className="font-semibold">{mcpStatus.tools}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">资源</div>
                              <div className="font-semibold">{mcpStatus.resources}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">提示</div>
                              <div className="font-semibold">{mcpStatus.prompts}</div>
                            </div>
                          </div>
                        </div>

                        {/* 详细列表 */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">已注册工具</h4>
                            <div className="space-y-2">
                              {mcpStatus.toolList.map(tool => (
                                <div key={tool} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                                  <Zap className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium">{tool}</span>
                                </div>
                              ))}
                              {mcpStatus.toolList.length === 0 && (
                                <div className="text-sm text-gray-500">暂无已注册工具</div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">提示模板</h4>
                            <div className="space-y-2">
                              {mcpStatus.promptList.map(prompt => (
                                <div key={prompt} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium">{prompt}</span>
                                </div>
                              ))}
                              {mcpStatus.promptList.length === 0 && (
                                <div className="text-sm text-gray-500">暂无提示模板</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'export' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">导出配置</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">导出说明</h4>
                        <p className="text-sm text-yellow-800">
                          导出的配置文件包含示例MCP服务器、工具、资源和提示模板配置。
                          您可以基于此模板创建自己的MCP配置。
                        </p>
                      </div>

                      <button
                        onClick={handleExport}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>导出示例配置</span>
                      </button>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">配置文件结构</h4>
                        <pre className="text-sm text-gray-600 overflow-x-auto">
{`{
  "mcpServers": {
    "server_name": {
      "command": "npx",
      "args": ["package", "arg1"],
      "env": {}
    }
  },
  "tools": {
    "tool_name": {
      "description": "工具描述",
      "inputSchema": { ... }
    }
  },
  "resources": {
    "resource_name": {
      "uri": "资源URI",
      "type": "file|api|database"
    }
  },
  "prompts": {
    "prompt_name": {
      "template": "提示模板",
      "variables": ["var1", "var2"]
    }
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-500">
                MCP协议版本: 1.0.0
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                {activeTab === 'import' && (
                  <button
                    onClick={handleImport}
                    disabled={!isValidConfig}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                  >
                    导入配置
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default MCPConfigPanel