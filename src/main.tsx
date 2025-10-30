import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/App'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element with id "root" was not found')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
