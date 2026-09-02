// src/services/offlineDataService.ts
// Data service abstraction - routes between online API and offline IndexedDB

import { networkService } from './network';
import { db, offlineDbHelpers, OfflineSession, OfflineAuditTrail, CachedShelter, SyncQueueItem } from './offlineDb';
import { api } from './api';
import { FactItem, CrisisDomain } from '../types';

class OfflineDataService {
  async saveSession(sessionToken: string, domain: CrisisDomain, facts: FactItem[], severity: string): Promise<OfflineSession> {
    const session: OfflineSession = {
      sessionToken,
      domain,
      facts,
      currentSeverity: severity as any,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOfflineCreated: !networkService.isOnline(),
    };

    const id = await offlineDbHelpers.saveSession(session);
    session.id = id;

    if (networkService.isOnline()) {
      await this.addToSyncQueue('session', session);
    }

    return session;
  }

  async getSession(sessionToken: string): Promise<OfflineSession | null> {
    const local = await offlineDbHelpers.getSession(sessionToken);
    if (local) return local;

    if (networkService.isOnline()) {
      try {
        const response = await api.getSession(sessionToken);
        const offlineSession: OfflineSession = {
          sessionToken: response.session_token,
          domain: response.domain as CrisisDomain,
          facts: [],
          currentSeverity: response.current_severity as any,
          isActive: response.is_active,
          createdAt: response.created_at,
          updatedAt: response.created_at,
          isOfflineCreated: false,
        };
        await offlineDbHelpers.saveSession(offlineSession);
        return offlineSession;
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    }

    return null;
  }

  async saveAuditTrail(sessionToken: string, domain: CrisisDomain, action: string, severity: string, reasons: string[], prohibitions: string[], facts: FactItem[], latency: number): Promise<OfflineAuditTrail> {
    const audit: OfflineAuditTrail = {
      sessionToken,
      domain,
      recommendedAction: action,
      severity: severity as any,
      reasons,
      prohibitedActions: prohibitions,
      factsSnapshot: facts,
      evaluationLatencyMs: latency,
      createdAt: new Date().toISOString(),
      isOfflineCreated: !networkService.isOnline(),
      synced: false,
    };

    const id = await offlineDbHelpers.saveAuditTrail(audit);
    audit.id = id;

    if (networkService.isOnline()) {
      await this.addToSyncQueue('audit', audit);
    }

    return audit;
  }

  async getAuditTrails(sessionToken: string): Promise<OfflineAuditTrail[]> {
    const local = await offlineDbHelpers.getAuditsBySession(sessionToken);

    if (networkService.isOnline()) {
      try {
        const remote = await api.getSessionAudit(sessionToken);
        for (const r of remote) {
          const offlineAudit: OfflineAuditTrail = {
            sessionToken: r.session_token,
            domain: r.domain as CrisisDomain,
            recommendedAction: r.recommended_action,
            severity: r.severity as any,
            reasons: r.reasons,
            prohibitedActions: r.prohibited_actions,
            factsSnapshot: r.facts_snapshot || [],
            evaluationLatencyMs: r.evaluation_latency_ms,
            createdAt: r.created_at,
            isOfflineCreated: false,
            synced: true,
          };
          await offlineDbHelpers.saveAuditTrail(offlineAudit);
        }
        return await offlineDbHelpers.getAuditsBySession(sessionToken);
      } catch (error) {
        console.error('Error fetching audits:', error);
      }
    }

    return local;
  }

  async cacheShelters(disasterType?: CrisisDomain): Promise<CachedShelter[]> {
    const existing = await offlineDbHelpers.getShelters();
    if (existing.length > 0 && offlineDbHelpers.getCacheAgeMinutes(existing[0].cachedAt) < 1440) {
      return existing;
    }

    if (networkService.isOnline()) {
      try {
        const response = await api.getNearbyShelters(0, 0, 50, disasterType);
        if (response.shelters) {
          const cached: CachedShelter[] = response.shelters.map(s => ({
            serverId: s.id,
            name: s.name,
            disasterType: s.disaster_type,
            address: s.address,
            latitude: s.latitude,
            longitude: s.longitude,
            capacity: s.capacity,
            currentOccupancy: s.current_occupancy,
            contactPhone: s.contact_phone,
            isOpen: s.is_open,
            facilities: s.facilities || [],
            cachedAt: new Date().toISOString(),
          }));
          await offlineDbHelpers.saveShelters(cached);
          return cached;
        }
      } catch (error) {
        console.error('Error fetching shelters:', error);
      }
    }

    return existing;
  }

  async getSheltersByType(type: CrisisDomain | 'general'): Promise<CachedShelter[]> {
    return await offlineDbHelpers.getSheltersByType(type);
  }

  private async addToSyncQueue(type: 'session' | 'audit', data: OfflineSession | OfflineAuditTrail): Promise<void> {
    const item: SyncQueueItem = {
      clientId: Math.random().toString(36).substring(2, 15),
      type,
      data,
      createdAt: new Date().toISOString(),
      synced: false,
      syncAttempts: 0,
    };

    await offlineDbHelpers.addToSyncQueue(item);
  }

  async getSyncQueueStats() {
    const items = await db.syncQueue.toArray();
    return {
      total: items.length,
      pending: items.filter(i => !i.synced && i.syncAttempts < 3).length,
      failed: items.filter(i => i.syncAttempts >= 3).length,
    };
  }

  async clearSyncQueue(): Promise<void> {
    await offlineDbHelpers.clearSyncQueue();
  }
}

export const offlineDataService = new OfflineDataService();
