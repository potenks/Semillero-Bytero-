import { useDemoContext } from '../../context/DemoContext'

export default function Courses() {
  const { demoMode } = useDemoContext()
  const mockCourses = (() => {
    const names = ['Matemática', 'Lengua', 'Historia', 'Geografía', 'Biología', 'Física', 'Química', 'Programación', 'Arte', 'Música', 'Inglés', 'Literatura']
    const sections = ['A', 'B', 'C']
    const arr = []
    for (let i = 0; i < names.length; i++) {
      const id = `c-${i + 1}`
      const name = `${names[i]} ${((i % 3) + 1)}`
      const section = sections[i % sections.length]
      const syncStatus = i % 7 === 0 ? 'syncing' : 'ok'
      const lastSync = syncStatus === 'ok' ? new Date(Date.now() - i * 3600_000).toISOString() : null
      arr.push({ id, name, section, syncStatus, lastSync })
    }
    return arr
  })()
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-2">Cursos</div>
      {!demoMode ? (
        <div className="text-gray-500">Sin cursos</div>
      ) : (
        <div className="max-h-[480px] overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-gray-500">
                <th className="py-2 px-2">Nombre</th>
                <th className="py-2 px-2">Sección</th>
                <th className="py-2 px-2">Estado</th>
                <th className="py-2 px-2">Última sync</th>
              </tr>
            </thead>
            <tbody>
              {mockCourses.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2 px-2">{c.name}</td>
                  <td className="py-2 px-2">{c.section}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${c.syncStatus === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{c.syncStatus}</span>
                  </td>
                  <td className="py-2 px-2 text-gray-600">{c.lastSync ? new Date(c.lastSync).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
