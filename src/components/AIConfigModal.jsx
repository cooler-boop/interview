import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Check, AlertCircle, Eye, EyeOff, Search, Filter, Cloud, HardDrive, Zap, Globe } from 'lucide-react'
import useAIConfigStore from '../store/aiConfigStore'
import toast from 'react-hot-toast'

const AIConfigModal = ({ isOpen, onClose }) => {
  const {
    getProviders,
    activeProvider,
    setActiveProvider,
    getProviderConfig,
    updateProviderConfig,
    testConnection,
    getModelStats,
    searchModels
  } = useAIConfigStore()
  
  const [selectedProvider, setSelectedProvider] = useState(activeProvider)
  const [config, setConfig] = useState(() => getProviderConfig(activeProvider))
  const [testing, setTesting] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const providers = getProviders()
  const modelStats = getModelStats()
  
  // 过滤提供商
  const filteredProviders = useMemo(() => {
    const providerEntries = Object.entries(providers)
    
    let filtered = providerEntries
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(([, provider]) => provider.category === categoryFilter)
    }
    
    if (searchQuery) {
      filtered = filtered.filter(([, provider]) => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.models.some(model => model.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    return filtered
  }, [providers, searchQuery, categoryFilter])
  
  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId)
    setConfig(getProviderConfig(providerId))
  }
  
  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }
  
  const handleTest = async () => {
    setTesting(true)
    try {
      await testConnection(selectedProvider)
      toast.success('连接测试成功！')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setTesting(false)
    }
  }
  
  const handleSave = () => {
    updateProviderConfig(selectedProvider, config)
    setActiveProvider(selectedProvider)
    toast.success('配置已保存')
    onClose()
  }
  
  const maskApiKey = (key) => {
    if (!key) return ''
    if (key.length <= 8) return '*'.repeat(key.length)
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4)
  }
  
  const getCategoryIcon = (category) => {
    return category === '云端' ? <Cloud className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />
  }
  
  const getCategoryColor = (category) => {
    return category === '云端' ? 'text-blue-600' : 'text-green-600'
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">AI模型配置中心</h2>
                  <p className="text-sm text-gray-600">
                    支持 {modelStats.totalProviders} 个提供商，{modelStats.totalModels} 个模型
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 统计信息 */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{modelStats.cloudProviders}</div>
                  <div className="text-sm text-gray-600">云端提供商</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{modelStats.localProviders}</div>
                  <div className="text-sm text-gray-600">本地提供商</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{modelStats.cloudModels}</div>
                  <div className="text-sm text-gray-600">云端模型</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{modelStats.localModels}</div>
                  <div className="text-sm text-gray-600">本地模型</div>
                </div>
              </div>
            </div>
            
            <div className="flex h-[600px]">
              {/* 提供商列表 */}
              <div className="w-1/3 border-r bg-gray-50 flex flex-col">
                {/* 搜索和筛选 */}
                <div className="p-4 border-b bg-white">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="搜索提供商或模型..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          categoryFilter === 'all'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        全部
                      </button>
                      <button
                        onClick={() => setCategoryFilter('云端')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
                          categoryFilter === '云端'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Cloud className="w-3 h-3" />
                        <span>云端</span>
                      </button>
                      <button
                        onClick={() => setCategoryFilter('本地')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1 ${
                          categoryFilter === '本地'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <HardDrive className="w-3 h-3" />
                        <span>本地</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 提供商列表 */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {filteredProviders.map(([id, provider]) => (
                      <button
                        key={id}
                        onClick={() => handleProviderChange(id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          selectedProvider === id
                            ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                            : 'bg-white hover:bg-gray-100 border border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{provider.name}</div>
                          <div className={`flex items-center space-x-1 ${getCategoryColor(provider.category)}`}>
                            {getCategoryIcon(provider.category)}
                            <span className="text-xs">{provider.category}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {provider.models.length} 个模型
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {provider.models.slice(0, 3).map((model, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {model.length > 15 ? model.slice(0, 15) + '...' : model}
                            </span>
                          ))}
                          {provider.models.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{provider.models.length - 3}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 配置表单 */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                        <span>{providers[selectedProvider]?.name} 配置</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          providers[selectedProvider]?.category === '云端'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {providers[selectedProvider]?.category}
                        </span>
                      </h3>
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {showAdvanced ? '隐藏高级选项' : '显示高级选项'}
                      </button>
                    </div>
                  </div>
                  
                  {/* 基础配置 */}
                  <div className="space-y-4">
                    {/* API密钥 */}
                    {providers[selectedProvider]?.category === '云端' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API密钥 *
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey ? 'text' : 'password'}
                            value={config.apiKey}
                            onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                            placeholder="请输入API密钥"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {config.apiKey && !showApiKey && (
                          <div className="mt-1 text-sm text-gray-500">
                            当前密钥: {maskApiKey(config.apiKey)}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Base URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base URL
                      </label>
                      <input
                        type="text"
                        value={config.baseUrl}
                        onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                        placeholder="API基础URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    {/* 模型选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        预设模型
                      </label>
                      <select
                        value={config.model}
                        onChange={(e) => handleConfigChange('model', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">选择模型</option>
                        {providers[selectedProvider]?.models.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* 自定义模型 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        自定义模型ID
                      </label>
                      <input
                        type="text"
                        value={config.customModel}
                        onChange={(e) => handleConfigChange('customModel', e.target.value)}
                        placeholder="如果使用自定义模型，请输入模型ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="mt-1 text-sm text-gray-500">
                        自定义模型ID会覆盖预设模型选择
                      </div>
                    </div>
                  </div>
                  
                  {/* 高级配置 */}
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 border-t pt-4"
                    >
                      <h4 className="font-medium text-gray-900">高级参数</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            最大Token数
                          </label>
                          <input
                            type="number"
                            value={config.maxTokens}
                            onChange={(e) => handleConfigChange('maxTokens', e.target.value)}
                            placeholder="2048"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Temperature (0-2)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="2"
                            value={config.temperature}
                            onChange={(e) => handleConfigChange('temperature', e.target.value)}
                            placeholder="0.7"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Top P (0-1)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={config.topP}
                            onChange={(e) => handleConfigChange('topP', e.target.value)}
                            placeholder="1.0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency Penalty
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="-2"
                            max="2"
                            value={config.frequencyPenalty}
                            onChange={(e) => handleConfigChange('frequencyPenalty', e.target.value)}
                            placeholder="0.0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* 测试连接 */}
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <button
                      onClick={handleTest}
                      disabled={testing || (providers[selectedProvider]?.category === '云端' && !config.apiKey)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {testing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          <span>测试中...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>测试连接</span>
                        </>
                      )}
                    </button>
                    {testing && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>正在验证配置...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 底部操作栏 */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-500">
                当前选择: {providers[selectedProvider]?.name} ({providers[selectedProvider]?.models.length} 个模型)
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  保存配置
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AIConfigModal