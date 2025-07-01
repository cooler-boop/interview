import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    category: '云端',
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4-turbo-preview',
      'gpt-4',
      'gpt-4-32k',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'gpt-3.5-turbo-instruct',
      'text-davinci-003',
      'text-davinci-002',
      'text-curie-001',
      'text-babbage-001',
      'text-ada-001'
    ],
    defaultBaseUrl: 'https://api.openai.com/v1'
  },
  claude: {
    name: 'Claude (Anthropic)',
    category: '云端',
    models: [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'claude-2.1',
      'claude-2.0',
      'claude-instant-1.2',
      'claude-instant-1.1'
    ],
    defaultBaseUrl: 'https://api.anthropic.com'
  },
  gemini: {
    name: 'Google Gemini',
    category: '云端',
    models: [
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-1.0-pro',
      'gemini-pro',
      'gemini-pro-vision',
      'text-bison-001',
      'text-bison-002',
      'chat-bison-001',
      'chat-bison-002'
    ],
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1'
  },
  apixiaoyun: {
    name: 'API小云',
    category: '云端',
    models: [
      'gemini-2.5-flash-preview-04-17-thinking',
      'gemini-2.5-pro-preview-05-06',
      'gemini-2.5-pro-preview',
      'gemini-2.5-flash-lite-preview-06-17'
    ],
    defaultBaseUrl: 'https://apixiaoyun.deno.dev/v1'
  },
  qwen: {
    name: '通义千问 (阿里云)',
    category: '云端',
    models: [
      'qwen2.5-72b-instruct',
      'qwen2.5-32b-instruct',
      'qwen2.5-14b-instruct',
      'qwen2.5-7b-instruct',
      'qwen2.5-3b-instruct',
      'qwen2.5-1.5b-instruct',
      'qwen2.5-0.5b-instruct',
      'qwen-max',
      'qwen-max-longcontext',
      'qwen-plus',
      'qwen-turbo',
      'qwen-long',
      'qwen-vl-plus',
      'qwen-vl-max'
    ],
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/api/v1'
  },
  ernie: {
    name: '文心一言 (百度)',
    category: '云端',
    models: [
      'ernie-4.0-8k',
      'ernie-4.0-8k-preview',
      'ernie-3.5-8k',
      'ernie-3.5-8k-preview',
      'ernie-3.5-4k',
      'ernie-speed-8k',
      'ernie-speed-128k',
      'ernie-lite-8k',
      'ernie-tiny-8k',
      'ernie-character-8k',
      'ernie-functions-8k'
    ],
    defaultBaseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1'
  },
  zhipu: {
    name: '智谱AI (清华)',
    category: '云端',
    models: [
      'glm-4-plus',
      'glm-4-0520',
      'glm-4',
      'glm-4-air',
      'glm-4-airx',
      'glm-4-flash',
      'glm-4-long',
      'glm-3-turbo',
      'chatglm_turbo',
      'chatglm_pro',
      'chatglm_std',
      'chatglm_lite'
    ],
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4'
  },
  moonshot: {
    name: '月之暗面 (Kimi)',
    category: '云端',
    models: [
      'moonshot-v1-8k',
      'moonshot-v1-32k',
      'moonshot-v1-128k',
      'moonshot-v1-auto'
    ],
    defaultBaseUrl: 'https://api.moonshot.cn/v1'
  },
  deepseek: {
    name: 'DeepSeek',
    category: '云端',
    models: [
      'deepseek-chat',
      'deepseek-coder',
      'deepseek-reasoner'
    ],
    defaultBaseUrl: 'https://api.deepseek.com/v1'
  },
  doubao: {
    name: '豆包 (字节跳动)',
    category: '云端',
    models: [
      'doubao-pro-4k',
      'doubao-pro-32k',
      'doubao-pro-128k',
      'doubao-lite-4k',
      'doubao-lite-32k',
      'doubao-lite-128k'
    ],
    defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3'
  },
  spark: {
    name: '讯飞星火 (科大讯飞)',
    category: '云端',
    models: [
      'spark-max',
      'spark-pro',
      'spark-lite',
      'spark-ultra',
      'spark-4.0-ultra',
      'spark-3.5-max',
      'spark-3.1-lite'
    ],
    defaultBaseUrl: 'https://spark-api.xf-yun.com/v1'
  },
  minimax: {
    name: 'MiniMax',
    category: '云端',
    models: [
      'abab6.5s-chat',
      'abab6.5g-chat',
      'abab6.5t-chat',
      'abab5.5s-chat',
      'abab5.5-chat'
    ],
    defaultBaseUrl: 'https://api.minimax.chat/v1'
  },
  baichuan: {
    name: '百川智能',
    category: '云端',
    models: [
      'baichuan2-turbo',
      'baichuan2-turbo-192k',
      'baichuan2-53b',
      'baichuan-text-embedding'
    ],
    defaultBaseUrl: 'https://api.baichuan-ai.com/v1'
  },
  sensetime: {
    name: '商汤 (SenseTime)',
    category: '云端',
    models: [
      'nova-ptc-xl-v1',
      'nova-ptc-xs-v1',
      'sensechat-5',
      'sensechat-turbo'
    ],
    defaultBaseUrl: 'https://api.sensenova.cn/v1'
  },
  yi: {
    name: '零一万物 (01.AI)',
    category: '云端',
    models: [
      'yi-lightning',
      'yi-large',
      'yi-large-turbo',
      'yi-medium',
      'yi-medium-200k',
      'yi-spark',
      'yi-vision'
    ],
    defaultBaseUrl: 'https://api.lingyiwanwu.com/v1'
  },
  stepfun: {
    name: '阶跃星辰 (StepFun)',
    category: '云端',
    models: [
      'step-1v-8k',
      'step-1v-32k',
      'step-1-8k',
      'step-1-32k',
      'step-1-128k',
      'step-1-256k'
    ],
    defaultBaseUrl: 'https://api.stepfun.com/v1'
  },
  groq: {
    name: 'Groq',
    category: '云端',
    models: [
      'llama-3.1-405b-reasoning',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-groq-70b-8192-tool-use-preview',
      'llama3-groq-8b-8192-tool-use-preview',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'gemma-7b-it'
    ],
    defaultBaseUrl: 'https://api.groq.com/openai/v1'
  },
  together: {
    name: 'Together AI',
    category: '云端',
    models: [
      'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'mistralai/Mixtral-8x22B-Instruct-v0.1',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
      'google/gemma-2-27b-it',
      'microsoft/WizardLM-2-8x22B'
    ],
    defaultBaseUrl: 'https://api.together.xyz/v1'
  },
  perplexity: {
    name: 'Perplexity',
    category: '云端',
    models: [
      'llama-3.1-sonar-small-128k-online',
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-huge-128k-online',
      'llama-3.1-8b-instruct',
      'llama-3.1-70b-instruct'
    ],
    defaultBaseUrl: 'https://api.perplexity.ai'
  },
  cohere: {
    name: 'Cohere',
    category: '云端',
    models: [
      'command-r-plus',
      'command-r',
      'command',
      'command-nightly',
      'command-light',
      'command-light-nightly'
    ],
    defaultBaseUrl: 'https://api.cohere.ai/v1'
  },
  mistral: {
    name: 'Mistral AI',
    category: '云端',
    models: [
      'mistral-large-latest',
      'mistral-large-2407',
      'mistral-medium-latest',
      'mistral-small-latest',
      'mistral-tiny',
      'open-mistral-7b',
      'open-mixtral-8x7b',
      'open-mixtral-8x22b',
      'codestral-latest'
    ],
    defaultBaseUrl: 'https://api.mistral.ai/v1'
  },
  ollama: {
    name: 'Ollama (本地)',
    category: '本地',
    models: [
      'llama3.2:latest',
      'llama3.2:3b',
      'llama3.2:1b',
      'llama3.1:latest',
      'llama3.1:70b',
      'llama3.1:8b',
      'llama3:latest',
      'llama3:70b',
      'llama3:8b',
      'llama2:latest',
      'llama2:70b',
      'llama2:13b',
      'llama2:7b',
      'codellama:latest',
      'codellama:70b',
      'codellama:34b',
      'codellama:13b',
      'codellama:7b',
      'mistral:latest',
      'mistral:7b',
      'mixtral:latest',
      'mixtral:8x7b',
      'mixtral:8x22b',
      'qwen2.5:latest',
      'qwen2.5:72b',
      'qwen2.5:32b',
      'qwen2.5:14b',
      'qwen2.5:7b',
      'qwen2.5:3b',
      'qwen2.5:1.5b',
      'qwen2.5:0.5b',
      'qwen2:latest',
      'qwen2:72b',
      'qwen2:7b',
      'gemma2:latest',
      'gemma2:27b',
      'gemma2:9b',
      'gemma2:2b',
      'gemma:latest',
      'gemma:7b',
      'gemma:2b',
      'phi3:latest',
      'phi3:14b',
      'phi3:3.8b',
      'phi3.5:latest',
      'neural-chat:latest',
      'starling-lm:latest',
      'vicuna:latest',
      'vicuna:33b',
      'vicuna:13b',
      'vicuna:7b',
      'orca-mini:latest',
      'orca-mini:13b',
      'orca-mini:7b',
      'orca-mini:3b',
      'wizard-vicuna-uncensored:latest',
      'wizard-vicuna-uncensored:30b',
      'wizard-vicuna-uncensored:13b',
      'wizard-vicuna-uncensored:7b',
      'nous-hermes2:latest',
      'nous-hermes2:34b',
      'nous-hermes2:10.7b',
      'dolphin-mistral:latest',
      'dolphin-mistral:7b',
      'openchat:latest',
      'openchat:7b',
      'zephyr:latest',
      'zephyr:7b',
      'solar:latest',
      'solar:10.7b',
      'deepseek-coder:latest',
      'deepseek-coder:33b',
      'deepseek-coder:6.7b',
      'deepseek-coder:1.3b',
      'codeqwen:latest',
      'codeqwen:7b',
      'magicoder:latest',
      'magicoder:7b',
      'starcoder2:latest',
      'starcoder2:15b',
      'starcoder2:7b',
      'starcoder2:3b'
    ],
    defaultBaseUrl: 'http://localhost:11434'
  },
  lmstudio: {
    name: 'LM Studio (本地)',
    category: '本地',
    models: [
      'local-model',
      'llama-3.2-3b-instruct',
      'llama-3.2-1b-instruct',
      'llama-3.1-8b-instruct',
      'qwen2.5-7b-instruct',
      'qwen2.5-3b-instruct',
      'qwen2.5-1.5b-instruct',
      'gemma-2-9b-instruct',
      'gemma-2-2b-instruct',
      'phi-3.5-mini-instruct',
      'mistral-7b-instruct',
      'codellama-7b-instruct',
      'deepseek-coder-6.7b-instruct'
    ],
    defaultBaseUrl: 'http://localhost:1234/v1'
  },
  janai: {
    name: 'Jan AI (本地)',
    category: '本地',
    models: [
      'llama3.2-3b-instruct',
      'llama3.2-1b-instruct',
      'qwen2.5-7b-instruct',
      'qwen2.5-3b-instruct',
      'gemma-2-9b-instruct',
      'gemma-2-2b-instruct',
      'phi-3.5-mini-instruct',
      'mistral-7b-instruct-v0.3',
      'openchat-3.5-7b',
      'neural-chat-7b-v3.3'
    ],
    defaultBaseUrl: 'http://localhost:1337/v1'
  },
  gpt4all: {
    name: 'GPT4All (本地)',
    category: '本地',
    models: [
      'Meta-Llama-3-8B-Instruct.Q4_0.gguf',
      'Phi-3-mini-4k-instruct.Q4_0.gguf',
      'Mistral-7B-Instruct-v0.1.Q4_0.gguf',
      'orca-mini-3b-gguf2-q4_0.gguf',
      'gpt4all-falcon-q4_0.gguf',
      'wizardlm-13b-v1.2.Q4_0.gguf',
      'nous-hermes-llama2-13b.Q4_0.gguf',
      'gpt4all-13b-snoozy-q4_0.gguf'
    ],
    defaultBaseUrl: 'http://localhost:4891/v1'
  },
  textgen: {
    name: 'Text Generation WebUI (本地)',
    category: '本地',
    models: [
      'local-model',
      'llama-3.1-8b-instruct',
      'qwen2.5-7b-instruct',
      'mistral-7b-instruct',
      'codellama-7b-instruct',
      'vicuna-7b-v1.5',
      'wizard-vicuna-7b-uncensored',
      'nous-hermes-13b',
      'alpaca-7b'
    ],
    defaultBaseUrl: 'http://localhost:5000/v1'
  },
  koboldcpp: {
    name: 'KoboldCpp (本地)',
    category: '本地',
    models: [
      'local-model',
      'llama-3.1-8b-instruct.gguf',
      'qwen2.5-7b-instruct.gguf',
      'mistral-7b-instruct.gguf',
      'codellama-7b-instruct.gguf',
      'phi-3-mini-4k-instruct.gguf',
      'gemma-2-9b-instruct.gguf'
    ],
    defaultBaseUrl: 'http://localhost:5001/v1'
  }
}

