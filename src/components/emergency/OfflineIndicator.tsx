// src/components/emergency/OfflineIndicator.tsx
// Offline status indicator UI component with sync controls

import React, { useState } from 'react';
import { useSyncStatus, useOfflineStatus } from '../../context/OfflineContext';
import styles from './OfflineIndicator.module.css';

interface OfflineIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ position = 'top-right', compact = false }) => {
  const { networkStatus, isOnline, isOffline } = useOfflineStatus();
  const { syncStatus, syncQueueSize, lastSyncTime, syncError, triggerSync, clearSyncError } = useSyncStatus();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    if (isOnline) return '🟢';
    if (isOffline) return '🔴';
    return '🟡';
  };

  const getStatusLabel = () => {
    if (isOnline) return 'Online';
    if (isOffline) return 'Offline Mode';
    return 'Uncertain Connection';
  };

  const handleManualSync = async () => {
    await triggerSync();
  };

  if (compact && isOnline && syncStatus === 'idle') {
    return null; // Don't show if online and no sync needed
  }

  return (
    <div className={`${styles.container} ${styles[position]}`}>
      <div className={styles.indicator} onClick={() => setIsExpanded(!isExpanded)}>
        <span className={styles.icon}>{getStatusIcon()}</span>
        <span className={styles.label}>{getStatusLabel()}</span>
      </div>

      {isExpanded && (
        <div className={styles.panel}>
          <div className={styles.status}>
            <div className={styles.statusRow}>
              <span className={styles.label}>Network:</span>
              <span className={styles.value}>{networkStatus}</span>
            </div>
            
            {syncQueueSize > 0 && (
              <div className={styles.statusRow}>
                <span className={styles.label}>Pending Sync:</span>
                <span className={styles.value}>{syncQueueSize} items</span>
              </div>
            )}

            {syncStatus === 'syncing' && (
              <div className={styles.statusRow}>
                <span className={styles.label}>Status:</span>
                <span className={styles.value}>Syncing...</span>
              </div>
            )}

            {syncStatus === 'error' && syncError && (
              <div className={styles.statusRow}>
                <span className={styles.label}>Error:</span>
                <span className={styles.errorText}>{syncError}</span>
              </div>
            )}

            {lastSyncTime && (
              <div className={styles.statusRow}>
                <span className={styles.label}>Last Sync:</span>
                <span className={styles.value}>{new Date(lastSyncTime).toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {isOffline && (
              <button className={styles.button} disabled>
                ⏸️ Waiting for connection...
              </button>
            )}

            {isOnline && syncQueueSize > 0 && (
              <button className={styles.button} onClick={handleManualSync} disabled={syncStatus === 'syncing'}>
                {syncStatus === 'syncing' ? '⏳ Syncing...' : '🔄 Sync Now'}
              </button>
            )}

            {syncError && (
              <button className={styles.button} onClick={clearSyncError}>
                ✕ Clear Error
              </button>
            )}
          </div>

          <div className={styles.info}>
            <p className={styles.infoText}>
              {isOffline
                ? 'App is working offline. Data will sync when connection is restored.'
                : 'App is online. All data is synced with server.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;
