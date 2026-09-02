import { vi } from 'vitest';
import { MockFetch, createMockFetch } from './fetch.mock';
import { MockNavigator, createMockNavigator, setupMockNavigator } from './navigator.mock';

/**
 * Test utilities for assertions and helpers
 */
export async function waitFor(
  predicate: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  while (!predicate()) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`waitFor timeout after ${timeout}ms`);
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

/**
 * Create test data factories
 */
export function createTestSession(overrides?: any) {
  return {
    id: 1,
    sessionToken: 'test-token-123',
    domain: 'medical',
    facts: [],
    currentSeverity: 'critical',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isOfflineCreated: false,
    ...overrides,
  };
}

export function createTestAudit(overrides?: any) {
  return {
    id: 1,
    sessionId: 1,
    action: 'evaluate',
    result: { severity: 'critical' },
    timestamp: new Date().toISOString(),
    isOfflineCreated: false,
    ...overrides,
  };
}

export function createTestShelter(overrides?: any) {
  return {
    id: 1,
    name: 'Test Shelter',
    latitude: 40.7128,
    longitude: -74.006,
    capacity: 100,
    currentOccupancy: 50,
    category: 'general',
    phone: '555-0100',
    address: '123 Test St',
    ...overrides,
  };
}

/**
 * Test harness factory for creating services with mocked dependencies
 */
export interface TestHarness {
  mockFetch: MockFetch;
  mockNavigator: MockNavigator;
  cleanup(): void;
}

export function createTestHarness(): TestHarness {
  const mockFetch = createMockFetch();
  const mockNavigator = createMockNavigator();

  setupMockNavigator(mockNavigator);

  // Replace global fetch with mock
  global.fetch = vi.fn((input, init) => mockFetch.request(input, init));

  return {
    mockFetch,
    mockNavigator,
    cleanup(): void {
      mockFetch.clear();
      mockNavigator.clear();
      vi.clearAllMocks();
    },
  };
}
