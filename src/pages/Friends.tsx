import { useState } from 'react'
import { useUserStore } from '../stores/userStore'
import ReferralLink from '../components/friends/ReferralLink'
import FriendsList from '../components/friends/FriendsList'
import ReferralBoostCard from '../components/friends/ReferralBoostCard'

export default function Friends() {
  const { friends, referralBoost } = useUserStore()
  const activeCount = friends.filter(f => 
    (Date.now() - new Date(f.lastActive).getTime()) < 24 * 60 * 60 * 1000
  ).length

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">Friends & Referrals</h1>
      
      <ReferralLink />
      
      <ReferralBoostCard 
        boost={referralBoost} 
        friendCount={activeCount}
      />
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Friends</h2>
        <FriendsList friends={friends} />
      </div>
    </div>
  )
}