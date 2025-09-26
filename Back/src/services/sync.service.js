import { GoogleClassroomService } from './google.classroom.service.js'
import { AuthService } from './auth.service.js'
import { publish } from './notification.service.js'

const classroom = new GoogleClassroomService()

export const SyncService = {
  async syncUser(userId, _accessToken, { force = false } = {}) {
    publish('sync:status', { userId, status: 'started', force })
    try {
      // Obtener cliente OAuth autorizado para el usuario
      const { client } = await AuthService.getAuthorizedOAuthClientForUser(userId)
      const result = await classroom.syncUserCourses(userId, client)
      publish('sync:status', { userId, status: 'ok', result })
      return result
    } catch (e) {
      publish('sync:status', { userId, status: 'error', error: e?.message || String(e) })
      throw e
    }
  },
}
