import { useAuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useDemoContext } from '../../context/DemoContext'

export default function Header() {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()
  const { demoMode } = useDemoContext()
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-heading text-primary">Semillero Digital</h1>
        {user && (
          <div className="flex items-center gap-3">
            {demoMode && (
              <span className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-700">Modo Demo activo</span>
            )}
            <button
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              onClick={async () => { await logout(); navigate('/login', { replace: true }) }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
