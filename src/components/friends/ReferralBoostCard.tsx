interface ReferralBoostCardProps {
  boost: number
  friendCount: number
}

export default function ReferralBoostCard({ boost, friendCount }: ReferralBoostCardProps) {
  const boostPercentage = (boost * 100).toFixed(1)

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-2">Your Referral Boost</h3>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-3xl font-bold mb-1">
            {boostPercentage}%
          </p>
          <p className="text-sm opacity-90">
            Mining Boost
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold mb-1">
            {friendCount}
          </p>
          <p className="text-sm opacity-90">
            Active Friends
          </p>
        </div>
      </div>
      
      <div className="mt-4 text-sm">
        <p className="opacity-90">
          Each friend adds a 1% boost at Level 1.
          Higher friend levels increase the boost!
        </p>
      </div>
    </div>
  )
}