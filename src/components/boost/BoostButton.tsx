interface Level {
  level: number
  bonus: string
  cost: number
  tokenCost: number
}

interface BoostConfig {
  name: string
  levels: Level[]
}

interface BoostButtonProps {
  config: BoostConfig
  currentLevel: number
  onUpgrade: () => void
  wbuxDollars: number
  wbuxBalance: number
}

export default function BoostButton({ 
  config, 
  currentLevel, 
  onUpgrade,
  wbuxDollars,
  wbuxBalance
}: BoostButtonProps) {
  const nextLevel = config.levels[currentLevel]
  const canAfford = nextLevel?.cost <= wbuxDollars && nextLevel?.tokenCost <= wbuxBalance

  if (!nextLevel) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">{config.name}</h3>
          <span className="text-green-500">MAX LEVEL</span>
        </div>
        <div className="text-gray-400">
          All upgrades completed
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">{config.name}</h3>
        <span className="text-gray-400">Level {currentLevel}/9</span>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-400">Next Level Bonus</div>
        <div className="text-lg text-green-500 font-semibold">
          {nextLevel.bonus}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-gray-400">Cost</div>
          <div className="text-white">
            {nextLevel.cost > 0 && `$${nextLevel.cost}`}
            {nextLevel.tokenCost > 0 && `${nextLevel.tokenCost} WBUX`}
          </div>
        </div>
      </div>

      <button
        onClick={onUpgrade}
        disabled={!canAfford}
        className={`w-full py-2 rounded-lg font-semibold ${
          canAfford
            ? 'bg-green-600 hover:bg-green-500 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canAfford ? 'Upgrade' : 'Insufficient Balance'}
      </button>
    </div>
  )
}