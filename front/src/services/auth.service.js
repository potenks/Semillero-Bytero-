import { apiFetch } from './api'

export const AuthService = {
  async me() {
    return apiFetch('/api/auth/me')
  },
}
