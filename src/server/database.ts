import { EmergencySession, FactItem, TriageAuditTrail, EmergencyShelter, CrisisDomain, TriageSeverity } from '../types';

export class InMemoryDatabase {
  private sessions = new Map<string, EmergencySession>();
  private auditTrails: TriageAuditTrail[] = [];
  private shelters: EmergencyShelter[] = [];
  private auditCounter = 1;

  constructor() {
    this.seedShelters();
  }

  private seedShelters() {
    this.shelters = [
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
        facilities: ['Level 1 Trauma Care', 'ICU & Resuscitation', 'Blood Bank Reserves', '24/7 Ambulance Bay', 'Emergency Oxygen']
      },
      {
        id: 2,
        name: 'North Okkalapa General Hospital (NOGH) Emergency Post',
        disaster_type: 'medical',
        address: 'Thudamar Road, North Okkalapa Township, Yangon',
        latitude: 16.8970,
        longitude: 96.1668,
        capacity: 800,
        current_occupancy: 210,
        contact_phone: '+95-1-9699851',
        is_open: true,
        facilities: ['Emergency Trauma Wing', 'Burn Care Bay', 'Oxygen Refill Station', 'Rapid Patient Triage']
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
        facilities: ['Mass Evacuation Arena', 'Helipad Landing Staging', 'Clean Water Purification', 'Emergency Satellite Comms', 'Backup Diesel Power']
      },
      {
        id: 4,
        name: 'Hlaingthaya Flood Relief & Rapid Evacuation Sanctuary',
        disaster_type: 'natural_disaster',
        address: 'Yangon-Pathein Highway, Hlaingthaya Township, Western Yangon',
        latitude: 16.8660,
        longitude: 96.0680,
        capacity: 1500,
        current_occupancy: 290,
        contact_phone: '+95-1-685210',
        is_open: true,
        facilities: ['Elevated Flood High-Ground', 'Rescue Boat Staging Area', 'Emergency Food Rations', 'Field Clinic Post']
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
        facilities: ['SCBA Refill Station', 'Chemical Decontamination Showers', 'Smoke Inhalation Triage', 'Heavy Extrication Fleet']
      },
      {
        id: 6,
        name: 'Yangon-Mandalay Expressway (Zero Mile) Crash Relief Point',
        disaster_type: 'road_accident',
        address: 'Zero Mile Junction, Mingaladon Township, Northern Yangon',
        latitude: 16.9450,
        longitude: 96.1750,
        capacity: 400,
        current_occupancy: 60,
        contact_phone: '+95-1-635199',
        is_open: true,
        facilities: ['Expressway Fast-Track Trauma Bay', 'Heavy Vehicle Towing Staging', 'Spinal Immobilization Post', 'Ambulance Fast-Lane']
      }
    ];
  }

  // Session Management
  public getOrCreateSession(token: string, domain: CrisisDomain): EmergencySession {
    let session = this.sessions.get(token);
    if (!session) {
      const now = new Date().toISOString();
      session = {
        id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        session_token: token,
        domain: domain,
        current_severity: 'moderate',
        is_active: true,
        facts: [],
        created_at: now,
        updated_at: now
      };
      this.sessions.set(token, session);
    }
    return session;
  }

  public getSession(token: string): EmergencySession | undefined {
    return this.sessions.get(token);
  }

  public updateSessionFacts(token: string, domain: CrisisDomain, newFacts: FactItem[], severity: TriageSeverity): EmergencySession {
    const session = this.getOrCreateSession(token, domain);
    session.domain = domain;
    session.current_severity = severity;
    session.updated_at = new Date().toISOString();

    // Merge facts (replace existing keys or append)
    const factMap = new Map<string, any>();
    for (const f of session.facts) {
      factMap.set(f.key, f.value);
    }
    for (const f of newFacts) {
      factMap.set(f.key, f.value);
    }

    session.facts = Array.from(factMap.entries()).map(([key, value]) => ({ key, value }));
    this.sessions.set(token, session);
    return session;
  }

  // Audit Trails
  public recordAudit(
    sessionToken: string,
    domain: CrisisDomain,
    recommendedAction: string,
    severity: TriageSeverity,
    reasons: string[],
    prohibitedActions: string[],
    factsSnapshot: FactItem[],
    evaluationLatencyMs: number
  ): TriageAuditTrail {
    const audit: TriageAuditTrail = {
      id: this.auditCounter++,
      session_token: sessionToken,
      domain,
      recommended_action: recommendedAction,
      severity,
      reasons,
      prohibited_actions: prohibitedActions,
      facts_snapshot: [...factsSnapshot],
      evaluation_latency_ms: evaluationLatencyMs,
      created_at: new Date().toISOString()
    };
    this.auditTrails.unshift(audit); // Most recent first
    if (this.auditTrails.length > 200) {
      this.auditTrails.pop();
    }
    return audit;
  }

  public getAuditHistory(sessionToken?: string): TriageAuditTrail[] {
    if (sessionToken) {
      return this.auditTrails.filter(a => a.session_token === sessionToken);
    }
    return this.auditTrails;
  }

  public clearAuditHistory(sessionToken?: string): void {
    if (sessionToken) {
      this.auditTrails = this.auditTrails.filter(a => a.session_token !== sessionToken);
    } else {
      this.auditTrails = [];
    }
  }

  public addShelter(shelter: Omit<EmergencyShelter, 'id'>): EmergencyShelter {
    const newShelter: EmergencyShelter = {
      ...shelter,
      id: this.shelters.length + 1
    };
    this.shelters.push(newShelter);
    return newShelter;
  }

  // Shelter Geolocation queries (Haversine Formula)
  public getNearbyShelters(
    userLat: number,
    userLon: number,
    radiusKm: number = 50,
    disasterType?: string
  ): EmergencyShelter[] {
    return this.shelters
      .filter(s => {
        if (!s.is_open) return false;
        if (disasterType && disasterType !== 'all' && disasterType !== 'general') {
          if (s.disaster_type !== 'general' && s.disaster_type !== disasterType) {
            return false;
          }
        }
        return true;
      })
      .map(s => {
        const distance = this.calculateHaversineDistance(userLat, userLon, s.latitude, s.longitude);
        return { ...s, distance_km: Math.round(distance * 10) / 10 };
      })
      .filter(s => s.distance_km! <= radiusKm)
      .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const db = new InMemoryDatabase();
