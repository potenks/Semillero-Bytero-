import { Router } from 'express'

const router = Router()

// Webhook placeholder para eventos de Google Classroom
router.post('/', async (req, res) => {
  // TODO: validar firma si aplica y procesar evento
  console.log('[Webhook][Classroom] event', req.body)
  res.status(200).json({ ok: true })
})

export default router
