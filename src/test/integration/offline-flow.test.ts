import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestHarness, waitFor } from '@/test/utils';
import { createNetworkMonitor } from '@/services/network';

describe('Offline Flow Integration', () => {
  let harness: ReturnType<typeof createTestHarness>;

  beforeEach(() => {
    harness = createTestHarness();
    harness.mockFetch.setResponse('/api/health', {
      status: 200,
      body: { status: 'ok' },
    });
  });

  afterEach(() => {
    harness.cleanup();
  });

  it('should transition from online to offline', async () => {
    harness.mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: harness.mockNavigator as any,
      fetchFn: harness.mockFetch.request.bind(harness.mockFetch),
      windowObj: window,
    });

    const statusChanges: string[] = [];
    monitor.subscribe(status => statusChanges.push(status));

    harness.mockNavigator.triggerOffline();
    await waitFor(() => statusChanges.includes('offline'));

    expect(monitor.isOnline()).toBe(false);
    expect(statusChanges).toContain('offline');
    monitor.destroy();
  });

  it('should transition from offline to online', async () => {
    harness.mockNavigator.setOnLine(false);
    const monitor = createNetworkMonitor({
      navigatorObj: harness.mockNavigator as any,
      fetchFn: harness.mockFetch.request.bind(harness.mockFetch),
      windowObj: window,
    });

    const statusChanges: string[] = [];
    monitor.subscribe(status => statusChanges.push(status));

    harness.mockNavigator.triggerOnline();
    await waitFor(() => statusChanges.includes('online'), 10000);

    expect(monitor.isOnline()).toBe(true);
    monitor.destroy();
  });

  it('should handle rapid network transitions', async () => {
    harness.mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: harness.mockNavigator as any,
      fetchFn: harness.mockFetch.request.bind(harness.mockFetch),
      windowObj: window,
    });

    const statusChanges: string[] = [];
    monitor.subscribe(status => statusChanges.push(status));

    harness.mockNavigator.triggerOffline();
    await waitFor(() => statusChanges.includes('offline'));

    harness.mockNavigator.triggerOnline();
    await waitFor(() => statusChanges.filter(s => s === 'online').length >= 2, 10000);

    expect(statusChanges.length).toBeGreaterThanOrEqual(3);
    monitor.destroy();
  });

  it('should maintain state across multiple subscribers', async () => {
    harness.mockNavigator.setOnLine(true);
    const monitor = createNetworkMonitor({
      navigatorObj: harness.mockNavigator as any,
      fetchFn: harness.mockFetch.request.bind(harness.mockFetch),
      windowObj: window,
    });

    const listener1Changes: string[] = [];
    const listener2Changes: string[] = [];

    monitor.subscribe(s => listener1Changes.push(s));
    monitor.subscribe(s => listener2Changes.push(s));

    harness.mockNavigator.triggerOffline();
    await waitFor(() => listener1Changes.includes('offline'));

    expect(listener1Changes).toContain('offline');
    expect(listener2Changes).toContain('offline');

    monitor.destroy();
  });
});
