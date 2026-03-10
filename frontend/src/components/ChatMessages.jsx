import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

function ChatMessages({ messages, contact, isTyping }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Date Separator */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-100 dark:bg-primary/10" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
        <div className="flex-1 h-px bg-slate-100 dark:bg-primary/10" />
      </div>

      {/* Messages */}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.isOwn}
          avatar={contact.avatar}
        />
      ))}

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator avatar={contact.avatar} />}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
