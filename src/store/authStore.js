import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isTrialUser: false,
      
      // 创建试用账户
      createTrialAccount: () => {
        const trialUser = {
          id: `trial_${Date.now()}`,
          name: '试用用户',
          email: 'trial@example.com',
          isTrialUser: true,
          createdAt: new Date().toISOString()
        }
        
        set({
          user: trialUser,
          isAuthenticated: true,
          isTrialUser: true
        })
        
        return trialUser
      },
      
      // 登录
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
          isTrialUser: userData.isTrialUser || false
        })
      },
      
      // 登出
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isTrialUser: false
        })
      },
      
      // 更新用户信息
      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates }
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isTrialUser: state.isTrialUser
      })
    }
  )
)

export default useAuthStore