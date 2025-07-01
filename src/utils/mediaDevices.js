/**
 * 媒体设备服务
 * 封装摄像头和麦克风访问功能
 */

export class MediaDevicesService {
  constructor() {
    this.videoStream = null
    this.audioStream = null
    this.isVideoAvailable = false
    this.isAudioAvailable = false
    this.videoDevices = []
    this.audioDevices = []
    
    // 检查设备支持
    this.checkDeviceSupport()
  }
  
  /**
   * 检查设备支持
   */
  async checkDeviceSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.warn('当前浏览器不支持媒体设备API')
      return
    }
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      
      this.videoDevices = devices.filter(device => device.kind === 'videoinput')
      this.audioDevices = devices.filter(device => device.kind === 'audioinput')
      
      this.isVideoAvailable = this.videoDevices.length > 0
      this.isAudioAvailable = this.audioDevices.length > 0
      
      console.log(`检测到 ${this.videoDevices.length} 个视频设备和 ${this.audioDevices.length} 个音频设备`)
    } catch (error) {
      console.error('检查媒体设备失败:', error)
    }
  }
  
  /**
   * 获取视频流
   */
  async getVideoStream(constraints = {}) {
    if (!this.isVideoAvailable) {
      console.warn('没有可用的视频设备')
      return null
    }
    
    try {
      // 如果已有视频流，先停止
      if (this.videoStream) {
        this.stopVideoStream()
      }
      
      // 默认约束
      const defaultConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      }
      
      // 合并约束
      const finalConstraints = {
        ...defaultConstraints,
        ...constraints
      }
      
      // 获取媒体流
      this.videoStream = await navigator.mediaDevices.getUserMedia(finalConstraints)
      return this.videoStream
    } catch (error) {
      console.error('获取视频流失败:', error)
      return null
    }
  }
  
  /**
   * 获取音频流
   */
  async getAudioStream(constraints = {}) {
    if (!this.isAudioAvailable) {
      console.warn('没有可用的音频设备')
      return null
    }
    
    try {
      // 如果已有音频流，先停止
      if (this.audioStream) {
        this.stopAudioStream()
      }
      
      // 默认约束
      const defaultConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      }
      
      // 合并约束
      const finalConstraints = {
        ...defaultConstraints,
        ...constraints
      }
      
      // 获取媒体流
      this.audioStream = await navigator.mediaDevices.getUserMedia(finalConstraints)
      return this.audioStream
    } catch (error) {
      console.error('获取音频流失败:', error)
      return null
    }
  }
  
  /**
   * 停止视频流
   */
  stopVideoStream() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop())
      this.videoStream = null
    }
  }
  
  /**
   * 停止音频流
   */
  stopAudioStream() {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop())
      this.audioStream = null
    }
  }
  
  /**
   * 停止所有媒体流
   */
  stopAllStreams() {
    this.stopVideoStream()
    this.stopAudioStream()
  }
  
  /**
   * 获取可用的视频设备
   */
  getVideoDevices() {
    return this.videoDevices
  }
  
  /**
   * 获取可用的音频设备
   */
  getAudioDevices() {
    return this.audioDevices
  }
  
  /**
   * 检查摄像头权限
   */
  async checkCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      console.error('摄像头权限检查失败:', error)
      return false
    }
  }
  
  /**
   * 检查麦克风权限
   */
  async checkMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      console.error('麦克风权限检查失败:', error)
      return false
    }
  }
}

// 全局媒体设备服务实例
export const mediaDevices = new MediaDevicesService()