import { Router } from 'express'
import { StudentsController } from '../../controllers/students.controller.js'

const router = Router()

router.get('/:id/progress', StudentsController.progress)

export default router
