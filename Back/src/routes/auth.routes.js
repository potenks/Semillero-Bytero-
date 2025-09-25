import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'

const router = Router()

router.get('/google', AuthController.google)
router.get('/google/callback', AuthController.googleCallback)
// Ruta alternativa para opción B (puerto 5001 y path /oauth/callback)
router.get('/oauth/callback', AuthController.googleCallback)
router.get('/me', AuthController.me)
router.post('/logout', AuthController.logout)

export default router
