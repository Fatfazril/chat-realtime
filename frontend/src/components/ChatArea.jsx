import React, { useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

function ChatArea({ contact, messages, isTyping, onSendMessage, onEditMessage, onDeleteMessage }) {
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)

  const handleSend = (msgText) => {
    if (editingId) {
      if (onEditMessage) onEditMessage(editingId, msgText);
      setEditingId(null);
    } else {
      onSendMessage(msgText);
    }
    setText('');
  }

  const handleEdit = (msg) => {
    setEditingId(msg.id || msg._id)
    setText(msg.text || msg.message)
  }
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#efeae2] dark:bg-[#0b141a]">
      <ChatHeader contact={contact} />
      <ChatMessages
        messages={messages}
        contact={contact}
        isTyping={isTyping}
        onEdit={handleEdit}
        onDelete={onDeleteMessage}
      />
      <ChatInput 
        onSendMessage={handleSend}
        messageText={text}
        setMessageText={setText}
        isEditing={!!editingId}
        onCancelEdit={() => {setEditingId(null); setText('');}}
      />
    </main>
  )
}

export default ChatArea
