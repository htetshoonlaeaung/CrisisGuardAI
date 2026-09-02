import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup fake-indexeddb for all tests
import 'fake-indexeddb/auto';

// Mock fetch globally
global.fetch = vi.fn();

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
