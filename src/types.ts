// Domain & Severity Types
export type TriageSeverity = 'critical' | 'high' | 'moderate' | 'low' | 'informational';

export type CrisisDomain = 'medical' | 'natural_disaster' | 'fire_hazard' | 'road_accident';

export interface FactItem {
  key: string;
  value: string | boolean | number;
}

export interface EvaluateCrisisRequest {
  session_token: string;
  domain: CrisisDomain;
  submitted_facts: FactItem[];
}

export interface ProofNode {
  type: 'evidence' | 'rule' | 'deduction' | 'safety_invariant';
  label: string;
  details?: string;
  children?: ProofNode[];
}

export interface EvaluateCrisisResponse {
  session_token: string;
  domain: CrisisDomain;
  severity: TriageSeverity;
  action_headline: string;
  step_by_step_instructions: string[];
  reasons: string[];
  prohibited_actions: string[];
  proof_tree: ProofNode;
  evaluation_latency_ms: number;
  timestamp: string;
}

export interface EmergencySession {
  id: string;
  session_token: string;
  domain: CrisisDomain;
  current_severity: TriageSeverity;
  is_active: boolean;
  facts: FactItem[];
  created_at: string;
  updated_at: string;
}

export interface TriageAuditTrail {
  id: number;
  session_token: string;
  domain: CrisisDomain;
  recommended_action: string;
  severity: TriageSeverity;
  reasons: string[];
  prohibited_actions: string[];
  facts_snapshot: FactItem[];
  evaluation_latency_ms: number;
  created_at: string;
}

export interface EmergencyShelter {
  id: number;
  name: string;
  disaster_type: CrisisDomain | 'general';
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  current_occupancy: number;
  contact_phone: string;
  is_open: boolean;
  facilities: string[];
  distance_km?: number;
}

export interface IncidentItem {
  id: string;
  name: string;
  severity: TriageSeverity;
  victims_count: number;
  hazard_type: string;
  location: string;
}

export interface RescueTeam {
  id: number;
  name: string;
  type: 'paramedic' | 'fire_rescue' | 'heavy_extrication' | 'flood_boat';
  vehicle_capacity: number;
  is_available: boolean;
  base_location: string;
}

export interface DispatchPlan {
  incident_id: string;
  incident_name: string;
  severity: TriageSeverity;
  assigned_team_id: number;
  team_name: string;
  estimated_arrival_minutes: number;
  constraints_satisfied: string[];
}

export interface DispatchResponse {
  success: boolean;
  solver: 'CLP(FD) Symbolic Constraint Solver';
  plans: DispatchPlan[];
  unassigned_incidents: string[];
  total_latency_ms: number;
}
