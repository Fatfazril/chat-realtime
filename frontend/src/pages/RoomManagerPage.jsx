import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RoomManagerPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Create Room');
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [inviteToken, setInviteToken] = useState('');

  return (
    <div className="min-h-screen bg-[#13111C] text-white font-display flex items-center justify-center p-4">
      <div className="w-full max-w-[900px] flex flex-col gap-8">
        
        {/* Header & Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#2A273F] pb-4">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-[#6344F5] flex items-center justify-center shadow-lg shadow-[#6344F5]/20">
                <span className="material-symbols-outlined text-white text-[20px]">door_open</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Room Manager</h1>
            </div>
            <button onClick={() => navigate(-1)} className="size-9 rounded-lg bg-[#1A1829] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-[#2A273F] transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex items-center gap-8 border-b border-[#2A273F]">
            {['Create Room', 'Join via Link'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-colors relative ${
                  activeTab === tab ? 'text-white' : 'text-[#645F7C] hover:text-[#9CA3AF]'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6344F5] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Create Room Panel */}
          <div className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Create a new room</h2>
            <p className="text-[#9CA3AF] text-sm mb-8">Set up a space for your community to interact.</p>

            <div className="space-y-5 flex-1">
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Room Name</label>
                <input
                  type="text"
                  placeholder="e.g. Design Team Sync"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  className="w-full bg-[#13111C] border border-[#2A273F] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#6344F5] outline-none text-white placeholder:text-[#645F7C] shadow-inner font-medium"
                />
              </div>

              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Description</label>
                <textarea
                  placeholder="What is this room for?"
                  rows="4"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#13111C] border border-[#2A273F] rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#6344F5] outline-none text-white placeholder:text-[#645F7C] shadow-inner font-medium resize-none"
                />
              </div>

              <div className="flex items-start gap-4 py-2">
                <div 
                  className={`size-5 rounded border flex items-center justify-center shrink-0 cursor-pointer mt-0.5 transition-colors ${isPublic ? 'bg-[#6344F5] border-[#6344F5]' : 'border-[#2A273F] bg-[#13111C]'}`}
                  onClick={() => setIsPublic(!isPublic)}
                >
                  {isPublic && <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>}
                </div>
                <div className="cursor-pointer" onClick={() => setIsPublic(!isPublic)}>
                  <p className="text-sm font-semibold text-white mb-0.5">Make this room public</p>
                  <p className="text-xs text-[#645F7C]">Anyone with the link can view messages.</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#6344F5] hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#6344F5]/20 active:scale-[0.98]">
              Create Room
            </button>
          </div>

          {/* Join Room Panel */}
          <div className="bg-[#1A1829] border border-[#2A273F] rounded-2xl p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Join a room</h2>
            <p className="text-[#9CA3AF] text-sm mb-8">Enter an invite token or paste a link to join an existing space.</p>

            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Invite Token or URL</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#645F7C] text-[20px]">link</span>
                  <input
                    type="text"
                    placeholder="e.g. room-xyz-123"
                    value={inviteToken}
                    onChange={e => setInviteToken(e.target.value)}
                    className="w-full bg-[#13111C] border border-[#2A273F] rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-[#6344F5] outline-none text-white placeholder:text-[#645F7C] shadow-inner font-medium"
                  />
                </div>
              </div>

              <div className="bg-[#6344F5]/10 border border-[#6344F5]/20 rounded-xl p-4 flex gap-3">
                <span className="material-symbols-outlined text-[#6344F5] text-[20px] shrink-0">info</span>
                <p className="text-xs leading-relaxed text-[#9CA3AF]">
                  Joining via a token will automatically add you to the room's participant list. Some rooms may require approval from an administrator.
                </p>
              </div>
            </div>

            <div className="mt-auto space-y-4">
               <button className="w-full bg-[#6344F5] hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-[#6344F5]/20 active:scale-[0.98]">
                Join Room
              </button>
              <p className="text-center text-xs text-[#645F7C] font-semibold">
                Don't have a code? <Link to="/discover" className="text-[#6344F5] hover:underline">Browse public rooms</Link>
              </p>
            </div>
          </div>

        </div>

        {/* Recent Rooms */}
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4">Your Recent Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <Link to="/messages" className="bg-[#1A1829] border border-[#2A273F] rounded-xl p-4 flex items-center gap-4 hover:border-[#3B3654] transition-colors group">
              <div className="size-10 rounded-lg bg-[#6344F5]/10 flex items-center justify-center shrink-0 group-hover:bg-[#6344F5]/20 transition-colors">
                <span className="material-symbols-outlined text-[#6344F5] text-[20px]">groups</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-0.5 group-hover:text-[#6344F5] transition-colors">Engineering HQ</h4>
                <p className="text-xs text-[#645F7C]">12 members active</p>
              </div>
            </Link>

            <Link to="/messages" className="bg-[#1A1829] border border-[#2A273F] rounded-xl p-4 flex items-center gap-4 hover:border-[#3B3654] transition-colors group">
              <div className="size-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center shrink-0 group-hover:bg-[#10B981]/20 transition-colors">
                <span className="material-symbols-outlined text-[#10B981] text-[20px]">palette</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-0.5 group-hover:text-[#10B981] transition-colors">Design Critique</h4>
                <p className="text-xs text-[#645F7C]">4 members active</p>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
