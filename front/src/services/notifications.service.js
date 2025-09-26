import { apiFetch } from './api'

export const NotificationsService = {
  async mockAssignment(payload = { id: Date.now(), title: 'Nueva tarea demo', courseId: 'COURSE_DEMO' }) {
    return apiFetch('/api/notifications/mock/assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload }),
    })
  },
  async mockCourseUpdate(payload = { id: 'COURSE_DEMO', title: 'Curso demo actualizado' }) {
    return apiFetch('/api/notifications/mock/course-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload }),
    })
  },
  async mockBroadcast(event = 'app:info', payload = { message: 'Hola desde modo demo' }) {
    return apiFetch('/api/notifications/mock/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload }),
    })
  },
}
