import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Students from './pages/Students/Students'
import Courses from './pages/Courses/Courses'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'
import { useAuthContext } from './context/AuthContext'
import Assignments from './pages/Assignments/Assignments'
import Notifications from './components/common/Notifications'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext()
  if (loading) return <div className="p-6">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen text-gray-800">
      <Header />
      <Notifications />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-4 p-4">
        <Sidebar />
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
