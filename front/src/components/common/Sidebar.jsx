import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <nav className="p-4 space-y-2">
        <NavLink className={({isActive}) => `block hover:text-primary ${isActive ? 'text-primary font-medium' : ''}`} to="/">Dashboard</NavLink>
        <NavLink className={({isActive}) => `block hover:text-primary ${isActive ? 'text-primary font-medium' : ''}`} to="/students">Estudiantes</NavLink>
        <NavLink className={({isActive}) => `block hover:text-primary ${isActive ? 'text-primary font-medium' : ''}`} to="/courses">Cursos</NavLink>
        <NavLink className={({isActive}) => `block hover:text-primary ${isActive ? 'text-primary font-medium' : ''}`} to="/assignments">Asignaciones</NavLink>
      </nav>
    </aside>
  )
}
