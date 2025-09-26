import { apiFetch } from './api'

export const SyncService = {
  async classroomSync({ force = false } = {}) {
    return apiFetch('/api/sync/classroom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force }),
    })
  },
}
