import { createContext, useContext, useState } from 'react'
import { useMemo } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'

const NotificationContext = createContext({ messages: [] })

export function NotificationProvider({ children }) {
  const [messages, setMessages] = useState([])
  const push = (m) => setMessages((prev) => [...prev, m])

  const wsUrl = useMemo(() => {
    const api = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    return api.replace(/^http/i, 'ws') + '/ws/notifications'
  }, [])

  useWebSocket(wsUrl, (msg) => {
    // msg: { event, payload, ts }
    push(msg)
  })

  return <NotificationContext.Provider value={{ messages, push }}>{children}</NotificationContext.Provider>
}

export const useNotificationContext = () => useContext(NotificationContext)
