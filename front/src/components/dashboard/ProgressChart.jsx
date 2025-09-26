import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function ProgressChart({ submissionsByStatus = {} }) {
  const labels = Object.keys(submissionsByStatus)
  const values = labels.map((k) => submissionsByStatus[k])
  const data = {
    labels,
    datasets: [
      {
        label: 'Entregas por estado',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-2">Progreso</div>
      {labels.length ? (
        <Bar data={data} options={options} height={160} />
      ) : (
        <div className="h-40 grid place-items-center text-gray-400">Sin datos</div>
      )}
    </div>
  )
}
