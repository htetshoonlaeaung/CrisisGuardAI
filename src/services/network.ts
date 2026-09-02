// src/services/network.ts
// Network status monitoring and backend health checks for offline detection

type NetworkStatus = 'online' | 'offline' | 'uncertain';

interface NetworkListener {
  (status: NetworkStatus): void;
}

interface NetworkMonitorOptions {
  fetchFn?: typeof fetch;
  navigatorObj?: typeof navigator;
  windowObj?: typeof window;
}

class NetworkMonitor {
  private status: NetworkStatus = 'online';
  private listeners: Set<NetworkListener> = new Set();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private lastHealthCheck: number = Date.now();
  private healthCheckTimeout: NodeJS.Timeout | null = null;
  private fetchFn: typeof fetch;
  private navigatorObj: typeof navigator;
  private windowObj: typeof window;

  constructor(options: NetworkMonitorOptions = {}) {
    this.fetchFn = options.fetchFn || fetch;
    this.navigatorObj = options.navigatorObj || navigator;
    this.windowObj = options.windowObj || window;
    this.initializeListeners();
    this.startHealthCheck();
  }

  private initializeListeners(): void {
    // Monitor browser online/offline events
    this.windowObj.addEventListener('online', () => this.handleOnline());
    this.windowObj.addEventListener('offline', () => this.handleOffline());

    // Initial status based on navigator.onLine
    this.status = this.navigatorObj.onLine ? 'online' : 'offline';
  }

  private handleOnline(): void {
    if (this.status !== 'online') {
      this.status = 'online';
      this.notifyListeners('online');
    }
  }

  private handleOffline(): void {
    if (this.status !== 'offline') {
      this.status = 'offline';
      this.notifyListeners('offline');
    }
  }

  private startHealthCheck(): void {
    // Check backend health every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000);

    // Initial health check
    this.performHealthCheck();
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const controller = new AbortController();
      this.healthCheckTimeout = setTimeout(() => controller.abort(), 5000);

      const response = await this.fetchFn('/api/health', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(this.healthCheckTimeout!);

      if (response.ok) {
        this.lastHealthCheck = Date.now();
        if (this.status !== 'online') {
          this.status = 'online';
          this.notifyListeners('online');
        }
      } else {
        if (this.status === 'online') {
          this.status = 'uncertain';
          this.notifyListeners('uncertain');
        }
      }
    } catch (error) {
      clearTimeout(this.healthCheckTimeout!);
      
      if (!this.navigatorObj.onLine) {
        this.status = 'offline';
        this.notifyListeners('offline');
      } else if (this.status !== 'uncertain') {
        this.status = 'uncertain';
        this.notifyListeners('uncertain');
      }
    }
  }

  private notifyListeners(newStatus: NetworkStatus): void {
    this.listeners.forEach(listener => listener(newStatus));
    console.log(`[Network] Status changed to: ${newStatus}`);
  }

  // Public API
  public getStatus(): NetworkStatus {
    return this.status;
  }

  public isOnline(): boolean {
    return this.status === 'online' && this.navigatorObj.onLine;
  }

  public isOffline(): boolean {
    return !this.navigatorObj.onLine;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getLastHealthCheckTime(): number {
    return this.lastHealthCheck;
  }

  public destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.healthCheckTimeout) {
      clearTimeout(this.healthCheckTimeout);
    }
    this.listeners.clear();
  }
}

// Factory function for dependency injection (used in tests)
export function createNetworkMonitor(options?: NetworkMonitorOptions): NetworkMonitor {
  return new NetworkMonitor(options);
}

// Singleton instance
const networkMonitor = createNetworkMonitor();

// Export utilities
export const networkService = {
  getStatus: () => networkMonitor.getStatus(),
  isOnline: () => networkMonitor.isOnline(),
  isOffline: () => networkMonitor.isOffline(),
  subscribe: (listener: NetworkListener) => networkMonitor.subscribe(listener),
  getLastHealthCheck: () => networkMonitor.getLastHealthCheckTime(),
  destroy: () => networkMonitor.destroy(),
};

// For React hooks
export type { NetworkStatus };
export { networkMonitor };

