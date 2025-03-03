interface UserStatsProps {
  wbuxBalance: number
  wbuxDollars: number
  username: string
}

export default function UserStats({ wbuxBalance, wbuxDollars, username }: UserStatsProps) {
  return (
    <div className="flex items-center justify-between px-4 py-6 bg-gray-900 border-b border-gray-800">
      <div className="text-right">
        <div className="text-gray-400 text-sm">WBUX $</div>
        <div className="text-xl font-bold text-white">${wbuxDollars.toFixed(2)}</div>
      </div>
      
      <div className="text-center">
        <div className="text-gray-400 text-sm">@{username}</div>
      </div>
      
      <div className="text-left">
        <div className="text-gray-400 text-sm">$WBUX</div>
        <div className="text-xl font-bold text-white">{wbuxBalance.toLocaleString()}</div>
      </div>
    </div>
  )
}