import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ROOMS_DATA = [
  {
    id: 1,
    title: 'Frontend Wizards',
    tag: 'Tech',
    desc: 'A community for sharing the latest in React, Vue, and CSS magic.',
    members: '2.4k',
    gradient: 'from-indigo-600 to-primary',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-primary',
    icon: 'terminal'
  },
  {
    id: 2,
    title: 'Pixel Perfect',
    tag: 'Art',
    desc: 'Showcasing digital art, illustrations and creative processes.',
    members: '1.8k',
    gradient: 'from-emerald-600 to-teal-500',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    icon: 'palette'
  },
  {
    id: 3,
    title: 'RPG Central',
    tag: 'Gaming',
    desc: 'Dedicated to role-playing games, tabletop, and deep lore discussions.',
    members: '3.1k',
    gradient: 'from-orange-500 to-red-600',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    icon: 'sports_esports'
  },
  {
    id: 4,
    title: 'Future Tech',
    tag: 'Science',
    desc: 'Discussing AI, biotechnology, and space exploration breakthroughs.',
    members: '892',
    gradient: 'from-blue-600 to-sky-400',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: 'science'
  },
  {
    id: 5,
    title: 'Creative Flow',
    tag: 'Lifestyle',
    desc: 'Sharing tips for mindfulness and maintaining a productive creative flow.',
    members: '1.2k',
    gradient: 'from-fuchsia-600 to-pink-500',
    iconBg: 'bg-fuchsia-100',
    iconColor: 'text-fuchsia-600',
    icon: 'auto_awesome'
  },
  {
    id: 6,
    title: 'Lo-fi Producers',
    tag: 'Music',
    desc: 'A chill space for music producers to collaborate and share beats.',
    members: '542',
    gradient: 'from-violet-600 to-purple-400',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    icon: 'piano'
  }
];

