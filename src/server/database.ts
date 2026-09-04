import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  CrisisDomain,
  EmergencyShelter,
  EmergencySession,
  FactItem,
  TriageAuditTrail,
  TriageSeverity,
} from '../types';

export interface AppUser {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  id: string;
  user_id: string;
  csrf_token: string;
  created_at: string;
  expires_at: string;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface GuestSession {
  id: string;
  csrf_token: string;
  created_at: string;
  expires_at: string;
}

interface StoredData {
  users: AppUser[];
  auth_sessions: AuthSession[];
  guest_sessions: GuestSession[];
  emergency_sessions: EmergencySession[];
  audit_trails: TriageAuditTrail[];
  shelters: EmergencyShelter[];
  reset_tokens: PasswordResetToken[];
  audit_counter: number;
}

type ConsultationStatus = 'in_progress' | 'completed';

const DATA_FILE = process.env.CRISISGUARD_DB_FILE || path.resolve(process.cwd(), 'crisisguard.local-db.json');
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const GUEST_SESSION_TTL_MS = 1000 * 60 * 60 * 6;

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function safeJsonEqual(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export class PersistentDatabase {
  private data: StoredData;

  constructor() {
    this.data = this.load();
    if (this.data.shelters.length === 0) {
      this.data.shelters = this.defaultShelters();
      this.save();
    }
  }

  private load(): StoredData {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as Partial<StoredData>;
        return {
          users: parsed.users || [],
          auth_sessions: parsed.auth_sessions || [],
          guest_sessions: parsed.guest_sessions || [],
          emergency_sessions: parsed.emergency_sessions || [],
          audit_trails: parsed.audit_trails || [],
          shelters: parsed.shelters || [],
          reset_tokens: parsed.reset_tokens || [],
          audit_counter: parsed.audit_counter || 1,
        };
      } catch (error) {
        console.error('[Database] Failed to parse local database file:', error);
      }
    }

    return {
      users: [],
      auth_sessions: [],
      guest_sessions: [],
      emergency_sessions: [],
      audit_trails: [],
      shelters: [],
      reset_tokens: [],
      audit_counter: 1,
    };
  }

  private save() {
    this.cleanupExpiredGuestData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
  }

  private cleanupExpiredGuestData() {
    const now = Date.now();
    const activeGuestIds = new Set(
      this.data.guest_sessions
        .filter((session) => new Date(session.expires_at).getTime() > now)
        .map((session) => session.id)
    );
    this.data.guest_sessions = this.data.guest_sessions.filter((session) => activeGuestIds.has(session.id));
    this.data.emergency_sessions = this.data.emergency_sessions.filter((session) => {
      return !session.guest_session_id || activeGuestIds.has(session.guest_session_id);
    });
    this.data.audit_trails = this.data.audit_trails.filter((audit) => {
      return !audit.guest_session_id || activeGuestIds.has(audit.guest_session_id);
    });
  }

