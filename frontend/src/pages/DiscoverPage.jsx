import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';

export default function DiscoverPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Users');

  useEffect(() => {
    // Fetch users (dummy or real)
    fetchWithAuth('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
      .catch(console.error);
  }, []);

  const dummyUsers = [
    { _id: '1', username: 'Alex Rivers', title: 'UI/UX Designer', location: 'San Francisco', status: 'ONLINE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { _id: '2', username: 'Jordan Smith', title: 'Full-stack Dev', location: 'London', status: 'OFFLINE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
    { _id: '3', username: 'Marcus Chen', title: 'Photographer', location: 'Tokyo', status: 'ONLINE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
    { _id: '4', username: 'Elena Vasquez', title: 'Writer', location: 'Barcelona', status: 'ONLINE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
  ];

  const displayUsers = users.length > 0 ? users : dummyUsers;

  return (
    <div className="min-h-screen bg-[#13111C] text-white font-display flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-[#2A273F] flex items-center justify-between px-6 bg-[#13111C] sticky top-0 z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-[#6344F5] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">explore</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Social Discovery</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="size-10 rounded-xl bg-[#1E1B31] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <Link to="/settings" className="size-10 rounded-xl bg-[#1E1B31] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </Link>
          <div className="size-10 rounded-xl bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center overflow-hidden border border-[#2A273F]">
            {/* User avatar placeholder */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h2 className="text-[32px] font-black tracking-tight mb-2">Find your community</h2>
          <p className="text-[#9CA3AF] text-base">Discover interesting people nearby and around the world.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">search</span>
          <input
            type="text"
            placeholder="Search for usernames, interests, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E1B31] border-none rounded-xl pl-12 pr-4 py-4 text-[15px] focus:ring-2 focus:ring-[#6344F5] outline-none text-white placeholder:text-[#645F7C] shadow-inner"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-[#2A273F] mb-6">
          {['All Users', 'Online Now', 'Recently Active'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold transition-colors relative ${
                activeTab === tab ? 'text-[#6344F5]' : 'text-[#645F7C] hover:text-[#9CA3AF]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6344F5] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {displayUsers.slice(0, 4).map((u, i) => (
            <div key={u._id || i} className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-5 flex flex-col group hover:border-[#3B3654] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={u.avatar || dummyUsers[i%4].avatar} alt={u.username} className="size-14 rounded-full object-cover bg-[#2A273F]" />
                    {(u.status === 'ONLINE' || i === 0 || i === 2 || i === 3) && (
                      <span className="absolute bottom-0 right-0 size-3.5 bg-[#10B981] border-2 border-[#1A1829] rounded-full"></span>
                    )}
                    {(i === 1) && (
                      <span className="absolute bottom-0 right-0 size-3.5 bg-[#9CA3AF] border-2 border-[#1A1829] rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[17px] text-white leading-tight mb-1">{u.username}</h3>
                    <p className="text-sm text-[#9CA3AF]">{u.title || dummyUsers[i%4].title} • {u.location || dummyUsers[i%4].location}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${(i===1) ? 'text-[#645F7C]' : 'text-[#10B981]'}`}>
                  {(i===1) ? 'OFFLINE' : 'ONLINE'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <button className="flex-1 bg-[#6344F5] hover:brightness-110 text-white font-semibold py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]">
                  Add Friend
                </button>
                <button className="size-10 bg-[#2A273F] hover:bg-[#3B3654] text-[#9CA3AF] rounded-xl flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination & Interests */}
        <div className="flex items-center justify-between mb-12">
          <p className="text-sm text-[#645F7C]">Showing <span className="text-white font-bold">1-4</span> of 128 users</p>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-lg bg-[#1E1B31] border border-[#2A273F] flex items-center justify-center text-[#645F7C] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="size-9 rounded-lg bg-[#6344F5] text-white font-bold text-sm flex items-center justify-center">1</button>
            <button className="size-9 rounded-lg bg-[#1E1B31] border border-[#2A273F] text-[#9CA3AF] hover:text-white font-bold text-sm flex items-center justify-center transition-colors">2</button>
            <button className="size-9 rounded-lg bg-[#1E1B31] border border-[#2A273F] text-[#9CA3AF] hover:text-white font-bold text-sm flex items-center justify-center transition-colors">3</button>
            <button className="size-9 rounded-lg bg-[#1E1B31] border border-[#2A273F] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-bold mb-4">Discover Interests</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 rounded-full bg-[#6344F5]/10 border border-[#6344F5]/30 text-[#6344F5] font-semibold text-sm flex items-center gap-2 transition-colors hover:bg-[#6344F5]/20">
              <span className="material-symbols-outlined text-[18px]">code</span> Programming
            </button>
            <button className="px-5 py-2.5 rounded-full bg-[#1E1B31] border border-[#2A273F] text-white font-semibold text-sm flex items-center gap-2 transition-colors hover:bg-[#2A273F]">
              <span className="material-symbols-outlined text-[18px]">brush</span> Digital Art
            </button>
            <button className="px-5 py-2.5 rounded-full bg-[#1E1B31] border border-[#2A273F] text-white font-semibold text-sm flex items-center gap-2 transition-colors hover:bg-[#2A273F]">
              <span className="material-symbols-outlined text-[18px]">fitness_center</span> Fitness
            </button>
            <button className="px-5 py-2.5 rounded-full bg-[#1E1B31] border border-[#2A273F] text-white font-semibold text-sm flex items-center gap-2 transition-colors hover:bg-[#2A273F]">
              <span className="material-symbols-outlined text-[18px]">movie</span> Cinema
            </button>
            <button className="px-5 py-2.5 rounded-full bg-[#1E1B31] border border-[#2A273F] text-white font-semibold text-sm flex items-center gap-2 transition-colors hover:bg-[#2A273F]">
              <span className="material-symbols-outlined text-[18px]">language</span> Travel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
