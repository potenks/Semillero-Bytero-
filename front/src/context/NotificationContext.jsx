import { createContext, useContext, useState } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import { toast } from 'react-hot-toast'

const NotificationContext = createContext({ messages: [] })

export function NotificationProvider({ children }) {
  const [messages, setMessages] = useState([])
  const push = (m) => setMessages((prev) => [...prev, m])
  // Suscribirse a notificaciones del backend
  const token = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('token') : null
  const wsUrl = token
    ? `ws://localhost:3001/ws/notifications?token=${encodeURIComponent(token)}`
    : 'ws://localhost:3001/ws/notifications'
  useWebSocket(wsUrl, (data) => {
    // data: { event, payload, ts }
    push(data)
    // Mostrar toast básico por tipo de evento
    const title = data?.event || 'notificación'
    const content = typeof data?.payload === 'object' ? JSON.stringify(data.payload) : String(data?.payload ?? '')
    const msg = content ? `${title}: ${content}` : title
    if (title.startsWith('sync:status')) {
      const status = data?.payload?.status || ''
      if (status === 'error') toast.error(`Sync: error`)
      else if (status === 'completed') toast.success(`Sync: completado`)
      else toast(`Sync: ${status}`)
    } else if (title.includes('assignment')) {
      toast.success(msg)
    } else if (title.includes('update')) {
      toast(msg)
    } else {
      toast(msg)
    }
  })
  return <NotificationContext.Provider value={{ messages, push }}>{children}</NotificationContext.Provider>
}

export const useNotificationContext = () => useContext(NotificationContext)
