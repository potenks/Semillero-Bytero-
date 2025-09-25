import mongoose from 'mongoose'
import { env } from './environment.js'

export async function connectDatabase() {
  mongoose.set('strictQuery', true)
  try {
    if (env.skipDb) {
      console.log('[DB] SKIP_DB=true, omitiendo conexión a MongoDB')
      return
    }
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log('[DB] Conectado a MongoDB')
  } catch (err) {
    console.error('[DB] Error de conexión', err)
    process.exit(1)
  }
}
