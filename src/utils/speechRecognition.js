/**
 * 语音识别服务
 * 封装浏览器的SpeechRecognition API
 */

export class SpeechRecognitionService {
  constructor() {
    this.recognition = null
    this.isSupported = false
    this.isListening = false
    this.onResultCallback = null
    this.onErrorCallback = null
    this.onEndCallback = null
    this.language = 'zh-CN'
    
    this.initialize()
  }
  
  /**
   * 初始化语音识别
   */
  initialize() {
    // 检查浏览器支持
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.isSupported = true
      
      // 配置
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = this.language
      
      // 事件处理
      this.recognition.onresult = this.handleResult.bind(this)
      this.recognition.onerror = this.handleError.bind(this)
      this.recognition.onend = this.handleEnd.bind(this)
      
      console.log('语音识别服务初始化成功')
    } else {
      console.warn('当前浏览器不支持语音识别')
      this.isSupported = false
    }
  }
  
  /**
   * 处理识别结果
   */
  handleResult(event) {
    let transcript = ''
    let isFinal = false
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript
      isFinal = event.results[i].isFinal
    }
    
    if (this.onResultCallback) {
      this.onResultCallback(transcript, isFinal)
    }
  }
  
  /**
   * 处理错误
   */
  handleError(event) {
    console.error('语音识别错误:', event.error)
    
    if (this.onErrorCallback) {
      this.onErrorCallback(event.error)
    }
    
    this.isListening = false
  }
  
  /**
   * 处理结束
   */
  handleEnd() {
    console.log('语音识别结束')
    
    if (this.onEndCallback) {
      this.onEndCallback()
    }
    
    // 如果仍在监听状态，则重新开始
    if (this.isListening) {
      try {
        this.recognition.start()
      } catch (error) {
        console.error('重新启动语音识别失败:', error)
        this.isListening = false
      }
    }
  }
  
  /**
   * 开始语音识别
   */
  start() {
    if (!this.isSupported) {
      console.warn('当前浏览器不支持语音识别')
      return false
    }
    
    try {
      this.recognition.start()
      this.isListening = true
      console.log('语音识别已启动')
      return true
    } catch (error) {
      console.error('启动语音识别失败:', error)
      this.isListening = false
      return false
    }
  }
  
  /**
   * 停止语音识别
   */
  stop() {
    if (!this.isSupported || !this.isListening) {
      return
    }
    
    try {
      this.recognition.stop()
      this.isListening = false
      console.log('语音识别已停止')
    } catch (error) {
      console.error('停止语音识别失败:', error)
    }
  }
  
  /**
   * 设置语言
   */
  setLanguage(language) {
    this.language = language
    if (this.recognition) {
      this.recognition.lang = language
    }
  }
  
  /**
   * 设置结果回调
   */
  onResult(callback) {
    this.onResultCallback = callback
  }
  
  /**
   * 设置错误回调
   */
  onError(callback) {
    this.onErrorCallback = callback
  }
  
  /**
   * 设置结束回调
   */
  onEnd(callback) {
    this.onEndCallback = callback
  }
  
  /**
   * 检查是否支持语音识别
   */
  isRecognitionSupported() {
    return this.isSupported
  }
  
  /**
   * 检查是否正在监听
   */
  isRecognitionActive() {
    return this.isListening
  }
}

// 全局语音识别服务实例
export const speechRecognition = new SpeechRecognitionService()