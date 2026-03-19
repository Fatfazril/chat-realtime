import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';

export default function ProfileModal({ memberId, onClose, currentUserId, friendIds, onFriendAction }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`/api/users/${memberId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (e) {
        console.error('Fetch profile error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [memberId]);

  if (!memberId) return null;

  const isSelf = memberId === currentUserId;
  const isFriend = friendIds.includes(memberId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background-dark border border-primary/20 rounded-2xl w-full max-w-md shadow-2xl shadow-primary/10 overflow-hidden animate-in" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : profile ? (
          <>
            {/* Banner */}
            <div className="h-28 bg-gradient-to-br from-primary via-[#805cf3] to-[#c084fc] relative">
              <button onClick={onClose} className="absolute top-3 right-3 size-8 rounded-lg bg-black/30 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-sm transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Avatar */}
            <div className="px-6 -mt-10 relative z-10">
              <div className="size-20 rounded-2xl border-4 border-background-dark overflow-hidden bg-primary/20 shadow-lg">
                <img
                  src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="px-6 pt-4 pb-6 space-y-5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-black text-white tracking-tight">{profile.username}</h3>
                  <span className={`size-2.5 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                </div>
                {profile.email && <p className="text-sm text-slate-400">{profile.email}</p>}
                {profile.statusMessage && (
                  <p className="text-sm text-primary/70 mt-1 italic">"{profile.statusMessage}"</p>
                )}
              </div>

              {profile.bio && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-white">{profile.friends?.length || 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Friends</p>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-white">{profile.isOnline ? 'Online' : 'Offline'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-white">{profile.presence || 'online'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Presence</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">calendar_today</span>
                  <span className="text-slate-400">Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">{profile.isPublic ? 'visibility' : 'visibility_off'}</span>
                  <span className="text-slate-400">{profile.isPublic ? 'Public Profile' : 'Private Profile'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {!isSelf && (
                <div className="flex gap-3 pt-2">
                  {isFriend ? (
                    <button disabled className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 text-green-400 text-sm font-bold border border-green-500/20">
                      <span className="material-symbols-outlined text-[18px]">person_check</span>
                      Already Friends
                    </button>
                  ) : (
                    <button
                      onClick={() => onFriendAction(memberId)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:brightness-110 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      Add Friend
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/20 transition-all">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    Message
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-slate-400">User not found</div>
        )}
      </div>
    </div>
  );
}
