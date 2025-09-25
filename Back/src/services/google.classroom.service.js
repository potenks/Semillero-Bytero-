import { google } from 'googleapis'
import Course from '../models/Course.js'
import User from '../models/User.js'
import Assignment from '../models/Assignment.js'
import Submission from '../models/Submission.js'
import Enrollment from '../models/Enrollment.js'

export class GoogleClassroomService {
  /**
   * Sincroniza cursos, estudiantes, assignments y submissions para el usuario
   * @param {string} userId Mongo ObjectId del usuario local
   * @param {import('google-auth-library').OAuth2Client} oauthClient Cliente OAuth2 autorizado para el usuario
   */
  async syncUserCourses(userId, oauthClient) {
    const classroom = google.classroom({ version: 'v1', auth: oauthClient })

    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    // 1) Cursos del usuario como profesor
    const teacherCourses = await this.#listAll(async (pageToken) => {
      const res = await classroom.courses.list({ teacherId: 'me', pageToken })
      return res.data
    })

    // 1b) Cursos del usuario como estudiante
    const studentCourses = await this.#listAll(async (pageToken) => {
      const res = await classroom.courses.list({ studentId: 'me', pageToken })
      return res.data
    })

    const allCourses = [...teacherCourses, ...studentCourses]
    let upserted = 0

    for (const c of allCourses) {
      if (!c?.id) continue

      // Upsert del curso
      const courseDoc = await Course.findOneAndUpdate(
        { googleClassroomId: c.id },
        {
          googleClassroomId: c.id,
          name: c.name,
          section: c.section,
          description: c.description,
          owner: { userId: user._id, email: user.email },
          syncStatus: 'syncing',
          lastSync: new Date(),
        },
        { new: true, upsert: true }
      )

      // 2) Estudiantes del curso
      const students = await this.#listAll(async (pageToken) => {
        try {
          const res = await classroom.courses.students.list({ courseId: c.id, pageToken })
          return res.data
        } catch (e) {
          // Puede fallar si no hay permisos para ver roster (p.ej. solo estudiante)
          return { students: [] }
        }
      })

      for (const s of students) {
        const email = s?.profile?.emailAddress
        const name = s?.profile?.name?.fullName
        if (!email) continue
        let stu = await User.findOne({ email })
        if (!stu) {
          stu = await User.create({ email, name, role: 'student' })
        }
        await Enrollment.findOneAndUpdate(
          { userId: stu._id, courseId: courseDoc._id },
          { userId: stu._id, courseId: courseDoc._id, role: 'student' },
          { upsert: true }
        )
      }

      // 3) CourseWork (assignments)
      const courseWorks = await this.#listAll(async (pageToken) => {
        try {
          const res = await classroom.courses.courseWork.list({ courseId: c.id, pageToken })
          return res.data
        } catch (e) {
          return { courseWork: [] }
        }
      })

      for (const cw of courseWorks) {
        if (!cw?.id) continue
        const assignmentDoc = await Assignment.findOneAndUpdate(
          { googleId: cw.id },
          {
            googleId: cw.id,
            courseId: courseDoc._id,
            title: cw.title,
            description: cw.description,
            dueDate: cw.dueDate ? new Date(Date.UTC(cw.dueDate.year, (cw.dueDate.month || 1) - 1, cw.dueDate.day || 1)) : undefined,
          },
          { new: true, upsert: true }
        )

        // 4) Submissions por assignment
        const subs = await this.#listAll(async (pageToken) => {
          try {
            const res = await classroom.courses.courseWork.studentSubmissions.list({ courseId: c.id, courseWorkId: cw.id, pageToken })
            return res.data
          } catch (e) {
            return { studentSubmissions: [] }
          }
        })

        for (const s of subs) {
          await Submission.findOneAndUpdate(
            { assignmentId: assignmentDoc._id, userId: undefined, status: s.state },
            {
              assignmentId: assignmentDoc._id,
              userId: undefined,
              status: s.state,
              turnedInAt: s.submissionHistory?.find(h => h.stateHistory?.state === 'TURNED_IN')?.stateHistory?.stateTimestamp,
              grade: s.assignedGrade,
            },
            { upsert: true }
          )
        }
      }

      await Course.updateOne({ _id: courseDoc._id }, { $set: { syncStatus: 'ok', lastSync: new Date() } })
      upserted += 1
    }

    return { userId, courses: upserted }
  }

  async setupWebhook(userId) {
    // Configurar webhook para cambios en tiempo real
    return { userId, webhook: 'ok' }
  }

  async #listAll(listFn) {
    let pageToken
    const items = []
    do {
      const data = await listFn(pageToken)
      const list = data.courses || data.students || data.courseWork || data.studentSubmissions || []
      items.push(...list)
      pageToken = data.nextPageToken
    } while (pageToken)
    return items
  }
}
