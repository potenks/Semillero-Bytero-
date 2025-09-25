import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import { SyncService } from '../../services/sync.service.js'

const router = Router()

// Forzar sincronización con Google Classroom para el usuario autenticado
router.post('/classroom', auth, async (req, res) => {
  try {
    const userId = req.user.uid
    // En una implementación real, usaríamos el accessToken de Google almacenado/refrescado.
    const result = await SyncService.syncUser(userId, null)
    return res.json({ ok: true, result })
  } catch (e) {
    console.error('Sync error', e)
    return res.status(500).json({ error: 'Sync error' })
  }
})

export default router
