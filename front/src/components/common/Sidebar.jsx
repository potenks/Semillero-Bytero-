export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <nav className="p-4 space-y-2">
        <a className="block hover:text-primary" href="#">Dashboard</a>
        <a className="block hover:text-primary" href="#">Estudiantes</a>
        <a className="block hover:text-primary" href="#">Cursos</a>
      </nav>
    </aside>
  )
}
