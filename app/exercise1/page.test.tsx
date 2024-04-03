import { render, screen, waitFor } from '@testing-library/react'
import Exercise1 from './page'

describe('Exercise 1', () => {
  test('displays loading initially', () => {
    render(<Exercise1 />)
    expect(screen.getByText(/loading.../i))
  })

  test('loads data and displays range component', async () => {
    render(<Exercise1 />)

    // Esperas a que acabe de esperar
    await waitFor(() => expect(screen.queryByText(/loading.../i)).toBeNull())
    expect(screen.getByTestId('rangeComponent'))
  })
})
