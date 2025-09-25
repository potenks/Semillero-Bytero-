import Submission from '../models/Submission.js'
import Assignment from '../models/Assignment.js'
import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'

export const AnalyticsService = {
  async getDashboard(userId, { from, to } = {}) {
    const dateMatch = {}
    if (from) dateMatch.$gte = new Date(from)
    if (to) dateMatch.$lte = new Date(to)

    // Cursos asociados al usuario (owner o enrolado)
    const [ownedCoursesCount, enrolledCourseIds] = await Promise.all([
      Course.countDocuments({ 'owner.userId': userId }),
      Enrollment.distinct('courseId', { userId }),
    ])
    const totalCourses = ownedCoursesCount + (enrolledCourseIds?.length || 0)

    // Submissions del usuario por estado
    const submissionMatch = { userId }
    if (Object.keys(dateMatch).length) submissionMatch.createdAt = dateMatch

    const submissionsByStatusAgg = await Submission.aggregate([
      { $match: submissionMatch },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    const submissionsByStatus = submissionsByStatusAgg.reduce((acc, it) => {
      acc[it._id || 'unknown'] = it.count
      return acc
    }, {})

    // A tiempo vs tarde (requiere dueDate del Assignment)
    const onTimeLateAgg = await Submission.aggregate([
      { $match: submissionMatch },
      {
        $lookup: {
          from: 'assignments',
          localField: 'assignmentId',
          foreignField: '_id',
          as: 'assignment',
        },
      },
      { $unwind: '$assignment' },
      {
        $addFields: {
          onTime: {
            $cond: [
              { $and: [ { $ifNull: ['$turnedInAt', false] }, { $ifNull: ['$assignment.dueDate', false] } ] },
              { $lte: ['$turnedInAt', '$assignment.dueDate'] },
              null,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$onTime',
          count: { $sum: 1 },
        },
      },
    ])
    const onTime = onTimeLateAgg.find((x) => x._id === true)?.count || 0
    const late = onTimeLateAgg.find((x) => x._id === false)?.count || 0

    // Actividad reciente (últimas 5 entregas)
    const recentSubmissions = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    return {
      courses: { total: totalCourses },
      submissions: {
        byStatus: submissionsByStatus,
        onTime,
        late,
        recent: recentSubmissions.map((s) => ({
          id: s._id,
          assignmentId: s.assignmentId,
          status: s.status,
          turnedInAt: s.turnedInAt,
          grade: s.grade,
          createdAt: s.createdAt,
        })),
      },
      attendance: { week: null }, // Placeholder hasta integrar Calendar
      participation: { month: null },
      updatedAt: new Date().toISOString(),
      userId,
    }
  },
}
