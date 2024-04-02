'use client'
import { useRouter } from 'next/navigation'
import Range from '../components/Range'

export default function Exercise1() {
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <button
        className='absolute top-4 left-4 px-6 py-3 bg-white text-black rounded-md shadow-md hover:bg-gray-200 transition duration-300'
        onClick={handleBackClick}
      >
        Back
      </button>
      <section>
        <Range minValue={1} maxValue={1000} />
      </section>
    </main>
  )
}
