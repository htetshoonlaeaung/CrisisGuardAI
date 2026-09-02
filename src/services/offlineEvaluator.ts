// src/services/offlineEvaluator.ts
// Offline medical rules evaluator - Critical life-threatening scenarios

import { FactItem } from '../types';

interface OfflineEvaluationResult {
  severity: 'critical' | 'high' | 'moderate' | 'low' | 'informational';
  action_headline: string;
  step_by_step_instructions: string[];
  reasons: string[];
  prohibited_actions: string[];
  evaluation_latency_ms: number;
  offline_mode: true;
}

class OfflineEvaluator {
  private startTime: number = 0;

  private parseFactValue(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    return String(value).toLowerCase() === 'true';
  }

  private getFact(facts: FactItem[], key: string): any {
    return facts.find(f => f.key.toLowerCase() === key.toLowerCase())?.value;
  }

  // RULE 1: CPR
  private evaluateCPR(facts: FactItem[]): OfflineEvaluationResult | null {
    const unconscious = this.parseFactValue(this.getFact(facts, 'unconscious'));
    const breathing = String(this.getFact(facts, 'breathing')).toLowerCase();

    if ((unconscious) && breathing === 'none') {
      return {
        severity: 'critical',
        action_headline: 'begin_cpr_and_call_emergency',
        step_by_step_instructions: [
          'Call 911 immediately',
          'Place on firm, flat surface',
          'Tilt head back, lift chin',
          'Position hands on chest center',
          'Push hard and fast 2+ inches deep',
          'Perform 100-120 compressions/minute',
          'Give 2 rescue breaths after 30 compressions',
          'Continue until help arrives',
        ],
        reasons: [
          'Unconscious + no respiration = cardiac arrest',
          'Brain cells die after 4-6 minutes without oxygen',
          'Early CPR increases survival by 400%',
          'Activate AED immediately',
        ],
        prohibited_actions: [
          'Do NOT leave victim unattended',
          'Do NOT delay CPR to find pulse',
          'Do NOT give food or fluids',
          'Do NOT move unless in danger',
        ],
        evaluation_latency_ms: Date.now() - this.startTime,
        offline_mode: true,
      };
    }
    return null;
  }

  // RULE 2: Severe Bleeding
  private evaluateSevereBleeding(facts: FactItem[]): OfflineEvaluationResult | null {
    const bleeding = String(this.getFact(facts, 'bleeding')).toLowerCase();

    if (bleeding === 'severe' || bleeding === 'severe_pulsing') {
      return {
        severity: 'critical',
        action_headline: 'apply_direct_pressure_and_call_911',
        step_by_step_instructions: [
          'Call 911 immediately',
          'Do NOT remove embedded objects',
          'Apply direct pressure with cloth',
          'Use tourniquet if arterial bleeding on limb',
          'Elevate wound above heart',
          'Maintain constant pressure',
          'Add cloth layers if soaked through',
          'Apply ice around the wound',
        ],
        reasons: [
          'Arterial bleeding = death in minutes',
          'Pulsing blood indicates artery rupture',
          'Direct pressure stops 90% of bleeding',
          'Elevation slows flow by gravity',
        ],
        prohibited_actions: [
          'Do NOT remove embedded objects',
          'Do NOT apply tourniquet below wound',
          'Do NOT remove first bandage layer',
          'Do NOT let victim walk around',
        ],
        evaluation_latency_ms: Date.now() - this.startTime,
        offline_mode: true,
      };
    }
    return null;
  }

  // RULE 3: Choking
  private evaluateChoking(facts: FactItem[]): OfflineEvaluationResult | null {
    const obstruct = this.parseFactValue(this.getFact(facts, 'airway_obstruction'));
    const coughing = String(this.getFact(facts, 'coughing')).toLowerCase();

    if (obstruct || coughing === 'ineffective') {
      return {
        severity: 'critical',
        action_headline: 'perform_heimlich_maneuver',
        step_by_step_instructions: [
          'Ask "Are you choking?" - no sound = choking',
          'Stand behind victim',
          'Place fist above navel, below ribs',
          'Grasp fist with other hand',
          'Make quick upward thrusts',
          'Repeat until object expelled',
          'If unconscious, begin CPR',
          'Call 911 after 1 minute if object not expelled',
        ],
        reasons: [
          'Airway obstruction = unconscious in seconds',
          'Brain damage after 4 minutes no oxygen',
          'Heimlich creates pressure to dislodge',
          'Speed = survival',
        ],
        prohibited_actions: [
          'Do NOT perform if coughing effectively',
          'Do NOT use back blows on adults',
          'Do NOT reach into throat blindly',
          'Do NOT leave victim alone',
        ],
        evaluation_latency_ms: Date.now() - this.startTime,
        offline_mode: true,
      };
    }
    return null;
  }

  // RULE 4: Heart Attack
  private evaluateHeartAttack(facts: FactItem[]): OfflineEvaluationResult | null {
    const chestPain = this.parseFactValue(this.getFact(facts, 'chest_pain'));
    const shortness = this.parseFactValue(this.getFact(facts, 'shortness_of_breath'));
    const chestType = String(this.getFact(facts, 'chest_pain_type')).toLowerCase();

    if (chestPain && (shortness || chestType === 'pressure' || chestType === 'crushing')) {
      return {
        severity: 'critical',
        action_headline: 'heart_attack_protocol_call_911',
        step_by_step_instructions: [
          'Call 911 immediately', 'Chew aspirin (325mg if available)', 'Sit down and rest',
          'Loosen tight clothing', 'Take nitroglycerin if prescribed', 'Monitor breathing',
          'Begin CPR if becomes unresponsive', 'Use AED if available',
        ],
        reasons: [
          'Chest pain + breathing difficulty = cardiac event',
          'Every minute counts for survival', 'Aspirin prevents clot formation',
          'Hospital intervention critical within first hour',
        ],
        prohibited_actions: [
          'Do NOT wait for pain to subside', 'Do NOT drive to hospital',
          'Do NOT delay calling 911', 'Do NOT give anything except prescribed meds',
        ],
        evaluation_latency_ms: Date.now() - this.startTime,
        offline_mode: true,
      };
    }
    return null;
  }

