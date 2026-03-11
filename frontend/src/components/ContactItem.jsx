import React from 'react'

function ContactItem({ name, avatar, time, lastMessage, isActive, isOnline, isTyping }) {
  return (
    <div
      className={`flex items-center gap-3 pl-3 pr-4 py-3 cursor-pointer transition-colors ${
        isActive
          ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
          : 'bg-white dark:bg-[#111b21] hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
      }`}
    >
      <div className="relative shrink-0">
        <div
          className="size-[49px] rounded-full bg-slate-200 dark:bg-slate-800 avatar overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: avatar ? `url('${avatar}')` : undefined }}
        />
        {isOnline && (
          <div
            className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-[#111b21] bg-[#00a884] dark:bg-[#00a884]"
          />
        )}
      </div>
      
      <div className="hidden lg:flex flex-1 min-w-0 flex-col justify-center border-b border-slate-100 dark:border-[#222d34] pb-3 -mb-3 h-[49px]">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className="text-[17px] text-[#111b21] dark:text-[#e9edef] truncate leading-tight">{name}</h3>
          <span className={`text-[12px] ${isActive ? 'text-[#111b21] dark:text-[#e9edef]' : 'text-[#667781] dark:text-[#8696a0]'}`}>{time}</span>
        </div>
        <p className={`text-[13px] truncate ${isTyping ? 'text-[#00a884] font-medium' : 'text-[#667781] dark:text-[#8696a0]'}`}>
          {isTyping ? 'typing...' : lastMessage}
        </p>
      </div>
    </div>
  )
}

export default ContactItem
