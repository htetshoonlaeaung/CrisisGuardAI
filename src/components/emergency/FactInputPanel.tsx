import React, { useState } from 'react';
import { CrisisDomain, FactItem } from '../../types';
import { QuickFactButtons } from './QuickFactButtons';
import { COMMON_FACT_KEYS, QuickFactPreset, FactKeyConfig } from '../../data/quickFacts';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
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
  const { isLight } = useTheme();
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
      className={`rounded-2xl border p-4 md:p-6 shadow-xl backdrop-blur-md space-y-5 transition-colors duration-200 ${
        isLight
          ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50'
          : 'bg-[#111111] border-[#2A2A2A] text-[#F5F5F5] shadow-black/80'
      }`}
    >
      {/* 1. DOMAIN SELECTOR WITH SKEUOMORPHIC AMBER/GOLD TABS */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label
            className={`text-[13px] font-mono font-bold flex items-center gap-1.5 ${
              isLight ? 'text-zinc-600' : 'text-zinc-400'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
            <span>{t('factInput.emergencyDomain')}</span>
          </label>
          <span className={`text-[11px] font-mono font-semibold ${isLight ? 'text-amber-800' : 'text-[#FFAB00]'}`}>
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
                variant={isSelected ? (isLight ? 'primary' : 'amber') : 'secondary'}
                skeuomorphic={true}
                onClick={() => onChangeDomain(d.id)}
                className={`h-11 sm:h-12 px-2.5 rounded-xl text-[13px] font-semibold leading-[1.2] transition-all border flex items-center justify-center text-center [word-break:normal] [overflow-wrap:normal] ${
                  isSelected
                    ? isLight
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                      : 'bg-[rgba(255,171,0,0.12)] border-[rgba(255,171,0,0.50)] text-[#FFAB00] shadow-[0_0_16px_rgba(255,171,0,0.25)]'
                    : isLight
                    ? 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-300'
                    : 'border-[#2A2A2A] bg-[#111111] text-zinc-300 hover:border-[rgba(255,171,0,0.30)] hover:bg-[rgba(255,171,0,0.06)]'
                }`}
              >
                <span className="min-w-0 whitespace-normal [word-break:normal] [overflow-wrap:normal]">{td(d.id)}</span>
              </HapticButton>
            );
          })}
        </div>
      </div>

      {/* 2. QUICK FACT PRESETS (Skeuomorphic Buttons with Electric Amber Glow) */}
      <QuickFactButtons domain={domain} activeFacts={facts} onSelectPreset={onApplyPreset} />

      {/* 3. ACTIVE FACTS CHIPS (Spotify/Apple Amber tactile pill badges) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            className={`text-xs font-mono font-semibold flex items-center gap-1.5 ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}
          >
            <span>{t('factInput.activeFacts', { count: facts.length })}</span>
          </label>
          {facts.length > 0 && (
            <HapticButton
              variant="ghost"
              skeuomorphic={false}
              onClick={onClearFacts}
              className={`text-[11px] font-mono flex items-center gap-1 py-1 px-2 rounded-lg ${
                isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Trash2 className="w-3 h-3" /> {t('factInput.clearAll')}
            </HapticButton>
          )}
        </div>

        {facts.length === 0 ? (
          <div
            className={`p-3.5 rounded-xl border border-dashed text-center text-xs font-mono ${
              isLight
                ? 'bg-zinc-50 border-zinc-300 text-zinc-500'
                : 'border-[#2A2A2A] bg-[#090909]/60 text-zinc-500'
            }`}
          >
            {t('factInput.noFacts')}
          </div>
        ) : (
          <div
            className={`flex flex-wrap gap-2 p-3 rounded-xl border min-h-[52px] ${
              isLight
                ? 'bg-zinc-50/80 border-zinc-200'
                : 'bg-[#090909] border-[#2A2A2A]'
            }`}
          >
            {facts.map((f) => (
              <div
                key={f.key}
                id={`fact-chip-${f.key}`}
                className={`skeuo-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono select-none cursor-pointer transition-all ${
                  isLight
                    ? 'bg-white border-zinc-300 text-zinc-900 hover:border-amber-500 shadow-xs'
                    : 'bg-[rgba(255,171,0,0.10)] border-[rgba(255,171,0,0.35)] text-[#FFD000] hover:border-[rgba(255,171,0,0.60)]'
                }`}
                onClick={() => onRemoveFact(f.key)}
                title="Click to remove fact"
              >
                <span className={`font-bold ${isLight ? 'text-amber-800' : 'text-[#FFAB00]'}`}>{f.key}</span>
                <span className={isLight ? 'text-zinc-400' : 'text-amber-500/60'}>=</span>
                <span className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-[#FFE066]'}`}>{String(f.value)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFact(f.key);
                  }}
                  className={`ml-1 p-0.5 rounded focus:outline-none cursor-pointer transition-colors ${
                    isLight ? 'text-zinc-400 hover:text-red-600 hover:bg-zinc-100' : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800'
                  }`}
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
        className={`space-y-2 pt-2 border-t ${isLight ? 'border-zinc-200' : 'border-[#2A2A2A]'}`}
      >
        <label
          className={`text-xs font-mono font-semibold block ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}
        >
          {t('factInput.addFact')}
        </label>

        {/* Quick select dropdown */}
        <div className="flex gap-2">
          <select
            value={selectedQuickKey}
            onChange={(e) => handleSelectQuickKey(e.target.value)}
            className={`w-full border text-xs rounded-lg px-3 py-2 focus:outline-none font-sans ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-600'
                : 'bg-[#111111] border-[#2A2A2A] text-zinc-200 focus:border-[#FFAB00]'
            }`}
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
            className={`sm:col-span-2 border text-xs rounded-lg px-3 py-2 focus:outline-none font-mono ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-600'
                : 'bg-[#111111] border-[#2A2A2A] text-zinc-200 focus:border-[#FFAB00]'
            }`}
          />
          <input
            type="text"
            placeholder={t('factInput.valuePlaceholder')}
            value={customVal}
            onChange={(e) => setCustomVal(e.target.value)}
            className={`sm:col-span-2 border text-xs rounded-lg px-3 py-2 focus:outline-none font-mono ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-600'
                : 'bg-[#111111] border-[#2A2A2A] text-zinc-200 focus:border-[#FFAB00]'
            }`}
          />
          <HapticButton
            type="submit"
            variant="primary"
            skeuomorphic={true}
            disabled={!customKey.trim()}
            className={`sm:col-span-1 rounded-lg text-xs py-2 px-3 flex items-center justify-center gap-1 ${
              isLight ? 'bg-zinc-900 hover:bg-black text-white' : 'bg-[#1A1A1A] hover:bg-[#2A2A2A] text-zinc-100 border-[#2A2A2A]'
            }`}
          >
            <Plus className={`w-3.5 h-3.5 ${isLight ? 'text-amber-400' : 'text-[#FFAB00]'}`} />
            <span>{t('factInput.assert')}</span>
          </HapticButton>
        </div>

        {/* Rapid Clinical Sign Toggle Chips */}
        <div className="pt-2">
          <span className={`text-[11px] font-mono block mb-1.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {t('factInput.quickSigns')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {commonKeys.map((item) => {
              const isAsserted = facts.some((f) => f.key === item.key);
              return (
                <HapticButton
                  key={item.key}
                  type="button"
                  variant={isAsserted ? (isLight ? 'primary' : 'amber') : 'secondary'}
                  skeuomorphic={true}
                  onClick={() => {
                    if (isAsserted) {
                      onRemoveFact(item.key);
                    } else {
                      onAddFact(item.key, item.defaultVal);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                    isAsserted
                      ? isLight
                        ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                        : 'skeuo-btn-amber text-zinc-950 font-bold'
                      : isLight
                      ? 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
                      : 'text-zinc-300 hover:text-white hover:border-[rgba(255,171,0,0.30)] bg-[#111111] border-[#2A2A2A]'
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

      {/* 5. PRIMARY HIGH-ACCURACY EVALUATION CTA (SKEUOMORPHIC 3D PUSH BUTTON) */}
      <HapticButton
        id="btn-evaluate-crisis-now"
        variant={isLight ? 'primary' : 'amber'}
        skeuomorphic={true}
        onClick={onEvaluate}
        disabled={isEvaluating}
        className={`w-full py-3.5 md:py-4 px-6 rounded-xl font-black text-sm md:text-base uppercase tracking-wider transition-all ${
          isLight
            ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-md font-black'
            : 'skeuo-btn-amber text-zinc-950 font-black'
        }`}
      >
        {isEvaluating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>{t('factInput.reasoning')}</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 fill-zinc-950 text-zinc-950" />
            <span>{t('factInput.evaluate')}</span>
          </>
        )}
      </HapticButton>
    </div>
  );
};
