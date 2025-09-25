import { GoogleClassroomService } from './google.classroom.service.js'
import { AuthService } from './auth.service.js'

const classroom = new GoogleClassroomService()

export const SyncService = {
  async syncUser(userId, _accessToken) {
    // Obtener cliente OAuth autorizado para el usuario
    const { client } = await AuthService.getAuthorizedOAuthClientForUser(userId)
    return classroom.syncUserCourses(userId, client)
  },
}
