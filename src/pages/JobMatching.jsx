import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star,
  Filter,
  Briefcase,
  Building,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Settings,
  BarChart3,
  Cpu,
  Database,
  RefreshCw,
  AlertCircle,
  Globe,
  Shield,
  ExternalLink,
  CheckCircle,
  Users,
  Award
} from 'lucide-react'
import useDataStore from '../store/dataStore'
import useAuthStore from '../store/authStore'
import { enterpriseJobSearchService } from '../utils/EnterpriseJobSearchService'
import { intelligentMatcher } from '../utils/intelligentMatcher'
import RealTimeSearchBox from '../components/RealTimeSearchBox'
import AuthGuard from '../components/AuthGuard'
import toast from 'react-hot-toast'

const JobMatching = () => {
  const { jobMatches, addJobMatch, resumes } = useDataStore()
  const { isAuthenticated, user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [systemStatus, setSystemStatus] = useState(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchMode, setSearchMode] = useState('enterprise') // 'enterprise' | 'intelligent'
  const [userProfile, setUserProfile] = useState(null)
  const [searchStats, setSearchStats] = useState(null)
  const [filters, setFilters] = useState({
    salaryMin: '',
    experience: '',
    companySize: '',
    industry: '',
    jobType: '',
    remote: false
  })
  
  useEffect(() => {
    if (isAuthenticated) {
      initializeSystem()
      buildUserProfile()
    }
  }, [isAuthenticated])
  
  const initializeSystem = async () => {
    try {
      // 获取系统状态
      const status = enterpriseJobSearchService.getSystemStatus()
      setSystemStatus(status)
      
      console.log('Enterprise job search system initialized for authenticated user')
      
    } catch (error) {
      console.error('Failed to initialize enterprise job search system:', error)
      toast.error('系统初始化失败')
    }
  }
  
  // 构建用户画像
  const buildUserProfile = () => {
    try {
      // 从简历分析中获取用户信息
      const latestResume = resumes[0]
      const profile = {
        skills: latestResume?.analysisResult?.skills?.map(s => s.name) || [],
        experience: '3年', // 可以从简历中提取
        education: '本科',
        preferredLocations: [location || '北京'],
        expectedSalary: '20K-35K',
        preferredCompanySize: '大型',
        preferredIndustry: '互联网',
        careerGoals: ['高级工程师', '技术专家'],
        workStyle: 'flexible',
        resumeAnalysis: latestResume?.analysisResult,
        searchHistory: [],
        clickHistory: [],
        applicationHistory: []
      }
      
      setUserProfile(profile)
      intelligentMatcher.setUserProfile(profile)
      
    } catch (error) {
      console.error('Failed to build user profile:', error)
    }
  }
  
  // 企业级搜索处理
  const handleEnterpriseSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    setSearching(true)
    setSearchTerm(query)
    
    try {
      const searchParams = {
        query,
        location,
        ...filters,
        limit: 20,
        adapters: ['jobspy', 'linkedin', 'jobapis'] // 使用所有适配器
      }
      
      const result = await enterpriseJobSearchService.searchJobs(searchParams)
      
      // 如果启用智能匹配，对结果进行个性化排序
      let finalResults = result.jobs
      if (searchMode === 'intelligent' && userProfile) {
        finalResults = await intelligentMatcher.matchJobs(result.jobs)
      }
      
      setSearchResults(finalResults)
      setSearchStats({
        totalCount: result.totalCount,
        sources: result.sources,
        errors: result.errors,
        algorithm: result.algorithm,
        searchTime: Date.now() - result.searchTime
      })
      
      // 添加到匹配记录
      finalResults.forEach(job => {
        addJobMatch({
          ...job,
          searchTerm: query,
          searchLocation: location,
          algorithm: result.algorithm,
          timestamp: Date.now()
        })
      })
      
      toast.success(`找到 ${finalResults.length} 个真实职位`)
      
    } catch (error) {
      console.error('企业级搜索失败:', error)
      toast.error(error.message || '搜索失败，请稍后重试')
    } finally {
      setSearching(false)
    }
  }
  
  // 传统搜索处理
  const handleTraditionalSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('请输入搜索关键词')
      return
    }
    
    await handleEnterpriseSearch(searchTerm)
  }
  
  // 建议选择处理
  const handleSuggestionSelect = (jobData) => {
    setSearchResults([jobData])
    toast.success('已选择职位')
  }
  
  const getMatchColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }
  
  const getSourceBadge = (source) => {
    const badges = {
      'jobspy': { text: 'JobSpy', color: 'bg-purple-100 text-purple-700' },
      'linkedin': { text: 'LinkedIn', color: 'bg-blue-100 text-blue-700' },
      'jobapis': { text: 'JobApis', color: 'bg-green-100 text-green-700' },
      'fallback': { text: '示例数据', color: 'bg-gray-100 text-gray-700' }
    }
    
    return badges[source] || badges['fallback']
  }

  // 如果用户未登录，显示认证守卫
  if (!isAuthenticated) {
    return <AuthGuard feature="企业级职位搜索" />
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            企业级职位搜索系统
          </h1>
          <p className="text-gray-600">
            整合JobSpy、LinkedIn、JobApis等多平台真实职位数据
          </p>
          
          {/* 用户状态和系统状态 */}
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm px-4 py-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  已登录: {user?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">
                  多平台数据源
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">
                  企业级算法: {systemStatus?.config?.enabledAdapters?.length || 0} 个适配器
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 搜索区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* 搜索模式切换 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">搜索模式</h3>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSearchMode('enterprise')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchMode === 'enterprise'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Database className="w-4 h-4 mr-2 inline" />
                  企业级搜索
                </button>
                <button
                  onClick={() => setSearchMode('intelligent')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchMode === 'intelligent'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Brain className="w-4 h-4 mr-2 inline" />
                  智能匹配
                </button>
              </div>
            </div>
            
            {/* 模式说明 */}
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {searchMode === 'enterprise' ? (
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-green-500" />
                  <span>企业级搜索：并行搜索JobSpy、LinkedIn、JobApis等多平台，获取最全面的真实职位数据</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span>智能匹配：基于您的简历和偏好进行个性化匹配，推荐最适合的职位</span>
                </div>
              )}
            </div>
          </div>
          
          {/* 实时搜索框 */}
          {searchMode === 'enterprise' ? (
            <div className="space-y-4">
              <RealTimeSearchBox
                onSearch={handleEnterpriseSearch}
                onSuggestionSelect={handleSuggestionSelect}
                placeholder="搜索真实职位：公司名、职位名、技能关键词..."
                showFilters={true}
                autoFocus={true}
                className="w-full"
              />
              
              {/* 地点筛选 */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 max-w-xs">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="城市"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  多平台聚合 · 企业级搜索
                </div>
              </div>
            </div>
          ) : (
            /* 智能匹配搜索框 */
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="描述您的理想职位..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      onKeyPress={(e) => e.key === 'Enter' && handleTraditionalSearch()}
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="城市"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <button
                  onClick={handleTraditionalSearch}
                  disabled={searching || !searchTerm.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  {searching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2 inline" />
                      智能匹配
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* 高级筛选 */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>高级筛选</span>
            </button>
            
            <div className="text-sm text-gray-500">
              数据来源：JobSpy、LinkedIn、JobApis等多平台
            </div>
          </div>
          
          {/* 高级筛选面板 */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 mt-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最低薪资</label>
                <input
                  type="number"
                  placeholder="如: 15"
                  value={filters.salaryMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, salaryMin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工作经验</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">不限</option>
                  <option value="0年">应届生</option>
                  <option value="1年">1年经验</option>
                  <option value="3年">3年经验</option>
                  <option value="5年">5年经验</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司规模</label>
                <select
                  value={filters.companySize}
                  onChange={(e) => setFilters(prev => ({ ...prev, companySize: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">不限</option>
                  <option value="初创">初创公司</option>
                  <option value="小型">小型公司</option>
                  <option value="中型">中型公司</option>
                  <option value="大型">大型公司</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工作类型</label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">不限</option>
                  <option value="全职">全职</option>
                  <option value="兼职">兼职</option>
                  <option value="实习">实习</option>
                  <option value="合同">合同工</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* 搜索进度 */}
        {searching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                正在搜索企业级职位数据...
              </h3>
              <p className="text-gray-600 mb-4">
                并行搜索JobSpy、LinkedIn、JobApis等多平台，获取最新职位信息
              </p>
              
              {/* 搜索进度指示器 */}
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                  <span>JobSpy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span>LinkedIn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span>JobApis</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 搜索统计 */}
        {searchStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">搜索统计</span>
                </div>
                <div className="text-sm text-gray-600">
                  总计: {searchStats.totalCount} 个职位
                </div>
                <div className="text-sm text-gray-600">
                  算法: {searchStats.algorithm}
                </div>
                <div className="text-sm text-gray-600">
                  耗时: {searchStats.searchTime}ms
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {searchStats.sources && searchStats.sources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-1 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      source.adapter === 'jobspy' ? 'bg-purple-500' :
                      source.adapter === 'linkedin' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`} />
                    <span>{source.adapter}: {source.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 搜索结果 */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                搜索结果 ({searchResults.length})
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Database className="w-4 h-4" />
                  <span>企业级数据源</span>
                </div>
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option>按匹配度排序</option>
                  <option>按发布时间排序</option>
                  <option>按薪资排序</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {searchResults.map((job, index) => (
                <motion.div
                  key={job.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        {job.matchScore && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchScore)}`}>
                            {job.matchScore}% 匹配
                          </span>
                        )}
                        {job.source && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadge(job.source).color}`}>
                            {getSourceBadge(job.source).text}
                          </span>
                        )}
                        {job.remote && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            远程
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.experience}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                    </div>
                  </div>
                  
                  {/* 智能匹配详情 */}
                  {job.matchDetails && (
                    <div className="bg-purple-50 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        智能匹配分析
                      </h4>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-purple-600">技能匹配:</span>
                          <span className="ml-2 font-medium">{Math.round(job.matchDetails.skillMatch)}%</span>
                        </div>
                        <div>
                          <span className="text-purple-600">经验匹配:</span>
                          <span className="ml-2 font-medium">{Math.round(job.matchDetails.experienceMatch)}%</span>
                        </div>
                        <div>
                          <span className="text-purple-600">地点匹配:</span>
                          <span className="ml-2 font-medium">{Math.round(job.matchDetails.locationMatch)}%</span>
                        </div>
                        <div>
                          <span className="text-purple-600">薪资匹配:</span>
                          <span className="ml-2 font-medium">{Math.round(job.matchDetails.salaryMatch)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 推荐理由 */}
                  {job.reasons && job.reasons.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">推荐理由</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.reasons.map((reason, reasonIndex) => (
                          <span key={reasonIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 改进建议 */}
                  {job.improvements && job.improvements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">提升建议</h4>
                      <div className="space-y-1">
                        {job.improvements.map((improvement, impIndex) => (
                          <div key={impIndex} className="text-sm text-orange-700 bg-orange-50 px-2 py-1 rounded">
                            {improvement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 技能要求和福利 */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">技能要求</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, reqIndex) => (
                            <span key={reqIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">福利待遇</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit, benefitIndex) => (
                            <span key={benefitIndex} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.5</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {job.publishTime ? new Date(job.publishTime).toLocaleDateString() : '最新发布'}
                      </span>
                      {job.sourceUrl && job.sourceUrl !== '#' && (
                        <a
                          href={job.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>查看原文</span>
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                        收藏
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        立即申请
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* 空状态 */}
        {searchResults.length === 0 && !searching && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索企业级职位</h3>
            <p className="text-gray-600 mb-6">
              搜索来自JobSpy、LinkedIn、JobApis等多平台的真实职位信息
            </p>
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4">
                <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">多平台聚合</h4>
                <p className="text-sm text-gray-600">JobSpy + LinkedIn + JobApis</p>
              </div>
              <div className="text-center p-4">
                <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">智能匹配</h4>
                <p className="text-sm text-gray-600">个性化推荐</p>
              </div>
              <div className="text-center p-4">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">企业级架构</h4>
                <p className="text-sm text-gray-600">高可用性</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default JobMatching