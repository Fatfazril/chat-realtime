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
    <footer className="p-4 border-t border-slate-200 dark:border-primary/20 shrink-0">
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <div className="flex items-center gap-1 mb-1">
          <button className="p-2 rounded-full text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <button className="p-2 rounded-full text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">image</span>
          </button>
        </div>
        <div className="flex-1 relative">
          <textarea
            className="w-full bg-white dark:bg-primary/20 border-none rounded-2xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary resize-none text-sm leading-relaxed ring-2 ring-primary"
            placeholder="Type a message..."
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">sentiment_satisfied</span>
          </button>
        </div>
        <button
          onClick={handleSend}
          className="mb-1 p-3 bg-primary text-white rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center animate-subtle-pulse"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </footer>
  )
}

export default ChatInput
