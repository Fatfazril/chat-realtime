import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [username, setUsername] = useState('alexjohnson_dev');
  const [email, setEmail] = useState('alex.j@nebula.io');
  const [bio, setBio] = useState('Full-stack developer passionate about building clean user interfaces and high-performance applications. Coffee lover and open-source contributor.');
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="min-h-screen bg-[#13111C] text-white font-display overflow-x-hidden flex flex-col">
      {/* Navbar */}
      <header className="h-16 border-b border-[#2A273F] flex items-center justify-between px-8 bg-[#13111C] sticky top-0 z-10 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-[#6344F5] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">settings</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        </Link>
        
        {/* Nav Tabs */}
        <nav className="flex items-center gap-8 h-full">
          {['Profile', 'Account', 'Privacy', 'Notifications'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-full text-sm font-semibold transition-colors relative flex items-center ${
                activeTab === tab ? 'text-[#6344F5]' : 'text-[#645F7C] hover:text-[#9CA3AF]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6344F5] rounded-t-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="size-9 rounded-full bg-[#1E1B31] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>
          <div className="size-9 rounded-full bg-[#6344F5] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#6344F5]/20 cursor-pointer border-2 border-[#13111C]">
            AJ
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-10 flex flex-col lg:flex-row gap-10">
        
        {/* Left Section: User Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-[#1A1829] border border-[#2A273F] rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-32 bg-[#6344F5] relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 size-24 rounded-full border-4 border-[#1A1829] bg-[#FFD1B3] overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&skinColor=f8d25c&top=shortHairShortFlat&facialHair=blank" alt="Avatar" className="w-full h-full object-cover scale-125 translate-y-2"/>
              </div>
            </div>
            
            <div className="pt-14 pb-8 px-6 text-center">
              <h2 className="text-xl font-bold mb-1">Alex Johnson</h2>
              <p className="text-sm text-[#645F7C] mb-4">alex.j@nebula.io</p>
              
              <div className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF] mb-6">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                Joined January 2023
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 bg-[#13111C] p-3 rounded-xl border border-[#2A273F]">
                  <p className="text-xl font-black text-[#6344F5] mb-1">1,284</p>
                  <p className="text-[9px] font-bold text-[#645F7C] tracking-widest uppercase">Friends</p>
                </div>
                <div className="flex-1 bg-[#13111C] p-3 rounded-xl border border-[#2A273F]">
                  <p className="text-xl font-black text-[#6344F5] mb-1">42</p>
                  <p className="text-[9px] font-bold text-[#645F7C] tracking-widest uppercase">Mutual</p>
                </div>
              </div>

              <div className="text-left">
                <p className="text-[10px] font-bold text-[#645F7C] tracking-widest uppercase mb-3">Mutual Friends</p>
                <div className="flex -space-x-3">
                  {['Sarah', 'Mike', 'Emma'].map((seed, i) => (
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt="Mutual" className="size-10 rounded-full border-2 border-[#1A1829] bg-slate-200 relative"/>
                  ))}
                  <div className="size-10 rounded-full border-2 border-[#1A1829] bg-[#6344F5] text-white text-[10px] font-bold flex items-center justify-center relative z-10 shadow-lg shadow-[#6344F5]/30">
                    +39
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Forms */}
        <div className="flex-1 space-y-8">
          
          {/* Settings Card */}
          <div className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
                <p className="text-[#9CA3AF] text-sm">Update your personal information and bio</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="text-xs font-bold">Saved</span>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              {/* Username */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-[#13111C] border border-[#2A273F] rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-[#6344F5] outline-none text-white font-medium shadow-inner"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#10B981]">verified</span>
                </div>
                <p className="text-xs text-[#645F7C] mt-2">Your unique identifier used across the platform.</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#13111C] border border-[#2A273F] rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-[#6344F5] outline-none text-white font-medium shadow-inner"
                />
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-white">Bio</label>
                  <span className="text-[#645F7C] text-xs font-semibold">{bio.length} / 250 characters</span>
                </div>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows="4"
                  className="w-full bg-[#13111C] border border-[#2A273F] rounded-xl p-4 text-sm focus:ring-1 focus:ring-[#6344F5] outline-none text-white font-medium shadow-inner resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="mb-10">
              <h3 className="text-xs font-bold tracking-widest text-white uppercase mb-6">Preferences</h3>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Public Profile</h4>
                  <p className="text-xs text-[#9CA3AF]">Allow others to see your stats and bio</p>
                </div>
                <button 
                  onClick={() => setIsPublic(!isPublic)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    isPublic ? 'bg-[#6344F5]' : 'bg-[#2A273F]'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    isPublic ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-[#2A273F]">
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#9CA3AF] hover:text-white transition-colors">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#6344F5] hover:brightness-110 text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6344F5]/20 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Changes
              </button>
            </div>
          </div>

          {/* Connected Accounts grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-5 flex items-center gap-4 hover:border-[#3B3654] transition-colors cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <span className="material-symbols-outlined text-blue-500 text-[20px]">link</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">GitHub Account</h4>
                <p className="text-xs text-[#9CA3AF]">Connected as @alexj_dev</p>
              </div>
            </div>

            <div className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-5 flex items-center gap-4 hover:border-[#3B3654] transition-colors cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                <span className="material-symbols-outlined text-orange-500 text-[20px]">alternate_email</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Slack Workspace</h4>
                <p className="text-xs text-[#9CA3AF]">Connected to Nebula HQ</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#645F7C]">
        © 2024 Nebula Workspace. All rights reserved.
      </footer>
    </div>
  );
}
