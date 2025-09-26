import { useEffect, useState } from 'react'
import { AuthService } from '../services/auth.service'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    AuthService.me().then(u => mounted && setUser(u)).catch(() => {}).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  async function logout() {
    try {
      await AuthService.logout()
    } catch (_) {}
    setUser(null)
  }

  return { user, loading, logout }
}
