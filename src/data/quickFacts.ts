import { CrisisDomain, FactItem } from '../types';

export interface QuickFactPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  facts: FactItem[];
  expectedSeverity: 'critical' | 'high' | 'moderate' | 'low';
}

export const QUICK_FACTS: Record<CrisisDomain, QuickFactPreset[]> = {
  medical: [
    {
      id: 'med_cardiac',
      label: 'Cardiac Arrest',
      icon: 'HeartPulse',
      description: 'Unconscious + absent/agonal breathing',
      facts: [
        { key: 'unconscious', value: 'true' },
        { key: 'breathing', value: 'none' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'med_arterial',
      label: 'Arterial Bleeding',
      icon: 'Droplet',
      description: 'Severe pulsing / pooling hemorrhage',
      facts: [{ key: 'bleeding', value: 'severe_pulsing' }],
      expectedSeverity: 'critical',
    },
    {
      id: 'med_choking',
      label: 'Choking / Blocked Airway',
      icon: 'Wind',
      description: 'Unable to speak, cough, or breathe',
      facts: [
        { key: 'symptom', value: 'choking' },
        { key: 'airway_pass', value: 'blocked' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'med_stroke',
      label: 'Stroke (F.A.S.T.)',
      icon: 'Brain',
      description: 'Facial droop, arm drift, speech slurred',
      facts: [
        { key: 'face_droop', value: 'true' },
        { key: 'speech_difficulty', value: 'true' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'med_burns',
      label: 'Severe Burns',
      icon: 'Flame',
      description: 'Extensive thermal or chemical burn',
      facts: [
        { key: 'burn_type', value: 'thermal' },
        { key: 'burn_area', value: 'large' },
      ],
      expectedSeverity: 'high',
    },
    {
      id: 'med_poison',
      label: 'Poisoning / Toxic Ingestion',
      icon: 'FlaskConical',
      description: 'Harmful chemical or substance ingestion',
      facts: [
        { key: 'toxic_substance', value: 'true' },
        { key: 'symptom', value: 'poisoning' },
      ],
      expectedSeverity: 'high',
    },
  ],

  fire_hazard: [
    {
      id: 'fire_electrical',
      label: 'Electrical Fire',
      icon: 'Zap',
      description: 'Appliance/breaker fire — never use water',
      facts: [
        { key: 'hazard', value: 'fire' },
        { key: 'fire_source', value: 'electrical' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'fire_grease',
      label: 'Grease / Oil Cooktop Fire',
      icon: 'Flame',
      description: 'Pan fire on stove — steam explosion risk',
      facts: [
        { key: 'hazard', value: 'fire' },
        { key: 'fire_source', value: 'cooking_oil' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'fire_gas_leak',
      label: 'Indoor Gas Leak',
      icon: 'Gauge',
      description: 'Rotten egg smell — explosion hazard',
      facts: [
        { key: 'hazard', value: 'gas_leak' },
        { key: 'location', value: 'indoors' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'fire_trapped',
      label: 'Structure Fire (Trapped)',
      icon: 'DoorClosed',
      description: 'Heavy smoke, primary exits blocked',
      facts: [
        { key: 'hazard', value: 'fire' },
        { key: 'exit_blocked', value: 'true' },
      ],
      expectedSeverity: 'critical',
    },
  ],

  natural_disaster: [
    {
      id: 'dis_flood_1floor',
      label: 'Flash Flood (Single Floor)',
      icon: 'Waves',
      description: 'Water rising rapidly on ground floor',
      facts: [
        { key: 'disaster', value: 'flood' },
        { key: 'water_rising', value: 'true' },
        { key: 'building', value: 'single_story' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'dis_earthquake_active',
      label: 'Active Earthquake Shaking',
      icon: 'Activity',
      description: 'Severe seismic tremor in progress',
      facts: [
        { key: 'disaster', value: 'earthquake' },
        { key: 'shaking', value: 'active' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'dis_tsunami',
      label: 'Tsunami Warning / Surge',
      icon: 'Waves',
      description: 'Coastal water receding / inland surge threat',
      facts: [
        { key: 'disaster', value: 'tsunami' },
        { key: 'coastal', value: 'true' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'dis_quake_gas',
      label: 'Post-Quake Gas Leak',
      icon: 'AlertTriangle',
      description: 'Structural shift with strong gas odor',
      facts: [
        { key: 'disaster', value: 'earthquake' },
        { key: 'smell_gas', value: 'true' },
      ],
      expectedSeverity: 'critical',
    },
  ],

  road_accident: [
    {
      id: 'road_unconscious',
      label: 'Unconscious Crash Victim',
      icon: 'Car',
      description: 'Non-responsive victim with potential spinal injury',
      facts: [
        { key: 'unconscious', value: 'true' },
        { key: 'breathing', value: 'none' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'road_fire_trapped',
      label: 'Vehicle Fire (Entrapped)',
      icon: 'Flame',
      description: 'Burning vehicle cabin with trapped passenger',
      facts: [
        { key: 'vehicle_fire', value: 'true' },
        { key: 'victim_trapped', value: 'true' },
      ],
      expectedSeverity: 'critical',
    },
    {
      id: 'road_traffic_hazard',
      label: 'Highway Active Traffic Crash',
      icon: 'ShieldAlert',
      description: 'High-speed roadway collision hazard',
      facts: [{ key: 'traffic_active', value: 'true' }],
      expectedSeverity: 'high',
    },
    {
      id: 'road_mci',
      label: 'Multi-Casualty Incident (MCI)',
      icon: 'Siren',
      description: 'Multiple injured victims needing START triage',
      facts: [{ key: 'casualties', value: 'multiple' }],
      expectedSeverity: 'high',
    },
  ],
};

export interface FactKeyConfig {
  key: string;
  label: string;
  placeholder: string;
  defaultVal: string;
}

export const COMMON_FACT_KEYS: Record<CrisisDomain, FactKeyConfig[]> = {
  medical: [
    { key: 'unconscious', label: 'Unconscious / Unresponsive', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'breathing', label: 'Breathing Status', placeholder: 'none / normal / shallow', defaultVal: 'none' },
    { key: 'bleeding', label: 'Bleeding Severity', placeholder: 'severe_pulsing / minor', defaultVal: 'severe_pulsing' },
    { key: 'symptom', label: 'Primary Symptom', placeholder: 'choking / chest_pain / stroke', defaultVal: 'choking' },
    { key: 'airway_pass', label: 'Airway Passage', placeholder: 'blocked / clear', defaultVal: 'blocked' },
    { key: 'face_droop', label: 'Face Drooping (F.A.S.T.)', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'arm_weakness', label: 'Arm Weakness (F.A.S.T.)', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'speech_difficulty', label: 'Speech Slurred (F.A.S.T.)', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'burn_type', label: 'Burn Type', placeholder: 'thermal / chemical / electrical', defaultVal: 'thermal' },
    { key: 'burn_area', label: 'Burn Area', placeholder: 'large / small', defaultVal: 'large' },
  ],
  fire_hazard: [
    { key: 'hazard', label: 'Hazard Type', placeholder: 'fire / gas_leak / chemical', defaultVal: 'fire' },
    { key: 'fire_source', label: 'Ignition Source', placeholder: 'electrical / cooking_oil / gas / wood', defaultVal: 'electrical' },
    { key: 'location', label: 'Location', placeholder: 'indoors / outdoors / basement', defaultVal: 'indoors' },
    { key: 'exit_blocked', label: 'Exits Blocked', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'smoke', label: 'Smoke Condition', placeholder: 'heavy_black / detected', defaultVal: 'heavy_black' },
  ],
  natural_disaster: [
    { key: 'disaster', label: 'Disaster Type', placeholder: 'flood / earthquake / tsunami / cyclone', defaultVal: 'flood' },
    { key: 'water_rising', label: 'Water Level Rising', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'building', label: 'Building Structure', placeholder: 'single_story / multi_story / ground_floor', defaultVal: 'single_story' },
    { key: 'shaking', label: 'Seismic Shaking', placeholder: 'active / stopped', defaultVal: 'active' },
    { key: 'smell_gas', label: 'Gas Smell Detected', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'coastal', label: 'Coastal Proximity', placeholder: 'true / false', defaultVal: 'true' },
  ],
  road_accident: [
    { key: 'unconscious', label: 'Victim Unconscious', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'breathing', label: 'Victim Breathing', placeholder: 'none / normal', defaultVal: 'none' },
    { key: 'vehicle_fire', label: 'Vehicle on Fire', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'victim_trapped', label: 'Victim Trapped in Wreck', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'traffic_active', label: 'Active Highway Traffic', placeholder: 'true / false', defaultVal: 'true' },
    { key: 'casualties', label: 'Casualty Count', placeholder: 'single / multiple / many', defaultVal: 'multiple' },
  ],
};
