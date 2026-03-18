import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('My Friends');

  const friends = [
    { id: 1, name: 'John Doe', status: 'Playing: Galactic Siege', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', online: true },
    { id: 2, name: 'Sarah Smith', status: 'Last seen 2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', online: false },
    { id: 3, name: 'Mark Webb', status: 'Online', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark', online: true },
    { id: 4, name: 'Elena Rodriguez', status: 'Away', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', online: false, away: true },
  ];

  const pendingRequests = [
    { id: 1, name: 'Sam Wilson', detail: '4 mutual friends', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
    { id: 2, name: 'Riley Chen', detail: 'Joined via Community Link', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley' },
    { id: 3, name: 'Toby Fox', detail: 'Sent a request 1w ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Toby' },
  ];

  return (
    <div className="flex h-screen bg-[#13111C] text-white font-display overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#2A273F] flex flex-col shrink-0">
        <div className="h-20 flex items-center px-6 gap-3 border-b border-[#2A273F]">
          <div className="size-8 rounded-lg bg-[#6344F5] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">group</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Social Hub</h1>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-[#6344F5] font-semibold transition-colors">
            <span className="material-symbols-outlined text-[20px]">home</span>
            Dashboard
          </Link>
          <Link to="/friends" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#1E1B31] font-semibold transition-colors">
            <span className="material-symbols-outlined text-[20px]">people</span>
            Friends
          </Link>
          <Link to="/messages" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#1E1B31] font-semibold transition-colors">
            <span className="material-symbols-outlined text-[20px]">chat</span>
            Messages
          </Link>
        </nav>
        <div className="p-4 border-t border-[#2A273F]">
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#1E1B31] font-semibold transition-colors mb-2">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </Link>
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="size-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Alex Rivera</p>
              <p className="text-[10px] text-[#645F7C] font-semibold tracking-widest uppercase mt-0.5">PREMIUM</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-[#2A273F] flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">search</span>
            <input
              type="text"
              placeholder="Search friends or people..."
              className="w-full bg-[#1A1829] border border-[#2A273F] rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[#6344F5] outline-none text-white placeholder:text-[#645F7C]"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#6344F5] text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Add Friend
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-[#2A273F] mb-8">
            {['My Friends', 'Friend Requests', 'Sent Requests'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab ? 'text-[#6344F5]' : 'text-[#645F7C] hover:text-[#9CA3AF]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {i===0?'group':i===1?'person_add':'send'}
                </span>
                {tab}
                {tab === 'My Friends' && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-[#6344F5]/20 text-[#6344F5]' : 'bg-[#1E1B31] text-[#645F7C]'}`}>24</span>
                )}
                {tab === 'Friend Requests' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400">3</span>
                )}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6344F5] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Two Column Layout inside standard content */}
          <div className="flex gap-10">
            {/* Left Column */}
            <div className="flex-1 space-y-10">
              {/* Connected Friends */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Connected Friends</h2>
                  <button className="size-8 rounded-lg border border-[#2A273F] flex items-center justify-center text-[#9CA3AF] hover:bg-[#1E1B31] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map(f => (
                    <div key={f.id} className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-4 flex items-center justify-between hover:border-[#3B3654] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={f.avatar} alt={f.name} className="size-12 rounded-full object-cover bg-[#2A273F]" />
                          {f.online && !f.away && <span className="absolute bottom-0 right-0 size-3 bg-[#10B981] border-2 border-[#1A1829] rounded-full"></span>}
                          {!f.online && !f.away && <span className="absolute bottom-0 right-0 size-3 bg-[#9CA3AF] border-2 border-[#1A1829] rounded-full"></span>}
                          {f.away && <span className="absolute bottom-0 right-0 size-3 bg-orange-400 border-2 border-[#1A1829] rounded-full"></span>}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-[15px]">{f.name}</h3>
                          <p className={`text-xs ${f.online ? 'text-[#9CA3AF]' : 'text-[#645F7C]'}`}>{f.status}</p>
                        </div>
                      </div>
                      <button className="size-8 rounded-lg bg-[#6344F5]/10 flex items-center justify-center text-[#6344F5] group-hover:bg-[#6344F5]/20 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pending Outbound Requests */}
              <section>
                <h2 className="text-xl font-bold mb-4">Pending Outbound Requests</h2>
                <div className="bg-[#1A1829] border border-dashed border-[#2A273F] rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusK" alt="Marcus K." className="size-10 rounded-full object-cover bg-[#2A273F]" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Marcus K.</h3>
                      <p className="text-xs text-[#645F7C]">Sent 2 days ago</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-[#645F7C] hover:text-white transition-colors">
                    CANCEL
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column: Friend Requests */}
            <div className="w-80 shrink-0">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Friend Requests
                <span className="size-5 rounded-full bg-[#6344F5] text-white text-[10px] font-bold flex items-center justify-center">3</span>
              </h2>
              <div className="space-y-4">
                {pendingRequests.map(req => (
                  <div key={req.id} className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <img src={req.avatar} alt={req.name} className="size-12 rounded-lg object-cover bg-[#2A273F]" />
                      <div>
                        <h3 className="font-bold text-white text-[15px] leading-tight">{req.name}</h3>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">{req.detail}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-[#6344F5] hover:brightness-110 text-white text-xs font-bold rounded-lg transition-all">Accept</button>
                      <button className="flex-1 py-2 bg-[#1E1B31] hover:bg-[#2A273F] text-[#9CA3AF] hover:text-white text-xs font-bold rounded-lg transition-colors">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 text-sm font-bold text-[#6344F5] hover:text-[#7A5EFF] transition-colors py-2">
                View all requests
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
