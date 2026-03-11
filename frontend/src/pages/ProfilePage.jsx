import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [presence, setPresence] = useState('online');
  const [avatar, setAvatar] = useState('');
  
  const [rooms, setRooms] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      // Fetch user profile
      fetchWithAuth(`/api/users/${user.id || user._id}`)
        .then(res => res.json())
        .then(data => {
          if(data.user) {
            setUsername(data.user.username || '');
            setEmail(data.user.email || '');
            setStatusMessage(data.user.statusMessage || '');
            setPresence(data.user.presence || 'online');
            setAvatar(data.user.avatar || '');
          }
        })
        .catch(console.error);

      // Fetch user rooms
      fetchWithAuth('/api/rooms/me')
        .then(res => res.json())
        .then(data => {
            setRooms(data.rooms || []);
        })
        .catch(console.error);
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await fetchWithAuth(`/api/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, statusMessage, presence, avatar })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMsg({ text: data.error || 'Failed to update profile', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Network error', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const handleChangeAvatar = () => {
      const newUrl = prompt('Enter new avatar image URL (e.g. from Unsplash or DiceBear):');
      if (newUrl) setAvatar(newUrl);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        {/* Navigation Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-6 py-4 lg:px-40 bg-background-light dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-primary hover:scale-110 transition-transform cursor-pointer">
              <span className="material-symbols-outlined text-3xl">arrow_back</span>
            </Link>
            <h2 className="text-xl font-bold tracking-tight">Settings</h2>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-10 px-6 lg:px-40">
          <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 gap-8">
            {msg.text && (
                <div className={`p-4 rounded-xl border ${msg.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {msg.text}
                </div>
            )}
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Sidebar: Profile Summary & Nav */}
              <aside className="flex flex-col w-full lg:w-64 gap-6 shrink-0">
                <div className="flex flex-col items-center p-6 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="relative group cursor-pointer" onClick={handleChangeAvatar}>
                    <div 
                        className="size-32 rounded-full overflow-hidden border-4 border-primary bg-slate-800 bg-cover bg-center" 
                        style={{ backgroundImage: `url('${avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}')` }}
                    >
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white">photo_camera</span>
                    </div>
                    <div className={`absolute bottom-1 right-1 size-6 rounded-full border-2 border-background-dark ${presence === 'online' ? 'bg-green-500' : presence === 'busy' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-bold">{username}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{email || 'No email set'}</p>
                  </div>
                  <button onClick={handleChangeAvatar} className="mt-4 w-full py-2 px-4 rounded-lg bg-primary/20 text-primary font-semibold text-sm hover:bg-primary/30 transition-colors">
                    Change Avatar
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  <span className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium cursor-default">
                    <span className="material-symbols-outlined">person</span> Profile Details
                  </span>
                  <button className="flex justify-start items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">security</span> Privacy & Security
                  </button>
                  <button className="flex justify-start items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">devices</span> Devices
                  </button>
                  <div className="h-px bg-primary/10 my-2"></div>
                  <button onClick={handleLogout} className="flex justify-start items-center gap-3 px-4 py-3 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all font-medium">
                    <span className="material-symbols-outlined">logout</span> Logout
                  </button>
                </nav>
              </aside>

              {/* Main Content: Form Fields */}
              <div className="flex-1 flex flex-col gap-8 min-w-0">
                <section className="flex flex-col gap-6 p-6 sm:p-8 rounded-xl bg-primary/5 border border-primary/10">
                  <h2 className="text-xl font-bold border-b border-primary/10 pb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</label>
                      <input 
                        className="bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-primary/30 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                        type="text" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                      <input 
                        className="bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-primary/30 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Message</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-primary/30 rounded-lg p-3 pr-12 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                        type="text" 
                        value={statusMessage}
                        onChange={e => setStatusMessage(e.target.value)}
                        placeholder="What's on your mind?"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/60 pointer-events-none">edit</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Presence Status</label>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => setPresence('online')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium transition-all ${presence === 'online' ? 'bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-500' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-green-500/40'}`}
                      >
                        <span className="size-2.5 rounded-full bg-green-500"></span> Online
                      </button>
                      <button 
                        onClick={() => setPresence('busy')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium transition-all ${presence === 'busy' ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-500' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-amber-500/40'}`}
                      >
                        <span className="size-2.5 rounded-full bg-amber-500"></span> Busy
                      </button>
                      <button 
                        onClick={() => setPresence('offline')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium transition-all ${presence === 'offline' ? 'bg-slate-500/10 border-slate-500/40 text-slate-700 dark:text-slate-400' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-500/40'}`}
                      >
                        <span className="size-2.5 rounded-full bg-slate-500"></span> Offline
                      </button>
                    </div>
                  </div>
                </section>

                {/* Joined Rooms Section */}
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Active Conversations</h2>
                    <Link to="/rooms" className="text-primary text-sm font-bold hover:underline">View All</Link>
                  </div>
                  
                  {rooms.length === 0 ? (
                      <div className="p-8 text-center bg-primary/5 border border-primary/10 rounded-xl text-slate-500">
                          You haven't joined any rooms yet.
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {rooms.slice(0, 4).map(room => (
                            <Link key={room._id} to={`/nexus?roomId=${room._id}`} className="group flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer">
                              <div className="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                                {room.isDirect ? (
                                     <span className="material-symbols-outlined">person</span>
                                ) : (
                                     <span className="material-symbols-outlined">{room.icon || 'hub'}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold truncate">{room.name || 'Direct Message'}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{room.memberCount || room.members?.length || 0} members</p>
                              </div>
                              <span className="material-symbols-outlined text-slate-600 group-hover:text-primary shrink-0">chevron_right</span>
                            </Link>
                        ))}
                      </div>
                  )}
                </section>

                {/* Danger Zone */}
                <section className="mt-4 p-6 rounded-xl border border-rose-500/20 bg-rose-500/5">
                  <h3 className="text-rose-500 font-bold mb-2">Danger Zone</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <button className="px-4 py-2 rounded-lg border border-rose-500/40 text-rose-500 text-sm font-bold hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                    Delete Account
                  </button>
                </section>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto px-6 py-8 border-t border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-background-dark/30">
          <div className="max-w-[1024px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 opacity-60">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <span className="text-sm">© 2024 ChatApp Protocol. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm opacity-60">
              <span className="hover:text-primary transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Status</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
