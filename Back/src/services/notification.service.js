export const NotificationService = {
  async send({ userId, channel, message }) {
    // TODO: integrar con proveedor real (email/WhatsApp/Telegram)
    return { userId, channel, message, deliveredAt: new Date().toISOString() }
  },
}
