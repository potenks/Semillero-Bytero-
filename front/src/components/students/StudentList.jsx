import { useDemoContext } from '../../context/DemoContext'

export default function StudentList() {
  const { demoMode } = useDemoContext()
  const mockStudents = (() => {
    const total = 140
    const arr = []
    for (let i = 1; i <= total; i++) {
      const id = `stu-${String(i).padStart(3, '0')}`
      const name = `Alumno ${String(i).padStart(3, '0')}`
      const email = `alumno${i}@example.com`
      const status = i % 7 === 0 ? 'Pendiente' : 'Activa'
      arr.push({ id, name, email, status })
    }
    return arr
  })()
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-2">Estudiantes</div>
      {!demoMode ? (
        <div>Lista vacía</div>
      ) : (
        <div className="max-h-[480px] overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-gray-500">
                <th className="py-2 px-2">Nombre</th>
                <th className="py-2 px-2">Email</th>
                <th className="py-2 px-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-2 px-2">{s.name}</td>
                  <td className="py-2 px-2 text-gray-600">{s.email}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        s.status === 'Activa' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {s.status}
                    </span>
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
