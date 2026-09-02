import { describe, it, expect, beforeEach } from 'vitest';
import { offlineEvaluator } from '@/services/offlineEvaluator';
import { FactItem } from '@/types';

describe('OfflineEvaluator', () => {
  let facts: FactItem[];

  beforeEach(() => {
    facts = [];
  });

  // RULE 1: CPR Tests
  describe('CPR Rule', () => {
    it('should recommend CPR when unconscious and not breathing', () => {
      facts = [
        { key: 'unconscious', value: true },
        { key: 'breathing', value: 'none' },
      ];

      const result = offlineEvaluator.evaluate(facts);

      expect(result).not.toBeNull();
      expect(result?.severity).toBe('critical');
      expect(result?.action_headline).toBe('begin_cpr_and_call_emergency');
      expect(result?.offline_mode).toBe(true);
    });

    it('should not recommend CPR when conscious', () => {
      facts = [
        { key: 'unconscious', value: false },
        { key: 'breathing', value: 'normal' },
      ];

      const result = offlineEvaluator.evaluate(facts);

      expect(result).toBeNull();
    });
  });

  // RULE 2: Severe Bleeding Tests
  describe('Severe Bleeding Rule', () => {
    it('should recommend bleeding protocol for severe bleeding', () => {
      facts = [{ key: 'bleeding', value: 'severe' }];

      const result = offlineEvaluator.evaluate(facts);

      expect(result).not.toBeNull();
      expect(result?.severity).toBe('critical');
      expect(result?.action_headline).toBe('apply_direct_pressure_and_call_911');
    });

    it('should recommend bleeding protocol for severe pulsing', () => {
      facts = [{ key: 'bleeding', value: 'severe_pulsing' }];

      const result = offlineEvaluator.evaluate(facts);

      expect(result).not.toBeNull();
      expect(result?.severity).toBe('critical');
    });

    it('should not recommend protocol for minor bleeding', () => {
      facts = [{ key: 'bleeding', value: 'minor' }];

      const result = offlineEvaluator.evaluate(facts);

      expect(result).toBeNull();
    });
  });
});
