import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../utils/api';

/* ─── User Profile Modal ──────────────────────────────────── */
function ProfileModal({ memberId, onClose, currentUserId, friendIds, onFriendAction }) {
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

/* ─── Main Page ──────────────────────────────────────────── */
export default function RoomManagementPage() {
  const { id: roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All Members');
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [friendIds, setFriendIds] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const currentUserId = user?._id || user?.id;

  // Show toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch room data and members
  const fetchRoomData = useCallback(async () => {
    if (!roomId) return;
    try {
      const [roomRes, membersRes] = await Promise.all([
        fetchWithAuth(`/api/rooms/${roomId}`),
        fetchWithAuth(`/api/rooms/${roomId}/members`),
      ]);

      if (roomRes.ok) {
        const roomData = await roomRes.json();
        setRoom(roomData.room);
      }
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.members || []);
      }
    } catch (err) {
      console.error('Failed to fetch room data:', err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Fetch friends
  const fetchFriends = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/users/friends');
      if (res.ok) {
        const data = await res.json();
        setFriendIds((data.friends || []).map(f => f._id || f));
        setPendingRequests(data.friendRequests || []);
      }
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    }
  }, []);

  useEffect(() => {
    fetchRoomData();
    fetchFriends();
  }, [fetchRoomData, fetchFriends]);

  // Check if current user is admin/owner
  const isOwner = room?.owner?._id === currentUserId;
  const isAdmin = room?.admins?.some(a => (typeof a === 'string' ? a : a?._id) === currentUserId);
  const canManage = isOwner || isAdmin;

  // Send friend request
  const handleAddFriend = async (targetUserId) => {
    setActionLoading(targetUserId);
    try {
      const res = await fetchWithAuth('/api/users/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Friend request sent!');
        setPendingRequests(prev => [...prev, { user: targetUserId, status: 'pending' }]);
      } else {
        showToast(data.error || 'Failed to send request');
      }
    } catch (err) {
      showToast('Failed to send friend request');
    } finally {
      setActionLoading(null);
    }
  };

  // Check if friend request already sent to target
  const hasSentRequest = (targetId) => {
    return pendingRequests.some(r => {
      const rUserId = typeof r.user === 'string' ? r.user : r.user?._id;
      return rUserId === targetId && r.status === 'pending';
    });
  };

  // Promote to admin
  const handlePromote = async (targetUserId) => {
    setActionLoading(targetUserId);
    try {
      const res = await fetchWithAuth(`/api/rooms/${roomId}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      if (res.ok) { showToast('User promoted to Admin'); await fetchRoomData(); }
    } catch (err) { console.error('Promote failed:', err); }
    finally { setActionLoading(null); }
  };

  // Demote from admin
  const handleDemote = async (targetUserId) => {
    setActionLoading(targetUserId);
    try {
      const res = await fetchWithAuth(`/api/rooms/${roomId}/admins/${targetUserId}`, { method: 'DELETE' });
      if (res.ok) { showToast('User demoted to Member'); await fetchRoomData(); }
    } catch (err) { console.error('Demote failed:', err); }
    finally { setActionLoading(null); }
  };

  // Remove member
  const handleRemove = async (targetUserId) => {
    setActionLoading(targetUserId);
    try {
      const res = await fetchWithAuth(`/api/rooms/${roomId}/members/${targetUserId}`, { method: 'DELETE' });
      if (res.ok) { showToast('Member removed'); await fetchRoomData(); }
    } catch (err) { console.error('Remove failed:', err); }
    finally { setActionLoading(null); }
  };

  // Generate invite link
  const handleGenerateInvite = async () => {
    try {
      const res = await fetchWithAuth(`/api/rooms/${roomId}/invite-token`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setInviteLink(data.inviteToken);
        showToast('Invite link generated!');
      }
    } catch (err) { console.error('Generate invite failed:', err); }
  };

  // Leave room
  const handleLeaveRoom = async () => {
    try {
      const res = await fetchWithAuth(`/api/rooms/${roomId}/leave`, { method: 'POST' });
      if (res.ok) navigate('/rooms');
    } catch (err) { console.error('Leave room failed:', err); }
  };

  // Compute stats
  const totalMembers = members.length;
  const onlineNow = members.filter(m => m.isOnline).length;
  const adminCount = room?.admins?.length || 0;

  // Role helpers
  const isMemberAdmin = (memberId) => room?.admins?.some(a => (typeof a === 'string' ? a : a?._id) === memberId);
  const isMemberOwner = (memberId) => (room?.owner?._id || room?.owner) === memberId;

  let filteredMembers = members;
  if (activeTab === 'Online') filteredMembers = members.filter(m => m.isOnline);
  if (searchQuery.trim()) {
    filteredMembers = filteredMembers.filter(m =>
      m.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-dark text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] bg-primary text-white px-5 py-3 rounded-xl shadow-2xl shadow-primary/30 text-sm font-bold flex items-center gap-2 animate-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        memberId={selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
        currentUserId={currentUserId}
        friendIds={friendIds}
        onFriendAction={(id) => { handleAddFriend(id); setSelectedMemberId(null); }}
      />

      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-primary/20 bg-background-light dark:bg-background-dark px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined">meeting_room</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold leading-tight tracking-tight">Room Management</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{room?.name || 'Workspace'}</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#" className="text-sm font-medium hover:text-primary transition-colors text-slate-500 dark:text-slate-400">Overview</Link>
            <Link to="#" className="text-sm font-semibold text-primary border-b-2 border-primary pb-1">Members</Link>
            <Link to="#" className="text-sm font-medium hover:text-primary transition-colors text-slate-500 dark:text-slate-400">Settings</Link>
            <Link to="#" className="text-sm font-medium hover:text-primary transition-colors text-slate-500 dark:text-slate-400">Analytics</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              className="w-64 rounded-lg border-none bg-slate-200 dark:bg-primary/10 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Search members..."
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 dark:bg-primary/10 hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary bg-slate-300">
            <img alt="Admin Avatar" className="h-full w-full object-cover" src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'admin'}`} />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-primary/10 bg-background-light dark:bg-background-dark/50 p-4 gap-2">
          <div className="mb-4 flex items-center gap-3 px-2 py-3 rounded-xl bg-primary/5">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">shield_person</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold">{canManage ? 'Admin Panel' : 'Member Panel'}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{isOwner ? 'Room Owner' : isAdmin ? 'Admin' : 'Member'}</p>
            </div>
          </div>
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link to="/room-manager" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
            <span className="material-symbols-outlined">door_open</span>
            <span className="text-sm font-medium">Rooms</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-medium">Members</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
            <span className="material-symbols-outlined">verified_user</span>
            <span className="text-sm font-medium">Roles</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-sm font-medium">Logs</span>
          </Link>
          <div className="mt-auto border-t border-primary/10 pt-4">
            <button onClick={handleLeaveRoom} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all w-full">
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm font-medium">Exit Room</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                <span className="h-px w-8 bg-primary"></span>
                Management
              </div>
              <h1 className="text-4xl font-black tracking-tight dark:text-white">Member Directory</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage access levels, view profiles, and connect with members in the room.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 px-6 h-11 rounded-lg bg-slate-200 dark:bg-primary/10 text-slate-900 dark:text-white text-sm font-bold hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined text-xl">ios_share</span>
                Export List
              </button>
              <button onClick={handleGenerateInvite} className="flex items-center justify-center gap-2 px-6 h-11 rounded-lg bg-primary text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                <span className="material-symbols-outlined text-xl">link</span>
                Generate Invite Link
              </button>
            </div>
          </div>

          {/* Invite Link Banner */}
          {inviteLink && (
            <div className="mb-6 flex items-center gap-3 bg-primary/10 border border-primary/20 text-white p-4 rounded-xl">
              <span className="material-symbols-outlined text-primary shrink-0">link</span>
              <p className="text-sm font-medium flex-1">
                Invite Token: <code className="bg-primary/20 px-2 py-0.5 rounded font-mono text-primary">{inviteLink}</code>
              </p>
              <button onClick={() => { navigator.clipboard.writeText(inviteLink); showToast('Copied to clipboard!'); }} className="text-xs bg-primary px-3 py-1.5 rounded-lg font-bold hover:brightness-110 transition-all">Copy</button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Members</span>
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined">groups</span></div>
              </div>
              <p className="text-3xl font-bold">{totalMembers.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-green-500 mt-2 font-medium">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>Active room</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Online Now</span>
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><span className="material-symbols-outlined">sensors</span></div>
              </div>
              <p className="text-3xl font-bold">{onlineNow}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-2 font-medium">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Active sessions</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Admins</span>
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><span className="material-symbols-outlined">security</span></div>
              </div>
              <p className="text-3xl font-bold">{adminCount}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-2 font-medium">
                <span>Restricted permissions</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-200 dark:border-primary/20 mb-6">
            <div className="flex gap-8">
              <button onClick={() => setActiveTab('All Members')} className={`flex items-center gap-2 border-b-2 pb-3 font-semibold text-sm transition-colors ${activeTab === 'All Members' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary'}`}>
                All Members <span className={`px-2 py-0.5 rounded text-xs ${activeTab === 'All Members' ? 'bg-primary/10' : 'bg-slate-200 dark:bg-primary/10'}`}>{totalMembers}</span>
              </button>
              <button onClick={() => setActiveTab('Online')} className={`flex items-center gap-2 border-b-2 pb-3 font-semibold text-sm transition-colors ${activeTab === 'Online' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary'}`}>
                Online <span className={`px-2 py-0.5 rounded text-xs ${activeTab === 'Online' ? 'bg-primary/10' : 'bg-slate-200 dark:bg-primary/10'}`}>{onlineNow}</span>
              </button>
              <button onClick={() => setActiveTab('Pending Invites')} className={`flex items-center gap-2 border-b-2 pb-3 font-semibold text-sm transition-colors ${activeTab === 'Pending Invites' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary'}`}>
                Pending Invites <span className="bg-slate-200 dark:bg-primary/10 px-2 py-0.5 rounded text-xs">0</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark/30 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-primary/5 border-b border-slate-200 dark:border-primary/10">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Member</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Joined Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                  {filteredMembers.map(member => {
                    const memberId = member._id;
                    const memberIsAdmin = isMemberAdmin(memberId);
                    const memberIsOwner = isMemberOwner(memberId);
                    const isSelf = memberId === currentUserId;
                    const isFriend = friendIds.includes(memberId);
                    const requestSent = hasSentRequest(memberId);

                    return (
                      <tr key={memberId} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group">
                        {/* Member Cell — clickable to open profile */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedMemberId(memberId)}>
                            <div className="relative size-10 flex-shrink-0">
                              <img alt={member.username} className="rounded-full h-full w-full object-cover bg-slate-200 dark:bg-primary/10" src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`} />
                              <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-background-dark ${member.isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold hover:text-primary transition-colors">
                                {member.username}
                                {isFriend && <span className="ml-2 text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-bold">Friend</span>}
                              </span>
                              <span className="text-xs text-slate-500">{member.email || `@${member.username}`}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {member.isOnline ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400">
                              <span className="size-1.5 rounded-full bg-green-500"></span>Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-500/10 dark:text-slate-400">
                              Offline
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {memberIsOwner ? (
                            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">OWNER</span>
                          ) : memberIsAdmin ? (
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">ADMIN</span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Member</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500 dark:text-slate-400">{formatDate(member.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* View Profile */}
                            <button
                              onClick={() => setSelectedMemberId(memberId)}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="View Profile"
                            >
                              <span className="material-symbols-outlined text-xl">person</span>
                            </button>

                            {/* Add Friend */}
                            {!isSelf && !isFriend && !requestSent && (
                              <button
                                onClick={() => handleAddFriend(memberId)}
                                disabled={actionLoading === memberId}
                                className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50"
                                title="Add Friend"
                              >
                                <span className="material-symbols-outlined text-xl">person_add</span>
                              </button>
                            )}
                            {!isSelf && requestSent && (
                              <button disabled className="p-2 text-yellow-500/60 rounded-lg" title="Request Pending">
                                <span className="material-symbols-outlined text-xl">schedule</span>
                              </button>
                            )}
                            {!isSelf && isFriend && (
                              <button disabled className="p-2 text-green-500/60 rounded-lg" title="Already Friends">
                                <span className="material-symbols-outlined text-xl">person_check</span>
                              </button>
                            )}

                            {/* Admin Actions */}
                            {canManage && !memberIsOwner && !isSelf && (
                              <>
                                {memberIsAdmin ? (
                                  isOwner && (
                                    <button onClick={() => handleDemote(memberId)} disabled={actionLoading === memberId} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50" title="Demote to Member">
                                      <span className="material-symbols-outlined text-xl">vertical_align_bottom</span>
                                    </button>
                                  )
                                ) : (
                                  <button onClick={() => handlePromote(memberId)} disabled={actionLoading === memberId} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50" title="Promote to Admin">
                                    <span className="material-symbols-outlined text-xl">verified_user</span>
                                  </button>
                                )}
                                <button onClick={() => handleRemove(memberId)} disabled={actionLoading === memberId} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" title="Remove Member">
                                  <span className="material-symbols-outlined text-xl">person_remove</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-primary/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-bold dark:text-white">1</span> to <span className="font-bold dark:text-white">{filteredMembers.length}</span> of <span className="font-bold dark:text-white">{totalMembers}</span> members
              </p>
              <div className="flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 dark:border-primary/20 hover:bg-primary/10 transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded bg-primary text-white font-bold text-sm">1</button>
                <button className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 dark:border-primary/20 hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Promotion Banner */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary to-[#805cf3] p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
            <div className="relative z-10 max-w-xl">
              <h3 className="text-2xl font-bold mb-2">Need to invite your entire team?</h3>
              <p className="text-white/80 mb-6">Create a shared workspace link that never expires. You can set a default role for new members joining through this link.</p>
              <button onClick={handleGenerateInvite} className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined">add_link</span>
                Create Permanent Link
              </button>
            </div>
            <div className="absolute -right-20 -top-20 size-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 hidden md:block pointer-events-none">
              <span className="material-symbols-outlined text-[160px]">diversity_3</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
