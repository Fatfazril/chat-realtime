import React from 'react';
import { NavLink } from 'react-router-dom';

const navClasses = ({ isActive }) =>
  `p-2 rounded-lg transition-colors ${
    isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10'
  }`;

const NexusSidebar = () => (
  <aside className="w-16 hidden md:flex flex-col items-center py-6 gap-8 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark/50">
    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20 shrink-0">
      <span className="material-symbols-outlined">bolt</span>
    </div>
    <nav className="flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar">
      <NavLink to="/dashboard" className={navClasses}>
        <span className="material-symbols-outlined">house</span>
      </NavLink>
      <NavLink to="/nexus" className={navClasses}>
        <span className="material-symbols-outlined">folder</span>
      </NavLink>
      <NavLink to="/messages" className={navClasses}>
        <span className="material-symbols-outlined">chat_bubble</span>
      </NavLink>
      <NavLink to="/rooms" className={navClasses}>
        <span className="material-symbols-outlined">group</span>
      </NavLink>
    </nav>
    <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors shrink-0">
      <span className="material-symbols-outlined">settings</span>
    </button>
  </aside>
);

const NexusRoomSidebar = () => (
  <aside className="w-64 hidden lg:flex flex-col border-r border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/30">
    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold">Channels</h2>
        <button className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 hover:bg-primary/5 transition-colors group">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">tag</span>
            <span className="text-sm font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300">general</span>
          </div>
        </button>
        <button className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 text-primary active-channel-glow w-full text-left">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">tag</span>
            <span className="text-sm font-bold tracking-tight">development</span>
          </div>
          <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full font-bold">12</span>
        </button>
        <button className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 hover:bg-primary/5 transition-colors group">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">tag</span>
            <span className="text-sm font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300">design</span>
          </div>
        </button>
        <button className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 hover:bg-primary/5 transition-colors group">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">tag</span>
            <span className="text-sm font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300">marketing</span>
          </div>
          <span className="text-[10px] bg-slate-300 dark:bg-slate-700 text-white px-1.5 py-0.5 rounded-full font-bold">3</span>
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Direct Messages</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors p-2">
            <div className="relative size-8 shrink-0">
              <img className="size-8 rounded-full object-cover avatar" alt="Sarah Miller" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1PC58ShhZ_NWkXi30NjEGQhWjwHe2OKp4jHCC7bRKM-YcveAoqAsTgKFIZ5-nbPOMJxXwdDRghB_Zb8u6qs2bxDgXGSSGxzg9Nu6kllKdVXL5wS_YLfkIg9W5iqPUjk2bcRnxwRzm4Rx6y4eLSq3fSi3_LUia5PCbDboAkvP9hh-BD_LG7vT9qHSYNWZYMxXbZIhapTC7Tx4aFaYEkoP0RBn6vQP7lQLlXlfkPi7PaZ5KobbbQmeRvxtvsnZ9z7xKt7f-xk9ybp4" />
              <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full"></span>
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sarah Miller</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors p-2">
            <div className="relative size-8 shrink-0">
              <img className="size-8 rounded-full object-cover avatar" alt="James Wilson" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA_Qr7_Je9yZ78XHTM3SlGmQy2Z2wIa5yg7NtvrH0GL0xLXj3CyWU9jKnT3PkRbOOfDwDr1sLJvNBeg0-p14YvJrh8nVV9KpxfEhzcDVA7SX7m9ONW1aVjk6oRfqvOwuRoBhq8GIJtSL9EP8zXzBA5nQ7oHMJ6tayaWZpqWSceg0zm6ACzvWz-dw5DVEV7Hz_y8DAfZiRpRzh2GNM7VFT2nPd7RxDPz4bRC2IMjoldNQIBF9ZR3df0ypmDzq1-g9CeDdJcLsAcCQU" />
              <span className="absolute bottom-0 right-0 size-2.5 bg-slate-300 rounded-full border-2 border-slate-50 dark:border-background-dark"></span>
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">James Wilson</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-auto p-4 border-t border-slate-200 dark:border-primary/20 shrink-0">
      <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-95">
        <span className="material-symbols-outlined text-lg">add_circle</span>
        Create Room
      </button>
    </div>
  </aside>
);

