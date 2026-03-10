import React from 'react'

function ChatHeader({ contact }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-primary/20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="size-10 rounded-full bg-slate-200 avatar"
            style={{ backgroundImage: contact.avatar ? `url('${contact.avatar}')` : undefined }}
          />
          {contact.isOnline && (
            <div className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1a142e]" />
          )}
        </div>
        <div>
          <h2 className="font-bold text-sm">{contact.name}</h2>
          <p className={`text-[10px] font-medium uppercase tracking-wider ${
            contact.isOnline ? 'text-emerald-500' : 'text-slate-400'
          }`}>
            {contact.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-500 transition-colors">
          <span className="material-symbols-outlined">call</span>
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-500 transition-colors">
          <span className="material-symbols-outlined">videocam</span>
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-500 transition-colors">
          <span className="material-symbols-outlined">info</span>
        </button>
      </div>
    </header>
  )
}

export default ChatHeader
