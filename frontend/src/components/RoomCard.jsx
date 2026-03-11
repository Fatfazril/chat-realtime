import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../utils/api'

function RoomCard({ room }) {
  const navigate = useNavigate()
  const [isJoining, setIsJoining] = useState(false)
  const badgeStyles = {
    active: 'bg-green-500/20 text-green-500',
    public: 'bg-primary/20 text-primary',
    hot: 'bg-orange-500/20 text-orange-500',
  }

  const badgeStyle = badgeStyles[room.badge?.toLowerCase()] || badgeStyles.public

  const handleJoin = async () => {
    try {
      setIsJoining(true)
      await fetchWithAuth(`/api/rooms/${room._id}/join`, {
        method: 'POST'
      })
      
      // Even if already joined (error 400), we can just navigate to the room.
      // Or we can parse the error. For now, navigate to it in Nexus workspace.
      navigate(`/nexus?roomId=${room._id}`)
    } catch (err) {
      console.error('Failed to join room', err)
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="group bg-primary/5 border border-primary/10 rounded-xl p-5 hover:bg-primary/10 transition-all hover:border-primary/30">
      {/* Top row: icon + badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">{room.icon}</span>
        </div>
        <span className={`${badgeStyle} text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 ${
          room.badge?.toLowerCase() === 'active' ? 'animate-pulse' : ''
        }`}>
          {room.badge?.toLowerCase() === 'active' && (
            <span className="block size-1.5 rounded-full bg-green-500" />
          )}
          {room.badge}
        </span>
      </div>

      {/* Info */}
      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
        {room.name}
      </h3>
      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{room.description}</p>

      {/* Bottom row: members + join */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <span className="material-symbols-outlined text-sm">groups</span>
          <span>{room.memberCount || 1} members</span>
        </div>
        <button 
          onClick={handleJoin}
          disabled={isJoining}
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {isJoining ? 'Joining...' : 'Join Room'}
        </button>
      </div>
    </div>
  )
}

export default RoomCard
