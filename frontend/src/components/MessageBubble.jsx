import React from 'react'

function MessageBubble({ message, isOwn, onEdit, onDelete }) {
  const senderName = message.sender?.username || 'Unknown';
  const senderAvatar = message.sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName}`;

  return (
    <div className={`w-full flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex gap-3 max-w-[90%] md:max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        <img src={senderAvatar} alt={senderName} className="size-8 md:size-10 rounded-full object-cover shrink-0 bg-primary/20 mt-1" />
        <div className={`flex flex-col gap-1 min-w-0 ${isOwn ? 'items-end' : 'items-start'}`}>
          <div className="flex items-baseline gap-2 mx-1">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{isOwn ? 'You' : senderName}</span>
            <span className="text-[10px] text-slate-400">{message.time || 'Just now'}</span>
          </div>
          <div className={`flex items-center gap-2 group/bubble ${isOwn ? 'flex-row' : 'flex-row-reverse'}`}>
            {isOwn && onEdit && onDelete && (
              <div className="hidden group-hover/bubble:flex flex-col gap-1 opacity-50 hover:opacity-100 transition-opacity text-slate-400 hover:text-primary">
                <button onClick={() => onEdit(message)} title="Edit"><span className="material-symbols-outlined text-[14px]">edit</span></button>
                <button onClick={() => {if(window.confirm('Delete message?')) onDelete(message.id || message._id)}} title="Delete" className="hover:text-red-500"><span className="material-symbols-outlined text-[14px]">delete</span></button>
              </div>
            )}
            <div className={`w-fit px-4 py-2.5 rounded-2xl shadow-sm ${isOwn ? 'bg-primary text-white rounded-tr-sm' : 'bg-white dark:bg-[#202c33] border border-slate-100 dark:border-[#202c33] text-slate-800 dark:text-[#e9edef] rounded-tl-sm'}`}>
              {message.image ? (
              <div className="flex flex-col gap-1">
                <div
                  className="w-64 h-40 rounded-lg bg-slate-200 dark:bg-slate-800 bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url('${message.image}')` }}
                />
                {message.imageLabel && (
                  <p className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words mt-1">{message.imageLabel}</p>
                )}
              </div>
            ) : (
              <p className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
            )}
            
            {message.edited && <span className="text-[10px] opacity-70 block mt-1">(edited)</span>}

            {isOwn && (
              <div className="flex items-center justify-end gap-1 mt-1 -mb-1 float-right ml-4">
                {message.read ? (
                  <span className="material-symbols-outlined text-[14px] text-[#53bdeb]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    done_all
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[14px] text-white/50" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check
                  </span>
                )}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
