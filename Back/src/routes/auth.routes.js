import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'

const router = Router()

router.get('/google', AuthController.google)
router.get('/google/callback', AuthController.googleCallback)
router.get('/me', AuthController.me)

export default router
