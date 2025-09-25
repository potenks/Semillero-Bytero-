import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import { SyncService } from '../../services/sync.service.js'
import { publishToUser } from '../../services/notification.service.js'

const router = Router()

// Forzar sincronización con Google Classroom para el usuario autenticado
router.post('/classroom', auth, async (req, res) => {
  try {
    const userId = req.user.uid
    publishToUser(userId, 'sync:status', { userId, status: 'started' })
    // En una implementación real, usaríamos el accessToken de Google almacenado/refrescado.
    const result = await SyncService.syncUser(userId, null)
    publishToUser(userId, 'sync:status', { userId, status: 'completed', resultSummary: { courses: result?.length ?? 0 } })
    return res.json({ ok: true, result })
  } catch (e) {
    console.error('Sync error', e)
    publishToUser(req.user?.uid, 'sync:status', { status: 'error', error: 'Sync error' })
    return res.status(500).json({ error: 'Sync error' })
  }
})

export default router