  private defaultShelters(): EmergencyShelter[] {
    return [
      {
        id: 1,
        name: 'Yangon General Hospital (YGH) Trauma & Emergency Hub',
        disaster_type: 'medical',
        address: 'Bogyoke Aung San Road, Latha Township, Downtown Yangon',
        latitude: 16.7788,
        longitude: 96.1534,
        capacity: 1200,
        current_occupancy: 340,
        contact_phone: '+95-1-256112',
        is_open: true,
        facilities: ['Level 1 Trauma Care', 'ICU & Resuscitation', 'Blood Bank Reserves', '24/7 Ambulance Bay', 'Emergency Oxygen'],
      },
      {
        id: 2,
        name: 'North Okkalapa General Hospital (NOGH) Emergency Post',
        disaster_type: 'medical',
        address: 'Thudamar Road, North Okkalapa Township, Yangon',
        latitude: 16.897,
        longitude: 96.1668,
        capacity: 800,
        current_occupancy: 210,
        contact_phone: '+95-1-9699851',
        is_open: true,
        facilities: ['Emergency Trauma Wing', 'Burn Care Bay', 'Oxygen Refill Station', 'Rapid Patient Triage'],
      },
      {
        id: 3,
        name: 'Thuwunna National Stadium Disaster & Cyclone Sanctuary',
        disaster_type: 'natural_disaster',
        address: 'Waizayandar Road, Thingangyun Township, Eastern Yangon',
        latitude: 16.8167,
        longitude: 96.1833,
        capacity: 3500,
        current_occupancy: 420,
        contact_phone: '+95-1-578210',
        is_open: true,
        facilities: ['Mass Evacuation Arena', 'Helipad Landing Staging', 'Clean Water Purification', 'Emergency Satellite Comms', 'Backup Diesel Power'],
      },
      {
        id: 4,
        name: 'Hlaingthaya Flood Relief & Rapid Evacuation Sanctuary',
        disaster_type: 'natural_disaster',
        address: 'Yangon-Pathein Highway, Hlaingthaya Township, Western Yangon',
        latitude: 16.866,
        longitude: 96.068,
        capacity: 1500,
        current_occupancy: 290,
        contact_phone: '+95-1-685210',
        is_open: true,
        facilities: ['Elevated Flood High-Ground', 'Rescue Boat Staging Area', 'Emergency Food Rations', 'Field Clinic Post'],
      },
      {
        id: 5,
        name: 'Yangon Central Fire Services HQ & Hazmat Assembly Zone',
        disaster_type: 'fire_hazard',
        address: 'Sule Pagoda Road, Kyauktada Township, Downtown Yangon',
        latitude: 16.7744,
        longitude: 96.1585,
        capacity: 500,
        current_occupancy: 95,
        contact_phone: '+95-1-252011',
        is_open: true,
        facilities: ['SCBA Refill Station', 'Chemical Decontamination Showers', 'Smoke Inhalation Triage', 'Heavy Extrication Fleet'],
      },
      {
        id: 6,
        name: 'Yangon-Mandalay Expressway (Zero Mile) Crash Relief Point',
        disaster_type: 'road_accident',
        address: 'Zero Mile Junction, Mingaladon Township, Northern Yangon',
        latitude: 16.945,
        longitude: 96.175,
        capacity: 400,
        current_occupancy: 60,
        contact_phone: '+95-1-635199',
        is_open: true,
        facilities: ['Expressway Fast-Track Trauma Bay', 'Heavy Vehicle Towing Staging', 'Spinal Immobilization Post', 'Ambulance Fast-Lane'],
      },
    ];
  }

  public createUser(fullName: string, email: string, passwordHash: string): AppUser | null {
    const cleanEmail = normalizeEmail(email);
    if (this.data.users.some((user) => user.email === cleanEmail)) return null;

    const timestamp = nowIso();
    const user: AppUser = {
      id: crypto.randomUUID(),
      full_name: fullName.trim(),
      email: cleanEmail,
      password_hash: passwordHash,
      created_at: timestamp,
      updated_at: timestamp,
    };
    this.data.users.push(user);
    this.save();
    return user;
  }

  public findUserByEmail(email: string): AppUser | undefined {
    return this.data.users.find((user) => user.email === normalizeEmail(email));
  }

  public getUser(userId: string): AppUser | undefined {
    return this.data.users.find((user) => user.id === userId);
  }

  public updateUserName(userId: string, fullName: string): AppUser | undefined {
    const user = this.getUser(userId);
    if (!user) return undefined;
    user.full_name = fullName.trim();
    user.updated_at = nowIso();
    this.save();
    return user;
  }

  public updatePasswordHash(userId: string, passwordHash: string): void {
    const user = this.getUser(userId);
    if (!user) return;
    user.password_hash = passwordHash;
    user.updated_at = nowIso();
    this.invalidateUserSessions(userId);
    this.save();
  }

  public createAuthSession(userId: string): AuthSession {
    const timestamp = nowIso();
    const session: AuthSession = {
      id: crypto.randomUUID(),
      user_id: userId,
      csrf_token: crypto.randomBytes(32).toString('hex'),
      created_at: timestamp,
      expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    };
    this.data.auth_sessions.push(session);
    this.save();
    return session;
  }

