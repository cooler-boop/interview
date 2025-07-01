import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Interview from './pages/Interview'
import Practice from './pages/Practice'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import ResumeAnalysis from './pages/ResumeAnalysis'
import CareerPlanning from './pages/CareerPlanning'
import JobMatching from './pages/JobMatching'
import Help from './pages/Help'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'
import useAuthStore from './store/authStore'

function App() {
  const { isAuthenticated, createTrialAccount } = useAuthStore()
  
  useEffect(() => {
    // 如果没有认证，自动创建试用账户
    if (!isAuthenticated) {
      createTrialAccount()
    }
  }, [isAuthenticated, createTrialAccount])
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resume-analysis" element={<ResumeAnalysis />} />
            <Route path="/career-planning" element={<CareerPlanning />} />
            <Route path="/job-matching" element={<JobMatching />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App