import React, { useState } from 'react'
import RoomCard from '../components/RoomCard'
import CreateRoomForm from '../components/CreateRoomForm'

const publicRooms = [
  {
    id: 1,
    name: 'Frontend Wizards',
    icon: 'code',
    description: 'A community for React, Vue and Tailwind CSS enthusiasts to share snippets and tips.',
    members: '1.2k',
    badge: 'Active',
  },
  {
    id: 2,
    name: 'Lobby 42: Gaming',
    icon: 'sports_esports',
    description: 'Casual and competitive gaming hub for all platforms. Daily tournaments!',
    members: '840',
    badge: 'Public',
  },
  {
    id: 3,
    name: 'Design Critique',
    icon: 'palette',
    description: 'Share your UI/UX work and get constructive feedback from senior designers.',
    members: '3.1k',
    badge: 'Public',
  },
  {
    id: 4,
    name: 'AI & Future Tech',
    icon: 'psychology',
    description: 'Discussing LLMs, automation, and how technology is shaping our world today.',
    members: '2.5k',
    badge: 'Hot',
  },
]

function RoomsPage() {
  const [activeFilter, setActiveFilter] = useState('trending')

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        {/* Right: Create Room */}
        <div className="lg:col-span-4">
          <CreateRoomForm />
        </div>
      </div>
    </div>
  )
}

export default RoomsPage
