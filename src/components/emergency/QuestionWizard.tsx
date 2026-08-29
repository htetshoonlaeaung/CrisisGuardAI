import React, { useState } from 'react';
import { Stethoscope, Flame, Waves, Car, Zap, Sparkles, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { CrisisDomain, FactItem } from '../../types';

interface PresetScenario {
  id: string;
  name: string;
  domain: CrisisDomain;
  description: string;
  icon: any;
  facts: FactItem[];
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'cardiac_arrest',
    name: 'Cardiac Arrest / Unresponsive',
    domain: 'medical',
    description: 'Person collapsed, unconscious with absent or agonal breathing',
    icon: Stethoscope,
    facts: [
      { key: 'unconscious', value: true },
      { key: 'breathing', value: 'none' }
    ]
  },
  {
    id: 'electrical_fire',
    name: 'Electrical Circuit Fire',
    domain: 'fire_hazard',
    description: 'Appliance or breaker box on fire; live power danger',
    icon: Zap,
    facts: [
      { key: 'hazard', value: 'fire' },
      { key: 'fire_source', value: 'electrical' }
    ]
  },
  {
    id: 'grease_fire',
    name: 'Kitchen Grease / Oil Fire',
    domain: 'fire_hazard',
    description: 'Cooking pan ignited on stove top with boiling oil',
    icon: Flame,
    facts: [
      { key: 'hazard', value: 'fire' },
      { key: 'fire_source', value: 'cooking_oil' }
    ]
  },
  {
    id: 'stroke_fast',
    name: 'Acute Stroke (F.A.S.T)',
    domain: 'medical',
    description: 'Facial droop, unilateral arm weakness, slurred speech',
    icon: Stethoscope,
    facts: [
      { key: 'face_droop', value: true },
      { key: 'arm_weakness', value: true },
      { key: 'speech_difficulty', value: true }
    ]
  },
  {
    id: 'gas_leak',
    name: 'Indoor Gas Leak',
    domain: 'fire_hazard',
    description: 'Strong rotten egg odor inside home / commercial building',
    icon: Flame,
    facts: [
      { key: 'hazard', value: 'gas_leak' },
      { key: 'location', value: 'indoors' }
    ]
  },
  {
    id: 'severe_bleeding',
    name: 'Arterial Bleeding / Trauma',
    domain: 'medical',
    description: 'Pulsing spurting blood from limb laceration',
    icon: Stethoscope,
    facts: [
      { key: 'bleeding', value: 'severe_pulsing' }
    ]
  },
  {
    id: 'flash_flood',
    name: 'Flash Flood (Single Story)',
    domain: 'natural_disaster',
    description: 'Rapid water ingress in single-story home',
    icon: Waves,
    facts: [
      { key: 'disaster', value: 'flood' },
      { key: 'water_rising', value: true },
      { key: 'building', value: 'single_story' }
    ]
  },
  {
    id: 'active_earthquake',
    name: 'Active Earthquake Shaking',
    domain: 'natural_disaster',
    description: 'Seismic tremors ongoing indoors',
    icon: Waves,
    facts: [
      { key: 'disaster', value: 'earthquake' },
      { key: 'shaking', value: 'active' },
      { key: 'location', value: 'indoors' }
    ]
  },
  {
    id: 'crash_cpr',
    name: 'Vehicle Crash Unresponsive',
    domain: 'road_accident',
    description: 'Collision with non-breathing victim in vehicle',
    icon: Car,
    facts: [
      { key: 'unconscious', value: true },
      { key: 'breathing', value: 'none' },
      { key: 'accident', value: 'vehicle_crash' }
    ]
  }
];

interface QuestionWizardProps {
  currentDomain: CrisisDomain;
  onSelectDomain: (domain: CrisisDomain) => void;
  onEvaluate: (domain: CrisisDomain, facts: FactItem[]) => void;
  isLoading: boolean;
}