  public createGuestSession(): GuestSession {
    const timestamp = nowIso();
    const session: GuestSession = {
      id: crypto.randomUUID(),
      csrf_token: crypto.randomBytes(32).toString('hex'),
      created_at: timestamp,
      expires_at: new Date(Date.now() + GUEST_SESSION_TTL_MS).toISOString(),
    };
    this.data.guest_sessions.push(session);
    this.save();
    return session;
  }

  public getGuestSession(sessionId?: string): GuestSession | undefined {
    if (!sessionId) return undefined;
    const session = this.data.guest_sessions.find((item) => item.id === sessionId);
    if (!session) return undefined;
    if (new Date(session.expires_at).getTime() <= Date.now()) {
      this.data.guest_sessions = this.data.guest_sessions.filter((item) => item.id !== sessionId);
      this.save();
      return undefined;
    }
    return session;
  }

  public getAuthSession(sessionId?: string): AuthSession | undefined {
    if (!sessionId) return undefined;
    const session = this.data.auth_sessions.find((item) => item.id === sessionId);
    if (!session) return undefined;
    if (new Date(session.expires_at).getTime() <= Date.now()) {
      this.deleteAuthSession(sessionId);
      return undefined;
    }
    return session;
  }

  public deleteAuthSession(sessionId?: string): void {
    if (!sessionId) return;
    this.data.auth_sessions = this.data.auth_sessions.filter((session) => session.id !== sessionId);
    this.save();
  }

  public invalidateUserSessions(userId: string): void {
    this.data.auth_sessions = this.data.auth_sessions.filter((session) => session.user_id !== userId);
  }

  public createPasswordResetToken(userId: string, tokenHash: string, expiresAt: string): PasswordResetToken {
    const resetToken: PasswordResetToken = {
      id: crypto.randomUUID(),
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_at: nowIso(),
    };
    this.data.reset_tokens.push(resetToken);
    this.save();
    return resetToken;
  }

  public consumePasswordResetToken(tokenHash: string): PasswordResetToken | undefined {
    const resetToken = this.data.reset_tokens.find((item) => item.token_hash === tokenHash);
    if (!resetToken || resetToken.used_at || new Date(resetToken.expires_at).getTime() <= Date.now()) {
      return undefined;
    }
    resetToken.used_at = nowIso();
    this.save();
    return resetToken;
  }

  public getOrCreateSession(token: string, domain: CrisisDomain, userId?: string, guestSessionId?: string): EmergencySession {
    let session = this.data.emergency_sessions.find((item) => item.session_token === token);
    if (!session) {
      const timestamp = nowIso();
      session = {
        id: crypto.randomUUID(),
        session_token: token,
        domain,
        current_severity: 'moderate',
        is_active: true,
        facts: [],
        created_at: timestamp,
        updated_at: timestamp,
        user_id: userId,
        guest_session_id: guestSessionId,
        status: 'in_progress',
      } as EmergencySession;
      this.data.emergency_sessions.push(session);
    }
    if (userId && !session.user_id) {
      session.user_id = userId;
    }
    if (guestSessionId && !session.user_id && !session.guest_session_id) {
      session.guest_session_id = guestSessionId;
    }
    this.save();
    return session;
  }

  public getSession(token: string, userId?: string, guestSessionId?: string): EmergencySession | undefined {
    const session = this.data.emergency_sessions.find((item) => item.session_token === token);
    if (!session) return undefined;
    if (userId) return session.user_id === userId ? session : undefined;
    if (guestSessionId) return !session.user_id && session.guest_session_id === guestSessionId ? session : undefined;
    if (session.user_id || session.guest_session_id) return undefined;
    return session;
  }

