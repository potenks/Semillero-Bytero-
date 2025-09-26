import { useNotificationContext } from '../../context/NotificationContext'

export default function Notifications() {
  const { messages } = useNotificationContext()
  if (!messages?.length) return null
  return (
    <div className="fixed right-4 top-20 space-y-2 z-50">
      {messages.slice(-5).map((m, idx) => (
        <div key={idx} className="bg-white shadow rounded px-3 py-2 border">
          <div className="text-xs text-gray-400">{new Date(m.ts || Date.now()).toLocaleTimeString()}</div>
          <div className="text-sm"><span className="font-medium">{m.event}</span></div>
          {m.payload?.title && <div className="text-sm text-gray-600">{m.payload.title}</div>}
        </div>
      ))}
    </div>
  )
}
