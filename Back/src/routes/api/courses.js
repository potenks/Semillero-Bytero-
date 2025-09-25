import { Router } from 'express'
import { CoursesController } from '../../controllers/courses.controller.js'

const router = Router()

router.get('/', CoursesController.list)
router.get('/:id/students', CoursesController.students)

export default router
