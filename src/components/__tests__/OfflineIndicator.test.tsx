import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfflineIndicator } from '@/components/emergency/OfflineIndicator';
import { OfflineProvider } from '@/context/OfflineContext';

describe('OfflineIndicator Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    vi.clearAllMocks();
  });

  it('should render offline indicator', () => {
    render(
      <OfflineProvider>
        <OfflineIndicator />
      </OfflineProvider>
    );

    const indicator = screen.getByTestId('offline-indicator');
    expect(indicator).toBeDefined();
  });

  it('should show online status when connected', () => {
    render(
      <OfflineProvider initialStatus="online">
        <OfflineIndicator />
      </OfflineProvider>
    );

    const status = screen.getByText(/online/i);
    expect(status).toBeDefined();
  });

  it('should show offline status when disconnected', () => {
    render(
      <OfflineProvider initialStatus="offline">
        <OfflineIndicator />
      </OfflineProvider>
    );

    const status = screen.getByText(/offline/i);
    expect(status).toBeDefined();
  });

  it('should show syncing status', () => {
    render(
      <OfflineProvider initialStatus="syncing">
        <OfflineIndicator />
      </OfflineProvider>
    );

    const syncStatus = screen.getByText(/syncing/i);
    expect(syncStatus).toBeDefined();
  });

  it('should display sync error when present', () => {
    render(
      <OfflineProvider initialStatus="error">
        <OfflineIndicator />
      </OfflineProvider>
    );

    const error = screen.getByText(/error/i);
    expect(error).toBeDefined();
  });
});
