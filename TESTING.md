# Testing Guide - Crisis Guard AI Offline Mode

## Overview

This document provides a comprehensive guide to testing the offline mode implementation with dependency injection. The test suite validates that the offline-first architecture works correctly under various network conditions.

## Test Infrastructure

### Test Framework: Vitest
- Zero-config Vite-native test runner
- JSDOM environment for DOM testing
- Coverage reporting with v8 provider
- UI dashboard for test visualization

### Mock Implementations

#### MockFetch
- Simulates network requests
- Configurable responses per URL
- Network delay simulation
- Online/offline state management
- Error injection

#### MockNavigator
- Mocks `navigator.onLine`
- Triggers online/offline events
- Event listener management

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI dashboard
npm test:ui

# Run tests once with coverage
npm test:coverage

# Run specific test file
npm test -- src/services/__tests__/network.test.ts
```

## Test Structure

### Unit Tests (src/services/__tests__/)

**network.test.ts** (12 tests)
- Online/offline state initialization
- Status transitions
- Listener subscription/unsubscription
- Multiple subscriber handling

**offlineEvaluator.test.ts** (25+ tests)
- CPR rule (unconscious + no breathing)
- Severe bleeding rule
- Choking rule
- Heart attack rule
- Stroke rule (FAST symptoms)
- Anaphylaxis rule
- Burns rule
- Rule prioritization

**offlineDb.test.ts** (10 tests)
- Session CRUD operations
- Audit trail storage
- Sync queue management
- Concurrent operations

### Integration Tests (src/test/integration/)

**offline-flow.test.ts** (8 tests)
- Online to offline transition
- Offline to online transition
- Rapid network transitions
- Data persistence
- Sync queue processing

### Component Tests (src/components/__tests__/)

**OfflineIndicator.test.tsx** (5 tests)
- Rendering with different states
- Online/offline/syncing/error display
- UI updates

## Coverage Goals

| Component | Target |
|-----------|--------|
| NetworkMonitor | 90% |
| OfflineEvaluator | 95% |
| OfflineDb | 85% |
| Overall | 85% |

## Best Practices

### Test Naming
Use descriptive names with "should" prefix:
```typescript
it('should recommend CPR when unconscious and not breathing', () => {})
```

### Test Pattern
```typescript
describe('Feature', () => {
  let harness: ReturnType<typeof createTestHarness>;

  beforeEach(() => {
    harness = createTestHarness();
  });

  afterEach(() => {
    harness.cleanup();
  });

  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

## Debugging

```bash
npm test -- --reporter=verbose
npm test -- --grep "specific test"
npm test:ui
```

## CI/CD

Tests run on every commit and pull request before deployment.
