import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import { AnalyticsService } from '../../services/analytics.service.js'

const router = Router()

router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user?.uid
    const { from, to } = req.query
    const data = await AnalyticsService.getDashboard(userId, { from, to })
    return res.json(data)
  } catch (e) {
    console.error('Analytics dashboard error', e)
    return res.status(500).json({ error: 'Analytics error' })
  }
})

export default router
