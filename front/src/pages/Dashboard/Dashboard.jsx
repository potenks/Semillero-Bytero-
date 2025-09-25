import MetricsCard from '../../components/dashboard/MetricsCard'
import ProgressChart from '../../components/dashboard/ProgressChart'
import RecentActivity from '../../components/dashboard/RecentActivity'

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricsCard title="Asistencia" value="-" subtitle="semana" />
      <MetricsCard title="Participación" value="-" subtitle="mes" />
      <MetricsCard title="Entregas" value="-" subtitle="mes" />
      <div className="md:col-span-2"><ProgressChart /></div>
      <RecentActivity />
    </div>
  )
}
