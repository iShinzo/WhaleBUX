import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center ${
            isActive('/') ? 'text-green-500' : 'text-gray-400'
          }`}
        >
          <span className="text-sm">HOME</span>
        </Link>
        
        <Link 
          to="/tasks" 
          className={`flex flex-col items-center ${
            isActive('/tasks') ? 'text-green-500' : 'text-gray-400'
          }`}
        >
          <span className="text-sm">TASK</span>
        </Link>
        
        <button 
          className="flex flex-col items-center text-gray-600 cursor-not-allowed"
          disabled
        >
          <span className="text-sm">NFT</span>
          <span className="text-xs">Soon</span>
        </button>
        
        <Link 
          to="/friends" 
          className={`flex flex-col items-center ${
            isActive('/friends') ? 'text-green-500' : 'text-gray-400'
          }`}
        >
          <span className="text-sm">FRIENDS</span>
        </Link>
        
        <Link 
          to="/wallet" 
          className={`flex flex-col items-center ${
            isActive('/wallet') ? 'text-green-500' : 'text-gray-400'
          }`}
        >
          <span className="text-sm">WALLET</span>
        </Link>
      </div>
    </nav>
  )
}