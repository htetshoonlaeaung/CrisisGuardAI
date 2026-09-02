import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Dexie from 'dexie';
import { createTestSession, createTestAudit } from '@/test/utils';

describe('OfflineDb Operations', () => {
  let db: Dexie;

  beforeEach(async () => {
    db = new Dexie('test_crisis_db');
    db.version(1).stores({
      sessions: '++id, sessionToken',
      auditTrails: '++id, sessionId',
      shelters: '++id, name',
      syncQueue: '++id, type, createdAt',
    });
    await db.open();
  });

  afterEach(async () => {
    await db.delete();
  });

  it('should save and retrieve a session', async () => {
    const session = createTestSession();
    const id = await db.table('sessions').add(session);
    const retrieved = await db.table('sessions').get(id);

    expect(retrieved).toBeDefined();
    expect(retrieved?.sessionToken).toBe(session.sessionToken);
  });

  it('should update an existing session', async () => {
    const session = createTestSession();
    const id = await db.table('sessions').add(session);
    const updated = { ...session, id, currentSeverity: 'high' };
    await db.table('sessions').put(updated);

    const retrieved = await db.table('sessions').get(id);
    expect(retrieved?.currentSeverity).toBe('high');
  });

  it('should retrieve all sessions', async () => {
    const s1 = createTestSession({ sessionToken: 'token-1' });
    const s2 = createTestSession({ sessionToken: 'token-2' });
    await db.table('sessions').add(s1);
    await db.table('sessions').add(s2);

    const all = await db.table('sessions').toArray();
    expect(all.length).toBe(2);
  });

  it('should add item to sync queue', async () => {
    const queueItem = {
      type: 'session',
      sessionId: 1,
      action: 'create',
      payload: { test: 'data' },
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    const id = await db.table('syncQueue').add(queueItem);
    const retrieved = await db.table('syncQueue').get(id);

    expect(retrieved?.type).toBe('session');
    expect(retrieved?.retryCount).toBe(0);
  });

  it('should handle concurrent operations', async () => {
    const s1 = createTestSession({ sessionToken: 'token-1' });
    const s2 = createTestSession({ sessionToken: 'token-2' });

    const [id1, id2] = await Promise.all([
      db.table('sessions').add(s1),
      db.table('sessions').add(s2),
    ]);

    expect(id1).not.toBe(id2);
  });
});
