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
import DashboardPage from './pages/DashboardPage'
import DiscoverPage from './pages/DiscoverPage'
import FriendsPage from './pages/FriendsPage'
import SettingsPage from './pages/SettingsPage'

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
          
          {/* New UI Routes */}
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

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
