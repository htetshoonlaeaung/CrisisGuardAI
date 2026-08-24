import React, { useState } from 'react';
import { CrisisDomain, FactItem } from '../../types';
import { QuickFactButtons } from './QuickFactButtons';
import { COMMON_FACT_KEYS, QuickFactPreset, FactKeyConfig } from '../../data/quickFacts';
import { HapticButton } from '../ui/HapticButton';
import { Plus, X, Trash2, Zap, Layers, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FactInputPanelProps {
  domain: CrisisDomain;
  onChangeDomain: (domain: CrisisDomain) => void;
  facts: FactItem[];
  onAddFact: (key: string, value: string | boolean) => void;
  onRemoveFact: (key: string) => void;
  onClearFacts: () => void;
  onEvaluate: () => void;
  isEvaluating: boolean;
  onApplyPreset: (preset: QuickFactPreset) => void;
}

export const FactInputPanel: React.FC<FactInputPanelProps> = ({
  domain,
  onChangeDomain,
  facts,
  onAddFact,
  onRemoveFact,
  onClearFacts,
  onEvaluate,
  isEvaluating,
  onApplyPreset,
}) => {
  const { t, td, tf } = useLanguage();
  const [customKey, setCustomKey] = useState('');
  const [customVal, setCustomVal] = useState('');
  const [selectedQuickKey, setSelectedQuickKey] = useState('');

  const commonKeys: FactKeyConfig[] = COMMON_FACT_KEYS[domain] || [];

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKey.trim()) return;
    onAddFact(customKey.trim().toLowerCase().replace(/\s+/g, '_'), customVal.trim() || 'true');
    setCustomKey('');
    setCustomVal('');
  };

  const handleSelectQuickKey = (key: string) => {
    setSelectedQuickKey(key);
    const item = commonKeys.find((k: FactKeyConfig) => k.key === key);
    if (item) {
      setCustomKey(item.key);
      setCustomVal(item.defaultVal);
    }
  };

  const domains: { id: CrisisDomain; label: string; icon: string }[] = [
    { id: 'medical', label: 'Medical', icon: '🚑' },
    { id: 'fire_hazard', label: 'Fire & Hazard', icon: '🔥' },
    { id: 'natural_disaster', label: 'Natural Disaster', icon: '🌊' },
    { id: 'road_accident', label: 'Road Accident', icon: '🚗' },
  ];

  return (
    <div
      id="fact-input-panel"
      className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm text-slate-900 space-y-5 transition-colors duration-200"
    >
      {/* 1. DOMAIN SELECTOR WITH CLEAN BLUE ACTIVE TABS */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-[13px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 text-slate-700">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('factInput.emergencyDomain')}</span>
          </label>
          <span className="text-[11px] font-mono font-medium text-slate-500">
            {t('factInput.kbModule')}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {domains.map((d) => {
            const isSelected = domain === d.id;
            return (
              <HapticButton
                key={d.id}
                id={`domain-tab-${d.id}`}
                variant={isSelected ? 'blue' : 'secondary'}
                skeuomorphic={false}
                onClick={() => onChangeDomain(d.id)}
                className={`h-11 sm:h-12 px-2.5 rounded-xl text-[13px] font-semibold leading-[1.2] transition-all border flex items-center justify-center text-center [word-break:normal] [overflow-wrap:normal] ${
                  isSelected
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200'
                }`}
              >
                <span className="min-w-0 whitespace-normal [word-break:normal] [overflow-wrap:normal]">{td(d.id)}</span>
              </HapticButton>
            );
          })}
        </div>
      </div>

      {/* 2. QUICK FACT PRESETS (Neutral / High-Contrast Blue Active state) */}
      <QuickFactButtons domain={domain} activeFacts={facts} onSelectPreset={onApplyPreset} />

      {/* 3. ACTIVE FACTS CHIPS (Neutral Slate Tactile Badges) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 text-slate-700">
            <span>{t('factInput.activeFacts', { count: facts.length })}</span>
          </label>
          {facts.length > 0 && (
            <HapticButton
              variant="ghost"
              skeuomorphic={false}
              onClick={onClearFacts}
              className="text-[11px] font-mono flex items-center gap-1 py-1 px-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> {t('factInput.clearAll')}
            </HapticButton>
          )}
        </div>

        {facts.length === 0 ? (
          <div className="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs font-mono text-slate-500">
            {t('factInput.noFacts')}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/80 min-h-[52px]">
            {facts.map((f) => (
              <div
                key={f.key}
                id={`fact-chip-${f.key}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-mono select-none cursor-pointer transition-all shadow-2xs hover:border-blue-400"
                onClick={() => onRemoveFact(f.key)}
                title="Click to remove fact"
              >
                <span className="font-bold text-slate-900">{f.key}</span>
                <span className="text-slate-400">=</span>
                <span className="font-semibold text-slate-700">{String(f.value)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFact(f.key);
                  }}
                  className="ml-1 p-0.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 focus:outline-none cursor-pointer transition-colors"
                  title="Remove fact"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. CUSTOM FACT ADDER & CLINICAL TOGGLES */}
      <form
        onSubmit={handleAddCustom}
        className="space-y-2 pt-2 border-t border-slate-200"
      >
        <label className="text-xs font-mono uppercase tracking-wider font-semibold block text-slate-700">
          {t('factInput.addFact')}
        </label>

        {/* Quick select dropdown */}
        <div className="flex gap-2">
          <select
            value={selectedQuickKey}
            onChange={(e) => handleSelectQuickKey(e.target.value)}
            className="w-full border border-slate-300 bg-white text-xs rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-sans shadow-2xs"
          >
            <option value="">{t('factInput.selectCommonSign')}</option>
            {commonKeys.map((k: FactKeyConfig) => (
              <option key={k.key} value={k.key}>
                {tf(k.label)} ({k.key})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          <input
            type="text"
            placeholder={t('factInput.factKeyPlaceholder')}
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            className="sm:col-span-2 border border-slate-300 bg-white text-xs rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono shadow-2xs"
          />
          <input
            type="text"
            placeholder={t('factInput.valuePlaceholder')}
            value={customVal}
            onChange={(e) => setCustomVal(e.target.value)}
            className="sm:col-span-2 border border-slate-300 bg-white text-xs rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono shadow-2xs"
          />
          <HapticButton
            type="submit"
            variant="secondary"
            skeuomorphic={false}
            disabled={!customKey.trim()}
            className="sm:col-span-1 rounded-lg text-xs py-2 px-3 flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('factInput.assert')}</span>
          </HapticButton>
        </div>

        {/* Rapid Clinical Sign Toggle Chips */}
        <div className="pt-2">
          <span className="text-[11px] font-mono block mb-1.5 text-slate-500">
            {t('factInput.quickSigns')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {commonKeys.map((item) => {
              const isAsserted = facts.some((f) => f.key === item.key);
              return (
                <HapticButton
                  key={item.key}
                  type="button"
                  variant={isAsserted ? 'blue' : 'secondary'}
                  skeuomorphic={false}
                  onClick={() => {
                    if (isAsserted) {
                      onRemoveFact(item.key);
                    } else {
                      onAddFact(item.key, item.defaultVal);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    isAsserted
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {isAsserted ? '✓ ' : '+ '}
                  {tf(item.label)}
                </HapticButton>
              );
            })}
          </div>
        </div>
      </form>

      {/* 5. PRIMARY HIGH-ACCURACY EVALUATION CTA */}
      <HapticButton
        id="btn-evaluate-crisis-now"
        variant="blue"
        skeuomorphic={true}
        onClick={onEvaluate}
        disabled={isEvaluating}
        className="w-full py-3.5 md:py-4 px-6 rounded-xl font-extrabold text-sm md:text-base uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 transition-all cursor-pointer"
      >
        {isEvaluating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>{t('factInput.reasoning')}</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 fill-white text-white" />
            <span>{t('factInput.evaluate')}</span>
          </>
        )}
      </HapticButton>
    </div>
  );
};
