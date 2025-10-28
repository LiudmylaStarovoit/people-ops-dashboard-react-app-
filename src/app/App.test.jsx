import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('App dashboard', () => {
  it('renders headline metrics', () => {
    render(<App />)

    expect(screen.getByText(/People operations dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Team size/i)).toBeInTheDocument()
    expect(screen.getByText(/Archived teammates/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Remote friendly/i).length).toBeGreaterThan(0)
  })

  it('toggles theme between dark and light', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(document.documentElement.dataset.theme).toBe('dark')

    await user.click(screen.getByRole('button', { name: /switch to light/i }))
    expect(document.documentElement.dataset.theme).toBe('light')

    await user.click(screen.getByRole('button', { name: /switch to dark/i }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
