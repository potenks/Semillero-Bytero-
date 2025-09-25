import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  role: { type: String },
  enrollmentDate: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('Enrollment', EnrollmentSchema)
