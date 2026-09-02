// src/services/syncManager.ts
// Sync queue manager - handles offline data sync with exponential backoff

import { db, offlineDbHelpers, SyncQueueItem } from './offlineDb';
import { api } from './api';
import { networkService } from './network';

interface SyncConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
}

class SyncManager {
  private config: SyncConfig = {
    maxRetries: 5,
    initialDelayMs: 1000,
    maxDelayMs: 32000,
  };
  private isSyncing: boolean = false;
  private syncTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.subscribeToPowerState();
  }

  private subscribeToPowerState(): void {
    networkService.subscribe((status) => {
      if (status === 'online') {
        console.log('[SyncManager] Online detected, initiating sync');
        this.startSync();
      }
    });
  }

  public async startSync(): Promise<void> {
    if (this.isSyncing) {
      console.log('[SyncManager] Sync already in progress');
      return;
    }

    if (!networkService.isOnline()) {
      console.log('[SyncManager] Offline, deferring sync');
      return;
    }

    this.isSyncing = true;
    console.log('[SyncManager] Starting sync...');

    try {
      const items = await offlineDbHelpers.getPendingSyncItems();
      console.log(`[SyncManager] Found ${items.length} pending items`);

      for (const item of items) {
        await this.syncItem(item);
      }

      console.log('[SyncManager] Sync complete');
    } catch (error) {
      console.error('[SyncManager] Sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    try {
      if (item.syncAttempts >= this.config.maxRetries) {
        console.warn(`[SyncManager] Item ${item.id} exceeded max retries`);
        return;
      }

      const delay = this.calculateBackoffDelay(item.syncAttempts);
      await this.sleep(delay);

      let success = false;

      if (item.type === 'session') {
        success = await this.syncSession(item.data);
      } else if (item.type === 'audit') {
        success = await this.syncAudit(item.data);
      }

      if (success && item.id) {
        await offlineDbHelpers.markAsSynced(item.id);
        console.log(`[SyncManager] Item ${item.id} synced successfully`);
      } else if (item.id) {
        await db.syncQueue.update(item.id, {
          syncAttempts: (item.syncAttempts || 0) + 1,
          lastSyncAttempt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(`[SyncManager] Error syncing item:`, error);
      if (item.id) {
        await db.syncQueue.update(item.id, {
          syncAttempts: (item.syncAttempts || 0) + 1,
          lastSyncAttempt: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  private async syncSession(data: any): Promise<boolean> {
    try {
      // If created offline, POST as new; otherwise PUT to update
      if (data.isOfflineCreated) {
        // Create new session on server
        const response = await api.createSession({
          domain: data.domain,
          facts: data.facts,
        });
        return !!response.session_token;
      } else {
        // Update existing session
        const response = await api.updateSession(data.sessionToken, {
          facts: data.facts,
          current_severity: data.currentSeverity,
        });
        return !!response.session_token;
      }
    } catch (error) {
      console.error('[SyncManager] Session sync failed:', error);
      return false;
    }
  }

  private async syncAudit(data: any): Promise<boolean> {
    try {
      // POST audit to server
      const response = await api.saveAudit({
        session_token: data.sessionToken,
        domain: data.domain,
        recommended_action: data.recommendedAction,
        severity: data.severity,
        reasons: data.reasons,
        prohibited_actions: data.prohibitedActions,
        facts_snapshot: data.factsSnapshot,
        evaluation_latency_ms: data.evaluationLatencyMs,
      });
      return !!response.audit_id;
    } catch (error) {
      console.error('[SyncManager] Audit sync failed:', error);
      return false;
    }
  }

  private calculateBackoffDelay(attempts: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s
    const exponentialDelay = Math.min(
      this.config.initialDelayMs * Math.pow(2, attempts),
      this.config.maxDelayMs
    );

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return Math.floor(exponentialDelay + jitter);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getSyncStatus(): { isSyncing: boolean; queueSize: Promise<number> } {
    return {
      isSyncing: this.isSyncing,
      queueSize: offlineDbHelpers.getSyncQueueSize(),
    };
  }

  public async manualSync(): Promise<void> {
    await this.startSync();
  }

  public destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }
}

export const syncManager = new SyncManager();