  // RULE 5: Stroke (F.A.S.T.)
  private evaluateStroke(facts: FactItem[]): OfflineEvaluationResult | null {
    const faceDroop = this.parseFactValue(this.getFact(facts, 'face_droop'));
    const armWeakness = this.parseFactValue(this.getFact(facts, 'arm_weakness'));
    const speechDiff = this.parseFactValue(this.getFact(facts, 'speech_difficulty'));

    if (faceDroop || armWeakness || speechDiff) {
      return {
        severity: 'critical',
        action_headline: 'activate_stroke_emergency_dispatch',
        step_by_step_instructions: [
          'Call 911 / emergency services immediately for acute stroke transfer',
          'Note the exact time symptoms first started',
          'Keep patient in comfortable seated or slightly elevated position',
          'Do NOT give patient anything to eat or drink',
          'Monitor breathing and level of consciousness continuously',
          'Prepare for paramedic handover at entrance',
        ],
        reasons: [
          'Positive F.A.S.T. stroke indicators observed (facial droop, arm weakness, or slurred speech)',
          'Time-critical brain ischemia suspected; immediate transport to comprehensive stroke center required',
        ],
        prohibited_actions: [
          'Do NOT administer aspirin or blood thinners without hospital CT scan',
          'Do NOT allow patient to drive or walk unaided',
          'Do NOT give water, food, or oral medications (choking risk)',
        ],
        evaluation_latency_ms: Date.now() - this.startTime,
        offline_mode: true,
      };
    }
    return null;
  }

  // RULE 6: Anaphylaxis
  private evaluateAnaphylaxis(facts: FactItem[]): OfflineEvaluationResult | null {
    const allergy = this.parseFactValue(this.getFact(facts, 'allergic_reaction'));
    const swelling = String(this.getFact(facts, 'swelling')).toLowerCase();
    const breathDiff = this.parseFactValue(this.getFact(facts, 'breathing_difficulty'));

    if ((allergy && (swelling === 'severe' || swelling === 'throat')) || (allergy && breathDiff)) {
      return {
        severity: 'critical',
        action_headline: 'anaphylaxis_use_epipen_call_911',
        step_by_step_instructions: [
          'Call 911 immediately', 'Use EpiPen - inject outer thigh', 'Remove stinger if bee sting',
          'Lie down with feet elevated', 'Remove tight clothing', 'Monitor breathing constantly',
          'Use EpiPen again in 5-15 min if needed', 'Do NOT leave victim alone',
        ],
        reasons: [
          'Anaphylaxis is life-threatening allergic reaction', 'Airway swelling blocks breathing',
          'Epinephrine is only effective immediate treatment', 'Hospital observation critical',
        ],
        prohibited_actions: [
          'Do NOT delay using EpiPen', 'Do NOT drive instead of calling 911',
          'Do NOT assume symptoms resolved', 'Do NOT move if breathing difficulty',
        ],
        evaluation_latency_ms: Date.now() - this.startTime,
        offline_mode: true,
      };
    }
    return null;
  }

  // RULE 7: Severe Burns
  private evaluateBurns(facts: FactItem[]): OfflineEvaluationResult | null {
    const burnDegree = String(this.getFact(facts, 'burn_degree')).toLowerCase();
    const burnArea = this.parseFactValue(this.getFact(facts, 'burn_area_large'));

    if (burnDegree === '2nd' || burnDegree === '3rd' || burnDegree === '2nd_degree' || burnArea) {
      return {
        severity: 'high',
        action_headline: 'severe_burn_protocol',
        step_by_step_instructions: [
          'Call 911 if 2nd/3rd degree or large area', 'Cool with water 10-20 minutes',
          'Remove jewelry and tight clothing', 'Do NOT use ice directly',
          'Cover with clean, dry cloth', 'Elevate burned area if possible',
          'Do NOT apply ointments or butter', 'Seek medical care immediately',
        ],
        reasons: [
          '2nd/3rd degree burns = deep tissue damage', 'Large burns cause shock and infection',
          'Cooling reduces pain and damage', 'Medical evaluation critical for burn depth',
        ],
        prohibited_actions: [
          'Do NOT use ice on skin', 'Do NOT apply ointments', 'Do NOT remove stuck clothing',
          'Do NOT pop blisters',
        ],
        evaluation_latency_ms: Date.now() - this.startTime,
        offline_mode: true,
      };
    }
    return null;
  }

  public evaluate(facts: FactItem[]): OfflineEvaluationResult | null {
    this.startTime = Date.now();
    return (
      this.evaluateCPR(facts) ||
      this.evaluateSevereBleeding(facts) ||
      this.evaluateChoking(facts) ||
      this.evaluateHeartAttack(facts) ||
      this.evaluateStroke(facts) ||
      this.evaluateAnaphylaxis(facts) ||
      this.evaluateBurns(facts) ||
      null
    );
  }
}

export const offlineEvaluator = new OfflineEvaluator();
export type { OfflineEvaluationResult };
