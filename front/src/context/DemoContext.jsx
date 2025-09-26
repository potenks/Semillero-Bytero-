import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const DemoContext = createContext({ demoMode: false, setDemoMode: () => {} })

export function DemoProvider({ children }) {
  const [demoMode, setDemoMode] = useState(false)

  // Persist in localStorage to keep state across refresh during demo
  useEffect(() => {
    const saved = localStorage.getItem('demoMode')
    if (saved === 'true') setDemoMode(true)
  }, [])
  useEffect(() => {
    localStorage.setItem('demoMode', demoMode ? 'true' : 'false')
  }, [demoMode])

  const value = useMemo(() => ({ demoMode, setDemoMode }), [demoMode])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export const useDemoContext = () => useContext(DemoContext)
