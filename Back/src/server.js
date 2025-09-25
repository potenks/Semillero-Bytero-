import express from 'express'
import cors from 'cors'
import { env } from './config/environment.js'
import { connectDatabase } from './config/database.js'
import { requestLogger } from './utils/logger.js'
import healthRoutes from './routes/health.routes.js'
import authRoutes from './routes/auth.routes.js'
import coursesRoutes from './routes/api/courses.js'
import studentsRoutes from './routes/api/students.js'
import analyticsRoutes from './routes/api/analytics.js'
import cookieParser from 'cookie-parser'
import syncRoutes from './routes/api/sync.js'
import classroomWebhook from './routes/webhooks/classroom.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import reportsRoutes from './routes/api/reports.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const apiSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'docs', 'openapi.json'), 'utf8')
)

// Restart trigger: harmless comment for nodemon
async function start() {
  await connectDatabase()

  const app = express()
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
  app.use(express.json())
  app.use(cookieParser())
  app.use(requestLogger)

  app.use('/api', healthRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/courses', coursesRoutes)
  app.use('/api/students', studentsRoutes)
  app.use('/api/analytics', analyticsRoutes)
  app.use('/api/sync', syncRoutes)
  app.use('/api/reports', reportsRoutes)
  app.use('/webhooks/classroom', classroomWebhook)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(apiSpec))

  app.get('/', (_req, res) => res.send('Semillero Backend activo'))

  app.listen(env.port, () => {
    console.log(`[Server] escuchando en http://localhost:${env.port}`)
  })
}

start().catch((e) => {
  console.error('Error al iniciar el servidor', e)
  process.exit(1)
})
