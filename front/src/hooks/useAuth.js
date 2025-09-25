import { useEffect, useState } from 'react'
import { AuthService } from '../services/auth.service'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    AuthService.me().then(u => mounted && setUser(u?.user ?? null)).catch(() => {}).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  async function refresh() {
    setLoading(true)
    try {
      const u = await AuthService.me()
      setUser(u?.user ?? null)
    } catch (e) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await AuthService.logout()
    } catch (e) {
      // ignore
    } finally {
      setUser(null)
    }
  }

  return { user, loading, refresh, logout }
}
