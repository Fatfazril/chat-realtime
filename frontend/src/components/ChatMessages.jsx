import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

function ChatMessages({ messages, contact, isTyping, onEdit, onDelete }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto px-[5%] py-4 space-y-1.5 custom-scrollbar bg-[#efeae2] dark:bg-[#0b141a]">
      {/* Date Separator */}
      <div className="flex items-center justify-center my-4">
        <span className="bg-white dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] px-3 py-1.5 rounded-lg text-[12.5px] shadow-sm tracking-wide">
          TODAY
        </span>
      </div>

      {/* Messages */}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.isOwn}
          avatar={contact.avatar}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {/* Typing Indicator */}
      {isTyping && <div className="mt-2"><TypingIndicator /></div>}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
