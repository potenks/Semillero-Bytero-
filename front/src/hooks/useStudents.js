import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api'

export function useStudents(courseId) {
  const [students, setStudents] = useState([])
  useEffect(() => {
    if (!courseId) return
    apiFetch(`/api/courses/${courseId}/students`).then(setStudents).catch(() => setStudents([]))
  }, [courseId])
  return students
}
