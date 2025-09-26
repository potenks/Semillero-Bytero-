import { useMemo } from 'react'

export default function FiltersBar({ data, filters, setFilters }) {
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'TURNED_IN', label: 'Entregado' },
    { value: 'RETURNED', label: 'Reentrega/Corregido' },
    { value: 'NEW', label: 'Nuevo' },
    { value: 'CREATED', label: 'Creado' },
    { value: 'LATE', label: 'Atrasado' },
  ]

  // Placeholder: derivar opciones de curso/profesor si existen en data
  const courseOptions = useMemo(() => [{ value: '', label: 'Todos los cursos' }], [])
  const professorOptions = useMemo(() => [{ value: '', label: 'Todos los profesores' }], [])

  return (
    <div className="bg-white rounded-lg border p-3 flex flex-wrap gap-3 items-center">
      <select
        className="border rounded px-2 py-1 text-sm"
        value={filters.courseId}
        onChange={(e) => setFilters((f) => ({ ...f, courseId: e.target.value }))}
      >
        {courseOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select
        className="border rounded px-2 py-1 text-sm"
        value={filters.professor}
        onChange={(e) => setFilters((f) => ({ ...f, professor: e.target.value }))}
      >
        {professorOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select
        className="border rounded px-2 py-1 text-sm"
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