  public updateSessionFacts(
    token: string,
    domain: CrisisDomain,
    newFacts: FactItem[],
    severity: TriageSeverity,
    userId?: string,
    guestSessionId?: string,
    status: ConsultationStatus = 'completed'
  ): EmergencySession {
    const session = this.getOrCreateSession(token, domain, userId, guestSessionId);
    session.domain = domain;
    session.current_severity = severity;
    session.updated_at = nowIso();
    session.status = status;

    const factMap = new Map<string, string | boolean | number>();
    for (const fact of session.facts || []) {
      factMap.set(fact.key, fact.value);
    }
    for (const fact of newFacts) {
      factMap.set(fact.key, fact.value);
    }

    session.facts = Array.from(factMap.entries()).map(([key, value]) => ({ key, value }));
    this.save();
    return session;
  }

  public recordAudit(
    sessionToken: string,
    domain: CrisisDomain,
    recommendedAction: string,
    severity: TriageSeverity,
    reasons: string[],
    prohibitedActions: string[],
    factsSnapshot: FactItem[],
    evaluationLatencyMs: number,
    userId?: string,
    guestSessionId?: string,
    stepByStepInstructions: string[] = []
  ): TriageAuditTrail {
    const lastAudit = this.data.audit_trails.find((audit) => audit.session_token === sessionToken);
    if (
      lastAudit &&
      lastAudit.recommended_action === recommendedAction &&
      lastAudit.severity === severity &&
      safeJsonEqual(lastAudit.facts_snapshot, factsSnapshot)
    ) {
      return lastAudit;
    }

    const audit: TriageAuditTrail = {
      id: this.data.audit_counter++,
      session_token: sessionToken,
      domain,
      recommended_action: recommendedAction,
      severity,
      reasons,
      prohibited_actions: prohibitedActions,
      facts_snapshot: [...factsSnapshot],
      step_by_step_instructions: stepByStepInstructions,
      evaluation_latency_ms: evaluationLatencyMs,
      created_at: nowIso(),
      user_id: userId,
      guest_session_id: guestSessionId,
    } as TriageAuditTrail;
    this.data.audit_trails.unshift(audit);
    this.save();
    return audit;
  }

  public getAuditHistory(sessionToken?: string, userId?: string, guestSessionId?: string): TriageAuditTrail[] {
    return this.data.audit_trails.filter((audit) => {
      if (userId && audit.user_id !== userId) return false;
      if (guestSessionId && (audit.user_id || audit.guest_session_id !== guestSessionId)) return false;
      if (!userId && !guestSessionId && (audit.user_id || audit.guest_session_id)) return false;
      if (sessionToken && audit.session_token !== sessionToken) return false;
      return true;
    });
  }

  public getUserConsultations(userId: string, domain?: string, limit = 20, offset = 0): { items: EmergencySession[]; total: number } {
    const filtered = this.data.emergency_sessions
      .filter((session) => session.user_id === userId)
      .filter((session) => !domain || domain === 'all' || session.domain === domain)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
    };
  }

  public getUserConsultationDetail(userId: string, token: string) {
    const session = this.getSession(token, userId);
    if (!session) return undefined;
    return {
      ...session,
      audit_trail: this.getAuditHistory(token, userId),
    };
  }

  public getGuestConsultationDetail(guestSessionId: string, token: string) {
    const session = this.getSession(token, undefined, guestSessionId);
    if (!session) return undefined;
    return {
      ...session,
      audit_trail: this.getAuditHistory(token, undefined, guestSessionId),
    };
  }

  public clearPrivateStateForUser(userId: string): void {
    this.invalidateUserSessions(userId);
    this.save();
  }

  public getNearbyShelters(userLat: number, userLon: number, radiusKm = 50, disasterType?: string): EmergencyShelter[] {
    return this.data.shelters
      .filter((shelter) => {
        if (!shelter.is_open) return false;
        if (disasterType && disasterType !== 'all' && disasterType !== 'general') {
          if (shelter.disaster_type !== 'general' && shelter.disaster_type !== disasterType) return false;
        }
        return true;
      })
      .map((shelter) => {
        const distance = this.calculateHaversineDistance(userLat, userLon, shelter.latitude, shelter.longitude);
        return { ...shelter, distance_km: Math.round(distance * 10) / 10 };
      })
      .filter((shelter) => shelter.distance_km! <= radiusKm)
      .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const radiusKm = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radiusKm * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const db = new PersistentDatabase();
