import React, { useState, useEffect } from 'react'
import RoomCard from '../components/RoomCard'
import CreateRoomForm from '../components/CreateRoomForm'

function RoomsPage() {
  const [activeFilter, setActiveFilter] = useState('trending')
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/rooms', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setRooms(data.rooms || [])
      }
    } catch (err) {
      console.error('Failed to fetch rooms', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleRoomCreated = (newRoom) => {
    setRooms(prev => [newRoom, ...prev])
  }

  return (
    <div className="p-8 space-y-8">
      {/* Hero Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Rooms</h1>
        <p className="text-slate-500">Create your own space or join trending communities.</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Discovery */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">explore</span>
              Discover Public Rooms
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('trending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === 'trending'
                    ? 'bg-primary text-white hover:shadow-lg hover:shadow-primary/30 active:scale-95 relative overflow-hidden'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setActiveFilter('newest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === 'newest'
                    ? 'bg-primary text-white hover:shadow-lg hover:shadow-primary/30 active:scale-95'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                Newest
              </button>
            </div>
          </div>

          {/* Room Cards Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center p-12 bg-primary/5 rounded-2xl border border-primary/10">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">forum</span>
              <h3 className="text-lg font-bold">No rooms found</h3>
              <p className="text-slate-500 text-sm">Be the first to create a public space!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Create Room */}
        <div className="lg:col-span-4">
          <CreateRoomForm onRoomCreated={handleRoomCreated} />
        </div>
      </div>
    </div>
  )
}

export default RoomsPage
