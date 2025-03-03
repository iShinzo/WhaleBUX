import { useEffect } from 'react'
import { useUserStore } from '../stores/userStore'
import { useMiningStore } from '../stores/miningStore'
import UserStats from '../components/mining/UserStats'
import ExperienceBar from '../components/mining/ExperienceBar'
import CircularTimer from '../components/mining/CircularTimer'
import MiningControls from '../components/mining/MiningControls'

export default function Home() {
  const { 
    wbuxBalance, 
    wbuxDollars,
    level,
    username 
  } = useUserStore()
  
  const { 
    isMining, 
    miningProgress, 
    currentMined,
    startMining,
    updateMiningProgress,
    stopMining
  } = useMiningStore()

  useEffect(() => {
    let interval: number | null = null
    
    if (isMining) {
      interval = window.setInterval(() => {
        updateMiningProgress(level)
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMining, level, updateMiningProgress])

  const handleStartMining = () => {
    if (!isMining) {
      startMining()
    }
  }

  const handleCompleteMining = () => {
    if (currentMined > 0) {
      stopMining()
    }
  }

  return (
    <div className="flex flex-col min-h-screen text-white pb-20">
      <UserStats 
        wbuxBalance={wbuxBalance}
        wbuxDollars={wbuxDollars}
        username={username}
      />
      
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <ExperienceBar />
        
        <CircularTimer 
          progress={miningProgress}
          isMining={isMining}
          level={level}
        />

        <MiningControls 
          isMining={isMining}
          currentMined={currentMined}
          onStartMining={handleStartMining}
          onCompleteMining={handleCompleteMining}
        />
      </div>
    </div>
  )
}