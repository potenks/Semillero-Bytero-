import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={onMenuClick}
            className="md:hidden p-2 rounded border border-gray-200 hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </button>
          <Link to="/dashboard" className="text-2xl font-heading text-primary">Semillero Digital</Link>
          {user && (
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">
              {user.role}
            </span>
          )}
        </div>
        {user && (
          <button onClick={handleLogout} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded">
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  )
}
