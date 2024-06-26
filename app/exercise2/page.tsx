'use client'
import { useRouter } from 'next/navigation'
import Range from '../components/Range'
import { useEffect, useState } from 'react'

// Esto deberia estar en el .env
const mockUrl = 'https://demo1331376.mockable.io/api/rangeValues'

export default function Exercise2() {
  const router = useRouter()
  const [minValue, setMinValue] = useState<number>(1)
  const [maxValue, setMaxValue] = useState<number>(1000)
  const [rangeValues, setRangeValues] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const handleBackClick = () => {
    router.back()
  }

  useEffect(() => {
    fetch(mockUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.rangeValues) {
          setRangeValues(data.rangeValues)
          setMinValue(data.rangeValues[0])
          setMaxValue(data.rangeValues[data.rangeValues.length - 1])
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
          <Range
            minValue={minValue}
            maxValue={maxValue}
            rangeValues={rangeValues}
          />
        </section>
      )}
      {error && <p className='text-red-500'>{error}</p>}
    </main>
  )
}
