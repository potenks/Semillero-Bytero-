import { apiFetch } from './api'

export const CalendarService = {
  async attendancePreview({ from, to } = {}) {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const qs = params.toString()
    const path = `/api/calendar/attendance/preview${qs ? `?${qs}` : ''}`
    return apiFetch(path)
  },
  async attendanceMock() {
    return apiFetch('/api/calendar/attendance/mock')
  },
}
