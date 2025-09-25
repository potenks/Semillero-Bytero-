export default function CourseCard({ name, description }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="font-heading">{name}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  )
}