const NexusChatArea = () => (
  <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background-dark">
    {/* Header */}
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-primary/20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="text-primary font-bold text-xl flex items-center gap-1">
          <span className="text-slate-400 font-normal">#</span>
          development
        </div>
        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-base">person</span>
          12 members
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">call</span></button>
        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">videocam</span></button>
        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">search</span></button>
        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">info</span></button>
      </div>
    </header>

    {/* Feed */}
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
      {/* Message 1 */}
      <div className="flex gap-4 group">
        <img className="size-10 rounded-xl object-cover shrink-0" alt="Alex Thompson" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3uF9p18o5K1ILwx2KwodmY56hDWdKAkA2mqWx6r5K3r85VNXGqwAE9d9aaVERaG1T31vR_LksdNVSqG9OWN5BCr2JlV6HrEOLfUaLyduEAiKSUFqAbinIwcbsgNLlDkwBxDEsDFZxxxU98HZ5BiykXUi2uelKDQPYYoX6YqRh0f8z9XOUaNTt_KmgI91ijskQfkxAktnoWxN4_jIfiabOQaEN0PG1z6qWMKa2lJR4uLPkFglWeS39YVLEMpWtyXddALPG2V-vh48" />
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">Alex Thompson</span>
            <span className="text-[10px] text-slate-400">10:42 AM</span>
          </div>
          <div className="w-fit max-w-2xl bg-slate-100 dark:bg-primary/10 px-4 py-2.5 rounded-xl rounded-tl-none">
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              Hey team, I've pushed the initial architecture for the real-time websocket integration. Let me know what you think of the flow.
            </p>
          </div>
        </div>
      </div>

      {/* Message 2 (Edited) */}
      <div className="flex gap-4 group">
        <img className="size-10 rounded-xl object-cover shrink-0" alt="Sarah Miller" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzc0rDms0TOfo5DAQNeGpxGWdR2a2cy8f8xsAiPv_kx4_OZxJFQEO6n-AdsxGO4tt5_CK72LLHJsriEVTjf6q8PqKehmrfUR6ivFF7qyYavi6KkoYb53Ucr3tS4CFuJ_-0OPo1ttyRo7YDz0yrIcKkrDce305ISSZafnMXaG-RIfFyIUdgWAwKHhmXVCaiz2dSG3-osexYkyFJFcsKGww3gocAXNMD3wRG-x-CerVOuEOYml3WpIXHxuIDP7bOjMrIbxKlOoLD4p8" />
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">Sarah Miller</span>
            <span className="text-[10px] text-slate-400">10:45 AM</span>
          </div>
          <div className="w-fit max-w-2xl bg-slate-100 dark:bg-primary/10 px-4 py-2.5 rounded-xl rounded-tl-none flex items-end gap-2">
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              Checking it now. The error handling on the client side looks much cleaner than the last version.
            </p>
          </div>
          <span className="text-[10px] text-slate-400 ml-1 italic">Edited</span>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 py-4 relative">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-primary/30"></div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20 shadow-sm shrink-0">
          New Messages
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/30 to-primary/30"></div>
      </div>

      {/* Message 3 (Own Message) */}
      <div className="flex gap-4 group">
        <img className="size-10 rounded-xl object-cover shrink-0" alt="David Chen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6Q7zcBLdfz8IgrZH1lFX-xEKW0GpIuHd5Xkr5tpiJBc5w2IlfGLgC0b_qRQ9nXMEPMTze9noiVdWttej5mgpctR4BKgi0nD48vbOcnC5-CB_0_fB8uRz857x-ccEkLXHWPtCfY3nrHsH_CnknDn7LJfmSXg5JH7KGh-L8WQuQNcbIglX6pVmJ6jtC_b-RsNy7IFMCNz8caW564VCARGQLsp_glvO1CyLlHHeB2jahshDXN0xEzmScaZx1VSJvPNWB7ipuDlakhp4" />
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">David Chen</span>
            <span className="text-[10px] text-slate-400">11:02 AM</span>
          </div>
          <div className="w-fit max-w-2xl bg-primary text-white px-4 py-2.5 rounded-xl rounded-tl-none shadow-md shadow-primary/20">
            <p className="text-sm leading-relaxed">
              Agreed. I also like how we handled the reconnection logic. Just need to verify performance on mobile browsers.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Input Area */}
    <footer className="p-6 shrink-0">
      <div className="mb-2 min-h-6 flex items-end">
        <p className="text-[11px] text-slate-400 flex items-center gap-2 bg-slate-50 dark:bg-white/5 w-fit px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
          <span className="flex gap-0.5">
            <span className="size-1 bg-primary rounded-full animate-bounce"></span>
            <span className="size-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="size-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </span>
          <span className="font-medium text-primary">Sarah Miller</span> is typing...
        </p>
      </div>
      
      <div className="bg-slate-100 dark:bg-primary/5 rounded-2xl p-2 border border-slate-200 dark:border-primary/10 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
        <div className="flex items-center gap-2 px-2 pb-2 border-b border-slate-200 dark:border-primary/10 mb-2">
          <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">format_bold</span></button>
          <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">format_italic</span></button>
          <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">link</span></button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors shrink-0">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-0 text-slate-800 dark:text-slate-200 placeholder:text-slate-400" 
            placeholder="Message #development" 
            type="text" 
          />
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">sentiment_satisfied</span>
            </button>
            <button className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  </main>
);

