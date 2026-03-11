import React, { useState } from 'react'
import { fetchWithAuth } from '../utils/api'

function CreateRoomForm({ onRoomCreated }) {
  const [roomName, setRoomName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!roomName.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchWithAuth('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: roomName, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.errors?.[0] || 'Failed to create room')
      }

      setRoomName('')
      setDescription('')
      if (onRoomCreated) onRoomCreated(data.room)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 sticky top-24">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Create New Room</h2>
        <p className="text-sm text-slate-400">Launch a private or public community</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Room Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Room Name</label>
          <input
            className="w-full bg-background-dark/50 border border-primary/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-600 transition-all outline-none"
            placeholder="e.g. Coffee & Code"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Description</label>
          <textarea
            className="w-full bg-background-dark/50 border border-primary/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-600 transition-all outline-none"
            placeholder="What is this room about?"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Privacy Setting */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Privacy Setting</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPrivacy('public')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${
                privacy === 'public'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-primary/5 bg-background-dark/50 text-slate-500 hover:border-primary/20'
              }`}
            >
              <span className="material-symbols-outlined mb-1">public</span>
              <span className="text-xs font-bold">Public</span>
            </button>
            <button
              type="button"
              onClick={() => setPrivacy('private')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${
                privacy === 'private'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-primary/5 bg-background-dark/50 text-slate-500 hover:border-primary/20'
              }`}
            >
              <span className="material-symbols-outlined mb-1">lock</span>
              <span className="text-xs font-bold">Private</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !roomName.trim()}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all mt-6"
        >
          <span className="material-symbols-outlined">{isLoading ? 'hourglass_empty' : 'add_circle'}</span>
          {isLoading ? 'Creating...' : 'Create Room'}
        </button>
      </form>

      {/* Info */}
      <div className="mt-8 pt-8 border-t border-primary/10">
        <div className="bg-gradient-to-br from-primary/20 to-transparent p-4 rounded-xl border border-primary/10">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Public rooms can be searched by anyone. Private rooms require an invite link to join.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRoomForm
