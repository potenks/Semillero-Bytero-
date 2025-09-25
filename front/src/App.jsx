export default function App() {
  return (
    <div className="min-h-screen text-gray-800">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-heading text-primary">Semillero Digital</h1>
          <nav className="space-x-4">
            <a className="hover:text-primary" href="#">Dashboard</a>
            <a className="hover:text-primary" href="#">Estudiantes</a>
            <a className="hover:text-primary" href="#">Cursos</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-heading mb-2">Bienvenido</h2>
          <p>Plataforma de seguimiento para Semillero Digital. Configuración base lista.</p>
        </div>
      </main>
    </div>
  )
}
