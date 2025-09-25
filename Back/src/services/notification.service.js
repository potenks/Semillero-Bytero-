import { broadcastNotification } from '../ws/notifications.js'

export const NotificationService = {
  async send({ userId, channel, message }) {
    // TODO: integrar con proveedor real (email/WhatsApp/Telegram)
    return { userId, channel, message, deliveredAt: new Date().toISOString() }
  },
}

// --- Realtime (WS) helpers ---

export function publish(event, payload = {}) {
  // Envía a todos los clientes conectados
  broadcastNotification(event, payload)
}

export function publishToUser(userId, event, payload = {}) {
  if (!userId) return publish(event, payload)
  broadcastNotification(event, payload, { userId: String(userId) })
}

// --- External channel mocks (email/WhatsApp/Telegram) ---
export const ExternalChannels = {
  async email({ to, subject, body }) {
    // Placeholder: simular envío
    return { provider: 'email', to, subject, body, deliveredAt: new Date().toISOString() }
  },
  async whatsapp({ to, body }) {
    return { provider: 'whatsapp', to, body, deliveredAt: new Date().toISOString() }
  },
  async telegram({ chatId, body }) {
    return { provider: 'telegram', chatId, body, deliveredAt: new Date().toISOString() }
  },
}
