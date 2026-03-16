import React from 'react'

function DashboardPage() {
  const stats = [
    { label: 'Rooms Joined', value: '42', trend: '+8%', icon: 'meeting_room', iconClass: 'text-primary bg-primary/10', glowClass: 'bg-primary/20', trendUp: true },
    { label: 'Messages Sent', value: '12,842', trend: '+24%', icon: 'send', iconClass: 'text-blue-500 bg-blue-500/10', glowClass: 'bg-blue-500/20', trendUp: true },
    { label: 'Active Contacts', value: '1,094', trend: '-2%', icon: 'person', iconClass: 'text-emerald-500 bg-emerald-500/10', glowClass: 'bg-emerald-500/20', trendUp: false },
  ];

  const contacts = [
    { name: 'Elena Gilbert', role: 'UX Designer', status: 'online' },
    { name: 'Marcus Wright', role: 'DevOps Engineer', status: 'online' },
    { name: 'Jessica Lane', role: 'Project Manager', status: 'offline' },
    { name: 'Sam Robinson', role: 'Marketing Lead', status: 'offline' },
  ];

  const chartData = [
    { day: 'MON', height: '40%' },
    { day: 'TUE', height: '60%' },
    { day: 'WED', height: '90%' },
    { day: 'THU', height: '45%' },
    { day: 'FRI', height: '85%' },
    { day: 'SAT', height: '35%' },
    { day: 'SUN', height: '30%' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">Welcome back, Alex!</h1>
          <p className="text-slate-400 text-lg">
            Your workspace activity has increased by <span className="text-green-500 font-bold">12.5%</span> compared to last week.
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex -space-x-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" className="size-10 rounded-full border-2 border-[#0b141a] bg-slate-200" alt="avatar" />
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe" className="size-10 rounded-full border-2 border-[#0b141a] bg-slate-200" alt="avatar" />
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dan" className="size-10 rounded-full border-2 border-[#0b141a] bg-slate-200" alt="avatar" />
            <div className="size-10 rounded-full border-2 border-[#0b141a] bg-[#202c33] flex items-center justify-center text-[11px] font-bold text-slate-300 relative z-10">
              +14
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#111b21] border border-[#202c33] rounded-xl hover:bg-[#202c33] transition-colors text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#111b21] border border-[#202c33] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-48 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`size-10 rounded-xl flex items-center justify-center ${stat.iconClass}`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {stat.trendUp ? 'trending_up' : 'trending_down'}
                </span>
                {stat.trend}
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-sm font-semibold text-slate-400 mb-1">{stat.label}</p>
              <p className="text-4xl font-black tracking-tight">{stat.value}</p>
            </div>

            <div className="absolute inset-x-6 bottom-6 h-8 flex items-end gap-1.5 opacity-40">
                {[...Array(6)].map((_, idx) => (
                    <div key={idx} className={`flex-1 rounded-t-sm ${idx === 4 ? stat.iconClass.split(' ')[0].replace('text-', 'bg-') : 'bg-slate-700'}`} style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                ))}
            </div>
            
            {/* Glow effect */}
            <div className={`absolute -bottom-10 right-10 size-32 blur-3xl rounded-full ${stat.glowClass}`}></div>
          </div>
        ))}
      </div>

      {/* Grid bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span (Charts & Activity) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111b21] border border-[#202c33] rounded-2xl p-8 h-[28rem] flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold mb-1">Workspace Overview</h3>
                <p className="text-sm text-slate-500">Weekly message volume by room types</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0b141a] rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors">
                Last 7 Days
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
            
            {/* Bar Chart Mockup */}
            <div className="flex-1 flex items-end justify-between gap-4 mt-8 relative">
                {/* Horizontal lines */}
                <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between z-0 pointer-events-none opacity-20">
                    <div className="border-t border-slate-600"></div>
                    <div className="border-t border-slate-600"></div>
                    <div className="border-t border-slate-600"></div>
                    <div className="border-t border-slate-600"></div>
                </div>

                {chartData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 z-10 w-full group">
                        <div className="w-full max-w-[4rem] bg-slate-800 rounded-t-xl relative overflow-hidden flex items-end transition-all group-hover:brightness-125" style={{ height: '200px' }}>
                            <div className="w-full bg-gradient-to-t from-primary/50 to-primary rounded-t-xl" style={{ height: d.height }}></div>
                        </div>
                        {/* Fake reflection */}
                        <div className="w-full max-w-[4rem] h-12 bg-gradient-to-b from-primary/20 to-transparent opacity-30 transform scale-y-[-1] rounded-b-xl -mt-4"></div>
                        <span className="text-[10px] font-bold text-slate-500 z-10">{d.day}</span>
                    </div>
                ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 ml-2">
                <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary"></span>
                    <span className="text-xs text-slate-400 font-medium">Public Channels</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#202c33]"></span>
                    <span className="text-xs text-slate-400 font-medium">Direct Messages</span>
                </div>
            </div>
          </div>

          <div className="bg-[#111b21] border border-[#202c33] rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Recent Activity Feed</h3>
              <p className="text-slate-500 text-sm italic">Analytics system is gathering data...</p>
          </div>
        </div>
        
        {/* Right Span (Contacts & System) */}
        <div className="space-y-6">
          <div className="bg-[#111b21] border border-[#202c33] rounded-2xl p-6 flex flex-col h-[28rem]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Active Contacts</h3>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                {contacts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} className="size-10 rounded-full bg-slate-200" alt="avatar" />
                                <span className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#111b21] ${c.status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-200">{c.name}</p>
                                <p className="text-xs text-slate-500">{c.role}</p>
                            </div>
                        </div>
                        <button className="size-8 rounded-lg bg-[#202c33] hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-[16px]">chat</span>
                        </button>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-3 rounded-xl border border-[#202c33] bg-[#0b141a] hover:bg-[#202c33] transition-colors text-sm font-bold">
                Invite New Member
            </button>
          </div>

          <div className="bg-[#111b21] border border-[#202c33] rounded-2xl p-6 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                 <h3 className="text-lg font-bold">System Status</h3>
             </div>
             <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-400">Server Load</span>
                     <span className="text-sm font-black">24%</span>
                 </div>
                 <div className="w-full bg-[#0b141a] h-1.5 rounded-full overflow-hidden">
                     <div className="bg-primary h-full rounded-full" style={{ width: '24%' }}></div>
                 </div>
             </div>
             
             <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[120px] text-[#0b141a] z-0">shield</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
