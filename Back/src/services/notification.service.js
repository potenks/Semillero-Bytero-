export const NotificationService = {
  async send({ userId, channel, message }) {
    // TODO: integrar con proveedor real (email/WhatsApp/Telegram)
    return { userId, channel, message, deliveredAt: new Date().toISOString() }
  },
}

// Publicar evento interno -> broadcast por WebSocket
import { broadcastNotification } from '../ws/notifications.js'

export function publish(event, payload = {}, options = {}) {
  // Emitir por WebSocket a todos o a un usuario específico
  broadcastNotification(event, payload, options)
  return { ok: true }
}
