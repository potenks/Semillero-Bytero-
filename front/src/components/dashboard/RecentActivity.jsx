export default function RecentActivity({ items = [], loading = false }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-2">Actividad reciente</div>
      {loading ? (
        <div className="text-gray-400 text-sm">Cargando...</div>
      ) : items.length ? (
        <ul className="space-y-2 text-sm text-gray-600">
          {items.map((it) => (
            <li key={it.id || it._id} className="flex items-center justify-between">
              <span>
                <span className="font-medium">{it.status || 'submission'}</span>
                {it.turnedInAt && (
                  <span className="text-gray-400"> · {new Date(it.turnedInAt).toLocaleString()}</span>
                )}
              </span>
              {it.grade != null && <span className="text-gray-500">{it.grade}</span>}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400 text-sm">Sin datos aún</div>
      )}
    </div>
  )
}
