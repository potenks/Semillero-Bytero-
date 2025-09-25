import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'
import LoadingSpinner from './components/common/LoadingSpinner'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Students from './pages/Students/Students'
import Courses from './pages/Courses/Courses'
import Assignments from './pages/Assignments/Assignments'
import { useAuthContext } from './context/AuthContext'
import { ROLES } from './utils/constants'

function ProtectedRoute() {
  const { user, loading } = useAuthContext()
  if (loading) return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <LoadingSpinner />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

function RequireRole({ allowed, redirect = '/dashboard' }) {
  const { user } = useAuthContext()
  if (!user) return <Navigate to="/login" replace />
  if (allowed?.length && !allowed.includes(user.role)) return <Navigate to={redirect} replace />
  return <Outlet />
}

import { useState } from 'react'

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const openMenu = () => setMobileOpen(true)
  const closeMenu = () => setMobileOpen(false)

  return (
    <div className="min-h-screen text-gray-800 bg-gray-50">
      <Header onMenuClick={openMenu} />
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4">
        <Sidebar open={mobileOpen} onClose={closeMenu} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<RequireRole allowed={[ROLES.teacher, ROLES.coordinator]} />}> 
            <Route path="/students" element={<Students />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/assignments" element={<Assignments />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
