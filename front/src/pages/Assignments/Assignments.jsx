import { useDemoContext } from '../../context/DemoContext'

export default function Assignments() {
  const { demoMode } = useDemoContext()
  const mockAssignments = (() => {
    const courses = ['Matemática 1', 'Lengua', 'Historia', 'Geografía', 'Biología', 'Física', 'Química', 'Programación', 'Arte', 'Música', 'Inglés', 'Literatura']
    const statuses = ['PUBLISHED', 'RETURNED', 'TURNED_IN', 'CREATED']
    const total = 100
    const arr = []
    for (let i = 1; i <= total; i++) {
      const id = `a-${String(i).padStart(3, '0')}`
      const title = `Asignación ${i}`
      const course = courses[i % courses.length]
      const offsetDays = (i % 20) - 10 // fechas distribuidas +/- 10 días
      const dueDate = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000).toISOString()
      const status = statuses[i % statuses.length]
      arr.push({ id, title, course, dueDate, status })
    }
    return arr
  })()
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-2">Asignaciones</div>
      {!demoMode ? (
        <div className="text-gray-500">Sin asignaciones</div>
      ) : (
        <div className="max-h-[480px] overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-gray-500">
                <th className="py-2 px-2">Título</th>
                <th className="py-2 px-2">Curso</th>
                <th className="py-2 px-2">Vencimiento</th>
                <th className="py-2 px-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockAssignments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="py-2 px-2">{a.title}</td>
                  <td className="py-2 px-2">{a.course}</td>
                  <td className="py-2 px-2 text-gray-600">{a.dueDate ? new Date(a.dueDate).toLocaleString() : '-'}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${a.status === 'PUBLISHED' ? 'bg-sky-100 text-sky-700' : a.status === 'RETURNED' ? 'bg-emerald-100 text-emerald-700' : a.status === 'TURNED_IN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
