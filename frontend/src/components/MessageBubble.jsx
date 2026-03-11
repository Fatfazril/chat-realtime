import React from 'react'

function MessageBubble({ message, isOwn }) {
  if (isOwn) {
    return (
      <div className="flex flex-row-reverse w-full mb-1">
        <div className="flex flex-col items-end max-w-[85%] md:max-w-[65%]">
          <div className="relative bg-[#d1eaff] dark:bg-[#005c8a] text-[#111b21] dark:text-[#e9edef] px-3 pt-1.5 pb-2 rounded-lg shadow-sm">
            {/* Tail for own message */}
            <svg 
              viewBox="0 0 8 13" 
              width="8" 
              height="13" 
              className="absolute top-0 -right-[7px] text-[#d1eaff] dark:text-[#005c8a] drop-shadow-sm" 
              fill="currentColor"
            >
              <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
              <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
            </svg>
            <p className="text-[14.2px] leading-[19px] whitespace-pre-wrap">{message.text}</p>
            <div className="flex items-center justify-end gap-1 mt-1 -mb-1 float-right ml-4">
              <span className="text-[11px] text-black/40 dark:text-white/50">{message.time}</span>
              {message.read && (
                <span className="material-symbols-outlined text-[14px] text-[#53bdeb]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  done_all
                </span>
              )}
              {!message.read && (
                <span className="material-symbols-outlined text-[14px] text-black/40 dark:text-white/50" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full mb-1">
      <div className="flex flex-col items-start max-w-[85%] md:max-w-[65%]">
        <div className="relative bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] px-3 pt-1.5 pb-2 rounded-lg shadow-sm">
          {/* Tail for others message */}
          <svg 
            viewBox="0 0 8 13" 
            width="8" 
            height="13" 
            className="absolute top-0 -left-[7px] text-white dark:text-[#202c33] drop-shadow-sm scale-x-[-1]" 
            fill="currentColor"
          >
            <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path>
            <path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path>
          </svg>
          
          {message.image ? (
            <div className="flex flex-col gap-1">
              <div
                className="w-64 h-40 rounded-lg bg-slate-200 dark:bg-slate-800 bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url('${message.image}')` }}
              />
              {message.imageLabel && (
                <p className="text-[14.2px] leading-[19px] whitespace-pre-wrap mt-1">{message.imageLabel}</p>
              )}
            </div>
          ) : (
            <p className="text-[14.2px] leading-[19px] whitespace-pre-wrap">{message.text}</p>
          )}
          
          <div className="flex items-center justify-end gap-1 mt-1 -mb-1 float-right ml-4">
            <span className="text-[11px] text-black/40 dark:text-white/50">{message.time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