export const QuestionWizard: React.FC<QuestionWizardProps> = ({
  currentDomain,
  onSelectDomain,
  onEvaluate,
  isLoading
}) => {
  // Domain fact state
  const [selectedFacts, setSelectedFacts] = useState<Record<string, any>>({});

  const domainIcons: Record<CrisisDomain, any> = {
    medical: Stethoscope,
    fire_hazard: Flame,
    natural_disaster: Waves,
    road_accident: Car
  };

  const domainLabels: Record<CrisisDomain, string> = {
    medical: 'Medical Emergency',
    fire_hazard: 'Fire & Hazards',
    natural_disaster: 'Disasters & Floods',
    road_accident: 'Road Accidents'
  };

  const handleApplyPreset = (preset: PresetScenario) => {
    onSelectDomain(preset.domain);
    const newFactsObj: Record<string, any> = {};
    for (const f of preset.facts) {
      newFactsObj[f.key] = f.value;
    }
    setSelectedFacts(newFactsObj);
    onEvaluate(preset.domain, preset.facts);
  };

  const handleToggleFact = (key: string, value: any) => {
    const next = { ...selectedFacts };
    if (next[key] === value) {
      delete next[key];
    } else {
      next[key] = value;
    }
    setSelectedFacts(next);

    const factList = Object.entries(next).map(([k, v]) => ({ key: k, value: v }));
    onEvaluate(currentDomain, factList);
  };

  const handleClear = () => {
    setSelectedFacts({});
    onEvaluate(currentDomain, []);
  };

  return (
    <div id="question-wizard-card" className="space-y-5">
      {/* 1. Quick Scenario Presets Toolbar */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            1-Tap Emergency Rapid Presets:
          </div>
          <span className="text-[11px] text-neutral-400">Instant AI Inference</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_SCENARIOS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-2.5 rounded-xl border border-neutral-800 bg-neutral-950/70 hover:bg-neutral-800/90 hover:border-red-500/50 transition flex flex-col justify-between group"
              >
                <div className="flex items-center gap-1.5 mb-1 text-red-400 group-hover:text-red-300">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-black truncate">{preset.name}</span>
                </div>
                <p className="text-[10px] text-neutral-400 line-clamp-2 leading-tight">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Domain Switcher Tabs */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/95 p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-white">Dynamic Emergency Questionnaire</h3>
            <p className="text-xs text-neutral-400">Select active crisis domain and observed clinical/scene signs</p>
          </div>
          <button
            onClick={handleClear}
            className="text-xs font-bold text-neutral-400 hover:text-white px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Selections
          </button>
        </div>

        {/* Domain Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {(['medical', 'fire_hazard', 'natural_disaster', 'road_accident'] as CrisisDomain[]).map((dom) => {
            const Icon = domainIcons[dom];
            const isSelected = currentDomain === dom;
            return (
              <button
                key={dom}
                id={`domain-tab-${dom}`}
                onClick={() => {
                  onSelectDomain(dom);
                  setSelectedFacts({});
                  onEvaluate(dom, []);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-red-600/20 border-red-500 text-white shadow-md'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-red-400' : 'text-neutral-400'}`} />
                  {isSelected && <span className="h-2 w-2 rounded-full bg-red-500" />}
                </div>
                <span className="text-xs font-bold">{domainLabels[dom]}</span>
              </button>
            );
          })}
        </div>

        {/* Domain-Specific Interactive Questionnaire */}
        <div className="space-y-4 pt-2 border-t border-neutral-800/80">
          {currentDomain === 'medical' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Patient Responsiveness &amp; Vitals:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleToggleFact('unconscious', true)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.unconscious === true
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Unconscious / Unresponsive</span>
                  {selectedFacts.unconscious === true && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('breathing', 'none')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.breathing === 'none'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Breathing: NONE / Agonal Gasping</span>
                  {selectedFacts.breathing === 'none' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('symptom', 'choking')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.symptom === 'choking'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Choking / Airway Blocked (Silent)</span>
                  {selectedFacts.symptom === 'choking' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('bleeding', 'severe_pulsing')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.bleeding === 'severe_pulsing'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Severe Arterial Spurting Bleed</span>
                  {selectedFacts.bleeding === 'severe_pulsing' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('face_droop', true)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.face_droop === true
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>FAST: One-Sided Facial Droop</span>
                  {selectedFacts.face_droop === true && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('arm_weakness', true)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.arm_weakness === true
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>FAST: Arm Weakness / Drift</span>
                  {selectedFacts.arm_weakness === true && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('burn_type', 'thermal')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.burn_type === 'thermal'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Large Thermal / Chemical Burn</span>
                  {selectedFacts.burn_type === 'thermal' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('toxic_substance', true)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.toxic_substance === true
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Toxic Ingestion / Poison Inhaled</span>
                  {selectedFacts.toxic_substance === true && <Check className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
          )}

          {currentDomain === 'fire_hazard' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fire Type &amp; Fuel Source:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleToggleFact('hazard', 'fire');
                    handleToggleFact('fire_source', 'electrical');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.fire_source === 'electrical'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Electrical Appliance / Breaker Fire</span>
                  {selectedFacts.fire_source === 'electrical' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => {
                    handleToggleFact('hazard', 'fire');
                    handleToggleFact('fire_source', 'cooking_oil');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.fire_source === 'cooking_oil'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Grease / Cooking Oil Stove Fire</span>
                  {selectedFacts.fire_source === 'cooking_oil' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => {
                    handleToggleFact('hazard', 'gas_leak');
                    handleToggleFact('location', 'indoors');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.hazard === 'gas_leak'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Strong Indoor Gas Leak Smell</span>
                  {selectedFacts.hazard === 'gas_leak' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => {
                    handleToggleFact('hazard', 'fire');
                    handleToggleFact('exit_blocked', true);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.exit_blocked === true
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Exit Blocked by Flames / Smoke</span>
                  {selectedFacts.exit_blocked === true && <Check className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
          )}

          {currentDomain === 'natural_disaster' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Disaster Environment:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleToggleFact('disaster', 'flood');
                    handleToggleFact('water_rising', true);
                    handleToggleFact('building', 'single_story');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.building === 'single_story'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Flash Flood (Single-Story / Ground)</span>
                  {selectedFacts.building === 'single_story' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => {
                    handleToggleFact('disaster', 'flood');
                    handleToggleFact('water_rising', true);
                    handleToggleFact('building', 'multi_story');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.building === 'multi_story'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Flood (Multi-Story Structure)</span>
                  {selectedFacts.building === 'multi_story' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => {
                    handleToggleFact('disaster', 'earthquake');
                    handleToggleFact('shaking', 'active');
                    handleToggleFact('location', 'indoors');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.shaking === 'active'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Active Earthquake Tremor (Indoors)</span>
                  {selectedFacts.shaking === 'active' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => {
                    handleToggleFact('disaster', 'earthquake');
                    handleToggleFact('smell_gas', true);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.smell_gas === true
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Post-Earthquake Gas Odor</span>
                  {selectedFacts.smell_gas === true && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => {
                    handleToggleFact('disaster', 'tsunami');
                    handleToggleFact('coastal', true);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.disaster === 'tsunami'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Tsunami Warning / Coastal Surge</span>
                  {selectedFacts.disaster === 'tsunami' && <Check className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
          )}

          {currentDomain === 'road_accident' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Collision Factors:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleToggleFact('unconscious', true);
                    handleToggleFact('breathing', 'none');
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.unconscious === true && selectedFacts.breathing === 'none'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Victim Non-Breathing at Crash</span>
                  {selectedFacts.unconscious === true && selectedFacts.breathing === 'none' && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => {
                    handleToggleFact('vehicle_fire', true);
                    handleToggleFact('victim_trapped', true);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.vehicle_fire === true
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Vehicle on Fire + Trapped Occupant</span>
                  {selectedFacts.vehicle_fire === true && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('traffic_active', true)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.traffic_active === true
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Active Highway Traffic Threat</span>
                  {selectedFacts.traffic_active === true && <Check className="w-4 h-4 text-white" />}
                </button>

                <button
                  onClick={() => handleToggleFact('casualties', 'multiple')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    selectedFacts.casualties === 'multiple'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Multi-Casualty Incident (START Triage)</span>
                  {selectedFacts.casualties === 'multiple' && <Check className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
