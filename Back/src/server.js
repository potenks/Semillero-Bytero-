import express from 'express'
import cors from 'cors'
import { env } from './config/environment.js'
import { connectDatabase } from './config/database.js'
import { createApp } from './app.js'

async function start() {
  await connectDatabase()

  const app = createApp()

  app.listen(env.port, () => {
    console.log(`[Server] escuchando en http://localhost:${env.port}`)
  })
}

start().catch((e) => {
  console.error('Error al iniciar el servidor', e)
  process.exit(1)
})
