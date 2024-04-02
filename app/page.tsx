import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-8'>
        Welcome to Mango Technical Test
      </h1>
      <div className='flex flex-col items-center space-y-4'>
        <Link
          href='/exercise1'
          className='px-6 py-3 bg-white text-black rounded-md shadow-md hover:bg-gray-200 transition duration-300'
        >
          Exercise 1
        </Link>
        <Link
          href='/exercise2'
          className='px-6 py-3 bg-white text-black rounded-md shadow-md hover:bg-gray-200 transition duration-300'
        >
          Exercise 2
        </Link>
      </div>
    </main>
  )
}
