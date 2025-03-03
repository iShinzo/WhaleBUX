import { useState } from 'react'
import { useUserStore } from '../stores/userStore'
import TaskNavigation from '../components/tasks/TaskNavigation'
import PlaceTask from '../components/tasks/PlaceTask'
import TaskCatalog from '../components/tasks/TaskCatalog'
import WhaleBuxTasks from '../components/tasks/WhaleBuxTasks'
import UserStats from '../components/mining/UserStats'

export default function Tasks() {
  const [activeSection, setActiveSection] = useState<'place-task' | 'catalog' | 'whalebux'>('place-task')
  const { wbuxBalance, wbuxDollars, username } = useUserStore()

  const renderContent = () => {
    switch (activeSection) {
      case 'place-task':
        return <PlaceTask />
      case 'catalog':
        return <TaskCatalog />
      case 'whalebux':
        return <WhaleBuxTasks />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <UserStats 
        wbuxBalance={wbuxBalance}
        wbuxDollars={wbuxDollars}
        username={username}
      />

      <div className="p-4">
        <TaskNavigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        {renderContent()}
      </div>
    </div>
  )
}