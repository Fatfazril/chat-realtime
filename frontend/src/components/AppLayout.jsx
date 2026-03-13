import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/api'

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/workspace', icon: 'bolt', label: 'Workspace' },
  { to: '/rooms', icon: 'groups', label: 'Rooms' },
  { to: '/messages', icon: 'chat', label: 'Messages' },
  { to: '/profile', icon: 'person', label: 'Profile' },
]

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ users: [], rooms: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchTimeoutRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ users: [], rooms: [] })
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const [usersRes, roomsRes] = await Promise.all([
          fetchWithAuth(`/api/users/search?q=${encodeURIComponent(searchQuery)}`),
          fetchWithAuth(`/api/rooms?q=${encodeURIComponent(searchQuery)}`)
        ])
        
        const usersData = await usersRes.json()
        const roomsData = await roomsRes.json()

        setSearchResults({
          users: usersData.users || [],
          rooms: roomsData.rooms || []
        })
      } catch (err) {
        console.error('Global search error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [searchQuery])

  const handleUserClick = async (targetUserId) => {
    try {
      // Create or get DM room
      const res = await fetchWithAuth('/api/rooms/dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId })
      })
      const data = await res.json()
      if (res.ok && data.room) {
        setShowDropdown(false)
        setSearchQuery('')
        navigate(`/messages?roomId=${data.room._id}`)
      }
    } catch (err) {
      console.error('Failed to create/get DM:', err)
    }
  }

  const handleRoomClick = async (roomId) => {
    // Attempt to join the room if not already a member, then navigate to nexus
    try {
      await fetchWithAuth(`/api/rooms/${roomId}/join`, { method: 'POST' })
      setShowDropdown(false)
      setSearchQuery('')
      navigate('/workspace') // Room joining currently relies on Workspace picking it up
    } catch (err) {
      console.error('Failed to join room:', err)
    }
  }

  const activeUser = user || {
    username: 'Guest',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-background-light dark:bg-background-dark/50 hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">ChatApp</h2>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="mt-auto p-4 border-t border-primary/10 flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-xl">
            <div className="relative size-10 shrink-0 flex items-center justify-center bg-primary/20 rounded-full overflow-hidden">
                {activeUser.avatar ? (
                    <img className="w-full h-full object-cover" alt={activeUser.username} src={activeUser.avatar} />
                ) : (
                    <span className="material-symbols-outlined text-primary">person</span>
                )}
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-background-light dark:border-background-dark/50 rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{activeUser.username}</p>
              <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 mr-1 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Nav */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-primary/10 sticky top-0 bg-background-dark/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md" ref={dropdownRef}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
              <input
                className="w-full bg-primary/5 border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary text-sm transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                placeholder="Search rooms or people..."
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {/* Search Dropdown */}
              {showDropdown && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111b21] border border-slate-200 dark:border-[#222d34] rounded-xl shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto custom-scrollbar">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                  ) : searchResults.users.length === 0 && searchResults.rooms.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">No results found</div>
                  ) : (
                    <div className="py-2">
                      {searchResults.users.length > 0 && (
                        <div className="mb-2">
                          <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">People</div>
                          {searchResults.users.map(u => (
                            <button
                              key={u._id}
                              onClick={() => handleUserClick(u._id)}
                              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-[#202c33] transition-colors text-left"
                            >
                              <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt={u.username} className="size-8 rounded-full bg-slate-200" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">{u.username}</p>
                              </div>
                              <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {searchResults.rooms.length > 0 && (
                        <div>
                          <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Rooms</div>
                          {searchResults.rooms.map(r => (
                            <button
                              key={r._id}
                              onClick={() => handleRoomClick(r._id)}
                              className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-[#202c33] transition-colors text-left"
                            >
                              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-[18px]">tag</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">{r.name}</p>
                                <p className="text-xs text-slate-500 truncate">{r.memberCount || 0} members</p>
                              </div>
                              <span className="material-symbols-outlined text-[18px] text-primary">login</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-primary/10 rounded-lg text-slate-400 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 hover:bg-primary/10 rounded-lg text-slate-400 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