export default function RoomHubPage() {
  const [activeTab, setActiveTab] = useState('All Communities');

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col">
          {/* User Profile */}
          <div className="p-6 border-b border-slate-200 dark:border-primary/10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30 shrink-0">
                <img 
                  alt="Alex Rivers" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0eDueCNnYgpVpzoM9ExCb5A2KYqVSiqvRlMLifattRjVMlhaSkMB5pb2GbRM65ChkBWl1Owvt-zrJqPdPsXBUu61K53Sgdt7DTm9f5fV5E9AeESfAcFSrR1lE_hNzrTWZedpb_4E0jpqvEifkGrww2FlkR51y0PgC0kjiUw_0fE-ovDdmyek5EzcOdplKRZSsbFLVNag3tdJ6Dnn7GS3Ar1ixiX9sGHBjUMnaez90R8NOR2lzVevvFnjsS3bdX6mlajfYKoc6mt0"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">Alex Rivers</h1>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 bg-green-500 rounded-full"></span>
                  <p className="text-xs text-slate-500 dark:text-primary/60">Online</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            {/* Main Actions */}
            <div className="space-y-1">
              <Link to="/roomhub" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-[20px]">explore</span>
                <span className="text-sm font-medium">Discover</span>
              </Link>
              <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span class="text-sm font-medium">Home Feed</span>
              </Link>
              <Link to="/activity" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="text-sm font-medium">Activity</span>
              </Link>
            </div>
            
            {/* Rooms Categories */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">My Rooms</h3>
                <button className="material-symbols-outlined text-sm text-slate-400 hover:text-primary">add_circle</button>
              </div>
              <div className="space-y-1">
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors group">
                  <span className="size-6 flex items-center justify-center rounded bg-indigo-500/20 text-indigo-500 font-bold text-[10px] shrink-0">GD</span>
                  <span className="text-sm font-medium truncate">Game Dev Enthusiasts</span>
                </Link>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors group">
                  <span className="size-6 flex items-center justify-center rounded bg-emerald-500/20 text-emerald-500 font-bold text-[10px] shrink-0">UI</span>
                  <span className="text-sm font-medium truncate">UI Design Daily</span>
                </Link>
                <Link to="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors group">
                  <span className="size-6 flex items-center justify-center rounded bg-amber-500/20 text-amber-500 font-bold text-[10px] shrink-0">CR</span>
                  <span className="text-sm font-medium truncate">Crypto Hub</span>
                </Link>
              </div>
            </div>

            {/* Direct Messages */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">Messages</h3>
                <button className="material-symbols-outlined text-sm text-slate-400 hover:text-primary">chat_bubble</button>
              </div>
              <div className="space-y-1">
                <Link to="/messages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
                  <img alt="Sarah" className="size-6 rounded-full shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsrdcgdKCUdpQR_EZX-oheeUH5mJMrTe5xBakHEA_eNqc1UAefvnmlWCOjFpZYZBrcKtCfsHeGrxZw67JC0xG5XBNZ41JcFjJQcpFDCOOxcodOqM9q3rvVoI0A11CugdzyGGlfRDc7bueq7fHI3sT6zbZzZI99vuuVsKhQr-uDg1wz3TtnVmSTseQG7Goz9Dz0ENqe2z4vUxmjhZ_g31gjE-aTAow7_Rd25eN2_I1eGW3oYE0s4yamXJd5vAAy0t7ZxeHyClW4G2w"/>
                  <span className="text-sm font-medium truncate">Sarah Jenkins</span>
                </Link>
                <Link to="/messages" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
                  <img alt="Mike" className="size-6 rounded-full shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG4WORuA60AzvFiUJOQhs-8UjeHdV7f8McKm4vu130L-xGZ2X0lDm844796ud9SkozUQACD6yLI4bija1b--vvMnYN3WoWpVEuz3EUOEw9sbOyyA5g-ca6Y6gqfDUcSZ7ov39J4FS82rfNtTegY7o7r24YX4ZYJJ4jHO1X7bkej1xAd6H3awdG0zORX9AR6WU4WmwzLZIatbAY2QN0eC_-ecEQB_ghPGUDZDm6GXcvD3mw-sqknBH1xmxg_xjNdDWp-9R4v2UGn4Y"/>
                  <span className="text-sm font-medium truncate">Mike Ross</span>
                </Link>
              </div>
            </div>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-primary/10 space-y-2">
            <Link to="/settings" className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </Link>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
          {/* Header */}
          <header className="h-16 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-8 flex-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined font-bold">hub</span>
                <span className="font-bold text-lg tracking-tight uppercase">RoomHub</span>
              </div>
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input 
                  className="w-full bg-slate-100 dark:bg-primary/5 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all" 
                  placeholder="Search rooms, users or tags..." 
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-primary dark:text-slate-400 transition-colors">
                <span className="material-symbols-outlined">help</span>
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-primary/20"></div>
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
                <span className="material-symbols-outlined text-sm">add</span>
                Create Room
              </button>
            </div>
          </header>

          {/* View Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Hero Section */}
            <div className="px-8 py-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Discover Public Rooms</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xl">Find and join communities from around the world. Whether it's tech, art, or gaming, there's a space for you.</p>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex border-b border-slate-200 dark:border-primary/10 mb-8 overflow-x-auto no-scrollbar">
                {['All Communities', 'Technology', 'Gaming', 'Art & Design', 'Music', 'Science'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm whitespace-nowrap outline-none transition-colors ${
                      activeTab === tab 
                        ? 'font-bold text-primary border-b-2 border-primary' 
                        : 'font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-b-2 border-transparent'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Rooms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ROOMS_DATA.map((room) => (
                  <div key={room.id} className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all group flex flex-col">
                    <div className={`h-32 bg-gradient-to-br ${room.gradient} relative shrink-0`}>
                      <div className="absolute -bottom-6 left-6 size-12 rounded-xl bg-white dark:bg-background-dark p-1 shadow-lg">
                        <div className={`w-full h-full rounded-lg ${room.iconBg} flex items-center justify-center ${room.iconColor}`}>
                          <span className="material-symbols-outlined">{room.icon}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{room.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-primary/20 text-slate-600 dark:text-primary uppercase">{room.tag}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{room.desc}</p>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="material-symbols-outlined text-sm">groups</span>
                          <span>{room.members} members</span>
                        </div>
                        <button className="px-4 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white text-sm font-bold transition-all">Join</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex items-center justify-between border-t border-slate-200 dark:border-primary/10 pt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="font-bold">1-6</span> of <span className="font-bold">248</span> rooms</p>
                <div className="flex items-center gap-2">
                  <button className="size-9 rounded-lg border border-slate-200 dark:border-primary/20 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 outline-none transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button className="size-9 rounded-lg bg-primary text-white font-bold text-sm outline-none">1</button>
                  <button className="size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-600 dark:text-slate-400 font-bold text-sm outline-none transition-colors">2</button>
                  <button className="size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-600 dark:text-slate-400 font-bold text-sm outline-none transition-colors">3</button>
                  <span className="text-slate-400 px-1">...</span>
                  <button className="size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-600 dark:text-slate-400 font-bold text-sm outline-none transition-colors">42</button>
                  <button className="size-9 rounded-lg border border-slate-200 dark:border-primary/20 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 outline-none transition-colors">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
