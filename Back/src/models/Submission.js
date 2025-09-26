import mongoose from 'mongoose'

const SubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  turnedInAt: Date,
  grade: Number,
  status: String,
  googleId: { type: String, index: true },
}, { timestamps: true })

export default mongoose.model('Submission', SubmissionSchema)