const NexusMembersSidebar = () => (
  <aside className="w-72 hidden xl:flex flex-col border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/30">
    <div className="p-6 overflow-y-auto custom-scrollbar">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Online — 4</h3>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-10 shrink-0">
              <img className="size-10 rounded-full object-cover" alt="Alex Thompson" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkAffGKIggclKAnh2jPrR8bbd0tPisFREM5MGYT4Ccu3F4KsjjA8HhS-Gpmk6H-GNXa5Q7O_oegNJ2cA-fQa-fg1Gx-0igVZQZNBPW33GvMHiUlO1U4TyVwYia_27WJ1bVhjs-CswHovbYdGrATz1c1Iujs8yxVvkC0VjS4TcMeEIHWBu9T1qaIyzKFSDNYJ3e9MVTYUqKLggAo5jd9n4KP1vJivULDPv4Cj6r8KCcOapbgaR5JYleY3aytgR9W9eBN7clvmIr0mo" />
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full animate-status-pulse"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">Alex Thompson</span>
              <span className="text-[11px] text-slate-500 truncate">Working on UI</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-10 shrink-0">
              <img className="size-10 rounded-full object-cover" alt="Sarah Miller" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg8eAqPe27VOEYARcdgD_Cw8KaPNUoW_8JBgqfnvDQAPnr7irhXGddTpzkhGBm_YA8XUTbuwASM_UigMV-0XNqPKTs3IKMBVxUNabZy5SgtCialQa1gd8kJF0OTiG43iMiljDqZ0rKPZWoNLLPSbD53JnGjzWPtMeLMZFXbuUzl-gbNqAf6NMHcR5JIzm5CLvKBo4qA7yhh4K2aZHQfryfvVbvizUz1X70-L9ZYbLKNHPoB77oaJYXeFLo_z1dn23DAjNMIQcbPzY" />
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full animate-status-pulse"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">Sarah Miller</span>
              <span className="text-[11px] text-primary font-medium truncate">Typing...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-10 shrink-0">
              <img className="size-10 rounded-full object-cover" alt="David Chen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE634tF5EsnbBnHGsEffpxCbOk4URWIhKQAvO1XBaNv3QwaWELWV0JG_TjYAcfve6Xpn5j0jGAH_uHmzZfqPGGSXlEw5_R5h2u6aws865wG_g9e-eBahgCWV5oi__rJzbVZR3nY1QSbpcytavuKvznkXpWFtk9IDNzUOfSMJcC19eHcZ8D3CK1WG5AIfkFXKDT1EEr94gmzhHbvITR8qkWP6nbdmxwSTHzSILgVn8M2dW4a79g9tyFZlyOjHjtxtmRgMdv5btK-vY" />
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full animate-status-pulse"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">David Chen</span>
              <span className="text-[11px] text-slate-500 truncate">Available</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-10 shrink-0">
              <img className="size-10 rounded-full object-cover" alt="Emily Blunt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4uer173WepRo0Cf5zOmZ36k5kniiCb3EsROVahYnCO1lHTKMHBLxCatgPVoWQ7g3xu2v88wNXh3RQvah4M8bWV1SKlhAXKzZ2Sw_fkAvMFjWE7HlTZn6jkAwuatVbcT8CTOt_4TZGZ18DFuSOyuSCQiTrmnlHoE8gElxYIKLyGgOhBMkJe-ubBnnOzGtDBd0rhmmCJapjKPmfIMQpoghGSh3TvM88C5dWgzd5bH_Yo6F51IeQt3BMTHStcZOGyYfR02kLvjXGXbc" />
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full animate-status-pulse"></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">Emily Blunt</span>
              <span className="text-[11px] text-slate-500 truncate">In a meeting</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-10 mb-6">Offline — 8</h3>
      <div className="flex flex-col gap-5 opacity-60">
        <div className="flex items-center gap-3">
          <img className="size-10 rounded-full object-cover grayscale shrink-0" alt="James Wilson" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3exAIwauZa_Qz5bxD1KXKdEFUEIRFbM5Ngrxz0lYoqxdLtwfR0uIxG3WNQQa1lXFunlxG0-rVA96xR4V1cQd3H7-veQfruWIc5HGb_qxVpPr1NNF6cBKAHALjWtwydj4tbSeKYMtF4H1T8pzfoAq93wK7RXhvKoF2Q2o6Bue31hZiAWjH4SoT_KLY44VBhZDLkzGbpHVyfaaIicYRBu-PVYXm09elbZ3z50DiIZ9Glf20B0ljGcGpDh2ZPb1OzHE0KcAM9VoS-NQ" />
          <span className="text-sm font-medium">James Wilson</span>
        </div>
        <div className="flex items-center gap-3">
          <img className="size-10 rounded-full object-cover grayscale shrink-0" alt="Lisa Ray" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7ALIchgsPFmfRgkL1DvxHuUV-_3nSUTFPzdl-w5pZUX58XnTLFZdH20hZAhYdMwD_gtBDPNZtCkLAC5U5sYEIFEWMRSDqrdbco3Om85669lp6GIl32CS5EzL9a_5pI9ki7kh8cQPN7aeKfGYwxI4bAAZ8GsprBd2vn012KgdS8kopsJUG7TtDru_HoX-9uUXCH5g7-RwWccirJWckxecRsGrzKPtc_I5qi7o-L32Ut68kJ9qEqGDbHalTsHTgE6L_8LtfeA_Ay_w" />
          <span className="text-sm font-medium">Lisa Ray</span>
        </div>
      </div>
    </div>
  </aside>
);

export default function NexusChatPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display h-screen flex overflow-hidden">
      <NexusSidebar />
      <NexusRoomSidebar />
      <NexusChatArea />
      <NexusMembersSidebar />
    </div>
  );
}
