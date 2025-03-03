import { useState } from 'react'
import { useUserStore } from '../../stores/userStore'
import { WebApp } from '@twa-dev/sdk'

export default function ReferralLink() {
  const { username } = useUserStore()
  const [copied, setCopied] = useState(false)
  
  const referralLink = `https://t.me/ReferralHelperBot/WBUX?start=${username}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareReferral = () => {
    if (WebApp?.showPopup) {
      WebApp.showPopup({
        title: 'Share Referral',
        message: 'Share your referral link with friends to earn rewards!',
        buttons: [
          { id: 'share', type: 'default', text: 'Share' },
          { id: 'cancel', type: 'cancel' }
        ]
      })
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">Your Referral Link</h3>
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        />
        
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        
        <button
          onClick={shareReferral}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium"
        >
          Invite
        </button>
      </div>
    </div>
  )
}