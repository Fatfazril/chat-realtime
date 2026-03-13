import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';

function InvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    // When visiting the link, directly attempt to join
    const joinRoom = async () => {
      try {
        const res = await fetchWithAuth(`/api/rooms/join/${token}`, { method: 'POST' });
        const data = await res.json();
        
        if (res.ok) {
            setRoomData(data.room);
            setTimeout(() => navigate('/workspace'), 2000);
        } else {
            setError(data.error || 'Failed to join via invite link.');
        }
      } catch {
        setError('Network error checking invite link.');
      } finally {
        setLoading(false);
      }
    };

    joinRoom();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#111b21] p-8 rounded-2xl shadow-xl text-center border border-slate-200 dark:border-[#202c33]">
        <div className="mx-auto size-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">group_add</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Room Invitation</h2>
        
        {loading && (
            <p className="text-slate-500 dark:text-[#8696a0]">Verifying invite link...</p>
        )}

        {error && (
            <div className="text-red-500 bg-red-500/10 p-4 rounded-xl mt-4 text-sm font-medium">
                {error}
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                >
                  Return to Dashboard
                </button>
            </div>
        )}

        {roomData && (
            <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-[#8696a0]">You have successfully joined</p>
                <div className="font-bold text-lg mt-1 text-slate-900 dark:text-slate-100">{roomData.name}</div>
                <p className="text-xs text-primary mt-6">Redirecting to Workspace...</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default InvitePage;
