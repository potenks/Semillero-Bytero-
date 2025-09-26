import { apiFetch } from './api'

export const AuthService = {
  async me() {
    const res = await apiFetch('/api/auth/me')
    return res.user
  },
  async logout() {
    return apiFetch('/api/auth/logout', { method: 'POST' })
  },
}
