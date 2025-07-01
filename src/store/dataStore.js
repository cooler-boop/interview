import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useDataStore = create(
  persist(
    (set, get) => ({
      // 简历数据
      resumes: [],
      
      // 面试会话数据
      interviewSessions: [],
      
      // 用户统计数据
      statistics: {
        totalResumes: 0,
        totalInterviews: 0,
        totalPracticeTime: 0,
        averageResumeScore: 0,
        averageInterviewScore: 0,
        lastActivity: null
      },
      
      // 职业规划数据
      careerGoals: [],
      learningResources: [],
      
      // 职位匹配数据
      jobMatches: [],
      searchHistory: [],
      
      // 添加简历
      addResume: (resume) => {
        const newResume = {
          id: Date.now().toString(),
          ...resume,
          createdAt: resume.createdAt || new Date().toISOString()
        }
        
        set(state => {
          const totalScore = state.resumes.reduce((sum, r) => sum + r.overallScore, 0) + resume.overallScore
          const newCount = state.resumes.length + 1
          
          return {
            resumes: [newResume, ...state.resumes],
            statistics: {
              ...state.statistics,
              totalResumes: newCount,
              averageResumeScore: totalScore / newCount,
              lastActivity: new Date().toISOString()
            }
          }
        })
        
        return newResume
      },
      
      // 删除简历
      removeResume: (id) => {
        set(state => {
          const filteredResumes = state.resumes.filter(resume => resume.id !== id)
          const totalScore = filteredResumes.reduce((sum, r) => sum + r.overallScore, 0)
          const newCount = filteredResumes.length
          
          return {
            resumes: filteredResumes,
            statistics: {
              ...state.statistics,
              totalResumes: newCount,
              averageResumeScore: newCount > 0 ? totalScore / newCount : 0,
              lastActivity: new Date().toISOString()
            }
          }
        })
      },
      
      // 添加面试会话
      addInterviewSession: (session) => {
        const newSession = {
          id: Date.now().toString(),
          ...session,
          createdAt: new Date().toISOString()
        }
        
        set(state => ({
          interviewSessions: [newSession, ...state.interviewSessions],
          statistics: {
            ...state.statistics,
            totalInterviews: state.statistics.totalInterviews + 1,
            lastActivity: new Date().toISOString()
          }
        }))
        
        return newSession
      },
      
      // 更新面试会话
      updateInterviewSession: (sessionId, updates) => {
        set(state => ({
          interviewSessions: state.interviewSessions.map(session =>
            session.id === sessionId ? { ...session, ...updates } : session
          )
        }))
      },
      
      // 添加职业目标
      addCareerGoal: (goal) => {
        const newGoal = {
          id: Date.now().toString(),
          ...goal,
          createdAt: new Date().toISOString(),
          progress: 0,
          status: 'active'
        }
        
        set(state => ({
          careerGoals: [newGoal, ...state.careerGoals]
        }))
        
        return newGoal
      },
      
      // 更新职业目标
      updateCareerGoal: (goalId, updates) => {
        set(state => ({
          careerGoals: state.careerGoals.map(goal =>
            goal.id === goalId ? { ...goal, ...updates } : goal
          )
        }))
      },
      
      // 添加学习资源
      addLearningResource: (resource) => {
        const newResource = {
          id: Date.now().toString(),
          ...resource,
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
        
        set(state => ({
          learningResources: [newResource, ...state.learningResources]
        }))
        
        return newResource
      },
      
      // 添加职位匹配
      addJobMatch: (job) => {
        const newJob = {
          id: Date.now().toString(),
          ...job,
          recommendedAt: new Date().toISOString()
        }
        
        set(state => ({
          jobMatches: [newJob, ...state.jobMatches]
        }))
        
        return newJob
      },
      
      // 更新练习时间
      updatePracticeTime: (additionalTime) => {
        set(state => ({
          statistics: {
            ...state.statistics,
            totalPracticeTime: state.statistics.totalPracticeTime + additionalTime,
            lastActivity: new Date().toISOString()
          }
        }))
      },
      
      // 获取统计数据
      getStatistics: () => get().statistics,
      
      // 清空所有数据
      clearAllData: () => {
        set({
          resumes: [],
          interviewSessions: [],
          statistics: {
            totalResumes: 0,
            totalInterviews: 0,
            totalPracticeTime: 0,
            averageResumeScore: 0,
            averageInterviewScore: 0,
            lastActivity: null
          },
          careerGoals: [],
          learningResources: [],
          jobMatches: [],
          searchHistory: []
        })
      }
    }),
    {
      name: 'data-storage'
    }
  )
)

export default useDataStore