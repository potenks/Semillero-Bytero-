import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api'

export function useCourses() {
  const [courses, setCourses] = useState([])
  useEffect(() => {
    apiFetch('/api/courses').then(setCourses).catch(() => setCourses([]))
  }, [])
  return courses
}
