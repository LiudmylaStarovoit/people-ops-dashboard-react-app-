import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserver
}

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
}

if (!window.print) {
  window.print = vi.fn()
}
