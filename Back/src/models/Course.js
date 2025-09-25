import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema({
  googleClassroomId: String,
  name: String,
  section: String,
  description: String,
  owner: { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, email: String },
  students: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, enrollmentDate: Date }],
  syncStatus: String,
  lastSync: Date,
}, { timestamps: true })

export default mongoose.model('Course', CourseSchema)
