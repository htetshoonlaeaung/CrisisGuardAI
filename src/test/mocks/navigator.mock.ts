import { vi } from 'vitest';

/**
 * Mock navigator.onLine for testing network status
 */
export class MockNavigator {
  private _onLine: boolean = true;
  private listeners: Array<(event: Event) => void> = [];

  get onLine(): boolean {
    return this._onLine;
  }

  setOnLine(value: boolean): void {
    this._onLine = value;
  }

  triggerOnline(): void {
    this._onLine = true;
    this.trigger('online');
  }

  triggerOffline(): void {
    this._onLine = false;
    this.trigger('offline');
  }

  private trigger(type: string): void {
    const event = new Event(type);
    this.listeners.forEach(listener => listener(event));
  }

  addEventListener(type: string, listener: EventListener): void {
    if (type === 'online' || type === 'offline') {
      this.listeners.push(listener as any);
    }
  }

  removeEventListener(type: string, listener: EventListener): void {
    const index = this.listeners.indexOf(listener as any);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  clear(): void {
    this.listeners = [];
  }
}

export function createMockNavigator(): MockNavigator {
  return new MockNavigator();
}

/**
 * Setup mock navigator for window
 */
export function setupMockNavigator(mockNav: MockNavigator): void {
  Object.defineProperty(window, 'addEventListener', {
    writable: true,
    value: (type: string, listener: EventListener) => {
      if (type === 'online' || type === 'offline') {
        mockNav.addEventListener(type, listener);
      }
    },
  });

  Object.defineProperty(window, 'removeEventListener', {
    writable: true,
    value: (type: string, listener: EventListener) => {
      if (type === 'online' || type === 'offline') {
        mockNav.removeEventListener(type, listener);
      }
    },
  });

  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: mockNav.onLine,
    configurable: true,
  });
}
