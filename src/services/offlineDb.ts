// src/services/offlineDb.ts
// Dexie/IndexedDB schema for offline crisis data persistence
// Object stores: sessions, auditTrails, shelters, syncQueue

import Dexie, { Table } from 'dexie';
import { TriageSeverity, CrisisDomain, FactItem, EvaluateCrisisResponse, TriageAuditTrail, EmergencyShelter } from '../types';

// Offline-specific types
export interface OfflineSession {
  id?: number;
  sessionToken: string;
  domain: CrisisDomain;
  facts: FactItem[];
  currentSeverity: TriageSeverity;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isOfflineCreated?: boolean;
}

export interface OfflineAuditTrail {
  id?: number;
  sessionToken: string;
  domain: CrisisDomain;
  recommendedAction: string;
  severity: TriageSeverity;
  reasons: string[];
  prohibitedActions: string[];
  factsSnapshot: FactItem[];
  evaluationLatencyMs: number;
  createdAt: string;
  isOfflineCreated?: boolean;
  synced?: boolean;
}

export interface CachedShelter {
  id?: number;
  serverId: number;
  name: string;
  disasterType: CrisisDomain | 'general';
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  currentOccupancy: number;
  contactPhone: string;
  isOpen: boolean;
  facilities: string[];
  cachedAt: string;
}

export interface SyncQueueItem {
  id?: number;
  clientId: string; // Unique ID generated on client
  type: 'session' | 'audit';
  data: OfflineSession | OfflineAuditTrail;
  createdAt: string;
  synced: boolean;
  syncAttempts: number;
  lastSyncAttempt?: string;
  error?: string;
}

// Dexie Database Class
export class CrisisGuardDB extends Dexie {
  sessions!: Table<OfflineSession>;
  auditTrails!: Table<OfflineAuditTrail>;
  shelters!: Table<CachedShelter>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('CrisisGuardOfflineDB');
    this.version(1).stores({
      sessions: '++id, sessionToken, createdAt',
      auditTrails: '++id, sessionToken, createdAt',
      shelters: '++id, serverId, cachedAt',
      syncQueue: '++id, clientId, synced, createdAt'
    });
  }
}

// Export singleton instance
export const db = new CrisisGuardDB();

// Helper Functions
export const offlineDbHelpers = {
  // Session helpers
  async saveSession(session: OfflineSession): Promise<number> {
    return await db.sessions.put(session);
  },

  async getSession(sessionToken: string): Promise<OfflineSession | undefined> {
    return await db.sessions.where('sessionToken').equals(sessionToken).first();
  },

  async getAllSessions(): Promise<OfflineSession[]> {
    return await db.sessions.toArray();
  },

  async deleteSession(id: number): Promise<void> {
    await db.sessions.delete(id);
  },

  // Audit helpers
  async saveAuditTrail(audit: OfflineAuditTrail): Promise<number> {
    return await db.auditTrails.put(audit);
  },

  async getAuditsBySession(sessionToken: string): Promise<OfflineAuditTrail[]> {
    return await db.auditTrails.where('sessionToken').equals(sessionToken).reverse().toArray();
  },

  async getAllAudits(): Promise<OfflineAuditTrail[]> {
    return await db.auditTrails.reverse().toArray();
  },

  // Shelter helpers
  async saveShelters(shelters: CachedShelter[]): Promise<void> {
    await db.shelters.clear();
    await db.shelters.bulkAdd(shelters);
  },

  async getShelters(): Promise<CachedShelter[]> {
    return await db.shelters.toArray();
  },

  async getSheltersByType(type: CrisisDomain | 'general'): Promise<CachedShelter[]> {
    return await db.shelters.where('disasterType').equals(type).toArray();
  },

  // Sync queue helpers
  async addToSyncQueue(item: SyncQueueItem): Promise<number> {
    return await db.syncQueue.put(item);
  },

  async getPendingSyncItems(): Promise<SyncQueueItem[]> {
    return await db.syncQueue.where('synced').equals(false).toArray();
  },

  async markAsSynced(id: number): Promise<void> {
    await db.syncQueue.update(id, { synced: true });
  },

  async getSyncQueueSize(): Promise<number> {
    return await db.syncQueue.count();
  },

  async clearSyncQueue(): Promise<void> {
    await db.syncQueue.clear();
  },

  // Utility: Get cache age in minutes
  getCacheAgeMinutes(cachedAt: string): number {
    const cachedTime = new Date(cachedAt).getTime();
    const nowTime = new Date().getTime();
    return Math.floor((nowTime - cachedTime) / (1000 * 60));
  },

  // Utility: Check if cache is stale (>24 hours)
  isCacheStale(cachedAt: string): boolean {
    return this.getCacheAgeMinutes(cachedAt) > 1440;
  },

  // Clear all offline data
  async clearAllData(): Promise<void> {
    await db.sessions.clear();
    await db.auditTrails.clear();
    await db.shelters.clear();
    await db.syncQueue.clear();
  }
};

// Export types
export type { OfflineSession, OfflineAuditTrail, CachedShelter, SyncQueueItem };
