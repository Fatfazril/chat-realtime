import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      // Fetch full profile info to get email if it's not in user
      fetch(`/api/users/${user.id || user._id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
        if(data.user) {
          setUsername(data.user.username || '');
          setEmail(data.user.email || '');
          setAvatar(data.user.avatar || '');
        }
      })
      .catch(console.error);
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username, email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage(data.error || 'Failed to update profile');
      }
    } catch {
      setMessage('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Profile</h1>
        <p className="text-slate-500">Manage your account settings and preferences.</p>
      </div>
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 max-w-lg">
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary font-bold text-sm">
            {message}
          </div>
        )}
        <div className="flex items-center gap-4 mb-6">
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
            {avatar ? (
               <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
               <span className="material-symbols-outlined text-primary text-3xl">person</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold">{username || 'Loading...'}</h3>
            <p className="text-sm text-slate-400">{email || '...'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Username</label>
            <input 
              className="w-full bg-slate-100 dark:bg-background-dark/50 border border-slate-200 dark:border-primary/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Email</label>
            <input 
              className="w-full bg-slate-100 dark:bg-background-dark/50 border border-slate-200 dark:border-primary/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
