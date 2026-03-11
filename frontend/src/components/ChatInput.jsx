import React, { useState } from 'react'

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <footer className="p-3 bg-slate-100 dark:bg-background-dark/80 border-t border-slate-200 dark:border-primary/10 shrink-0">
      <div className="flex items-end gap-2 max-w-5xl mx-auto">
        <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shrink-0">
          <span className="material-symbols-outlined">add</span>
        </button>
        
        <div className="flex-1 bg-white dark:bg-primary/5 rounded-full flex items-center px-4 py-1.5 border border-slate-200 dark:border-primary/10 focus-within:ring-1 focus-within:ring-primary/50 transition-shadow">
          <button className="p-1 mr-2 text-slate-400 hover:text-primary transition-colors shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
          </button>
          <textarea
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 max-h-32 custom-scrollbar outline-none"
            placeholder="Type a message"
            rows={1}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              // Auto-resize logic could go here
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {message.trim() ? (
          <button
            onClick={handleSend}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shrink-0 flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        ) : (
          <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shrink-0">
            <span className="material-symbols-outlined text-[24px]">mic</span>
          </button>
        )}
      </div>
    </footer>
  )
}

export default ChatInput
