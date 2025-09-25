import { useEffect, useState } from 'react'
import MetricsCard from '../../components/dashboard/MetricsCard'
import ProgressChart from '../../components/dashboard/ProgressChart'
import RecentActivity from '../../components/dashboard/RecentActivity'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { AnalyticsService } from '../../services/analytics.service'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({ attendance: null, participation: null, submissions: null })
  const [series, setSeries] = useState({ labels: [], data: [] })

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await AnalyticsService.dashboard()
        if (!mounted) return
        setMetrics({
          attendance: res.attendance,
          participation: res.participation,
          submissions: res.submissions,
        })
        // If backend returns timeseries like res.progress = { labels: [], data: [] }
        if (res.progress && Array.isArray(res.progress.labels) && Array.isArray(res.progress.data)) {
          setSeries({ labels: res.progress.labels, data: res.progress.data })
        }
      } catch (e) {
        // leave defaults
      } finally {
        mounted && setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 md:col-span-3">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricsCard title="Asistencia" value={metrics.attendance ?? '-'} subtitle="semana" />
      <MetricsCard title="Participación" value={metrics.participation ?? '-'} subtitle="mes" />
      <MetricsCard title="Entregas" value={metrics.submissions ?? '-'} subtitle="mes" />
      <div className="md:col-span-2">
        <ProgressChart title="Progreso" labels={series.labels} data={series.data} />
      </div>
      <RecentActivity />
    </div>
  )
}
