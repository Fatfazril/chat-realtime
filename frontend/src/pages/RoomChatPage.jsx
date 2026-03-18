import React from 'react';
import { Link } from 'react-router-dom';

export default function RoomChatPage() {
  const users = [
    { name: 'You', statusText: 'Writing code...', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You', online: true, me: true },
    { name: 'Alex Rivera', statusText: 'Senior Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexR', online: true },
    { name: 'Casey Chen', statusText: 'Product Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey', online: true },
    { name: 'Morgan Lee', statusText: 'Away', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan', online: true, away: true },
  ];

  const offline = [
    { name: 'Sam Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
    { name: 'Taylor Swift', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
    { name: 'Dakota Sky', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dakota' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#13111C] text-white font-display overflow-hidden">
      
      {/* Top Navigation */}
      <header className="h-16 border-b border-[#2A273F] flex items-center justify-between px-6 bg-[#13111C] shrink-0 z-10 w-full">
        <div className="flex items-center gap-8 border-r border-[#2A273F] pr-8 h-full">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#6344F5] flex items-center justify-center shadow-lg shadow-[#6344F5]/20">
              <span className="material-symbols-outlined text-white text-[18px]">rocket_launch</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Room Chat</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#" className="text-sm font-semibold text-white">Messages</Link>
            <Link to="#" className="text-sm font-medium text-[#645F7C] hover:text-[#9CA3AF] transition-colors">Files</Link>
            <Link to="#" className="text-sm font-medium text-[#645F7C] hover:text-[#9CA3AF] transition-colors">Settings</Link>
          </nav>
        </div>
        
        <div className="flex-1 flex justify-center max-w-xl px-6">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#645F7C] text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-[#1A1829] border border-[#2A273F] rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#6344F5] outline-none text-white placeholder:text-[#645F7C] shadow-inner font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pl-8 border-l border-[#2A273F] h-full">
          <button className="size-9 rounded-full bg-[#1A1829] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>
          <button className="size-9 rounded-full bg-[#1A1829] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">help</span>
          </button>
          <div className="size-9 rounded-full bg-[#FFD1B3] flex items-center justify-center overflow-hidden border-2 border-[#13111C] shrink-0 outline outline-1 outline-[#2A273F]">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="Me" className="w-full h-full object-cover scale-110 translate-y-1"/>
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-[260px] border-r border-[#2A273F] bg-[#13111C] flex flex-col shrink-0 flex-1 h-full">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            
            <div>
              <h3 className="text-[10px] font-bold text-[#645F7C] uppercase tracking-widest mb-3 px-3">Channels</h3>
              <div className="space-y-1">
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#1A1829] font-medium text-sm transition-colors group">
                  <span className="material-symbols-outlined text-[18px]">tag</span>
                  general
                </Link>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#6344F5] text-white font-medium text-sm shadow-md shadow-[#6344F5]/20">
                  <span className="material-symbols-outlined text-[18px]">groups</span>
                  design-team
                </Link>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#1A1829] font-medium text-sm transition-colors group">
                  <span className="material-symbols-outlined text-[18px]">computer</span>
                  engineering
                </Link>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#1A1829] font-medium text-sm transition-colors group">
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                  announcements
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-[#645F7C] uppercase tracking-widest mb-3 px-3 flex items-center justify-between">
                Direct Messages
              </h3>
              <div className="space-y-1">
                <Link to="/messages" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#1A1829] font-medium text-sm transition-colors">
                  <div className="relative">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=JordanSmith" className="size-6 rounded-full bg-[#2A273F]" alt="Jordan" />
                    <span className="absolute bottom-0 right-[-2px] size-2 bg-[#10B981] border border-[#13111C] rounded-full"></span>
                  </div>
                  Jordan Smith
                </Link>
                <Link to="/messages" className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#1A1829] font-medium text-sm transition-colors">
                  <div className="relative">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Riley" className="size-6 rounded-full bg-[#2A273F]" alt="Riley" />
                    <span className="absolute bottom-0 right-[-2px] size-2 bg-[#10B981] border border-[#13111C] rounded-full"></span>
                  </div>
                  Riley Evans
                </Link>
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-[#2A273F]">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#6344F5] hover:brightness-110 text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6344F5]/20 transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Invite Member
            </button>
          </div>
        </aside>

        {/* Center Chat Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0B0914] relative">
          
          {/* Chat Header */}
          <header className="h-[72px] px-8 border-b border-[#2A273F] flex items-center justify-between shrink-0 sticky top-0 bg-[#0B0914]/90 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="material-symbols-outlined text-[#6344F5] text-[20px]">groups</span>
                <h2 className="text-lg font-bold text-white tracking-tight"># design-team</h2>
              </div>
              <p className="text-xs text-[#645F7C] font-medium">Sync for the Q3 Design Sprint and Brand Guidelines</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="size-9 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-[#1A1829] transition-colors">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </button>
              <button className="size-9 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-[#1A1829] transition-colors">
                <span className="material-symbols-outlined text-[22px]">videocam</span>
              </button>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col gap-6">
            
            <div className="flex items-center justify-center my-4 relative">
              <div className="absolute w-full h-px bg-[#2A273F]"></div>
              <span className="bg-[#0B0914] px-4 text-[10px] font-bold text-[#645F7C] tracking-widest uppercase relative z-10">
                Monday, Oct 23
              </span>
            </div>

            {/* Others Message */}
            <div className="flex items-start gap-4 max-w-3xl">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AlexR" alt="Alex" className="size-10 rounded-full bg-[#2A273F] shrink-0" />
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-baseline gap-2 pl-1">
                  <span className="text-sm font-bold text-white">Alex Rivera</span>
                  <span className="text-[10px] text-[#645F7C] font-semibold">10:14 AM</span>
                </div>
                <div className="bg-[#1A1829] text-white px-5 py-3.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm">
                  Has anyone reviewed the latest mockups for the landing page? I've updated the hero section based on yesterday's feedback.
                </div>
              </div>
            </div>

            {/* Others Message 2 */}
            <div className="flex items-start gap-4 max-w-2xl">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Casey" alt="Casey" className="size-10 rounded-full bg-[#2A273F] shrink-0" />
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-baseline gap-2 pl-1">
                  <span className="text-sm font-bold text-white">Casey Chen</span>
                  <span className="text-[10px] text-[#645F7C] font-semibold">10:18 AM</span>
                </div>
                <div className="bg-[#1A1829] text-white px-5 py-3.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-sm">
                  Looking at them now. The typography feels much more balanced!
                </div>
              </div>
            </div>

            {/* My Message 1 */}
            <div className="flex items-start justify-end gap-4 max-w-2xl ml-auto">
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-baseline gap-2 pr-1">
                  <span className="text-[10px] text-[#645F7C] font-semibold">10:20 AM</span>
                  <span className="text-sm font-bold text-white">You</span>
                </div>
                <div className="bg-[#6344F5] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-md shadow-[#6344F5]/10 flex flex-col">
                  I just finished looking through them. Great work on the navigation! The sticky header interaction is smooth.
                  <span className="text-[10px] text-white/50 italic mt-1">(Edited)</span>
                </div>
              </div>
              <div className="size-10 rounded-full bg-[#FFD1B3] overflow-hidden shrink-0 outline outline-1 outline-[#2A273F]">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" className="w-full h-full object-cover scale-110 translate-y-1"/>
              </div>
            </div>

             {/* My Message 2 */}
            <div className="flex items-start justify-end gap-4 max-w-2xl ml-auto">
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-baseline gap-2 pr-1">
                  <span className="text-[10px] text-[#645F7C] font-semibold">10:22 AM</span>
                  <span className="text-sm font-bold text-white">You</span>
                </div>
                <div className="bg-[#6344F5] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-md shadow-[#6344F5]/10">
                  Should we move the feedback session to 2 PM instead of 1 PM?
                </div>
              </div>
              <div className="size-10 rounded-full bg-[#FFD1B3] overflow-hidden shrink-0 outline outline-1 outline-[#2A273F]">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" className="w-full h-full object-cover scale-110 translate-y-1"/>
              </div>
            </div>

          </div>

          {/* Input Area */}
          <div className="p-6 pt-2 bg-gradient-to-t from-[#0B0914] via-[#0B0914] to-transparent shrink-0">
            <div className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-2 flex items-end gap-2 focus-within:border-[#6344F5] focus-within:ring-1 focus-within:ring-[#6344F5] transition-all relative shadow-lg">
              <button className="p-2.5 text-[#645F7C] hover:text-white transition-colors bg-[#13111C] rounded-xl flex items-center justify-center shrink-0 mb-0.5">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
              
              <textarea 
                placeholder="Message #design-team"
                rows="1"
                className="w-full bg-transparent text-sm text-white placeholder:text-[#645F7C] outline-none resize-none py-3 px-2 font-medium custom-scrollbar max-h-32"
              ></textarea>
              
              <button className="p-2 text-[#645F7C] hover:text-white transition-colors flex items-center justify-center shrink-0 mb-1">
                <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
              </button>

              <button className="size-10 bg-[#6344F5] hover:brightness-110 text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#6344F5]/20 shrink-0 mb-0.5 transition-all active:scale-[0.95] pl-1">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
            
            <div className="flex items-center justify-between px-2 mt-2">
              <p className="text-[10px] text-[#645F7C] font-semibold">
                <strong className="text-white font-bold">Return</strong> to send, <strong className="text-white font-bold">Shift+Return</strong> for new line
              </p>
              <div className="flex items-center gap-3 text-[#645F7C]">
                <span className="material-symbols-outlined text-[14px]">alternate_email</span>
                <span className="material-symbols-outlined text-[14px]">format_bold</span>
                <span className="material-symbols-outlined text-[14px]">link</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar (Members) */}
        <aside className="w-[280px] border-l border-[#2A273F] bg-[#13111C] hidden lg:flex flex-col shrink-0 flex-1">
          <div className="h-[72px] px-6 border-b border-[#2A273F] flex items-center justify-between shrink-0">
            <h2 className="text-[15px] font-bold text-white">Room Members</h2>
            <div className="px-2 py-0.5 bg-[#6344F5]/10 text-[#6344F5] border border-[#6344F5]/20 rounded text-[10px] font-black">12</div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {/* Online */}
            <div>
              <h3 className="text-[10px] font-bold text-[#645F7C] uppercase tracking-widest mb-4">Online — 4</h3>
              <div className="space-y-4">
                {users.map(u => (
                  <div key={u.name} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative shrink-0">
                      <img src={u.avatar} className="size-9 rounded-full bg-[#2A273F]" alt={u.name} />
                      {u.online && !u.away && <span className="absolute bottom-0 right-0 size-2.5 bg-[#10B981] border-2 border-[#13111C] rounded-full"></span>}
                      {u.away && <span className="absolute bottom-0 right-0 size-2.5 bg-orange-400 border-2 border-[#13111C] rounded-full"></span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate group-hover:text-[#6344F5] transition-colors">
                        {u.name}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5 font-medium italic">
                        {u.statusText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offline */}
            <div>
              <h3 className="text-[10px] font-bold text-[#645F7C] uppercase tracking-widest mb-4">Offline — 8</h3>
              <div className="space-y-4">
                {offline.map(u => (
                  <div key={u.name} className="flex items-center gap-3 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                    <img src={u.avatar} className="size-9 rounded-full bg-[#2A273F] shrink-0 grayscale group-hover:grayscale-0 transition-all" alt={u.name} />
                    <p className="text-sm font-semibold text-white truncate group-hover:text-[#6344F5] transition-colors">{u.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
