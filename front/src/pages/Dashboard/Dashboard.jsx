import MetricsCard from '../../components/dashboard/MetricsCard'
import ProgressChart from '../../components/dashboard/ProgressChart'
import RecentActivity from '../../components/dashboard/RecentActivity'
import { useEffect, useState } from 'react'
import { AnalyticsService } from '../../services/analytics.service'
import { SyncService } from '../../services/sync.service'
import { CalendarService } from '../../services/calendar.service'
import { NotificationsService } from '../../services/notifications.service'
import { useDemoContext } from '../../context/DemoContext'
import FiltersBar from '../../components/dashboard/FiltersBar'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [attendancePreview, setAttendancePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [useCalendarMock, setUseCalendarMock] = useState(false)
  const { demoMode, setDemoMode } = useDemoContext()

  useEffect(() => {
    let mounted = true
    const calendarCall = useCalendarMock ? CalendarService.attendanceMock : CalendarService.attendancePreview
    Promise.all([
      AnalyticsService.dashboard().catch(() => null),
      calendarCall().catch(() => null),
    ])
      .then(([dash, att]) => {
        if (mounted) {
          if (dash) setData(dash)
          if (att) setAttendancePreview(att)
        }
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [useCalendarMock])

  const attendance = attendancePreview?.counts?.today ?? '-'
  const participation = data?.participation?.month ?? '-'
  const deliveries = data?.submissions?.byStatus?.TURNED_IN ?? 0

  // Filtros (por ahora solo estado, extensible a curso/profesor)
  const [filters, setFilters] = useState({ courseId: '', professor: '', status: '' })

  // Derivar datos filtrados para gráfico y actividad
  const filteredByStatus = (() => {
    const by = data?.submissions?.byStatus || {}
    if (!filters.status) return by
    const only = {}
    if (by[filters.status] != null) only[filters.status] = by[filters.status]
    return only
  })()

  const filteredRecent = (() => {
    const recent = data?.submissions?.recent || []
    if (!filters.status) return recent
    return recent.filter((r) => r.status === filters.status)
  })()

  async function handleSync() {
    try {
      setSyncing(true)
      await SyncService.classroomSync({ force: true })
      // refrescar métricas luego del sync
      const refreshed = await AnalyticsService.dashboard()
      setData(refreshed)
      const calendarCall = useCalendarMock ? CalendarService.attendanceMock : CalendarService.attendancePreview
      const att = await calendarCall().catch(() => null)
      if (att) setAttendancePreview(att)
    } catch (e) {
      console.error('Sync error', e)
      alert('Error al sincronizar')
    } finally {
      setSyncing(false)
    }
  }

  function handleExportCSV() {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    const url = `${API_URL}/api/reports/submissions.csv`
    window.open(url, '_blank')
  }

  function buildDemoAnalytics() {
    const now = new Date()
    return {
      courses: { total: 3 },
      submissions: {
        byStatus: { TURNED_IN: 12, RETURNED: 4, NEW: 3, CREATED: 2 },
        onTime: 10,
        late: 2,
        recent: [
          { id: 'demo1', assignmentId: 'A1', status: 'TURNED_IN', turnedInAt: now.toISOString(), grade: 8, createdAt: now.toISOString() },
          { id: 'demo2', assignmentId: 'A2', status: 'RETURNED', turnedInAt: now.toISOString(), grade: 9, createdAt: now.toISOString() },
        ],
      },
      attendance: { week: null },
      participation: { month: null },
      updatedAt: now.toISOString(),
      userId: 'demo-user',
    }
  }

  async function handleEnterDemo() {
    setDemoMode(true)
    setUseCalendarMock(true)
    setAttendancePreview({
      range: { from: new Date().toISOString(), to: new Date(Date.now() + 7*24*60*60*1000).toISOString() },
      counts: { upcomingWeek: 5, today: 2 },
      events: [
        { id: 'evt-1', summary: 'Clase Matemática', start: new Date().toISOString(), end: new Date(Date.now()+3600000).toISOString(), status: 'confirmed' },
        { id: 'evt-2', summary: 'Clase Lengua', start: new Date(Date.now()+7200000).toISOString(), end: new Date(Date.now()+10800000).toISOString(), status: 'confirmed' },
      ],
    })
    setData(buildDemoAnalytics())
    try {
      // Disparar algunos mocks de notificaciones para mostrar toasts
      await NotificationsService.mockAssignment()
      await NotificationsService.mockCourseUpdate()
      await NotificationsService.mockBroadcast('app:info', { title: 'Modo demo activo' })
    } catch (_) {}
  }

  async function handleExitDemo() {
    setDemoMode(false)
    setUseCalendarMock(false)
    setLoading(true)
    try {
      const [dash, att] = await Promise.all([
        AnalyticsService.dashboard().catch(() => null),
        CalendarService.attendancePreview().catch(() => null),
      ])
      if (dash) setData(dash)
      if (att) setAttendancePreview(att)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-3 flex items-center gap-2">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 rounded bg-primary text-white disabled:opacity-60"
        >
          {syncing ? 'Sincronizando…' : 'Sincronizar Classroom'}
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          Exportar CSV
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useCalendarMock} onChange={(e) => setUseCalendarMock(e.target.checked)} />
          Usar mock Calendar
        </label>
        {!demoMode ? (
          <button onClick={handleEnterDemo} className="px-3 py-2 rounded bg-emerald-500 text-white">Modo Demo</button>
        ) : (
          <button onClick={handleExitDemo} className="px-3 py-2 rounded bg-orange-500 text-white">Salir de Modo Demo</button>
        )}
      </div>
      <div className="md:col-span-3">
        <FiltersBar data={data} filters={filters} setFilters={setFilters} />
      </div>
      <MetricsCard title="Asistencia" value={attendance} subtitle="semana" />
      <MetricsCard title="Participación" value={participation} subtitle="mes" />
      <MetricsCard title="Entregas a tiempo" value={deliveries} subtitle="mes" />
      <div className="md:col-span-2">
        <ProgressChart submissionsByStatus={filteredByStatus} />
        {/* Resumen por estado */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {Object.entries(data?.submissions?.byStatus || {}).map(([k, v]) => (
            <span key={k} className="px-2 py-1 rounded bg-gray-100 text-gray-700">{k}: {v}</span>
          ))}
        </div>
      </div>
      <RecentActivity items={filteredRecent} loading={loading} />
    </div>
  )
}
