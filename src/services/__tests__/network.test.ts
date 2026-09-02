import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createNetworkMonitor } from '@/services/network';
import { createTestHarness, waitFor } from '@/test/utils';
import { MockFetch } from '@/test/mocks/fetch.mock';
import { MockNavigator } from '@/test/mocks/navigator.mock';

describe('NetworkMonitor', () => {
  let harness: ReturnType<typeof createTestHarness>;
  let mockFetch: MockFetch;
  let mockNavigator: MockNavigator;

  beforeEach(() => {
    harness = createTestHarness();
    mockFetch = harness.mockFetch;
    mockNavigator = harness.mockNavigator;

    // Setup mock responses
    mockFetch.setResponse('/api/health', {
      status: 200,
      body: { status: 'ok' },
    });
  });

  afterEach(() => {
    harness.cleanup();
  });

  it('should start in online state when navigator.onLine is true', () => {
    mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    expect(monitor.isOnline()).toBe(true);
    monitor.destroy();
  });

  it('should start in offline state when navigator.onLine is false', () => {
    mockNavigator.setOnLine(false);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    expect(monitor.isOnline()).toBe(false);
    expect(monitor.isOffline()).toBe(true);
    monitor.destroy();
  });

  it('should notify listeners when status changes to offline', async () => {
    mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    const listener = vi.fn();
    monitor.subscribe(listener);

    mockNavigator.triggerOffline();
    await waitFor(() => listener.mock.calls.length > 0);

    expect(listener).toHaveBeenCalledWith('offline');
    monitor.destroy();
  });

  it('should notify listeners when status changes to online', async () => {
    mockNavigator.setOnLine(false);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    const listener = vi.fn();
    monitor.subscribe(listener);

    mockNavigator.triggerOnline();
    await waitFor(() => listener.mock.calls.length > 0);

    expect(listener).toHaveBeenCalledWith('online');
    monitor.destroy();
  });

  it('should allow unsubscribing from status changes', async () => {
    mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    const listener = vi.fn();
    const unsubscribe = monitor.subscribe(listener);

    // Unsubscribe
    unsubscribe();

    mockNavigator.triggerOffline();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(listener).not.toHaveBeenCalled();
    monitor.destroy();
  });

  it('should return current status', async () => {
    mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    expect(monitor.getStatus()).toBe('online');

    mockNavigator.triggerOffline();
    await waitFor(() => monitor.getStatus() === 'offline');

    expect(monitor.getStatus()).toBe('offline');
    monitor.destroy();
  });

  it('should perform health check and update status', async () => {
    mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    const lastHealthCheck = monitor.getLastHealthCheckTime();
    expect(lastHealthCheck).toBeGreaterThan(0);

    monitor.destroy();
  });

  it('should transition to uncertain state on health check failure', async () => {
    mockNavigator.setOnLine(true);
    mockFetch.setError(new Error('Network error'));

    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    const listener = vi.fn();
    monitor.subscribe(listener);

    // Wait for health check to fail
    await waitFor(() => listener.mock.calls.some(call => call[0] === 'uncertain'), 10000);

    expect(monitor.getStatus()).toBe('uncertain');
    monitor.destroy();
  });

  it('should handle multiple subscribers', async () => {
    mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const listener3 = vi.fn();

    monitor.subscribe(listener1);
    monitor.subscribe(listener2);
    monitor.subscribe(listener3);

    mockNavigator.triggerOffline();
    await waitFor(() => listener1.mock.calls.length > 0);

    expect(listener1).toHaveBeenCalledWith('offline');
    expect(listener2).toHaveBeenCalledWith('offline');
    expect(listener3).toHaveBeenCalledWith('offline');

    monitor.destroy();
  });

  it('should clean up resources on destroy', () => {
    mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: mockNavigator as any,
      fetchFn: mockFetch.request.bind(mockFetch),
      windowObj: window,
    });

    const listener = vi.fn();
    monitor.subscribe(listener);

    monitor.destroy();

    mockNavigator.triggerOffline();
    expect(listener).not.toHaveBeenCalled();
  });
});
