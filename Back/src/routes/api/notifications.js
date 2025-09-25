import { Router } from 'express'
import { publish } from '../../services/notification.service.js'

const router = Router()

// Mock: emitir una nueva asignación
router.post('/mock/assignment', (req, res) => {
  const payload = req.body?.payload || { id: Date.now(), title: 'Nueva tarea', courseId: 'COURSE_X' }
  publish('assignment:new', payload)
  res.json({ ok: true, emitted: { event: 'assignment:new', payload } })
})

// Mock: actualización de curso
router.post('/mock/course-update', (req, res) => {
  const payload = req.body?.payload || { id: 'COURSE_X', title: 'Curso actualizado' }
  publish('course:update', payload)
  res.json({ ok: true, emitted: { event: 'course:update', payload } })
})

// Mock genérico
router.post('/mock/broadcast', (req, res) => {
  const { event = 'app:info', payload = { message: 'Hola desde mock' } } = req.body || {}
  publish(event, payload)
  res.json({ ok: true, emitted: { event, payload } })
})

export default router
