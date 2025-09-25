import { WebSocketServer } from 'ws'
import { parse } from 'url'
import jwt from 'jsonwebtoken'
import { env } from '../config/environment.js'

let wss = null

export function initNotificationsWS(server) {
  if (wss) return wss
  wss = new WebSocketServer({ server, path: '/ws/notifications' })

  wss.on('connection', (socket, req) => {
    // Optional: handshake log
    // console.log('[WS] client connected')
    // Parse token from query (?token=...)
    const { query } = parse(req.url, true)
    const token = query?.token
    if (token) {
      try {
        const payload = jwt.verify(token, env.jwtSecret)
        if (payload?.uid || payload?.userId || payload?.id) {
          socket.userId = String(payload.uid || payload.userId || payload.id)
        }
      } catch (e) {
        // Token inválido: en producción, cerrar. En dev, permitir sin userId.
        if (env.nodeEnv === 'production') {
          socket.close(1008, 'Invalid token')
          return
        }
      }
    } else if (env.nodeEnv === 'production') {
      // En producción, requerimos token
      socket.close(1008, 'Auth required')
      return
    }

    socket.isAlive = true

    socket.on('pong', () => {
      socket.isAlive = true
    })

    socket.on('close', () => {
      // console.log('[WS] client disconnected')
    })
  })

  // Heartbeat to clean dead sockets
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate()
      ws.isAlive = false
      ws.ping()
    })
  }, 30000)

  wss.on('close', () => clearInterval(interval))

  return wss
}

export function getNotificationsWSS() {
  if (!wss) throw new Error('Notifications WSS not initialized')
  return wss
}

export function broadcastNotification(event, payload = {}, options = {}) {
  if (!wss) return
  const message = JSON.stringify({ event, payload, ts: Date.now() })
  const targetUserId = options.userId || null
  wss.clients.forEach((client) => {
    if (client.readyState !== 1) return
    if (targetUserId && client.userId && client.userId !== targetUserId) return
    client.send(message)
  })
}
