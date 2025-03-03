interface TaskNavigationProps {
  activeSection: 'place-task' | 'catalog' | 'whalebux'
  onSectionChange: (section: 'place-task' | 'catalog' | 'whalebux') => void
}

export default function TaskNavigation({ activeSection, onSectionChange }: TaskNavigationProps) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <button
        onClick={() => onSectionChange('place-task')}
        className={`py-3 px-4 rounded-lg font-medium text-left ${
          activeSection === 'place-task'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-400'
        }`}
      >
        Place Task / Referral Job
      </button>
      
      <button
        onClick={() => onSectionChange('catalog')}
        className={`py-3 px-4 rounded-lg font-medium text-left ${
          activeSection === 'catalog'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-400'
        }`}
      >
        Task Catalog
      </button>
      
      <button
        onClick={() => onSectionChange('whalebux')}
        className={`py-3 px-4 rounded-lg font-medium text-left ${
          activeSection === 'whalebux'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-400'
        }`}
      >
        WhaleBux Tasks
      </button>
    </div>
  )
}