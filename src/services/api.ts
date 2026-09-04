import {
  AuthResponse,
  DispatchResponse,
  EmergencySession,
  EmergencyShelter,
  EvaluateCrisisRequest,
  EvaluateCrisisResponse,
  IncidentItem,
  RescueTeam,
  TriageAuditTrail,
  UserProfile,
} from '../types';

function getCookie(name: string): string {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : '';
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) {
    const csrf = getCookie('cg_csrf');
    if (csrf) headers.set('X-CSRF-Token', csrf);
  }

  const res = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.detail || res.statusText || 'Request failed');
  }
  return data as T;
}

export const api = {
  async register(payload: { full_name: string; email: string; password: string; confirm_password: string }): Promise<AuthResponse> {
    return request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    return request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async logout(): Promise<{ success: boolean }> {
    return request<{ success: boolean }>('/api/v1/auth/logout', { method: 'POST' });
  },

  async me(): Promise<AuthResponse> {
    return request<AuthResponse>('/api/v1/auth/me');
  },

  async ensureGuestSession(): Promise<{ guest: boolean; expires_at: string; message: string }> {
    return request<{ guest: boolean; expires_at: string; message: string }>('/api/v1/guest/session');
  },

  async updateProfile(payload: { full_name: string }): Promise<{ user: UserProfile }> {
    return request<{ user: UserProfile }>('/api/v1/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async changePassword(payload: { current_password: string; new_password: string; confirm_new_password: string }): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async forgotPassword(email: string): Promise<{ message: string; delivery_configured: boolean }> {
    return request<{ message: string; delivery_configured: boolean }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(payload: { token: string; password: string; confirm_password: string }): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async evaluateCrisis(payload: EvaluateCrisisRequest): Promise<EvaluateCrisisResponse> {
    if (!getCookie('cg_csrf')) await this.ensureGuestSession();
    return request<EvaluateCrisisResponse>('/api/v1/crisis/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getSession(token: string): Promise<EmergencySession> {
    return request<EmergencySession>(`/api/v1/sessions/${token}`);
  },

  async getSessionAudit(token: string): Promise<TriageAuditTrail[]> {
    return request<TriageAuditTrail[]>(`/api/v1/sessions/${token}/audit`);
  },

  async getAllAudits(): Promise<TriageAuditTrail[]> {
    return request<TriageAuditTrail[]>('/api/v1/audit/all');
  },

  async getHistory(params: { domain?: string; limit?: number; offset?: number } = {}): Promise<{ items: EmergencySession[]; total: number }> {
    const search = new URLSearchParams();
    if (params.domain && params.domain !== 'all') search.set('domain', params.domain);
    if (params.limit) search.set('limit', String(params.limit));
    if (params.offset) search.set('offset', String(params.offset));
    const query = search.toString();
    return request<{ items: EmergencySession[]; total: number }>(`/api/v1/history${query ? `?${query}` : ''}`);
  },

  async getHistoryDetail(token: string): Promise<EmergencySession> {
    return request<EmergencySession>(`/api/v1/history/${token}`);
  },

  async getNearbyShelters(lat: number, lon: number, radiusKm: number = 50, disasterType?: string): Promise<{ total_found: number; shelters: EmergencyShelter[] }> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      radius_km: radiusKm.toString(),
      ...(disasterType ? { disaster_type: disasterType } : {}),
    });
    return request<{ total_found: number; shelters: EmergencyShelter[] }>(`/api/v1/shelters/nearby?${params.toString()}`);
  },

  async solveDispatch(incidents: IncidentItem[], teams: RescueTeam[]): Promise<DispatchResponse> {
    if (!getCookie('cg_csrf')) await this.ensureGuestSession();
    return request<DispatchResponse>('/api/v1/scheduler/dispatch', {
      method: 'POST',
      body: JSON.stringify({ incidents, teams }),
    });
  },

  async createSession(payload: { domain: string; facts?: any[] }): Promise<EmergencySession> {
    if (!getCookie('cg_csrf')) await this.ensureGuestSession();
    return request<EmergencySession>('/api/v1/sessions/create', {
      method: 'POST',
      body: JSON.stringify({ domain: payload.domain }),
    });
  },

  async updateSession(token: string, payload: { facts?: any[]; current_severity?: string }): Promise<{ session_token: string }> {
    if (!getCookie('cg_csrf')) await this.ensureGuestSession();
    return request<{ session_token: string }>(`/api/v1/sessions/${token}/facts`, {
      method: 'POST',
      body: JSON.stringify({ facts: payload.facts || [] }),
    });
  },

  async saveAudit(payload: any): Promise<{ audit_id?: number; success: boolean }> {
    try {
      await request('/api/v1/sync/batch', {
        method: 'POST',
        body: JSON.stringify({
          items: [{
            client_id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            type: 'audit',
            data: payload,
          }],
        }),
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  async syncBatch(items: any[]): Promise<any> {
    return request('/api/v1/sync/batch', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },
};
