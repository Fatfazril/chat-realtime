import React, { useState } from 'react'
import { fetchWithAuth } from '../utils/api'

function CreateRoomForm({ onRoomCreated }) {
  const [roomName, setRoomName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!roomName.trim()) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetchWithAuth('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName, description }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.errors?.[0] || 'Failed to create room')
      }

      setRoomName('')
      setDescription('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      if (onRoomCreated) onRoomCreated(data.room)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#111b21] border border-[#202c33] rounded-2xl overflow-hidden sticky top-8">
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-[#202c33] bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3 mb-1">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white text-[18px]">add</span>
          </div>
          <h2 className="text-lg font-bold text-white">Create New Room</h2>
        </div>
        <p className="text-sm text-slate-500 ml-11">Launch a public or private community space</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20 text-sm">
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-3 bg-green-500/10 text-green-400 p-3 rounded-xl border border-green-500/20 text-sm">
            <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
            Room created successfully!
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Room Name */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Room Name</label>
            <input
              className="w-full bg-[#0b141a] border border-[#202c33] rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-600 transition-all outline-none text-white text-sm"
              placeholder="e.g. Coffee & Code"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
            <textarea
              className="w-full bg-[#0b141a] border border-[#202c33] rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-600 transition-all outline-none text-white text-sm resize-none"
              placeholder="What is this room about?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Privacy</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrivacy('public')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  privacy === 'public'
                    ? 'border-primary bg-primary/10 text-primary shadow-inner shadow-primary/10'
                    : 'border-[#202c33] bg-[#0b141a] text-slate-500 hover:border-primary/30 hover:text-slate-300'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">public</span>
                <span className="text-sm font-bold">Public</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('private')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  privacy === 'private'
                    ? 'border-primary bg-primary/10 text-primary shadow-inner shadow-primary/10'
                    : 'border-[#202c33] bg-[#0b141a] text-slate-500 hover:border-primary/30 hover:text-slate-300'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span className="text-sm font-bold">Private</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !roomName.trim()}
            className="w-full bg-primary hover:brightness-110 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">{isLoading ? 'hourglass_empty' : 'add_circle'}</span>
            {isLoading ? 'Creating...' : 'Create Room'}
          </button>
        </form>

        {/* Info pill */}
        <div className="flex items-start gap-3 bg-[#0b141a] border border-[#202c33] p-3 rounded-xl">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Public rooms are discoverable by all users. Private rooms require an invite link to join.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreateRoomForm
