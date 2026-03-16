import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../utils/api'

const ROOM_COLORS = [
  'bg-primary/20 text-primary',
  'bg-blue-500/20 text-blue-400',
  'bg-green-500/20 text-green-400',
  'bg-orange-500/20 text-orange-400',
  'bg-pink-500/20 text-pink-400',
  'bg-teal-500/20 text-teal-400',
]

function RoomCard({ room, isJoined }) {
  const navigate = useNavigate()
  const [isJoining, setIsJoining] = useState(false)

  // Pick a consistent color based on room name
  const colorIdx = room.name ? room.name.charCodeAt(0) % ROOM_COLORS.length : 0
  const colorClass = ROOM_COLORS[colorIdx]

  const handleJoin = async () => {
    try {
      setIsJoining(true)
      await fetchWithAuth(`/api/rooms/${room._id}/join`, { method: 'POST' })
      navigate(`/workspace?roomId=${room._id}`)
    } catch (err) {
      console.error('Failed to join room', err)
    } finally {
      setIsJoining(false)
    }
  }

  const handleOpen = () => {
    navigate(`/workspace?roomId=${room._id}`)
  }

  const memberCount = room.memberCount || room.members?.length || 1
  const isActive = memberCount > 2

  return (
    <div className="group bg-[#111b21] border border-[#202c33] rounded-2xl p-5 hover:border-primary/40 hover:bg-[#111b21]/80 transition-all flex flex-col gap-4">
      {/* Top row: icon + badges */}
      <div className="flex justify-between items-start">
        <div className={`size-12 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
          <span className="material-symbols-outlined text-2xl">{room.icon || 'tag'}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {isActive && (
            <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
              <span className="size-1.5 rounded-full bg-green-500 block" />
              Active
            </span>
          )}
          {isJoined && (
            <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
              <span className="material-symbols-outlined text-[12px]">check_circle</span>
              Joined
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors mb-1 truncate">
          {room.name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2">{room.description || 'No description provided.'}</p>
      </div>

      {/* Footer: members + action */}
      <div className="border-t border-[#202c33] pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span><span className="text-slate-300 font-semibold">{memberCount}</span> member{memberCount !== 1 ? 's' : ''}</span>
        </div>
        {isJoined ? (
          <button
            onClick={handleOpen}
            className="flex items-center gap-2 bg-[#202c33] hover:bg-primary/20 text-slate-300 hover:text-primary px-4 py-2 rounded-xl text-sm font-bold transition-all border border-[#2d3b43] hover:border-primary/30"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            Open
          </button>
        ) : (
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="flex items-center gap-2 bg-primary hover:brightness-110 text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">{isJoining ? 'hourglass_empty' : 'login'}</span>
            {isJoining ? 'Joining...' : 'Join Room'}
          </button>
        )}
      </div>
    </div>
  )
}

export default RoomCard
