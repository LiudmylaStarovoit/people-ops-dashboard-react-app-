import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { employeeServiceUtils } from '../services/employee-service'
import App from './App'

const renderWithClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false
      }
    }
  })

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

beforeEach(() => {
  employeeServiceUtils.reset()
})

describe('App dashboard', () => {
  it('renders headline metrics', async () => {
    renderWithClient(<App />)

    expect(await screen.findByText(/people operations dashboard/i)).toBeInTheDocument()
    expect(await screen.findByText(/team size/i)).toBeInTheDocument()
    expect(await screen.findByText(/archived teammates/i)).toBeInTheDocument()
    expect((await screen.findAllByText(/remote friendly/i)).length).toBeGreaterThan(0)
  })

  it('toggles theme between dark and light', async () => {
    const user = userEvent.setup()
    renderWithClient(<App />)

    expect(document.documentElement.dataset.theme).toBe('dark')

    await user.click(await screen.findByRole('button', { name: /switch to light/i }))
    expect(document.documentElement.dataset.theme).toBe('light')

    await user.click(screen.getByRole('button', { name: /switch to dark/i }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
