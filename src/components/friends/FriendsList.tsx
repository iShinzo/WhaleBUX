import { useUserStore } from '../../stores/userStore'

interface Friend {
  id: string
  username: string
  level: number
  joinedAt: string
  lastActive: string
  miningStreak: number
  totalMined: number
  taskPoints: number
}

interface FriendsListProps {
  friends: Friend[]
}

export default function FriendsList({ friends }: FriendsListProps) {
  const { removeFriend, upgradeFriendLevel } = useUserStore()

  if (friends.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No friends added yet. Invite friends to increase your mining boost!
      </div>
    )
  }

  const getActivityStatus = (lastActive: string) => {
    const hours = (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60)
    if (hours < 24) return 'Active Today'
    if (hours < 48) return 'Active Yesterday'
    return 'Inactive'
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="bg-white rounded-lg p-4 shadow border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">@{friend.username}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Level {friend.level}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  getActivityStatus(friend.lastActive).includes('Active')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getActivityStatus(friend.lastActive)}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Mining Streak: {friend.miningStreak} days</p>
                <p>Total Mined: {friend.totalMined.toLocaleString()} WBUX</p>
                <p>Task Points: {friend.taskPoints}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => upgradeFriendLevel(friend.id)}
                className="text-sm bg-green-500 text-white px-3 py-1 rounded"
                disabled={friend.level >= 9}
              >
                Upgrade
              </button>
              <button
                onClick={() => removeFriend(friend.id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}