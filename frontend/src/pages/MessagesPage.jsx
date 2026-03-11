import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { fetchWithAuth } from '../utils/api';

function MessagesPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeRoomId = searchParams.get('roomId');

  const [rooms, setRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch all user rooms to display in sidebar
  const fetchMyRooms = () => {
    fetchWithAuth('/api/rooms/me')
      .then(r => r.json())
      .then(data => setRooms(data.rooms || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchMyRooms();
    fetchWithAuth('/api/users/online')
      .then(r => r.json())
      .then(data => setOnlineUsers(data.onlineUsers ? data.onlineUsers.map(u => u._id) : []))
      .catch(console.error);
  }, []);

  // Fetch specific room details and messages when selected
  useEffect(() => {
    if (!activeRoomId) return;

    fetchWithAuth(`/api/rooms/${activeRoomId}`)
      .then(r => r.json())
      .then(data => setCurrentRoom(data.room || null))
      .catch(console.error);

    fetchWithAuth(`/api/rooms/${activeRoomId}/messages`)
      .then(r => r.json())
      .then(data => {
        // Map backend format to component expectations
        const formattedMsgs = (data.messages || []).reverse().map(m => ({
          id: m._id,
          text: m.message,
          time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: m.sender?._id === user?._id,
          read: true // Assuming read for now
        }));
        setMessages(formattedMsgs);
      })
      .catch(console.error);
      
  }, [activeRoomId, user?._id]);

  // Socket setup
  useEffect(() => {
    if (!socket || !activeRoomId) return;

    socket.emit('room:join', { roomId: activeRoomId });

    const handleNewMessage = (msg) => {
      if (msg.room === activeRoomId) {
        setMessages(prev => [...prev, {
          id: msg._id,
          text: msg.message,
          time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: msg.sender?._id === user?._id,
          read: true
        }]);
        socket.emit('message:read', { roomId: activeRoomId, messageIds: [msg._id] });
      }
    };

    socket.on('message:receive', handleNewMessage);
    socket.on('message:sent', handleNewMessage);

    return () => {
      socket.off('message:receive', handleNewMessage);
      socket.off('message:sent', handleNewMessage);
      socket.emit('room:leave', { roomId: activeRoomId });
    };
  }, [socket, activeRoomId, user?._id]);

  const handleSendMessage = (text) => {
    if (socket && activeRoomId) {
      socket.emit('message:send', { roomId: activeRoomId, message: text });
    }
  };

  // Convert rooms to Sidebar contacts prop format
  const contactsList = rooms.map(r => {
    // For DMs, show the other user
    if (r.isDirect) {
      const friend = r.members?.find(m => m._id !== user?._id) || r.members?.[0];
      return {
        id: r._id,
        name: friend?.username || 'Unknown',
        avatar: friend?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend?.username}`,
        time: '',
        lastMessage: r.name || 'Direct Message', // Just a placeholder for last message text
        isOnline: friend ? onlineUsers.includes(friend._id) : false,
        isTyping: false
      };
    }
    // For normal rooms
    return {
      id: r._id,
      name: r.name,
      avatar: r.icon ? undefined : `https://api.dicebear.com/7.x/identicon/svg?seed=${r._id}`,
      time: '',
      lastMessage: `${r.memberCount || r.members?.length || 0} members`,
      isOnline: false,
      isTyping: false
    };
  });

  const activeContact = contactsList.find(c => c.id === activeRoomId) || null;

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display overflow-hidden">
      <Sidebar 
        activeContactId={activeRoomId} 
        onSelectContact={(id) => setSearchParams({ roomId: id })} 
        contacts={contactsList}
      />
      
      {activeRoomId && activeContact ? (
        <ChatArea
          contact={activeContact}
          messages={messages}
          isTyping={activeContact.isTyping}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <main className="flex-1 flex items-center justify-center bg-[#efeae2] dark:bg-[#0b141a]">
          <div className="text-center">
            <h2 className="text-2xl font-light text-slate-500 mb-4">ChatApp Web</h2>
            <p className="text-slate-400">Select a chat to start messaging.</p>
          </div>
        </main>
      )}
    </div>
  )
}

export default MessagesPage
