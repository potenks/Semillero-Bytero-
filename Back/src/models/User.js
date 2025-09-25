import mongoose from 'mongoose'

const CourseRefSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  role: { type: String },
}, { _id: false })

const UserSchema = new mongoose.Schema({
  googleId: String,
  email: { type: String, index: true },
  name: String,
  role: { type: String, enum: ['student', 'teacher', 'coordinator'], default: 'student' },
  avatar: String,
  courses: [CourseRefSchema],
  googleTokens: {
    accessToken: { type: String },
    refreshToken: { type: String },
    expiryDate: { type: Date },
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

export default mongoose.model('User', UserSchema)
