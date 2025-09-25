import { Router } from 'express'

const router = Router()

router.get('/dashboard', async (req, res) => {
  // Placeholder: devolver métricas base
  return res.json({ attendance: null, participation: null, submissions: null })
})

export default router
