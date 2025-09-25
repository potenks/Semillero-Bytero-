import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext({ messages: [] })

export function NotificationProvider({ children }) {
  const [messages, setMessages] = useState([])
  const push = (m) => setMessages((prev) => [...prev, m])
  return <NotificationContext.Provider value={{ messages, push }}>{children}</NotificationContext.Provider>
}

export const useNotificationContext = () => useContext(NotificationContext)
