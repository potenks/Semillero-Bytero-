export default function Login() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm text-center">
        <h2 className="text-xl font-heading mb-4">Iniciar sesión</h2>
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={() => {
            const api = import.meta.env.VITE_API_URL || 'http://localhost:3001'
            window.location.href = `${api}/api/auth/google`
          }}
        >
          Continuar con Google
        </button>
      </div>
    </div>
  )
}