const useAIConfigStore = create(
  persist(
    (set, get) => ({
      configs: {},
      activeProvider: 'apixiaoyun',
      
      // 获取所有提供商
      getProviders: () => AI_PROVIDERS,
      
      // 获取提供商配置
      getProviderConfig: (providerId) => {
        // 如果是API小云，返回图片中的配置
        if (providerId === 'apixiaoyun') {
          return {
            apiKey: 'AlzaSyBAsW3Wb1DV5-oPQpv4QLMwyXmhrHLGXtE',
            baseUrl: 'https://apixiaoyun.deno.dev/v1',
            model: 'gemini-2.5-flash-preview-04-17-thinking',
            customModel: '',
            maxTokens: '2048',
            temperature: '0.7',
            topP: '1.0',
            frequencyPenalty: '0.0',
            presencePenalty: '0.0'
          }
        }
        
        return get().configs[providerId] || {
          apiKey: '',
          baseUrl: AI_PROVIDERS[providerId]?.defaultBaseUrl || '',
          model: AI_PROVIDERS[providerId]?.models[0] || '',
          customModel: '',
          maxTokens: '2048',
          temperature: '0.7',
          topP: '1.0',
          frequencyPenalty: '0.0',
          presencePenalty: '0.0'
        }
      },
      
      // 更新提供商配置
      updateProviderConfig: (providerId, config) => {
        set(state => ({
          configs: {
            ...state.configs,
            [providerId]: {
              ...state.configs[providerId],
              ...config
            }
          }
        }))
      },
      
      // 设置活跃提供商
      setActiveProvider: (providerId) => {
        set({ activeProvider: providerId })
      },
      
      // 测试连接
      testConnection: async (providerId) => {
        const config = get().getProviderConfig(providerId)
        
        if (!config.apiKey && !AI_PROVIDERS[providerId]?.category === '本地') {
          throw new Error('API密钥不能为空')
        }
        
        try {
          // 模拟连接测试
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 对于本地模型，检查URL可达性
          if (AI_PROVIDERS[providerId]?.category === '本地') {
            try {
              const response = await fetch(config.baseUrl + '/models', {
                method: 'GET',
                timeout: 5000
              })
              if (!response.ok) {
                throw new Error(`本地服务不可达: ${response.status}`)
              }
            } catch (error) {
              throw new Error(`本地服务连接失败: ${error.message}`)
            }
          }
          
          return { success: true, message: '连接成功' }
        } catch (error) {
          throw new Error('连接失败: ' + error.message)
        }
      },
      
      // 获取当前活跃配置
      getActiveConfig: () => {
        const { activeProvider, configs } = get()
        return {
          provider: activeProvider,
          config: configs[activeProvider] || {}
        }
      },
      
      // 获取模型统计
      getModelStats: () => {
        const providers = AI_PROVIDERS
        let totalModels = 0
        let cloudModels = 0
        let localModels = 0
        
        Object.values(providers).forEach(provider => {
          totalModels += provider.models.length
          if (provider.category === '云端') {
            cloudModels += provider.models.length
          } else {
            localModels += provider.models.length
          }
        })
        
        return {
          totalProviders: Object.keys(providers).length,
          totalModels,
          cloudModels,
          localModels,
          cloudProviders: Object.values(providers).filter(p => p.category === '云端').length,
          localProviders: Object.values(providers).filter(p => p.category === '本地').length
        }
      },
      
      // 搜索模型
      searchModels: (query) => {
        const results = []
        const lowerQuery = query.toLowerCase()
        
        Object.entries(AI_PROVIDERS).forEach(([providerId, provider]) => {
          provider.models.forEach(model => {
            if (model.toLowerCase().includes(lowerQuery) || 
                provider.name.toLowerCase().includes(lowerQuery)) {
              results.push({
                providerId,
                providerName: provider.name,
                model,
                category: provider.category
              })
            }
          })
        })
        
        return results
      }
    }),
    {
      name: 'ai-config-storage'
    }
  )
)

export default useAIConfigStore