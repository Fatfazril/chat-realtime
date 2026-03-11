import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ContactItem from './ContactItem'
import { fetchWithAuth } from '../utils/api'
import { useAuth } from '../context/AuthContext'

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

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleMessage = async (targetUserId) => {
        try {
            const res = await fetchWithAuth('/api/rooms/dm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            <div className="bg-white dark:bg-[#111b21] border border-slate-200 dark:border-[#222d34] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-[#222d34] flex items-center justify-between">
                    <h3 className="font-bold text-lg dark:text-[#e9edef]">Start New Chat</h3>
                    <button onClick={onClose} className="p-1 text-[#54656f] dark:text-[#8696a0] hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#54656f] dark:text-[#8696a0]">search</span>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Find a username..." 
                            value={query}
                            onChange={handleSearchChange}
                            className="w-full bg-[#f0f2f5] dark:bg-[#202c33] border-none rounded-xl pl-10 pr-4 py-3 focus:ring-0 text-[#111b21] dark:text-[#e9edef] placeholder-[#54656f] dark:placeholder-[#8696a0] outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto max-h-80 p-4 pt-0 custom-scrollbar text-[#111b21] dark:text-[#e9edef]">
                    {loading && <div className="text-center text-sm text-[#54656f] dark:text-[#8696a0] py-4">Searching...</div>}
                    {!loading && query.length >= 2 && results.length === 0 && <div className="text-center text-sm text-[#54656f] dark:text-[#8696a0] py-4">No users found</div>}
                    {!loading && results.map(u => (
                        <div key={u._id} className="flex items-center justify-between p-3 hover:bg-[#f0f2f5] dark:hover:bg-[#202c33] rounded-xl transition-colors cursor-pointer" onClick={() => handleMessage(u._id)}>
                            <div className="flex items-center gap-3">
                                <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt={u.username} className="size-10 rounded-full object-cover bg-slate-200 dark:bg-slate-800" />
                                <span className="font-bold">{u.username}</span>
                            </div>
                            <span className="material-symbols-outlined text-[#00a884]">chat</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function Sidebar({ activeContactId, onSelectContact, contacts = [] }) {
  const { user } = useAuth();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter the populated contacts prop
  const filteredContacts = contacts.filter(c =>
    (c.name || '').toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  return (
    <aside className="w-20 lg:w-[400px] border-r border-slate-200 dark:border-[#313d45] flex flex-col bg-white dark:bg-[#111b21] shrink-0">
      {/* Header */}
      <div className="h-[59px] px-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between shrink-0">
        <div
          className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 avatar cursor-pointer"
          style={{ backgroundImage: `url('${user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}')` }}
        />
        <div className="flex items-center gap-3 text-[#54656f] dark:text-[#aebac1]">
          <Link to="/rooms" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">groups</span>
          </Link>
          <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center" title="New Chat">
            <span className="material-symbols-outlined text-[24px]">chat</span>
          </button>
          <Link to="/profile" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 bg-white dark:bg-[#111b21] border-b border-slate-200 dark:border-[#222d34]">
        <div className="relative group flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 focus-within:bg-white dark:focus-within:bg-[#202c33] transition-colors shadow-sm">
          <span className="material-symbols-outlined shrink-0 text-[#54656f] dark:text-[#8696a0] w-6 text-sm group-focus-within:hidden transition-all">
            search
          </span>
          <span className="material-symbols-outlined shrink-0 text-[#00a884] dark:text-[#00a884] w-6 text-sm hidden group-focus-within:block transition-all">
            arrow_back
          </span>
          <input
            className="w-full bg-transparent border-none pl-3 py-1 text-[15px] focus:ring-0 text-[#111b21] dark:text-[#e9edef] placeholder:text-[#54656f] dark:placeholder:text-[#8696a0] outline-none"
            placeholder="Filter chats"
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts List */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#111b21]">
        {filteredContacts.map((contact) => (
          <div key={contact.id} onClick={() => onSelectContact(contact.id)}>
            <ContactItem
              name={contact.name}
              avatar={contact.avatar}
              time={contact.time}
              lastMessage={contact.lastMessage}
              isActive={contact.id === activeContactId}
              isOnline={contact.isOnline}
              isTyping={contact.isTyping}
            />
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div className="text-center p-6 text-[#54656f] dark:text-[#8696a0] text-sm">
            {localSearchQuery ? 'No chats found' : 'Click the chat icon above to start messaging'}
          </div>
        )}
      </nav>

      {isSearchOpen && (
        <SearchModal 
            onClose={() => setIsSearchOpen(false)} 
            onSelectRoom={(roomId) => {
                setIsSearchOpen(false);
                onSelectContact(roomId);
            }} 
        />
      )}
    </aside>
  )
}

export default Sidebar
