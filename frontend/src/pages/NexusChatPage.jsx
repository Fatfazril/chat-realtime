import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const navClasses = ({ isActive }) =>
  `p-2 rounded-lg transition-colors ${
    isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10'
  }`;

const NexusSidebar = () => (
  <aside className="w-16 hidden md:flex flex-col items-center py-6 gap-8 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark/50">
    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20 shrink-0">
      <span className="material-symbols-outlined">bolt</span>
    </div>
    <nav className="flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar">
      <NavLink to="/dashboard" className={navClasses}>
        <span className="material-symbols-outlined">house</span>
      </NavLink>
      <NavLink to="/nexus" className={navClasses}>
        <span className="material-symbols-outlined">folder</span>
      </NavLink>
      <NavLink to="/messages" className={navClasses}>
        <span className="material-symbols-outlined">chat_bubble</span>
      </NavLink>
      <NavLink to="/rooms" className={navClasses}>
        <span className="material-symbols-outlined">group</span>
      </NavLink>
    </nav>
    <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors shrink-0">
      <span className="material-symbols-outlined">settings</span>
    </button>
  </aside>
);

const NexusRoomSidebar = ({ rooms, currentRoomId, onSelectRoom }) => (
  <aside className="w-64 hidden lg:flex flex-col border-r border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/30">
    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold">Channels</h2>
        <NavLink to="/rooms" className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-sm">add</span>
        </NavLink>
      </div>

      <div className="flex flex-col gap-2">
        {rooms.map(room => (
          <button 
            key={room._id}
            onClick={() => onSelectRoom(room._id)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
              currentRoomId === room._id 
                ? 'bg-primary/10 text-primary active-channel-glow' 
                : 'text-slate-500 hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">tag</span>
              <span className={`text-sm ${currentRoomId === room._id ? 'font-bold tracking-tight' : 'font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                {room.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Direct Messages</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors p-2">
            <div className="relative size-8 shrink-0">
              <img className="size-8 rounded-full object-cover avatar" alt="Sarah Miller" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1PC58ShhZ_NWkXi30NjEGQhWjwHe2OKp4jHCC7bRKM-YcveAoqAsTgKFIZ5-nbPOMJxXwdDRghB_Zb8u6qs2bxDgXGSSGxzg9Nu6kllKdVXL5wS_YLfkIg9W5iqPUjk2bcRnxwRzm4Rx6y4eLSq3fSi3_LUia5PCbDboAkvP9hh-BD_LG7vT9qHSYNWZYMxXbZIhapTC7Tx4aFaYEkoP0RBn6vQP7lQLlXlfkPi7PaZ5KobbbQmeRvxtvsnZ9z7xKt7f-xk9ybp4" />
              <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full"></span>
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sarah Miller</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors p-2">
            <div className="relative size-8 shrink-0">
              <img className="size-8 rounded-full object-cover avatar" alt="James Wilson" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA_Qr7_Je9yZ78XHTM3SlGmQy2Z2wIa5yg7NtvrH0GL0xLXj3CyWU9jKnT3PkRbOOfDwDr1sLJvNBeg0-p14YvJrh8nVV9KpxfEhzcDVA7SX7m9ONW1aVjk6oRfqvOwuRoBhq8GIJtSL9EP8zXzBA5nQ7oHMJ6tayaWZpqWSceg0zm6ACzvWz-dw5DVEV7Hz_y8DAfZiRpRzh2GNM7VFT2nPd7RxDPz4bRC2IMjoldNQIBF9ZR3df0ypmDzq1-g9CeDdJcLsAcCQU" />
              <span className="absolute bottom-0 right-0 size-2.5 bg-slate-300 rounded-full border-2 border-slate-50 dark:border-background-dark"></span>
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">James Wilson</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-auto p-4 border-t border-slate-200 dark:border-primary/20 shrink-0">
      <NavLink to="/rooms" className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-95">
        <span className="material-symbols-outlined text-lg">add_circle</span>
        Create Room
      </NavLink>
    </div>
  </aside>
);

const NexusChatArea = ({ currentRoom, messages, onSendMessage, currentUser }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentRoom) return (
    <main className="flex-1 flex items-center justify-center bg-white dark:bg-background-dark text-slate-400 font-bold">
      Select a channel to start messaging
    </main>
  );

  return (
  <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background-dark relative">
    {/* Header */}
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-primary/20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="text-primary font-bold text-xl flex items-center gap-1">
          <span className="text-slate-400 font-normal">#</span>
          {currentRoom.name}
        </div>
        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-base">person</span>
          {currentRoom.members?.length || 0} members
        </div>
      </div>
    </header>

    {/* Feed */}
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
      {messages.map((msg, i) => {
        const isOwn = msg.sender?._id === currentUser?._id;
        return (
          <div key={msg._id || i} className="flex gap-4 group">
            {/* If sender has avatar use it, else generic */}
            <img className="size-10 rounded-xl object-cover shrink-0 bg-primary/20" alt={msg.sender?.username} src={msg.sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender?.username}`} />
            <div className={`flex flex-col gap-1 min-w-0 ${isOwn ? 'items-end ml-auto' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">{msg.sender?.username}</span>
                <span className="text-[10px] text-slate-400">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
              <div className={`w-fit max-w-2xl px-4 py-2.5 rounded-xl shadow-sm ${isOwn ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 dark:bg-primary/10 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>

    {/* Bottom Input Area */}
    <footer className="p-6 shrink-0">
      <div className="mb-2 min-h-6 flex items-end">
        {/* Placeholder for typing indicators */}
      </div>
      
      <div className="bg-slate-100 dark:bg-primary/5 rounded-2xl p-2 border border-slate-200 dark:border-primary/10 transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
        <div className="flex items-center gap-2 px-2 pb-2 border-b border-slate-200 dark:border-primary/10 mb-2">
          <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">format_bold</span></button>
          <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">format_italic</span></button>
          <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">link</span></button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <button className="p-1.5 text-slate-400 hover:text-primary rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
        </div>
        <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-4">
          <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors shrink-0">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-0 text-slate-800 dark:text-slate-200 placeholder:text-slate-400" 
            placeholder={`Message #${currentRoom.name}`}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">sentiment_satisfied</span>
            </button>
            <button type="submit" disabled={!text.trim()} className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </form>
      </div>
    </footer>
  </main>
  );
};
const NexusMembersSidebar = ({ currentRoom, onlineUsers }) => {
  if (!currentRoom) return <aside className="w-72 hidden xl:flex flex-col border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/30"></aside>;
  
  const members = currentRoom.members || [];
  const online = members.filter(m => onlineUsers.includes(m._id));
  const offline = members.filter(m => !onlineUsers.includes(m._id));

  return (
    <aside className="w-72 hidden xl:flex flex-col border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/30">
      <div className="p-6 overflow-y-auto custom-scrollbar">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Online — {online.length}</h3>
        <div className="flex flex-col gap-5">
          {online.map(user => (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0">
                  <img className="size-10 rounded-full object-cover bg-primary/20" alt={user.username} src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full"></span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold truncate">{user.username}</span>
                  <span className="text-[11px] text-slate-500 truncate">Online</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-10 mb-6">Offline — {offline.length}</h3>
        <div className="flex flex-col gap-5 opacity-60">
          {offline.map(user => (
            <div key={user._id} className="flex items-center gap-3">
              <img className="size-10 rounded-full object-cover grayscale shrink-0 bg-primary/20" alt={user.username} src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
              <span className="text-sm font-medium pt-1">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default function NexusChatPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentRoomId = searchParams.get('roomId');

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch all rooms for sidebar
  useEffect(() => {
    fetch('/api/rooms', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => setRooms(data.rooms || []))
      .catch(console.error);
      
    fetch('/api/users/online', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => setOnlineUsers(data.onlineUsers ? data.onlineUsers.map(u => u._id) : []))
      .catch(console.error);
  }, []);

  // Fetch current room details & messages on room ID change
  useEffect(() => {
    if (!currentRoomId) return;

    // Room details
    fetch(`/api/rooms/${currentRoomId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => setCurrentRoom(data.room || null))
      .catch(console.error);

    // Messages
    fetch(`/api/rooms/${currentRoomId}/messages`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(data => setMessages((data.messages || []).reverse()))
      .catch(console.error);
      
  }, [currentRoomId]);

  // Socket join/leave & listeners
  useEffect(() => {
    if (!socket || !currentRoomId) return;

    socket.emit('room:join', { roomId: currentRoomId });

    const handleNewMessage = (msg) => {
      // Check if message belongs to current room
      if (msg.room === currentRoomId) {
        setMessages(prev => [...prev, msg]);
        socket.emit('message:read', { roomId: currentRoomId, messageIds: [msg._id] });
      }
    };

    const handleRoomJoined = (data) => console.log('Successfully joined room', data);

    socket.on('message:receive', handleNewMessage);
    socket.on('message:sent', handleNewMessage); // My own sent messages
    socket.on('room:joined', handleRoomJoined);

    return () => {
      socket.off('message:receive', handleNewMessage);
      socket.off('message:sent', handleNewMessage);
      socket.off('room:joined', handleRoomJoined);
      socket.emit('room:leave', { roomId: currentRoomId });
    };
  }, [socket, currentRoomId]);

  const handleSendMessage = (text) => {
    if (socket && currentRoomId) {
      socket.emit('message:send', { roomId: currentRoomId, message: text });
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display h-screen flex overflow-hidden">
      <NexusSidebar />
      <NexusRoomSidebar 
        rooms={rooms} 
        currentRoomId={currentRoomId} 
        onSelectRoom={(id) => setSearchParams({ roomId: id })} 
      />
      <NexusChatArea 
        currentRoom={currentRoom} 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        onlineUsers={onlineUsers} 
        currentUser={user}
      />
      <NexusMembersSidebar 
        currentRoom={currentRoom} 
        onlineUsers={onlineUsers} 
      />
    </div>
  );
}
