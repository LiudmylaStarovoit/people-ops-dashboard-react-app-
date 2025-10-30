import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { employeeServiceUtils } from '../services/employee-service'
import App from './App'

beforeEach(() => {
  employeeServiceUtils.reset()
})

describe('App dashboard', () => {
  it('renders headline metrics', async () => {
    render(<App />)

    expect(await screen.findByText(/people operations dashboard/i)).toBeInTheDocument()
    expect(await screen.findByText(/team size/i)).toBeInTheDocument()
    expect(await screen.findByText(/archived teammates/i)).toBeInTheDocument()
    expect((await screen.findAllByText(/remote friendly/i)).length).toBeGreaterThan(0)
  })

  it('toggles theme between dark and light', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(document.documentElement.dataset.theme).toBe('dark')

    await user.click(await screen.findByRole('button', { name: /switch to light/i }))
    expect(document.documentElement.dataset.theme).toBe('light')

    await user.click(screen.getByRole('button', { name: /switch to dark/i }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
