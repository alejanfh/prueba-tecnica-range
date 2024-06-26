'use client'
import { useRouter } from 'next/navigation'
import Range from '../components/Range'
import { useEffect, useState } from 'react'

// 1. useState (manejar el estado de los valores)
// y useEffect (cargar los datos de la api)
// 2. Fetch para la carga de datos y manejo de loading y errores
// 3. Diseño volver a atras, texto loading y texto error
// 4. Implementar componente Range reutilizable
// 5. Se podrian aplicar mejoras (.env, suspense,...)

// Fase 2: Esto deberia estar en el .env
const mockUrl = 'https://demo1331376.mockable.io/api/minmax'

export default function Exercise1() {
  const router = useRouter()
  const [minValue, setMinValue] = useState<number>(1)
  const [maxValue, setMaxValue] = useState<number>(1000)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const handleBackClick = () => {
    router.back()
  }

  useEffect(() => {
    fetch(mockUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setMinValue(data.minValue)
          setMaxValue(data.maxValue)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching mock data:', error)
        setError('Failed to load data. Please try again later.')
        setIsLoading(false)
      })
  }, [])

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <button
        className='absolute top-4 left-4 px-6 py-3 bg-white text-black rounded-md shadow-md hover:bg-gray-200 transition duration-300'
        onClick={handleBackClick}
      >
        Back
      </button>
      {isLoading ? (
        <p>Loading...</p> // Fase 2: Mejorarlo con un <Suspense>
      ) : (
        <section>
          <Range minValue={minValue} maxValue={maxValue} />
        </section>
      )}
      {error && <p className='text-red-500'>{error}</p>}
    </main>
  )
}
