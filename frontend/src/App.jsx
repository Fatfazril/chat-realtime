import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import RoomsPage from './pages/RoomsPage'
import MessagesPage from './pages/MessagesPage'
import NexusChatPage from './pages/NexusChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import InvitePage from './pages/InvitePage'
import ProtectedRoute from './components/ProtectedRoute'

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
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Messages page uses its own chat layout (sidebar + chat area) */}
          <Route path="/messages" element={<MessagesPage />} />
          
          {/* New Nexus Workspace layout */}
          <Route path="/workspace" element={<NexusChatPage />} />

          {/* Invite Handler */}
          <Route path="/invite/:token" element={<InvitePage />} />

          {/* All other pages use the AppLayout with sidebar nav */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Default redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
