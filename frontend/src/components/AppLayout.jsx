import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../utils/api'

const navItems = [
  { to: '/dashboard', icon: 'grid_view', label: 'Dashboard' },
  { to: '/messages', icon: 'chat_bubble', label: 'Messages', badge: 12 },
  { to: '/rooms', icon: 'group', label: 'Rooms' },
  { to: '/contacts', icon: 'perm_contact_calendar', label: 'Contacts' },
  { to: '/analytics', icon: 'bar_chart', label: 'Analytics' },
]

const supportItems = [
  { to: '/settings', icon: 'settings', label: 'Settings' },
  { to: '/help', icon: 'help', label: 'Help Center' },
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
    <div className="flex h-screen overflow-hidden bg-[#0b141a] font-display text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[#202c33] bg-[#0b141a] hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
            <span className="material-symbols-outlined text-2xl">chat</span>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-widest text-white leading-tight">ChatApp</h2>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 mt-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-1 mb-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                      : 'text-slate-400 hover:bg-[#111b21] hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="font-medium text-[15px]">{item.label}</span>
                </div>
                {item.badge && (
                    <span className="text-[10px] font-bold bg-[#202c33] text-primary px-2 py-0.5 rounded-full group-[.active]:bg-white/20 group-[.active]:text-white">
                        {item.badge}
                    </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="px-3 mb-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Settings & Support</h3>
          </div>
          <div className="space-y-1">
            {supportItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                      : 'text-slate-400 hover:bg-[#111b21] hover:text-slate-200'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-medium text-[15px]">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>


        {/* User Profile & Logout */}
        <div className="mt-auto p-4 border-t border-[#202c33]">
          <div className="flex items-center gap-3 group">
            <div className="relative size-10 shrink-0 flex items-center justify-center bg-primary/20 rounded-full overflow-hidden border border-[#202c33]">
                {activeUser.avatar ? (
                    <img className="w-full h-full object-cover" alt={activeUser.username} src={activeUser.avatar} />
                ) : (
                    <span className="material-symbols-outlined text-primary">person</span>
                )}
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-[#0b141a] rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{activeUser.username}</p>
              <p className="text-[11px] text-slate-500 font-medium truncate">Head of Product</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-white hidden group-hover:block transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Nav */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-[#202c33] sticky top-0 bg-[#0b141a] z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-lg" ref={dropdownRef}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">search</span>
              <input
                className="w-full bg-[#111b21] border border-[#202c33] rounded-xl pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all text-white placeholder:text-slate-500"
                placeholder="Search across messages, rooms, or files..."
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
          <div className="flex items-center gap-4">
            <button className="relative size-10 rounded-xl bg-[#111b21] border border-[#202c33] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-[#111b21]"></span>
            </button>
            <button className="size-10 rounded-xl bg-[#111b21] border border-[#202c33] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </button>
            <div className="w-px h-8 bg-[#202c33] mx-2"></div>
            <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Broadcast
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
