// src/context/OfflineContext.tsx
// React context managing offline/online state and sync status

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { networkService, NetworkStatus } from '../services/network';
import { db } from '../services/offlineDb';

export type SyncStatus = 'idle' | 'syncing' | 'error';

interface OfflineContextType {
  networkStatus: NetworkStatus;
  syncStatus: SyncStatus;
  isOnline: boolean;
  isOffline: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
  syncQueueSize: number;
  triggerSync: () => Promise<void>;
  clearSyncError: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncQueueSize, setSyncQueueSize] = useState(0);

  // Initialize IndexedDB and network listeners on mount
  useEffect(() => {
    const initializeOfflineMode = async () => {
      try {
        // Initialize IndexedDB
        await db.open();
        console.log('[OfflineMode] IndexedDB initialized');

        // Update queue size
        const size = await db.syncQueue.count();
        setSyncQueueSize(size);

        // Check if we have stale cache data
        const shelters = await db.shelters.toArray();
        if (shelters.length > 0) {
          const cacheAge = Math.floor(
            (Date.now() - new Date(shelters[0].cachedAt).getTime()) / (1000 * 60)
          );
          console.log(`[OfflineMode] Cached shelters age: ${cacheAge} minutes`);
        }
      } catch (error) {
        console.error('[OfflineMode] Failed to initialize IndexedDB:', error);
      }
    };

    initializeOfflineMode();
  }, []);

  // Subscribe to network status changes
  useEffect(() => {
    const unsubscribe = networkService.subscribe((status: NetworkStatus) => {
      setNetworkStatus(status);
      setSyncError(null);

      // Auto-trigger sync when coming online
      if (status === 'online') {
        triggerSync();
      }
    });

    // Set initial status
    setNetworkStatus(networkService.getStatus());

    return () => unsubscribe();
  }, []);

  // Manual sync trigger
  const triggerSync = async () => {
    if (syncStatus === 'syncing') return;
    
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const pendingItems = await db.syncQueue.filter(item => !item.synced).toArray();
      
      if (pendingItems.length === 0) {
        setSyncStatus('idle');
        setLastSyncTime(new Date().toISOString());
        return;
      }

      // Simulate sync process (actual implementation in syncManager.ts)
      // For now, just mark as attempted
      for (const item of pendingItems) {
        const attempts = (item.syncAttempts || 0) + 1;
        await db.syncQueue.update(item.id!, {
          syncAttempts: attempts,
          lastSyncAttempt: new Date().toISOString()
        });
      }

      setLastSyncTime(new Date().toISOString());
      setSyncStatus('idle');
      setSyncQueueSize(await db.syncQueue.count());
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Sync failed';
      setSyncError(errorMsg);
      setSyncStatus('error');
      console.error('[OfflineMode] Sync error:', error);
    }
  };

  const clearSyncError = () => {
    setSyncError(null);
  };

  const value: OfflineContextType = {
    networkStatus,
    syncStatus,
    isOnline: networkStatus === 'online' && navigator.onLine,
    isOffline: !navigator.onLine,
    lastSyncTime,
    syncError,
    syncQueueSize,
    triggerSync,
    clearSyncError,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

// Hooks for consuming context
export const useOfflineStatus = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineStatus must be used within OfflineProvider');
  }
  return {
    networkStatus: context.networkStatus,
    isOnline: context.isOnline,
    isOffline: context.isOffline,
  };
};

export const useSyncStatus = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useSyncStatus must be used within OfflineProvider');
  }
  return {
    syncStatus: context.syncStatus,
    lastSyncTime: context.lastSyncTime,
    syncError: context.syncError,
    syncQueueSize: context.syncQueueSize,
    triggerSync: context.triggerSync,
    clearSyncError: context.clearSyncError,
  };
};

export default OfflineProvider;
