import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Exercise1 from '../app/exercise1/page'
import * as nextNavigation from 'next/navigation'

// Hago mock de useRouter
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(),
}))

describe('Exercise 1', () => {
  beforeEach(() => {
    const useRouterMock = nextNavigation.useRouter as jest.Mock
    useRouterMock.mockReturnValue({
      pathname: '/',
      push: jest.fn(),
    })
  })

  test('displays loading initially', async () => {
    render(<Exercise1 />)
    expect(screen.getByText(/loading.../i)).toBeInTheDocument()
  })
})
