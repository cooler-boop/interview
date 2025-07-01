import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  Code,
  MessageSquare,
  Database,
  Zap,
  Award,
  Bookmark,
  Share2,
  ThumbsUp
} from 'lucide-react'
import toast from 'react-hot-toast'

const Practice = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [completedQuestions, setCompletedQuestions] = useState([])
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([])
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // 模拟加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    // 从本地存储加载已完成题目
    const savedCompleted = localStorage.getItem('completed-questions')
    if (savedCompleted) {
      setCompletedQuestions(JSON.parse(savedCompleted))
    }
    
    // 从本地存储加载收藏题目
    const savedBookmarked = localStorage.getItem('bookmarked-questions')
    if (savedBookmarked) {
      setBookmarkedQuestions(JSON.parse(savedBookmarked))
    }
    
    return () => clearTimeout(timer)
  }, [])
  
  // 保存完成状态到本地存储
  useEffect(() => {
    localStorage.setItem('completed-questions', JSON.stringify(completedQuestions))
  }, [completedQuestions])
  
  // 保存收藏状态到本地存储
  useEffect(() => {
    localStorage.setItem('bookmarked-questions', JSON.stringify(bookmarkedQuestions))
  }, [bookmarkedQuestions])
  
  // 题目分类
  const categories = [
    { id: 'all', name: '全部题目', icon: BookOpen },
    { id: 'javascript', name: 'JavaScript', icon: Code },
    { id: 'react', name: 'React', icon: Code },
    { id: 'algorithm', name: '算法', icon: Code },
    { id: 'system-design', name: '系统设计', icon: Database },
    { id: 'behavioral', name: '行为面试', icon: MessageSquare }
  ]
  
  // 题目数据
  const questions = [
    {
      id: 101,
      category: 'javascript',
      title: '解释JavaScript中的闭包及其应用场景',
      difficulty: 'medium',
      popularity: 98,
      answer: '闭包是指有权访问另一个函数作用域中的变量的函数。\n\n**创建闭包的常见方式**是在一个函数内部创建另一个函数。\n\n**应用场景**：\n1. 数据私有化\n2. 函数工厂\n3. 模块化模式\n4. 回调函数\n5. 柯里化函数\n\n**示例代码**：\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\n**注意事项**：\n- 闭包会保留对外部变量的引用，可能导致内存泄漏\n- 在循环中创建闭包需要特别注意变量作用域'
    },
    {
      id: 102,
      category: 'javascript',
      title: '解释JavaScript中的事件循环机制',
      difficulty: 'hard',
      popularity: 95,
      answer: 'JavaScript的事件循环是其异步编程模型的核心机制。\n\n**关键组件**：\n1. 调用栈（Call Stack）：执行同步代码\n2. 任务队列（Task Queue/Callback Queue）：存放待执行的回调函数\n3. 微任务队列（Microtask Queue）：优先级高于宏任务队列\n4. 事件循环（Event Loop）：不断检查调用栈是否为空，为空则执行队列中的任务\n\n**宏任务（Macrotasks）**：\n- setTimeout, setInterval\n- I/O操作\n- UI渲染\n\n**微任务（Microtasks）**：\n- Promise.then/catch/finally\n- process.nextTick (Node.js)\n- queueMicrotask()\n\n**执行顺序**：\n1. 执行同步代码（调用栈中的任务）\n2. 执行所有微任务\n3. 执行一个宏任务\n4. 重复步骤2和3\n\n**示例代码**：\n```javascript\nconsole.log(\'1\'); // 同步\n\nsetTimeout(() => {\n  console.log(\'2\'); // 宏任务\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(\'3\'); // 微任务\n});\n\nconsole.log(\'4\'); // 同步\n\n// 输出顺序: 1, 4, 3, 2\n```'
    },
    {
      id: 201,
      category: 'react',
      title: 'React Hooks的优势和常见Hook的使用场景',
      difficulty: 'medium',
      popularity: 92,
      answer: 'React Hooks是React 16.8引入的特性，允许在函数组件中使用状态和其他React特性。\n\n**优势**：\n1. 简化组件逻辑，避免复杂的类组件和生命周期方法\n2. 更好的代码复用，通过自定义Hook提取逻辑\n3. 避免this的困扰\n4. 更好的类型推断\n5. 更小的包体积\n\n**常见Hook及使用场景**：\n\n1. **useState**：管理组件状态\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n2. **useEffect**：处理副作用，如数据获取、订阅、手动DOM操作\n```jsx\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n  return () => { /* 清理函数 */ };\n}, [count]);\n```\n\n3. **useContext**：消费Context值，避免组件嵌套\n```jsx\nconst theme = useContext(ThemeContext);\n```\n\n4. **useReducer**：管理复杂状态逻辑\n```jsx\nconst [state, dispatch] = useReducer(reducer, initialState);\n```\n\n5. **useCallback**：记忆化回调函数，避免不必要的渲染\n```jsx\nconst handleClick = useCallback(() => {\n  setCount(count + 1);\n}, [count]);\n```\n\n6. **useMemo**：记忆化计算结果，避免昂贵的重复计算\n```jsx\nconst expensiveResult = useMemo(() => {\n  return computeExpensiveValue(a, b);\n}, [a, b]);\n```\n\n7. **useRef**：保存可变值，不触发重新渲染\n```jsx\nconst inputRef = useRef(null);\n// 访问DOM: inputRef.current.focus();\n```\n\n8. **自定义Hook**：提取和复用组件逻辑\n```jsx\nfunction useWindowSize() {\n  const [size, setSize] = useState({ width: 0, height: 0 });\n  useEffect(() => {\n    // 实现逻辑...\n  }, []);\n  return size;\n}\n```'
    },
    {
      id: 202,
      category: 'react',
      title: 'React性能优化的关键策略',
      difficulty: 'hard',
      popularity: 90,
      answer: 'React应用性能优化是一个多层面的任务，涉及代码、构建和运行时优化。\n\n**关键优化策略**：\n\n1. **避免不必要的渲染**\n   - 使用React.memo包装函数组件\n   - 使用PureComponent代替Component\n   - 使用shouldComponentUpdate生命周期方法\n   - 使用useMemo和useCallback记忆化值和函数\n\n2. **状态管理优化**\n   - 合理拆分组件和状态\n   - 避免状态提升过高\n   - 考虑使用Context API或Redux等状态管理库\n   - 使用不可变数据结构\n\n3. **列表渲染优化**\n   - 为列表项提供稳定的key\n   - 使用虚拟滚动（react-window或react-virtualized）\n   - 实现分页或无限滚动\n\n4. **代码分割和懒加载**\n   - 使用React.lazy和Suspense\n   - 基于路由的代码分割\n   - 动态导入（import()）\n\n5. **减少重渲染**\n   ```jsx\n   // 不好的做法 - 每次渲染都创建新函数\n   <Button onClick={() => handleClick(id)} />\n   \n   // 好的做法 - 使用useCallback\n   const handleButtonClick = useCallback(() => {\n     handleClick(id);\n   }, [id]);\n   <Button onClick={handleButtonClick} />\n   ```\n\n6. **使用Web Workers**\n   - 将复杂计算移至Web Worker\n   - 使用库如comlink或workerize\n\n7. **服务端渲染(SSR)和静态生成(SSG)**\n   - 使用Next.js或Gatsby\n   - 实现增量静态再生成(ISR)\n\n8. **优化依赖**\n   - 减少包体积，使用工具如webpack-bundle-analyzer\n   - 考虑使用较小的替代库\n   - 使用tree-shaking\n\n9. **使用React DevTools Profiler**\n   - 识别渲染瓶颈\n   - 测量渲染时间\n\n10. **使用React.Fragment避免额外DOM节点**\n    ```jsx\n    // 不好的做法\n    return (\n      <div>\n        <Child1 />\n        <Child2 />\n      </div>\n    );\n    \n    // 好的做法\n    return (\n      <>\n        <Child1 />\n        <Child2 />\n      </>\n    );\n    ```'
    },
    {
      id: 301,
      category: 'algorithm',
      title: '实现一个函数，判断一个字符串是否是回文字符串',
      difficulty: 'easy',
      popularity: 85,
      answer: '回文字符串是指正着读和倒着读都一样的字符串，如"level"或"racecar"。\n\n**解决方案1：双指针法**\n\n```javascript\nfunction isPalindrome(s) {\n  // 预处理：转小写并移除非字母数字字符\n  s = s.toLowerCase().replace(/[^a-z0-9]/g, \'\');\n  \n  // 双指针法\n  let left = 0;\n  let right = s.length - 1;\n  \n  while (left < right) {\n    if (s[left] !== s[right]) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  \n  return true;\n}\n```\n\n**解决方案2：反转比较法**\n\n```javascript\nfunction isPalindrome(s) {\n  // 预处理：转小写并移除非字母数字字符\n  s = s.toLowerCase().replace(/[^a-z0-9]/g, \'\');\n  \n  // 反转字符串并比较\n  const reversed = s.split(\'\').reverse().join(\'\');\n  return s === reversed;\n}\n```\n\n**时间复杂度**：O(n)，其中n是字符串长度\n**空间复杂度**：\n- 方案1：O(1)，只使用了常数额外空间\n- 方案2：O(n)，创建了反转的字符串副本\n\n**注意事项**：\n- 通常需要忽略空格、标点符号和大小写\n- 空字符串通常被视为回文\n- 对于大型字符串，双指针法更节省内存'
    },
    {
      id: 302,
      category: 'algorithm',
      title: '实现一个函数，在不使用内置排序方法的情况下对数组进行排序',
      difficulty: 'medium',
      popularity: 88,
      answer: '以下是几种常见排序算法的JavaScript实现：\n\n**1. 快速排序**\n\n```javascript\nfunction quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  \n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = [];\n  const middle = [];\n  const right = [];\n  \n  for (let element of arr) {\n    if (element < pivot) left.push(element);\n    else if (element > pivot) right.push(element);\n    else middle.push(element);\n  }\n  \n  return [...quickSort(left), ...middle, ...quickSort(right)];\n}\n```\n\n**2. 归并排序**\n\n```javascript\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  \n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  \n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let leftIndex = 0, rightIndex = 0;\n  \n  while (leftIndex < left.length && rightIndex < right.length) {\n    if (left[leftIndex] < right[rightIndex]) {\n      result.push(left[leftIndex]);\n      leftIndex++;\n    } else {\n      result.push(right[rightIndex]);\n      rightIndex++;\n    }\n  }\n  \n  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));\n}\n```\n\n**3. 冒泡排序**\n\n```javascript\nfunction bubbleSort(arr) {\n  const n = arr.length;\n  let swapped;\n  \n  do {\n    swapped = false;\n    for (let i = 0; i < n - 1; i++) {\n      if (arr[i] > arr[i + 1]) {\n        // 交换元素\n        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];\n        swapped = true;\n      }\n    }\n  } while (swapped);\n  \n  return arr;\n}\n```\n\n**算法复杂度比较**：\n\n| 算法 | 时间复杂度(平均) | 时间复杂度(最坏) | 空间复杂度 | 稳定性 |\n|------|----------------|----------------|-----------|--------|\n| 快速排序 | O(n log n) | O(n²) | O(log n) | 不稳定 |\n| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 |\n| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |\n\n**选择建议**：\n- 对于大多数情况，快速排序是最佳选择\n- 如果稳定性很重要，选择归并排序\n- 对于几乎已排序的数组，冒泡排序可能表现良好\n- 对于非常小的数组（<10元素），简单算法如插入排序可能更快'
    },
    {
      id: 401,
      category: 'system-design',
      title: '设计一个高并发的短链接服务',
      difficulty: 'hard',
      popularity: 93,
      answer: '# 短链接服务设计\n\n## 1. 需求分析\n\n**功能需求**：\n- 将长URL转换为短URL\n- 访问短URL时重定向到原始长URL\n- 短链接有效期设置\n- 点击统计和分析\n\n**非功能需求**：\n- 高可用性（99.99%）\n- 低延迟（重定向<100ms）\n- 高并发（每秒数千次请求）\n- 防止滥用\n\n## 2. 系统架构\n\n**整体架构**：\n```\n用户 → CDN → 负载均衡器 → 应用服务器 → 数据库/缓存\n```\n\n**核心组件**：\n- **Web服务**：处理API请求和URL重定向\n- **URL生成服务**：创建唯一短码\n- **数据存储**：保存URL映射关系\n- **缓存层**：提高读取性能\n- **分析服务**：收集和处理点击数据\n\n## 3. 数据模型\n\n**URL映射表**：\n```sql\nCREATE TABLE url_mappings (\n  id BIGINT PRIMARY KEY AUTO_INCREMENT,\n  short_code VARCHAR(10) UNIQUE NOT NULL,\n  original_url TEXT NOT NULL,\n  user_id BIGINT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  expires_at TIMESTAMP NULL,\n  click_count BIGINT DEFAULT 0,\n  INDEX (short_code),\n  INDEX (user_id)\n);\n```\n\n**点击分析表**：\n```sql\nCREATE TABLE click_analytics (\n  id BIGINT PRIMARY KEY AUTO_INCREMENT,\n  short_code VARCHAR(10) NOT NULL,\n  user_agent TEXT,\n  referer TEXT,\n  ip_address VARCHAR(45),\n  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  country VARCHAR(2),\n  device VARCHAR(20),\n  INDEX (short_code),\n  INDEX (timestamp)\n);\n```\n\n## 4. 短码生成算法\n\n**方案1：自增ID + Base62编码**\n```javascript\nfunction generateShortCode(id) {\n  const characters = \'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\';\n  const base = characters.length;\n  let shortCode = \'\';\n  \n  while (id > 0) {\n    shortCode = characters[id % base] + shortCode;\n    id = Math.floor(id / base);\n  }\n  \n  return shortCode.padStart(6, \'0\');\n}\n```\n\n**方案2：MD5哈希 + 截取**\n```javascript\nfunction generateShortCode(url) {\n  const hash = md5(url + Date.now());\n  return hash.substring(0, 6);\n}\n```\n\n## 5. 缓存策略\n\n- 使用Redis缓存热门URL映射\n- 多级缓存：本地内存缓存 → Redis → 数据库\n- 缓存策略：LRU (Least Recently Used)\n- 缓存TTL：根据访问频率动态调整\n\n## 6. 扩展性考虑\n\n**水平扩展**：\n- 应用服务器无状态，可以轻松扩展\n- 数据库分片：按short_code范围或哈希分片\n- 读写分离：主从复制\n\n**地理分布**：\n- 多区域部署\n- 全球CDN分发\n- 就近路由\n\n## 7. 安全性考虑\n\n- 防止滥用：速率限制、验证码\n- 内容审核：检查恶意URL\n- HTTPS加密\n- 防止URL劫持\n\n## 8. 监控和告警\n\n- 系统健康指标：CPU、内存、磁盘\n- 业务指标：QPS、错误率、延迟\n- 自定义告警阈值\n- 日志聚合和分析\n\n## 9. 技术栈选择\n\n- **后端**：Node.js/Express或Go\n- **数据库**：MySQL (主存储) + Redis (缓存)\n- **负载均衡**：Nginx或云服务提供商的负载均衡\n- **CDN**：Cloudflare或Akamai\n- **监控**：Prometheus + Grafana\n- **日志**：ELK Stack\n\n## 10. 优化策略\n\n- 预生成短码池\n- 批量数据库操作\n- 异步处理分析数据\n- 热点数据特殊处理'
    },
    {
      id: 402,
      category: 'system-design',
      title: '设计一个实时聊天系统，支持单聊和群聊功能',
      difficulty: 'hard',
      popularity: 91,
      answer: '# 实时聊天系统设计\n\n## 1. 系统需求\n\n**功能需求**：\n- 一对一聊天\n- 群组聊天\n- 消息实时推送\n- 消息历史记录\n- 在线状态显示\n- 已读回执\n- 多设备同步\n- 媒体文件传输\n\n**非功能需求**：\n- 低延迟（<500ms）\n- 高可用性（99.9%+）\n- 可扩展性（支持百万级用户）\n- 消息可靠性（不丢失）\n- 安全性（端到端加密）\n\n## 2. 系统架构\n\n**客户端**：\n- Web客户端 (React/Vue)\n- 移动客户端 (iOS/Android)\n- 桌面客户端 (Electron)\n\n**服务端**：\n- 接入层：WebSocket服务器集群\n- 业务层：\n  - 用户服务：用户管理、认证\n  - 消息服务：消息处理和路由\n  - 群组服务：群组管理\n  - 通知服务：推送通知\n  - 存储服务：消息持久化\n  - 状态服务：在线状态管理\n\n**数据层**：\n- 关系型数据库 (PostgreSQL)：用户信息、群组信息\n- NoSQL数据库 (MongoDB)：消息历史\n- 缓存 (Redis)：在线状态、最近消息\n- 消息队列 (Kafka)：消息分发\n- 对象存储 (S3)：媒体文件\n\n## 3. 关键技术设计\n\n### 实时通信\n- WebSocket长连接\n- 心跳机制保持连接\n- 断线重连策略\n- 消息确认机制\n\n### 消息流程\n1. 客户端通过WebSocket发送消息\n2. 消息服务接收并验证消息\n3. 消息存储到MongoDB\n4. 消息发布到Kafka\n5. 接收方的WebSocket服务器从Kafka消费消息\n6. 推送消息到在线接收方\n7. 对离线用户触发推送通知\n\n### 消息ID和排序\n```javascript\nfunction generateMessageId() {\n  const timestamp = Date.now().toString(16);\n  const random = Math.floor(Math.random() * 1000000).toString(16);\n  const serverId = SERVER_ID.toString(16);\n  return `${timestamp}-${serverId}-${random}`;\n}\n```\n\n### 群聊设计\n- 群成员信息缓存在Redis\n- 消息扇出（Fan-out）策略：\n  - 小群组：写时扇出（发送时复制到所有成员）\n  - 大群组：读时扇出（成员读取时获取群消息）\n\n## 4. 数据模型\n\n**用户表**：\n```sql\nCREATE TABLE users (\n  id UUID PRIMARY KEY,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  email VARCHAR(100) UNIQUE NOT NULL,\n  password_hash VARCHAR(100) NOT NULL,\n  avatar_url TEXT,\n  created_at TIMESTAMP DEFAULT NOW(),\n  last_active TIMESTAMP\n);\n```\n\n**会话表**：\n```sql\nCREATE TABLE conversations (\n  id UUID PRIMARY KEY,\n  type VARCHAR(10), -- \'single\' or \'group\'\n  created_at TIMESTAMP DEFAULT NOW(),\n  updated_at TIMESTAMP DEFAULT NOW()\n);\n```\n\n**会话成员表**：\n```sql\nCREATE TABLE conversation_members (\n  conversation_id UUID REFERENCES conversations(id),\n  user_id UUID REFERENCES users(id),\n  joined_at TIMESTAMP DEFAULT NOW(),\n  role VARCHAR(20) DEFAULT \'member\',\n  PRIMARY KEY (conversation_id, user_id)\n);\n```\n\n**消息集合** (MongoDB)：\n```javascript\n{\n  _id: ObjectId,\n  conversation_id: UUID,\n  sender_id: UUID,\n  content: String,\n  content_type: String, // \'text\', \'image\', \'video\', etc.\n  media_url: String,\n  sent_at: Timestamp,\n  delivered_to: [{ user_id: UUID, timestamp: Timestamp }],\n  read_by: [{ user_id: UUID, timestamp: Timestamp }]\n}\n```\n\n## 5. 扩展性设计\n\n**WebSocket服务器扩展**：\n- 使用一致性哈希将用户分配到特定服务器\n- 服务器间通过Kafka或Redis Pub/Sub通信\n- 会话元数据在服务器间共享\n\n**数据库扩展**：\n- 用户数据水平分片\n- 消息数据按会话ID分片\n- 读写分离\n\n## 6. 高可用设计\n\n- 多区域部署\n- 服务发现和健康检查\n- 自动故障转移\n- 消息持久化确保不丢失\n- 限流和熔断保护\n\n## 7. 安全考虑\n\n- TLS加密WebSocket连接\n- 消息加密（可选端到端加密）\n- 认证和授权\n- 防止消息注入和XSS\n- 速率限制防止滥用\n\n## 8. 监控和运维\n\n- 连接数监控\n- 消息吞吐量\n- 消息延迟\n- 错误率\n- 资源使用率\n\n## 9. 客户端优化\n\n- 消息本地缓存\n- 增量同步\n- 消息预取\n- 图片和视频懒加载\n- 消息状态本地更新后异步同步\n\n## 10. 技术栈选择\n\n- **后端**：Node.js (Socket.io) 或 Go\n- **WebSocket**：Socket.io, ws, Gorilla WebSocket\n- **数据库**：PostgreSQL + MongoDB\n- **缓存**：Redis\n- **消息队列**：Kafka\n- **对象存储**：S3兼容存储\n- **部署**：Kubernetes'
    },
    {
      id: 501,
      category: 'behavioral',
      title: '描述一个你在项目中遇到的挑战，以及你是如何解决的',
      difficulty: 'medium',
      popularity: 87,
      answer: '回答这类行为面试问题时，应使用STAR方法（情境Situation、任务Task、行动Action、结果Result）来结构化你的回答。\n\n**示例回答**：\n\n**情境(Situation)**：\n在我负责的一个电商平台重构项目中，我们面临一个严峻的挑战。该平台在促销活动期间经常出现性能瓶颈，导致页面加载时间超过5秒，用户流失率高达40%。这个问题尤其在移动端用户中更为明显。\n\n**任务(Task)**：\n作为前端技术负责人，我的任务是识别性能瓶颈并实施解决方案，目标是将页面加载时间减少到2秒以内，同时确保系统在高流量下保持稳定。\n\n**行动(Action)**：\n1. 首先，我使用Lighthouse和Chrome DevTools进行全面的性能审计，识别出主要问题是大量未优化的图片资源和过多的阻塞渲染的JavaScript。\n\n2. 我设计并实施了以下优化策略：\n   - 实现图片懒加载和响应式图片，根据设备自动加载适当大小的图片\n   - 将关键CSS内联到HTML中，非关键CSS异步加载\n   - 应用代码分割，将大型JavaScript包拆分为更小的块，实现按需加载\n   - 实现组件级缓存策略，减少不必要的重新渲染\n   - 优化第三方脚本加载，使用`async`和`defer`属性\n\n3. 我组织了团队工作坊，确保所有开发人员理解并遵循这些性能最佳实践。\n\n4. 我建立了自动化性能监控系统，在CI/CD流程中集成性能测试，设置性能预算，确保新代码不会导致性能退化。\n\n**结果(Result)**：\n1. 页面加载时间从5秒减少到1.8秒，达到了目标。\n2. 用户流失率下降了35%。\n3. 转化率提高了15%，直接带来了可观的收入增长。\n4. 在随后的大型促销活动中，系统成功处理了比以往高3倍的流量，没有出现任何性能问题。\n5. 我们的性能优化方法被公司采纳为标准实践，并在其他项目中推广。\n\n这次经历教会我，性能优化不仅仅是技术问题，还需要建立长期的监控和维护机制，以及团队文化的改变。通过系统性思考和数据驱动的方法，我们不仅解决了当前问题，还建立了可持续的解决方案。\n\n**面试技巧**：\n- 选择一个真实的、有挑战性的问题\n- 强调你的个人贡献和主动性\n- 量化结果，使用具体数据\n- 展示你的技术能力和软技能（如团队协作、沟通）\n- 反思经验教训和个人成长'
    },
    {
      id: 502,
      category: 'behavioral',
      title: '如何处理与团队成员的意见分歧？',
      difficulty: 'medium',
      popularity: 84,
      answer: '处理团队意见分歧是展示你沟通能力、情商和解决冲突能力的重要机会。以下是一个结构化的回答框架：\n\n**开场**：\n我认为意见分歧是团队创新和成长的自然部分。在我的职业生涯中，我经历过多次有建设性的分歧，这些经历帮助我发展了处理不同观点的有效策略。\n\n**具体案例**（STAR方法）：\n\n**情境(Situation)**：\n在一个Web应用重构项目中，我和一位资深后端工程师对API设计方案产生了重大分歧。我主张采用GraphQL以提供更灵活的前端数据获取能力，而他坚持使用传统REST API，认为GraphQL会增加系统复杂性和学习成本。这个决定会影响整个项目架构和开发效率。\n\n**任务(Task)**：\n我需要以建设性的方式解决这个分歧，确保做出的技术决策既考虑前端需求，也尊重后端团队的关切，同时不延误项目进度。\n\n**行动(Action)**：\n1. **寻求理解**：我首先安排了一次一对一会议，真诚地了解他的顾虑和观点，不带任何预设立场。\n\n2. **基于数据讨论**：我准备了详细的数据，包括：\n   - 当前API调用效率分析\n   - GraphQL vs REST在我们特定用例中的性能比较\n   - 其他类似规模公司的案例研究\n   - 学习曲线和团队适应成本估算\n\n3. **寻求折中方案**：我提出了一个渐进式方案，先在一个非关键模块试点GraphQL，同时保留大部分REST API，并设定明确的评估指标。\n\n4. **扩大讨论**：我们邀请了其他团队成员和技术主管参与讨论，确保考虑到所有角度。\n\n5. **尊重专业判断**：我表明无论最终决定如何，我都会全力支持并确保实施成功。\n\n**结果(Result)**：\n1. 经过深入讨论，我们达成了一个混合方案：对数据需求复杂的新功能使用GraphQL，现有功能继续使用REST API。\n\n2. 我们共同制定了详细的实施计划和评估框架。\n\n3. 这个解决方案最终证明非常成功：\n   - 新功能开发速度提高了30%\n   - 前端API调用减少了40%\n   - 后端团队也逐渐接受并掌握了GraphQL\n\n4. 最重要的是，这次经历加强了团队内的相互尊重和沟通文化。\n\n**一般处理原则**：\n\n1. **专注于共同目标**：提醒所有人团队的最终目标是什么。\n\n2. **基于事实和数据**：用客观数据而非个人偏好来支持论点。\n\n3. **积极倾听**：真正理解对方的观点和顾虑，不急于反驳。\n\n4. **寻找共识点**：从双方都认同的点开始，逐步缩小分歧范围。\n\n5. **考虑折中方案**：愿意妥协并探索创新的解决方案。\n\n6. **保持专业和尊重**：即使在强烈分歧中也保持尊重和专业态度。\n\n7. **知道何时让步**：评估何时坚持己见，何时接受他人的方案更有利于团队。\n\n**总结**：\n通过这些经历，我学会了将分歧视为机会而非威胁。有效处理分歧不仅能达成更好的决策，还能建立更强大的团队关系和信任。我相信，能够建设性地处理分歧是一个优秀团队成员的关键特质。'
    }
  ]
  
  // 根据筛选条件过滤题目
  const filteredQuestions = questions.filter(question => {
    // 分类筛选
    if (activeCategory !== 'all' && question.category !== activeCategory) {
      return false
    }
    
    // 难度筛选
    if (difficulty !== 'all' && question.difficulty !== difficulty) {
      return false
    }
    
    // 搜索筛选
    if (searchQuery) {
      return question.title.toLowerCase().includes(searchQuery.toLowerCase())
    }
    
    return true
  })
  
  // 处理题目点击
  const handleQuestionClick = (questionId) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null)
      setShowAnswer(false)
    } else {
      setExpandedQuestion(questionId)
      setShowAnswer(false)
    }
  }
  
  // 切换完成状态
  const toggleCompleted = (questionId) => {
    if (completedQuestions.includes(questionId)) {
      setCompletedQuestions(prev => prev.filter(id => id !== questionId))
    } else {
      setCompletedQuestions(prev => [...prev, questionId])
      toast.success('题目已标记为完成！')
    }
  }
  
  // 切换收藏状态
  const toggleBookmarked = (questionId) => {
    if (bookmarkedQuestions.includes(questionId)) {
      setBookmarkedQuestions(prev => prev.filter(id => id !== questionId))
    } else {
      setBookmarkedQuestions(prev => [...prev, questionId])
      toast.success('题目已收藏！')
    }
  }
  
  // 获取难度标签样式
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
            面试题库
          </h1>
          <p className="text-gray-600">
            精选各类面试题，助你高效备战技术面试
          </p>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: '题目总数', value: questions.length, icon: BookOpen, color: 'bg-blue-500' },
            { title: '已完成', value: completedQuestions.length, icon: CheckCircle, color: 'bg-green-500' },
            { title: '已收藏', value: bookmarkedQuestions.length, icon: Bookmark, color: 'bg-purple-500' },
            { title: '完成率', value: `${Math.round((completedQuestions.length / questions.length) * 100)}%`, icon: Award, color: 'bg-orange-500' }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.title}
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* 搜索框 */}
            <div className="relative md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索题目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* 难度筛选 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">难度:</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部</option>
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
            
            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4 mr-1 inline" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 题目列表 */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载题库中...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="space-y-4">
            {filteredQuestions.map(question => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* 题目头部 */}
                <div 
                  className={`p-4 cursor-pointer ${
                    expandedQuestion === question.id ? 'border-b border-gray-200' : ''
                  }`}
                  onClick={() => handleQuestionClick(question.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        completedQuestions.includes(question.id)
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}>
                        {completedQuestions.includes(question.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">{question.id}</span>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900">{question.title}</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(question.difficulty)}`}>
                        {question.difficulty === 'easy' ? '简单' : 
                         question.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs">{question.popularity}%</span>
                      </div>
                      {expandedQuestion === question.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 展开内容 */}
                {expandedQuestion === question.id && (
                  <div className="p-4 bg-gray-50">
                    {/* 操作按钮 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {categories.find(c => c.id === question.category)?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleBookmarked(question.id)}
                          className={`p-2 rounded-full ${
                            bookmarkedQuestions.includes(question.id)
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleCompleted(question.id)}
                          className={`p-2 rounded-full ${
                            completedQuestions.includes(question.id)
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* 答案切换按钮 */}
                    <button
                      onClick={() => setShowAnswer(!showAnswer)}
                      className={`w-full px-4 py-2 mb-4 rounded-lg transition-colors ${
                        showAnswer
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {showAnswer ? '隐藏答案' : '查看答案'}
                    </button>
                    
                    {/* 答案内容 */}
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="prose prose-sm max-w-none">
                          {question.answer.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                        
                        {/* 答案反馈 */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">有帮助</span>
                            </button>
                            <button className="text-sm text-gray-600 hover:text-blue-600">
                              报告问题
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            最后更新: 2024-06-15
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的题目</h3>
            <p className="text-gray-600">
              尝试调整搜索条件或筛选器
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Practice