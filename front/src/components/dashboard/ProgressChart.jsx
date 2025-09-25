import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function ProgressChart({ title = 'Progreso', labels = [], data = [] }) {
  const hasData = Array.isArray(labels) && labels.length > 0 && Array.isArray(data) && data.length > 0

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Progreso',
        data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.2)',
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      <div className="h-56">
        {hasData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-full grid place-items-center text-gray-400 text-sm">Sin datos</div>
        )}
      </div>
    </div>
  )
}
