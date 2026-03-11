import React from 'react'

function ChatHeader({ contact }) {
  return (
    <header className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-slate-200 dark:border-[#313d45] shrink-0">
      <div className="flex items-center gap-4 cursor-pointer">
        <div className="relative">
          <div
            className="size-10 rounded-full bg-slate-200 avatar"
            style={{ backgroundImage: contact.avatar ? `url('${contact.avatar}')` : undefined }}
          />
          {contact.isOnline && (
            <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-slate-100 dark:border-[#202c33]" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-[15px] dark:text-[#e9edef] text-[#111b21] leading-tight">{contact.name}</h2>
          <p className={`text-[13px] ${
            contact.isOnline ? 'text-green-500 dark:text-green-400 font-medium' : 'text-[#667781] dark:text-[#8696a0]'
          }`}>
            {contact.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">videocam</span>
        </button>
        <button className="p-2 text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">call</span>
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-[#313d45] mx-1"></div>
        <button className="p-2 text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">search</span>
        </button>
      </div>
    </header>
  )
}

export default ChatHeader
