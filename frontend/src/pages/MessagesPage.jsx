import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
      .then(data => setOnlineUsers((data.users || data.onlineUsers || []).map(u => u._id)))
      .catch(console.error);
  }, []);

  // Fetch specific room details and messages when selected
  useEffect(() => {
    if (!activeRoomId) return;

    fetchWithAuth(`/api/rooms/${activeRoomId}`)
      .then(r => r.json())
      .catch(console.error);

    fetchWithAuth(`/api/rooms/${activeRoomId}/messages`)
      .then(r => r.json())
      .then(data => {
        // Backend already returns messages in chronological order — do NOT reverse again
        const currentUserId = String(user?._id || user?.id);
        const formattedMsgs = (data.messages || []).map(m => ({
          id: String(m._id),
          text: m.message,
          time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: String(m.sender?._id || m.sender?.id || m.sender) === currentUserId,
          read: true,
          sender: m.sender
        }));
        setMessages(formattedMsgs);
      })
      .catch(console.error);

  }, [activeRoomId, user?._id, user?.id]);

  // Socket setup
  useEffect(() => {
    if (!socket || !activeRoomId) return;

    const currentUserId = String(user?._id || user?.id);

    socket.emit('room:join', { roomId: activeRoomId });

    const handleNewMessage = (msg) => {
      if (String(msg.room) !== String(activeRoomId)) return;

      const msgId = String(msg._id);
      setMessages(prev => {
        // Dedup: check if this message already exists (string comparison)
        if (prev.some(m => String(m.id) === msgId)) return prev;
        return [...prev, {
          id: msgId,
          text: msg.message,
          time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: String(msg.sender?._id || msg.sender?.id || msg.sender) === currentUserId,
          read: true,
          sender: msg.sender
        }];
      });
    };

    // Listen to both events — message:sent is the ACK for the sender,
    // message:receive is the Redis broadcast for all room members.
    // The dedup above prevents showing the message twice.
    socket.on('message:receive', handleNewMessage);
    socket.on('message:sent', handleNewMessage);

    socket.on('message:update', (data) => {
      if (String(data.room) === String(activeRoomId)) {
        const updId = String(data._id);
        setMessages(prev => prev.map(m => String(m.id) === updId ? { ...m, text: data.message, edited: true } : m));
      }
    });

    socket.on('message:delete', (data) => {
      if (String(data.room) === String(activeRoomId)) {
        const delId = String(data._id);
        setMessages(prev => prev.filter(m => String(m.id) !== delId));
      }
    });

    return () => {
      socket.off('message:receive', handleNewMessage);
      socket.off('message:sent', handleNewMessage);
      socket.off('message:update');
      socket.off('message:delete');
      socket.emit('room:leave', { roomId: activeRoomId });
    };
  }, [socket, activeRoomId, user?._id, user?.id]);

  const handleSendMessage = (text) => {
    if (socket && activeRoomId) {
      socket.emit('message:send', { roomId: activeRoomId, message: text });
    }
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
        const res = await fetchWithAuth(`/api/messages/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: newText })
        });
        if (!res.ok) alert('Failed to edit message');
    } catch (err) {
        console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
        const res = await fetchWithAuth(`/api/messages/${messageId}`, {
            method: 'DELETE'
        });
        if (!res.ok) alert('Failed to delete message');
    } catch (err) {
        console.error(err);
    }
  };

  // Convert rooms to Sidebar contacts prop format — add isDirect flag for sectioning
  const contactsList = rooms.map(r => {
    if (r.isDirect) {
      const friend = r.members?.find(m => m._id !== user?._id) || r.members?.[0];
      return {
        id: r._id,
        name: friend?.username || 'Unknown',
        avatar: friend?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend?.username}`,
        time: '',
        lastMessage: r.name || 'Direct Message',
        isOnline: friend ? onlineUsers.includes(friend._id) : false,
        isTyping: false,
        isDirect: true
      };
    }
    return {
      id: r._id,
      name: r.name,
      avatar: r.icon ? undefined : `https://api.dicebear.com/7.x/identicon/svg?seed=${r._id}`,
      time: '',
      lastMessage: `${r.memberCount || r.members?.length || 0} members`,
      isOnline: false,
      isTyping: false,
      isDirect: false
    };
  });

  // Split into DMs and Rooms
  const directMessages = contactsList.filter(c => c.isDirect);
  const groupRooms = contactsList.filter(c => !c.isDirect);

  const activeContact = contactsList.find(c => c.id === activeRoomId) || null;

  // Render a single contact row
  const renderContactRow = (contact) => (
    <div
      key={contact.id}
      onClick={() => setSearchParams({ roomId: contact.id })}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group ${activeRoomId === contact.id ? 'bg-white dark:bg-primary/10 border border-slate-200 dark:border-primary/20 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-primary/5 border border-transparent'}`}
    >
      <div className="relative shrink-0">
        {contact.isDirect ? (
          /* DM: Round avatar */
          <img alt={contact.name} className="size-11 rounded-full object-cover bg-slate-200 dark:bg-[#202c33]" src={contact.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.id}`} />
        ) : (
          /* Room: Rounded-square avatar with gradient fallback */
          <div className="size-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden">
            {contact.avatar ? (
              <img alt={contact.name} className="size-full object-cover" src={contact.avatar} />
            ) : (
              <span className="material-symbols-outlined text-primary text-xl">tag</span>
            )}
          </div>
        )}
        {contact.isDirect && contact.isOnline && (
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-[#111b21] rounded-full"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{contact.time || ''}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{contact.lastMessage}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-900 dark:text-slate-100 bg-background-light dark:bg-[#0b141a] font-display">
      {/* Left Navigation Sidebar (Icon Style) */}
      <aside className="w-20 flex flex-col items-center py-6 border-r border-slate-200 dark:border-[#202c33] bg-white dark:bg-[#0b141a] shrink-0">
        <div className="mb-10 text-primary">
          <span className="material-symbols-outlined text-4xl">forum</span>
        </div>
        <nav className="flex flex-col gap-6 flex-1">
          <Link to="/dashboard" className="p-3 rounded-xl hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">home</span>
          </Link>
          <Link to="/messages" className="p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-2xl">chat_bubble</span>
          </Link>
          <Link to="/rooms" className="p-3 rounded-xl hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">group</span>
          </Link>
          <Link to="/contacts" className="p-3 rounded-xl hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">call</span>
          </Link>
          <Link to="/settings" className="p-3 rounded-xl hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">settings</span>
          </Link>
        </nav>
        <div className="mt-auto">
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="size-10 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-background-dark" />
          ) : (
            <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold ring-2 ring-primary ring-offset-2 ring-offset-[#0b141a]">
              {user?.username?.substring(0, 2).toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </aside>

      {/* Messages List Sidebar */}
      <section className="w-80 border-r border-slate-200 dark:border-[#202c33] bg-slate-50 dark:bg-[#111b21] flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Messages</h2>
            <button className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-xl font-bold">add</span>
            </button>
          </div>
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input className="w-full bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-[#202c33] rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 outline-none text-slate-900 dark:text-slate-100" placeholder="Search conversations..." type="text" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
          {/* ── Direct Messages Section ── */}
          {directMessages.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="material-symbols-outlined text-primary text-base">person</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Direct Messages</span>
                <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">{directMessages.length}</span>
              </div>
              <div className="space-y-0.5">
                {directMessages.map(renderContactRow)}
              </div>
            </div>
          )}

          {/* ── Divider ── */}
          {directMessages.length > 0 && groupRooms.length > 0 && (
            <div className="flex items-center gap-3 px-3 my-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-[#202c33]"></div>
              <span className="material-symbols-outlined text-[14px] text-slate-300 dark:text-[#3b4a54]">more_horiz</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-[#202c33]"></div>
            </div>
          )}

          {/* ── Rooms Section ── */}
          {groupRooms.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="material-symbols-outlined text-emerald-500 text-base">tag</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Rooms</span>
                <span className="ml-auto text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded">{groupRooms.length}</span>
              </div>
              <div className="space-y-0.5">
                {groupRooms.map(renderContactRow)}
              </div>
            </div>
          )}

          {/* ── Empty State ── */}
          {contactsList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">chat_bubble</span>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">No conversations yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Start a chat or join a room to get started.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-[#202c33]">
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">archive</span>
            Archived Chats
          </button>
        </div>
      </section>

      {/* Main Inbox Area or ChatArea */}
      {activeRoomId && activeContact ? (
        <ChatArea
          contact={activeContact}
          messages={messages}
          isTyping={activeContact.isTyping}
          onSendMessage={handleSendMessage}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      ) : (
        <>
          <main className="flex-1 flex flex-col bg-white dark:bg-[#0b141a]">
            {/* Inbox Header & Filters */}
            <header className="p-6 border-b border-slate-200 dark:border-[#202c33] flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
                  <p className="text-slate-500 text-sm">You have {contactsList.length} unread messages today.</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all">
                    <span className="material-symbols-outlined text-lg">edit</span>
                    New Message
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium">All</button>
                <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-[#111b21] text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-primary/20 transition-colors border border-transparent dark:border-[#202c33]">Unread</button>
                <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-[#111b21] text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-primary/20 transition-colors border border-transparent dark:border-[#202c33]">Mentions</button>
                <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-[#111b21] text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-primary/20 transition-colors border border-transparent dark:border-[#202c33]">Drafts</button>
              </div>
            </header>

            {/* Conversation View / Message List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {contactsList.map((contact, idx) => (
                  <div key={contact.id} onClick={() => setSearchParams({ roomId: contact.id })} className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-[#202c33] hover:border-primary/40 dark:hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all cursor-pointer bg-white dark:bg-[#111b21]">
                    <div className="flex items-center gap-4 flex-1">
                      {idx % 2 === 0 ? (
                        <div className="shrink-0 size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {contact.name.substring(0, 2).toUpperCase()}
                        </div>
                      ) : (
                        <img alt="User" className="size-12 rounded-xl object-cover bg-slate-200" src={contact.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${contact.id}`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-slate-100">{contact.name}</h3>
                          {idx % 3 === 0 && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-500 uppercase tracking-wider">Project</span>}
                          {idx % 3 === 1 && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 uppercase tracking-wider">Direct</span>}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{contact.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 ml-4">
                      <div className="hidden group-hover:flex items-center gap-3">
                        <button className="p-2 rounded-lg text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">star</span>
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-slate-400">{contact.time || '10:45 AM'}</p>
                        {idx === 0 && (
                            <div className="flex justify-end mt-1">
                                <span className="size-2 rounded-full bg-primary"></span>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Message Floating Input Area (Collapsed) */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-[#111b21] border-t border-slate-200 dark:border-[#202c33]">
              <div className="max-w-4xl mx-auto flex items-center gap-4">
                <div className="flex-1 relative">
                  <input className="w-full bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-[#202c33] rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500" placeholder="Start a new message..." type="text" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">sentiment_satisfied</span></button>
                    <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">attach_file</span></button>
                  </div>
                </div>
                <button className="size-11 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </main>

          {/* Right Detail/Info Panel */}
          <aside className="w-72 border-l border-slate-200 dark:border-[#202c33] bg-white dark:bg-[#111b21] hidden xl:flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                {user?.avatar ? (
                  <img alt="Profile" className="size-24 rounded-2xl object-cover ring-4 ring-primary/10" src={user.avatar} />
                ) : (
                  <div className="size-24 rounded-2xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-4xl text-white font-bold ring-4 ring-primary/10">
                    {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 size-5 bg-green-500 border-4 border-white dark:border-[#111b21] rounded-full"></span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.username}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Online</p>
              <div className="flex gap-3 w-full">
                <button className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors border border-transparent">Profile</button>
                <button className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-[#0b141a] text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-primary/20 transition-colors border border-transparent dark:border-[#202c33]">Settings</button>
              </div>
            </div>
            
            <div className="px-6 py-4 flex-1 overflow-y-auto custom-scrollbar border-t border-slate-200 dark:border-[#202c33]">
              <div className="mb-6 mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Shared Media</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-slate-100 dark:bg-primary/10 rounded-lg overflow-hidden border border-slate-200 dark:border-primary/20"></div>
                  <div className="aspect-square bg-slate-100 dark:bg-primary/10 rounded-lg overflow-hidden border border-slate-200 dark:border-primary/20"></div>
                  <div className="aspect-square bg-slate-100 dark:bg-primary/10 rounded-lg overflow-hidden border border-slate-200 dark:border-primary/20"></div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Files</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#0b141a] cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">description</span>
                    <div className="min-w-0 text-slate-900 dark:text-slate-100">
                      <p className="text-xs font-semibold truncate">brand_guidelines_v2.pdf</p>
                      <p className="text-[10px] text-slate-400">4.2 MB • Oct 12</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#0b141a] cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">image</span>
                    <div className="min-w-0 text-slate-900 dark:text-slate-100">
                      <p className="text-xs font-semibold truncate">hero_banner_final.png</p>
                      <p className="text-[10px] text-slate-400">12.5 MB • Oct 10</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-[#202c33]">
              <button className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-bold hover:bg-red-500/10 border border-transparent hover:border-red-500/20 py-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg font-bold">exit_to_app</span>
                Log Out
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

export default MessagesPage
