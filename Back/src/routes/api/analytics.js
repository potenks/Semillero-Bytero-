import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../../config/environment.js'
import Submission from '../../models/Submission.js'
import Assignment from '../../models/Assignment.js'
import Course from '../../models/Course.js'
import mongoose from 'mongoose'

const router = Router()

function getTokenFromReq(req) {
  const header = req.headers.authorization || ''
  const tokenHeader = header.startsWith('Bearer ') ? header.slice(7) : null
  const tokenCookie = req.cookies?.token
  return tokenHeader || tokenCookie
}

router.get('/dashboard', async (req, res) => {
  try {
    const token = getTokenFromReq(req)
    if (!token) return res.json({ attendance: null, participation: null, submissions: null, progress: { labels: [], data: [] } })
    let payload
    try {
      payload = jwt.verify(token, env.jwtSecret)
    } catch {
      return res.json({ attendance: null, participation: null, submissions: null, progress: { labels: [], data: [] } })
    }

    const userId = payload.uid ? new mongoose.Types.ObjectId(payload.uid) : null
    const role = payload.role || 'student'

    const now = new Date()
    const pastWeeks = 8 // últimas 8 semanas

    async function weeklySeries(matchStage) {
      // Agrupar por ISO week del campo turnedInAt
      const pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $isoWeekYear: '$turnedInAt' },
              week: { $isoWeek: '$turnedInAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.week': 1 } },
      ]
      const agg = await Submission.aggregate(pipeline)
      // Construir labels y datos de las últimas n semanas
      const labels = []
      const data = []
      // Generar lista de semanas ISO desde now hacia atrás
      const cursor = new Date(now)
      for (let i = pastWeeks - 1; i >= 0; i--) {
        const d = new Date(cursor)
        d.setDate(d.getDate() - i * 7)
        // aproximación de etiqueta Semana/Year
        const weekLabel = `Sem ${getISOWeek(d)}-${d.getFullYear()}`
        labels.push(weekLabel)
        data.push(0)
      }
      // Mapear resultados a posiciones
      for (const row of agg) {
        // Encontrar índice aproximado por año-semana
        const label = `Sem ${row._id.week}-${row._id.year}`
        const idx = labels.indexOf(label)
        if (idx !== -1) data[idx] = row.count
      }
      return { labels, data }
    }

    function getISOWeek(date) {
      const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      const dayNum = tmp.getUTCDay() || 7
      tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
      return Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7)
    }

    let submissionsCount = 0
    let series = { labels: [], data: [] }

    if (role === 'student' && userId) {
      submissionsCount = await Submission.countDocuments({ userId })
      // Serie por semanas para el estudiante
      series = await weeklySeries({ userId, turnedInAt: { $ne: null } })
    } else {
      // teacher/coordinator: si teacher, filtrar por cursos que es owner
      let courseIds = []
      if (role === 'teacher' && userId) {
        const courses = await Course.find({ 'owner.userId': userId }).select('_id').lean()
        courseIds = courses.map(c => c._id)
      }
      const assignmentMatch = courseIds.length ? { courseId: { $in: courseIds } } : {}
      const assignments = await Assignment.find(assignmentMatch).select('_id').lean()
      const assignmentIds = assignments.map(a => a._id)
      const subsMatch = assignmentIds.length ? { assignmentId: { $in: assignmentIds } } : {}

      submissionsCount = await Submission.countDocuments(subsMatch)
      series = await weeklySeries({ ...subsMatch, turnedInAt: { $ne: null } })
    }

    // Métricas placeholder calculables con la info disponible
    const attendance = null // Requiere origen de asistencia, dejar null por ahora
    const participation = series.data.length ? series.data[series.data.length - 1] : null // participación como entregas semana actual

    return res.json({ attendance, participation, submissions: submissionsCount, progress: series })
  } catch (e) {
    console.error('Analytics error', e)
    return res.status(500).json({ error: 'Analytics failed' })
  }
})

export default router
