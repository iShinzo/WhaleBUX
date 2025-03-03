import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Boost from './pages/Boost'
import Tasks from './pages/Tasks'
import Friends from './pages/Friends'
import DailyStreak from './pages/DailyStreak'
import Wallet from './pages/Wallet'
import { useUserStore } from './stores/userStore'
import { WebApp } from '@twa-dev/sdk'
import './index.css'

export default function App() {
  const loadUserData = useUserStore(state => state.loadUserData)

  useEffect(() => {
    // Initialize Telegram Web App
    if (WebApp) {
      WebApp.ready();
      WebApp.expand();
    }
    
    // Load user data
    loadUserData()
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-[100vh] min-h-[100dvh] bg-gray-900">
        <div className="max-w-md mx-auto bg-black min-h-[100vh] min-h-[100dvh] shadow-lg relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boost" element={<Boost />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/daily-streak" element={<DailyStreak />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
          <Navigation />
        </div>
      </div>
    </BrowserRouter>
  )
}