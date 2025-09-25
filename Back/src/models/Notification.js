import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  channel: { type: String, enum: ['email', 'whatsapp', 'telegram'] },
  message: String,
  deliveredAt: Date,
}, { timestamps: true })

export default mongoose.model('Notification', NotificationSchema)
