import React from 'react'

function MessageBubble({ message, isOwn, avatar }) {
  if (isOwn) {
    return (
      <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
        <div className="space-y-1 flex flex-col items-end">
          <div className={`bg-primary text-white rounded-2xl rounded-br-none shadow-lg shadow-primary/20 ${
            message.text.length < 20 ? 'px-4 py-2' : 'p-4'
          }`}>
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
          <div className="flex items-center gap-1 pr-1">
            <p className="text-[10px] text-slate-500">{message.time}</p>
            {message.read && (
              <span
                className="material-symbols-outlined text-sm text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 max-w-[80%]">
      <div
        className="size-8 rounded-full bg-slate-200 self-end shrink-0 avatar"
        style={{ backgroundImage: avatar ? `url('${avatar}')` : undefined }}
      />
      <div className="space-y-1">
        {message.image ? (
          <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl rounded-bl-none border border-primary/10">
            <div
              className="w-64 h-40 rounded-xl bg-slate-200 dark:bg-slate-900 bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url('${message.image}')` }}
            />
            {message.imageLabel && (
              <p className="text-xs text-slate-500 p-2 italic">{message.imageLabel}</p>
            )}
          </div>
        ) : (
          <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl rounded-bl-none">
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
        )}
        <p className="text-[10px] text-slate-500 pl-1">{message.time}</p>
      </div>
    </div>
  )
}

export default MessageBubble
