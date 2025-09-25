import { GoogleClassroomService } from './google.classroom.service.js'

const classroom = new GoogleClassroomService()

export const SyncService = {
  async syncUser(userId, accessToken) {
    return classroom.syncUserCourses(userId, accessToken)
  },
}
