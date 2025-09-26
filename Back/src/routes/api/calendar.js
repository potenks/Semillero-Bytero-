import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import { CalendarService } from '../../services/calendar.service.js'

const router = Router()

// GET /api/calendar/attendance/preview
router.get('/attendance/preview', auth, async (req, res) => {
  try {
    const userId = req.user?.uid
    const { from, to } = req.query
    const data = await CalendarService.getAttendancePreview(userId, { from, to })
    return res.json(data)
  } catch (e) {
    console.error('Calendar attendance preview error', e)
    return res.status(500).json({ error: 'Calendar error', message: e?.message || 'unknown' })
  }
})

// GET /api/calendar/attendance/mock
// Dev-only helper to validate frontend without hitting Google APIs
router.get('/attendance/mock', auth, async (_req, res) => {
  const now = new Date()
  const from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const to = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const mock = {
    range: { from, to },
    counts: { upcomingWeek: 5, today: 2 },
    events: [
      { id: 'evt-1', summary: 'Clase Matemática', start: now.toISOString(), end: new Date(now.getTime() + 3600000).toISOString(), status: 'confirmed' },
      { id: 'evt-2', summary: 'Clase Lengua', start: new Date(now.getTime() + 7200000).toISOString(), end: new Date(now.getTime() + 10800000).toISOString(), status: 'confirmed' },
    ],
  }
  return res.json(mock)
})

export default router
