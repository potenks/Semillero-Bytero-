import { useNotificationContext } from '../context/NotificationContext'

export default function NotificationsPanel() {
  const { messages } = useNotificationContext()
  return (
    <div className="border rounded-md p-3 bg-white shadow-sm">
      <div className="font-semibold mb-2">Notificaciones</div>
      {messages.length === 0 ? (
        <div className="text-sm text-gray-500">Sin notificaciones</div>
      ) : (
        <ul className="space-y-2">
          {messages.slice(-10).map((m, idx) => (
            <li key={idx} className="text-sm">
              <span className="text-gray-700 font-medium">{m.event}</span>
              <span className="text-gray-400"> · </span>
              <span className="text-gray-600">
                {typeof m.payload === 'object' ? JSON.stringify(m.payload) : String(m.payload)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
