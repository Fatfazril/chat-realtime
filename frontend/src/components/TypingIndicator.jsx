import React from 'react'

function TypingIndicator({ avatar }) {
  return (
    <div className="flex gap-3">
      <div
        className="size-8 rounded-full bg-slate-200 self-end shrink-0 avatar"
        style={{ backgroundImage: avatar ? `url('${avatar}')` : undefined }}
      />
      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDuration: '0.5s' }} />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDuration: '0.5s', animationDelay: '75ms' }} />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDuration: '0.5s', animationDelay: '150ms' }} />
      </div>
    </div>
  )
}

export default TypingIndicator
