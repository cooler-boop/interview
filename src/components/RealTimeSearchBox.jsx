import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Filter,
  Loader
} from 'lucide-react'
import { realTimeSearchEngine } from '../utils/realTimeSearch'

const RealTimeSearchBox = ({ 
  onSearch, 
  onSuggestionSelect,
  placeholder = "实时搜索职位、公司、技能...",
  showFilters = true,
  autoFocus = false,
  className = ""
}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searchHistory, setSearchHistory] = useState([])
  const [popularQueries, setPopularQueries] = useState([])
  const [searchStats, setSearchStats] = useState(null)
  
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const searchCancelRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // 初始化搜索引擎
  useEffect(() => {
    const initializeSearch = async () => {
      await realTimeSearchEngine.initialize()
      
      // 获取热门搜索
      const popular = realTimeSearchEngine.getPopularSuggestions()
      setPopularQueries(popular)
      
      // 获取搜索统计
      const stats = realTimeSearchEngine.getAnalytics()
      setSearchStats(stats)
    }
    
    initializeSearch()
  }, [])

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // 实时搜索
  const performRealTimeSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    
    try {
      // 取消之前的搜索
      if (searchCancelRef.current) {
        searchCancelRef.current()
      }

      // 开始新的搜索
      searchCancelRef.current = realTimeSearchEngine.searchWithSuggestions(
        searchQuery,
        (result) => {
          if (result.error) {
            console.error('Search error:', result.error)
            setSuggestions([])
          } else {
            // 合并搜索建议和结果
            const allSuggestions = [
              ...result.suggestions.map(s => ({ type: 'suggestion', text: s })),
              ...result.results.slice(0, 3).map(r => ({ 
                type: 'result', 
                text: r.title, 
                subtitle: r.company,
                data: r 
              }))
            ]
            
            setSuggestions(allSuggestions)
            setShowSuggestions(true)
          }
          setIsSearching(false)
        }
      )
    } catch (error) {
      console.error('Search failed:', error)
      setIsSearching(false)
      setSuggestions([])
    }
  }, [])

  // 处理输入变化
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    // 清除之前的防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 设置新的防抖定时器
    debounceTimerRef.current = setTimeout(() => {
      performRealTimeSearch(value)
    }, 150)
  }

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  // 处理搜索
  const handleSearch = () => {
    if (!query.trim()) return
    
    setShowSuggestions(false)
    setSelectedIndex(-1)
    
    // 添加到搜索历史
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(h => h !== query)]
      return newHistory.slice(0, 10) // 保留最近10个
    })
    
    onSearch?.(query)
  }

  // 处理建议点击
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    
    if (suggestion.type === 'result') {
      onSuggestionSelect?.(suggestion.data)
    } else {
      onSearch?.(suggestion.text)
    }
  }

  // 清空搜索
  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // 处理焦点
  const handleFocus = () => {
    if (query.trim()) {
      performRealTimeSearch(query)
    } else {
      // 显示热门搜索和历史
      const defaultSuggestions = [
        ...searchHistory.slice(0, 3).map(h => ({ type: 'history', text: h })),
        ...popularQueries.slice(0, 5).map(p => ({ type: 'popular', text: p }))
      ]
      setSuggestions(defaultSuggestions)
      setShowSuggestions(true)
    }
  }

  // 处理失焦
  const handleBlur = () => {
    // 延迟隐藏建议，允许点击建议
    setTimeout(() => {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }, 200)
  }

  // 获取建议图标
  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'history':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'popular':
        return <TrendingUp className="w-4 h-4 text-orange-400" />
      case 'result':
        return <ArrowRight className="w-4 h-4 text-blue-400" />
      default:
        return <Search className="w-4 h-4 text-gray-400" />
    }
  }

  // 获取建议类型标签
  const getSuggestionLabel = (type) => {
    switch (type) {
      case 'history':
        return '历史搜索'
      case 'popular':
        return '热门搜索'
      case 'result':
        return '搜索结果'
      default:
        return '搜索建议'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* 搜索框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        
        {/* 搜索统计 */}
        {searchStats && (
          <div className="absolute top-full right-0 mt-1 text-xs text-gray-500">
            {searchStats.totalSearches} 次搜索 · 平均 {Math.round(searchStats.avgResponseTime)}ms
          </div>
        )}
      </div>

      {/* 搜索建议下拉框 */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {/* 建议分组 */}
            {suggestions.reduce((groups, suggestion, index) => {
              const type = suggestion.type
              if (!groups[type]) {
                groups[type] = []
              }
              groups[type].push({ ...suggestion, index })
              return groups
            }, {}) && Object.entries(
              suggestions.reduce((groups, suggestion, index) => {
                const type = suggestion.type
                if (!groups[type]) {
                  groups[type] = []
                }
                groups[type].push({ ...suggestion, index })
                return groups
              }, {})
            ).map(([type, items]) => (
              <div key={type}>
                {/* 分组标题 */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    {getSuggestionIcon(type)}
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {getSuggestionLabel(type)}
                    </span>
                  </div>
                </div>
                
                {/* 建议项 */}
                {items.map((suggestion) => (
                  <motion.button
                    key={suggestion.index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0 ${
                      selectedIndex === suggestion.index ? 'bg-blue-50 border-blue-100' : ''
                    }`}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getSuggestionIcon(suggestion.type)}
                        <div>
                          <div className="font-medium text-gray-900">
                            {suggestion.text}
                          </div>
                          {suggestion.subtitle && (
                            <div className="text-sm text-gray-500">
                              {suggestion.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {suggestion.type === 'result' && (
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">直达</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            ))}
            
            {/* 搜索提示 */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>按 Enter 搜索 · ↑↓ 选择 · Esc 关闭</span>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>实时搜索</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 快捷过滤器 */}
      {showFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {['前端', 'React', 'Vue', 'Node.js', 'Python', 'Java'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setQuery(filter)
                onSearch?.(filter)
              }}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-150 flex items-center space-x-1"
            >
              <Filter className="w-3 h-3" />
              <span>{filter}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default RealTimeSearchBox