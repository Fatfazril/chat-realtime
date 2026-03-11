import React from 'react'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

function ChatArea({ contact, messages, isTyping, onSendMessage }) {
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#efeae2] dark:bg-[#0b141a]">
      <ChatHeader contact={contact} />
      <ChatMessages
        messages={messages}
        contact={contact}
        isTyping={isTyping}
      />
      <ChatInput onSendMessage={onSendMessage} />
    </main>
  )
}

export default ChatArea
