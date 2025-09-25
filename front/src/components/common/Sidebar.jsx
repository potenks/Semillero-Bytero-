import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { ROLES } from '../../utils/constants'

export default function Sidebar({ open = false, onClose }) {
  const { user } = useAuthContext()
  const canManage = user && [ROLES.teacher, ROLES.coordinator].includes(user.role)
  const linkClass = ({ isActive }) => `block px-2 py-2 rounded ${isActive ? 'text-primary font-medium bg-primary/5' : 'hover:text-primary'}`

  const NavContent = (
    <nav className="p-4 space-y-1">
      <NavLink onClick={onClose} className={linkClass} to="/dashboard">Dashboard</NavLink>
      {canManage && (
        <>
          <NavLink onClick={onClose} className={linkClass} to="/students">Estudiantes</NavLink>
          <NavLink onClick={onClose} className={linkClass} to="/courses">Cursos</NavLink>
          <NavLink onClick={onClose} className={linkClass} to="/assignments">Asignaciones</NavLink>
        </>
      )}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-56 bg-white border-r hidden md:block rounded-lg h-fit">
        {NavContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30" onClick={onClose} />
          {/* Drawer */}
          <div className="relative ml-0 bg-white w-64 h-full shadow-lg z-50">
            <button
              aria-label="Cerrar menú"
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {NavContent}
          </div>
        </div>
      )}
    </>
  )
}
