import React from 'react'

function ContactItem({ name, avatar, time, lastMessage, isActive, isOnline, isTyping }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:shadow-md hover:scale-[1.02] transform transition-all duration-200 ${
        isActive
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-slate-100 dark:hover:bg-primary/5'
      }`}
    >
      <div className="relative shrink-0">
        <div
          className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 avatar"
          style={{ backgroundImage: avatar ? `url('${avatar}')` : undefined }}
        />
        <div
          className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-background-dark ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
        />
      </div>
      <div className="hidden lg:block flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold text-sm truncate">{name}</h3>
          <span className="text-[10px] text-slate-400">{time}</span>
        </div>
        <p className={`text-xs truncate ${isTyping ? 'font-medium text-primary' : 'text-slate-400'}`}>
          {isTyping ? 'Typing...' : lastMessage}
        </p>
      </div>
    </div>
  )
}

export default ContactItem
