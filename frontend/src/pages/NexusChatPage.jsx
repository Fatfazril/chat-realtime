import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';

const navClasses = ({ isActive }) =>
  `p-2 rounded-lg transition-colors ${
    isActive ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10'
  }`;

const NexusSidebar = ({ onLogout }) => (
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
    <div className="mt-auto flex flex-col gap-6 w-full items-center">
      <button className="p-2 w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors shrink-0">
        <span className="material-symbols-outlined">settings</span>
      </button>
      <button 
        onClick={onLogout}
        className="p-2 w-10 h-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0" 
        title="Logout"
      >
        <span className="material-symbols-outlined">logout</span>
      </button>
    </div>
  </aside>
);

const NexusRoomSidebar = ({ rooms, currentRoomId, onSelectRoom, user }) => {
  const channels = rooms.filter(r => !r.isDirect);
  const directs = rooms.filter(r => r.isDirect);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
  <aside className="w-64 hidden lg:flex flex-col border-r border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/30 relative">
    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold">Channels</h2>
        <NavLink to="/rooms" className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-sm">add</span>
        </NavLink>
      </div>

      <div className="flex flex-col gap-2">
        {channels.map(room => (
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
        {channels.length === 0 && (
           <div className="text-xs text-slate-400 pl-2">No channels yet</div>
        )}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Direct Messages</h2>
            <button onClick={() => setIsSearchOpen(true)} className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-sm">person_add</span>
            </button>
        </div>
        <div className="flex flex-col gap-3">
            {directs.map(room => {
                // Find the other member in the DM
                const friend = room.members?.find(m => m._id !== user._id) || room.members[0];
                if (!friend) return null;
                return (
                    <button 
                        key={room._id} 
                        onClick={() => onSelectRoom(room._id)}
                        className={`flex items-center gap-3 w-full px-3 py-2 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors ${currentRoomId === room._id ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                    >
                        <div className="relative size-8 shrink-0">
                            <img className="size-8 rounded-full object-cover avatar bg-primary/20" alt={friend.username} src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`} />
                            <span className={`absolute bottom-0 right-0 size-2.5 border-2 border-slate-50 dark:border-background-dark rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                        </div>
                        <span className={`text-sm ${currentRoomId === room._id ? 'font-bold text-primary' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                            {friend.username}
                        </span>
                    </button>
                )
            })}
        </div>
      </div>
    </div>

    {isSearchOpen && (
      <SearchModal 
        onClose={() => setIsSearchOpen(false)} 
        onSelectRoom={(id) => { setIsSearchOpen(false); onSelectRoom(id); }}
      />
    )}
  </aside>
  );
};

const SearchModal = ({ onClose, onSelectRoom }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setQuery(val);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (val.trim().length >= 2) {
            setLoading(true);
            timeoutRef.current = setTimeout(() => {
                fetchWithAuth(`/api/users/search?q=${encodeURIComponent(val)}`)
                .then(r => r.json())
                .then(data => { setResults(data.users || []); })
                .catch(console.error)
                .finally(() => { setLoading(false); });
            }, 500);
        } else {
            setResults([]);
            setLoading(false);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleMessage = async (targetUserId) => {
        try {
            const res = await fetchWithAuth('/api/rooms/dm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ targetUserId })
            });
            const data = await res.json();
            if (res.ok && data.room) {
                onSelectRoom(data.room._id);
            }
        } catch (err) {
            console.error('Failed to create DM:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-primary/20 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Find Users</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Search username..." 
                            value={query}
                            onChange={handleSearchChange}
                            className="w-full bg-slate-100 dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto max-h-80 p-4 pt-0 custom-scrollbar">
                    {loading && <div className="text-center text-sm text-slate-400 py-4">Searching...</div>}
                    {!loading && query.length >= 2 && results.length === 0 && <div className="text-center text-sm text-slate-400 py-4">No users found</div>}
                    {!loading && results.map(u => (
                        <div key={u._id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-primary/5 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                                <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt={u.username} className="size-10 rounded-full object-cover bg-primary/20" />
                                <span className="font-bold">{u.username}</span>
                            </div>
                            <button onClick={() => handleMessage(u._id)} className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-sm font-bold transition-colors">
                                Message
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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

  const handleInvite = async () => {
    try {
      const res = await fetchWithAuth(`/api/rooms/${currentRoom._id}/invite-token`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.inviteToken) {
        const inviteLink = `${window.location.origin}/invite/${data.inviteToken}`;
        await navigator.clipboard.writeText(inviteLink);
        alert('Invite link copied to clipboard!');
      } else {
        alert(data.error || 'Failed to generate invite link');
      }
    } catch (err) {
      console.error('Invite generation error:', err);
    }
  };

  const isOwner = currentRoom?.owner?._id === currentUser?._id || currentRoom?.owner === currentUser?._id;
  const isAdmin = currentRoom?.admins?.some(a => a === currentUser?._id || a._id === currentUser?._id);
  const canInvite = !currentRoom?.isDirect && (isOwner || isAdmin);

  return (
  <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background-dark relative">
    {/* Header */}
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-primary/20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="text-primary font-bold text-xl flex items-center gap-1">
          {!currentRoom.isDirect && <span className="text-slate-400 font-normal">#</span>}
          {currentRoom.isDirect ? (currentRoom.members?.find(m => m._id !== currentUser?._id)?.username || 'Direct Message') : currentRoom.name}
        </div>
        {!currentRoom.isDirect && (
          <>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">person</span>
              {currentRoom.members?.length || 0} members
            </div>
            {canInvite && (
              <button onClick={handleInvite} className="ml-2 p-1.5 bg-primary/10 text-primary hover:bg-primary transition-colors hover:text-white rounded-lg flex items-center gap-1 text-xs font-bold" title="Generate Invite Link">
                <span className="material-symbols-outlined text-[14px]">link</span> Invite
              </button>
            )}
          </>
        )}
      </div>
    </header>

    {/* Feed */}
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
      {messages.map((msg, i) => {
        const isOwn = String(msg.sender?._id || msg.sender?.id || msg.sender) === String(currentUser?._id || currentUser?.id);
        return (
          <div key={msg._id || i} className={`w-full flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`flex gap-3 max-w-[90%] md:max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              <img className="size-8 md:size-10 rounded-full object-cover shrink-0 bg-primary/20 mt-1" alt={msg.sender?.username} src={msg.sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender?.username}`} />
              <div className={`flex flex-col gap-1 min-w-0 ${isOwn ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mx-1">
                  <span className="text-sm font-bold">{msg.sender?.username}</span>
                  <span className="text-[10px] text-slate-400">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </span>
                </div>
                <div className={`w-fit px-4 py-2.5 rounded-2xl shadow-sm ${isOwn ? 'bg-primary text-white rounded-tr-sm' : 'bg-white dark:bg-[#202c33] border border-slate-100 dark:border-primary/10 text-slate-800 dark:text-[#e9edef] rounded-tl-sm'}`}>
                  <p className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
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
const NexusMembersSidebar = ({ currentRoom, onlineUsers, currentUser, onRefreshRoom }) => {
  if (!currentRoom || currentRoom.isDirect) return <aside className="w-72 hidden xl:flex flex-col border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/30"></aside>;
  
  const members = currentRoom.members || [];
  const online = members.filter(m => onlineUsers.includes(m._id));
  const offline = members.filter(m => !onlineUsers.includes(m._id));

  const isOwner = currentRoom.owner?._id === currentUser?._id || currentRoom.owner === currentUser?._id;
  const isAdmin = currentRoom.admins?.some(a => a === currentUser?._id || a._id === currentUser?._id) || isOwner;

  const handleAction = async (action, userId) => {
    try {
        let method = 'POST';
        let url = `/api/rooms/${currentRoom._id}/admins`;
        let body = null;

        if (action === 'promote') {
            body = JSON.stringify({ targetUserId: userId });
        } else if (action === 'demote') {
            method = 'DELETE';
            url = `/api/rooms/${currentRoom._id}/admins/${userId}`;
        } else if (action === 'kick') {
            method = 'DELETE';
            url = `/api/rooms/${currentRoom._id}/members/${userId}`;
        }

        const res = await fetchWithAuth(url, {
            method,
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body
        });

        if (res.ok) {
            onRefreshRoom();
        } else {
            const data = await res.json();
            alert(data.error || 'Action failed');
        }
    } catch (err) {
        console.error('Member action error:', err);
    }
  };

  const renderMember = (user, isOffline = false) => {
      const isTargetOwner = currentRoom.owner === user._id || currentRoom.owner?._id === user._id;
      const isTargetAdmin = currentRoom.admins?.some(a => a === user._id || a._id === user._id);
      
      const canModerate = isAdmin && user._id !== currentUser?._id && !isTargetOwner && (isOwner || !isTargetAdmin);

      return (
        <div key={user._id} className={`flex items-center justify-between group ${isOffline ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3">
            <div className={`relative size-10 shrink-0 ${isOffline ? 'grayscale' : ''}`}>
                <img className="size-10 rounded-full object-cover bg-primary/20" alt={user.username} src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                {!isOffline && <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full"></span>}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate flex items-center gap-1">
                    {user.username} 
                    {isTargetOwner && <span className="material-symbols-outlined text-[12px] text-yellow-500" title="Owner">star</span>}
                    {isTargetAdmin && !isTargetOwner && <span className="material-symbols-outlined text-[12px] text-blue-500" title="Admin">shield</span>}
                </span>
                <span className="text-[11px] text-slate-500 truncate">{isOffline ? 'Offline' : 'Online'}</span>
            </div>
            </div>
            
            {canModerate && (
                <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    {!isTargetAdmin ? (
                        <button onClick={() => handleAction('promote', user._id)} className="p-1 text-slate-400 hover:text-primary transition-colors" title="Promote to Admin">
                            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                        </button>
                    ) : (
                        <button onClick={() => handleAction('demote', user._id)} className="p-1 text-slate-400 hover:text-orange-500 transition-colors" title="Demote Admin">
                            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                        </button>
                    )}
                    <button onClick={() => handleAction('kick', user._id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors" title="Remove Member">
                        <span className="material-symbols-outlined text-[16px]">person_remove</span>
                    </button>
                </div>
            )}
        </div>
      );
  };

  return (
    <aside className="w-72 hidden xl:flex flex-col border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-background-dark/30">
      <div className="p-6 overflow-y-auto custom-scrollbar">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Online — {online.length}</h3>
        <div className="flex flex-col gap-5">
          {online.map(u => renderMember(u, false))}
        </div>

        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-10 mb-6">Offline — {offline.length}</h3>
        <div className="flex flex-col gap-5">
          {offline.map(u => renderMember(u, true))}
        </div>
      </div>
    </aside>
  );
};

export default function NexusChatPage() {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentRoomId = searchParams.get('roomId');

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch all rooms for sidebar
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

  const fetchCurrentRoomDetails = useCallback(() => {
    if (!currentRoomId) return;
    fetchWithAuth(`/api/rooms/${currentRoomId}`)
      .then(r => r.json())
      .then(data => setCurrentRoom(data.room || null))
      .catch(console.error);
  }, [currentRoomId]);

  // Fetch current room details & messages on room ID change
  useEffect(() => {
    fetchCurrentRoomDetails();

    if (!currentRoomId) return;
    // Messages
    fetchWithAuth(`/api/rooms/${currentRoomId}/messages`)
      .then(r => r.json())
      .then(data => setMessages((data.messages || []).reverse()))
      .catch(console.error);
      
  }, [currentRoomId, fetchCurrentRoomDetails]);

  // Socket join/leave & listeners
  useEffect(() => {
    if (!socket || !currentRoomId) return;

    socket.emit('room:join', { roomId: currentRoomId });

    const handleNewMessage = (msg) => {
      // Check if message belongs to current room
      if (msg.room === currentRoomId) {
        setMessages(prev => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
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
      <NexusSidebar onLogout={logout} />
      <NexusRoomSidebar 
        rooms={rooms} 
        currentRoomId={currentRoomId} 
        onSelectRoom={(id) => {
            setSearchParams({ roomId: id });
            fetchMyRooms(); // refresh rooms in case a new DM was created
        }} 
        user={user}
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
        currentUser={user}
        onRefreshRoom={fetchCurrentRoomDetails}
      />
    </div>
  );
}
