import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import RoomsPage from './pages/RoomsPage'
import MessagesPage from './pages/MessagesPage'
import NexusChatPage from './pages/NexusChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here's an overview of your activity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary">groups</span>
            <span className="text-sm font-semibold text-slate-400">Rooms Joined</span>
          </div>
          <p className="text-3xl font-black">12</p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary">chat</span>
            <span className="text-sm font-semibold text-slate-400">Messages Sent</span>
          </div>
          <p className="text-3xl font-black">384</p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary">people</span>
            <span className="text-sm font-semibold text-slate-400">Contacts</span>
          </div>
          <p className="text-3xl font-black">47</p>
        </div>
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Profile</h1>
        <p className="text-slate-500">Manage your account settings and preferences.</p>
      </div>
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">person</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">Alex Rivers</h3>
            <p className="text-sm text-slate-400">alex.rivers@email.com</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Username</label>
            <input className="w-full bg-background-dark/50 border border-primary/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary" defaultValue="Alex Rivers" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Email</label>
            <input className="w-full bg-background-dark/50 border border-primary/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary" defaultValue="alex.rivers@email.com" />
          </div>
          <button className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Messages page uses its own chat layout (sidebar + chat area) */}
        <Route path="/messages" element={<MessagesPage />} />
        
        {/* New Nexus Workspace layout */}
        <Route path="/nexus" element={<NexusChatPage />} />

        {/* All other pages use the AppLayout with sidebar nav */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Default redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
