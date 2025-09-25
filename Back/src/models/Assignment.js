import mongoose from 'mongoose'

const AssignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  dueDate: Date,
  googleId: String,
}, { timestamps: true })

export default mongoose.model('Assignment', AssignmentSchema)
