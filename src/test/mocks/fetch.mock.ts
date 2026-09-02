import { vi } from 'vitest';

/**
 * Mock fetch implementation for testing
 */
export class MockFetch {
  private requests: Array<{
    url: string;
    method: string;
    body?: any;
    timestamp: number;
  }> = [];
  private responses: Map<string, { status: number; body: any; headers?: Record<string, string> }> = new Map();
  private delay: number = 0;
  private isOnline: boolean = true;
  private error: Error | null = null;

  async request(input: RequestInfo, init?: RequestInit): Promise<Response> {
    if (!this.isOnline) {
      throw new Error('Network error: offline');
    }

    if (this.error) {
      throw this.error;
    }

    // Simulate network delay
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }

    const url = typeof input === 'string' ? input : input.url;
    const method = init?.method || 'GET';

    this.requests.push({
      url,
      method,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
      timestamp: Date.now(),
    });

    const response = this.responses.get(url);
    if (!response) {
      throw new Error(`No mock response configured for ${url}`);
    }

    return new Response(JSON.stringify(response.body), {
      status: response.status,
      headers: response.headers || { 'Content-Type': 'application/json' },
    });
  }

  setResponse(url: string, response: { status: number; body: any; headers?: Record<string, string> }): void {
    this.responses.set(url, response);
  }

  setError(error: Error): void {
    this.error = error;
  }

  setDelay(ms: number): void {
    this.delay = ms;
  }

  setOnline(value: boolean): void {
    this.isOnline = value;
  }

  getRequests() {
    return [...this.requests];
  }

  clear(): void {
    this.requests = [];
    this.responses.clear();
    this.error = null;
  }
}

export function createMockFetch(): MockFetch {
  return new MockFetch();
}
