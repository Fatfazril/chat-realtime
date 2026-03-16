import React, { useState, useEffect } from 'react'
import RoomCard from '../components/RoomCard'
import CreateRoomForm from '../components/CreateRoomForm'
import { fetchWithAuth } from '../utils/api'

function RoomsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [rooms, setRooms] = useState([])
  const [myRooms, setMyRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const [allRes, myRes] = await Promise.all([
        fetchWithAuth('/api/rooms'),
        fetchWithAuth('/api/rooms/me'),
      ])
      if (allRes.ok) {
        const data = await allRes.json()
        setRooms(data.rooms || [])
      }
      if (myRes.ok) {
        const myData = await myRes.json()
        setMyRooms(myData.rooms || [])
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
    setShowCreateForm(false)
  }

  const filters = [
    { id: 'all', label: 'All Rooms', icon: 'apps' },
    { id: 'trending', label: 'Trending', icon: 'trending_up' },
    { id: 'newest', label: 'Newest', icon: 'fiber_new' },
    { id: 'my', label: 'My Rooms', icon: 'bookmark' },
  ]

  const myRoomIds = new Set(myRooms.map(r => r._id))

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = !searchQuery ||
      room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (activeFilter === 'my') return myRoomIds.has(room._id)
    return true
  }).sort((a, b) => {
    if (activeFilter === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (activeFilter === 'trending') return (b.memberCount || 0) - (a.memberCount || 0)
    return 0
  })

  return (
    <div className="min-h-screen bg-[#0b141a] text-slate-100">
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-[#202c33]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 left-40 size-60 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-2xl text-white">workspaces</span>
                  </div>
                  <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase">Community Hub</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Explore Rooms</h1>
                <p className="text-slate-400 text-lg max-w-md">Discover communities, join conversations, and build your network in real-time.</p>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 shrink-0">
                <div className="bg-[#111b21] border border-[#202c33] rounded-xl px-5 py-3 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px]">meeting_room</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Total Rooms</p>
                    <p className="text-xl font-black">{rooms.length}</p>
                  </div>
                </div>
                <div className="bg-[#111b21] border border-[#202c33] rounded-xl px-5 py-3 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-500 text-[18px]">wifi</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">My Rooms</p>
                    <p className="text-xl font-black">{myRooms.length}</p>
                  </div>
                </div>
                <div className="bg-[#111b21] border border-[#202c33] rounded-xl px-5 py-3 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-500 text-[18px]">local_fire_department</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Active Now</p>
                    <p className="text-xl font-black">{rooms.filter(r => (r.memberCount || 0) > 0).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-8 relative max-w-2xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
              <input
                type="text"
                placeholder="Search rooms by name or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#111b21] border border-[#202c33] rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-white placeholder:text-slate-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left: Discovery */}
          <div className="xl:col-span-8 space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-[#111b21] border border-[#202c33] p-1 rounded-xl">
                {filters.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      activeFilter === f.id
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0b141a]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{f.icon}</span>
                    <span className="hidden sm:inline">{f.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCreateForm(prev => !prev)}
                className="xl:hidden flex items-center gap-2 px-4 py-2 bg-primary rounded-xl text-sm font-bold text-white hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Room
              </button>
            </div>

            {/* Results Count */}
            {searchQuery && (
              <p className="text-sm text-slate-500">
                Showing <span className="text-white font-bold">{filteredRooms.length}</span> results for &ldquo;<span className="text-primary">{searchQuery}</span>&rdquo;
              </p>
            )}

            {/* Room Cards Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
                  <p className="text-slate-500 text-sm">Loading rooms...</p>
                </div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-20 bg-[#111b21] rounded-2xl border border-[#202c33]">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary">search_off</span>
                </div>
                <h3 className="text-xl font-bold mb-2">No rooms found</h3>
                <p className="text-slate-500 text-sm mb-6">
                  {activeFilter === 'my' ? "You haven't joined any rooms yet." : "Try a different search or be the first to create one!"}
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                  className="px-6 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20 text-sm font-bold hover:bg-primary/20 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRooms.map((room) => (
                  <RoomCard key={room._id} room={room} isJoined={myRoomIds.has(room._id)} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Create Room — Desktop */}
          <div className="xl:col-span-4">
            <CreateRoomForm onRoomCreated={handleRoomCreated} />
          </div>
        </div>
      </div>

      {/* Mobile Create Form Modal */}
      {showCreateForm && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CreateRoomForm onRoomCreated={handleRoomCreated} />
            <button
              onClick={() => setShowCreateForm(false)}
              className="mt-3 w-full py-3 bg-[#111b21] border border-[#202c33] rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomsPage
