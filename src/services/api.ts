import { EvaluateCrisisRequest, EvaluateCrisisResponse, EmergencySession, TriageAuditTrail, EmergencyShelter, IncidentItem, RescueTeam, DispatchResponse } from '../types';

export const api = {
  async evaluateCrisis(payload: EvaluateCrisisRequest): Promise<EvaluateCrisisResponse> {
    const res = await fetch('/api/v1/crisis/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Crisis evaluation failed: ${res.statusText}`);
    }
    return res.json();
  },

  async getSession(token: string): Promise<EmergencySession> {
    const res = await fetch(`/api/v1/sessions/${token}`);
    if (!res.ok) throw new Error(`Failed to fetch session: ${res.statusText}`);
    return res.json();
  },

  async getSessionAudit(token: string): Promise<TriageAuditTrail[]> {
    const res = await fetch(`/api/v1/sessions/${token}/audit`);
    if (!res.ok) throw new Error(`Failed to fetch audit: ${res.statusText}`);
    return res.json();
  },

  async getAllAudits(): Promise<TriageAuditTrail[]> {
    const res = await fetch('/api/v1/audit/all');
    if (!res.ok) throw new Error(`Failed to fetch all audits: ${res.statusText}`);
    return res.json();
  },

  async getNearbyShelters(lat: number, lon: number, radiusKm: number = 50, disasterType?: string): Promise<{ total_found: number; shelters: EmergencyShelter[] }> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      radius_km: radiusKm.toString(),
      ...(disasterType ? { disaster_type: disasterType } : {})
    });
    const res = await fetch(`/api/v1/shelters/nearby?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch shelters: ${res.statusText}`);
    return res.json();
  },

  async solveDispatch(incidents: IncidentItem[], teams: RescueTeam[]): Promise<DispatchResponse> {
    const res = await fetch('/api/v1/scheduler/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidents, teams })
    });
    if (!res.ok) throw new Error(`Failed to solve dispatch: ${res.statusText}`);
    return res.json();
  },

  async createSession(payload: { domain: string; facts?: any[] }): Promise<{ session_token: string; domain: string; created_at: string }> {
    const res = await fetch('/api/v1/sessions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: payload.domain })
    });
    if (!res.ok) throw new Error(`Failed to create session: ${res.statusText}`);
    return res.json();
  },

  async updateSession(token: string, payload: { facts?: any[]; current_severity?: string }): Promise<{ session_token: string }> {
    const res = await fetch(`/api/v1/sessions/${token}/facts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload.facts || [])
    });
    if (!res.ok) throw new Error(`Failed to update session facts: ${res.statusText}`);
    return res.json();
  },

  async saveAudit(payload: any): Promise<{ audit_id?: number; success: boolean }> {
    const res = await fetch('/api/v1/sync/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{
          client_id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          type: 'audit',
          data: payload
        }]
      })
    });
    if (!res.ok) return { success: false };
    const data = await res.json();
    return { success: true, audit_id: data.results?.[0]?.server_id };
  },

  async syncBatch(items: any[]): Promise<any> {
    const res = await fetch('/api/v1/sync/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    if (!res.ok) throw new Error(`Sync batch failed: ${res.statusText}`);
    return res.json();
  }
};

