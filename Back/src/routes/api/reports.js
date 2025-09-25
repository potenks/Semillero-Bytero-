import { Router } from 'express'
import { auth } from '../../middleware/auth.js'
import Submission from '../../models/Submission.js'
import Assignment from '../../models/Assignment.js'
import mongoose from 'mongoose'

const router = Router()

// GET /api/reports/submissions.csv
// Exporta submissions del usuario autenticado con datos de assignment
router.get('/submissions.csv', auth, async (req, res) => {
  try {
    const userId = req.user?.uid
    const { from, to, courseId } = req.query

    const match = { userId }
    if (from || to) {
      match.createdAt = {}
      if (from) match.createdAt.$gte = new Date(from)
      if (to) match.createdAt.$lte = new Date(to)
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'assignments',
          localField: 'assignmentId',
          foreignField: '_id',
          as: 'assignment',
        },
      },
      { $unwind: '$assignment' },
    ]

    if (courseId) {
      let objectId
      try { objectId = new mongoose.Types.ObjectId(courseId) } catch (e) { objectId = null }
      if (objectId) {
        pipeline.push({ $match: { 'assignment.courseId': objectId } })
      }
    }

    const rows = await Submission.aggregate(pipeline)

    // Build CSV
    const headers = [
      'submissionId',
      'assignmentId',
      'assignmentTitle',
      'courseId',
      'userId',
      'status',
      'grade',
      'turnedInAt',
      'dueDate',
      'onTime',
      'createdAt',
    ]

    const csvLines = [headers.join(',')]

    for (const r of rows) {
      const due = r.assignment?.dueDate ? new Date(r.assignment.dueDate) : null
      const turned = r.turnedInAt ? new Date(r.turnedInAt) : null
      const onTime = due && turned ? turned <= due : ''
      const line = [
        r._id,
        r.assignmentId,
        escapeCsv(r.assignment?.title || ''),
        r.assignment?.courseId || '',
        r.userId,
        r.status || '',
        r.grade ?? '',
        turned ? turned.toISOString() : '',
        due ? due.toISOString() : '',
        onTime,
        r.createdAt ? new Date(r.createdAt).toISOString() : '',
      ]
        .map((v) => (v === null || v === undefined ? '' : String(v)))
        .join(',')
      csvLines.push(line)
    }

    const csv = csvLines.join('\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="submissions.csv"')
    return res.send(csv)
  } catch (e) {
    console.error('Reports CSV error', e)
    return res.status(500).json({ error: 'Reports error' })
  }
})

function escapeCsv(value) {
  const needsQuotes = /[",\n]/.test(value)
  let escaped = value.replace(/"/g, '""')
  if (needsQuotes) escaped = `"${escaped}"`
  return escaped
}

export default router
