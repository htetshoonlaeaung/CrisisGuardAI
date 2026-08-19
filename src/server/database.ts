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
        name: 'Metro Civic Center Evacuation Complex',
        disaster_type: 'general',
        address: '100 Civic Center Plaza, Downtown',
        latitude: 37.7749,
        longitude: -122.4194,
        capacity: 850,
        current_occupancy: 240,
        contact_phone: '(555) 901-4420',
        is_open: true,
        facilities: ['Medical Triage Post', 'Backup Power Generators', 'Infant Care', 'Pet Boarding', 'Clean Water Filtration']
      },
      {
        id: 2,
        name: 'St. Jude Emergency Trauma & Medical Shelter',
        disaster_type: 'medical',
        address: '450 Health Sciences Way, North District',
        latitude: 37.7858,
        longitude: -122.4065,
        capacity: 400,
        current_occupancy: 310,
        contact_phone: '(555) 334-9110',
        is_open: true,
        facilities: ['Level 1 Trauma Unit', 'Burn Care Bay', 'Oxygen Refill Station', 'Blood Bank Reserves']
      },
      {
        id: 3,
        name: 'Highland Ridge Flood & Surge Sanctuary',
        disaster_type: 'natural_disaster',
        address: '880 Elevation Highway, Highland District',
        latitude: 37.7990,
        longitude: -122.4250,
        capacity: 650,
        current_occupancy: 120,
        contact_phone: '(555) 778-2200',
        is_open: true,
        facilities: ['High-Ground Helipad', 'Rescue Boat Staging Area', 'Food Distribution Hub', 'Satellite Comms']
      },
      {
        id: 4,
        name: 'Westside Fire Station #14 Emergency Assembly Zone',
        disaster_type: 'fire_hazard',
        address: '1240 Bayview Boulevard, West Sector',
        latitude: 37.7600,
        longitude: -122.4350,
        capacity: 350,
        current_occupancy: 80,
        contact_phone: '(555) 441-8900',
        is_open: true,
        facilities: ['Smoke Inhalation Treatment', 'Hazmat Decontamination Showers', 'Emergency Food Rations']
      },
      {
        id: 5,
        name: 'Valley Expressway Crash & Transit Relief Point',
        disaster_type: 'road_accident',
        address: 'Interstate 80 Junction, Exit 42B',
        latitude: 37.7510,
        longitude: -122.4100,
        capacity: 250,
        current_occupancy: 45,
        contact_phone: '(555) 889-1122',
        is_open: true,
        facilities: ['Ambulance Fast-Track Bay', 'Vehicle Towing Staging', 'Triage Assessment Area']
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
