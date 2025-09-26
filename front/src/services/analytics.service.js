import { apiFetch } from './api'

export const AnalyticsService = {
  async dashboard() {
    return apiFetch('/api/analytics/dashboard')
  },
}
