import React, { useState } from 'react';
import { CrisisDomain, FactItem } from '../../types';
import { QuickFactButtons } from './QuickFactButtons';
import { COMMON_FACT_KEYS, QuickFactPreset, FactKeyConfig } from '../../data/quickFacts';
import { HapticButton } from '../ui/HapticButton';
<<<<<<< HEAD
import {
  Plus,
  X,
  Trash2,
  Zap,
  Layers,
  RefreshCw,
  Activity,
  Flame,
  Waves,
  Car,
  Check,
} from 'lucide-react';
=======
import { useTheme } from '../../context/ThemeContext';
import { Plus, X, Trash2, Zap, Layers, RefreshCw } from 'lucide-react';
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
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
<<<<<<< HEAD
=======
  const { isLight } = useTheme();
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
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

<<<<<<< HEAD
  const domains: {
    id: CrisisDomain;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'medical', label: 'Medical', icon: Activity },
    { id: 'fire_hazard', label: 'Fire & Hazard', icon: Flame },
    { id: 'natural_disaster', label: 'Natural Disaster', icon: Waves },
    { id: 'road_accident', label: 'Road Accident', icon: Car },
=======
  const domains: { id: CrisisDomain; label: string; icon: string }[] = [
    { id: 'medical', label: 'Medical', icon: '🚑' },
    { id: 'fire_hazard', label: 'Fire & Hazard', icon: '🔥' },
    { id: 'natural_disaster', label: 'Natural Disaster', icon: '🌊' },
    { id: 'road_accident', label: 'Road Accident', icon: '🚗' },
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
  ];

  return (
    <div
      id="fact-input-panel"
<<<<<<< HEAD
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {domains.map((d) => {
            const isSelected = domain === d.id;
            const DomainIcon = d.icon;
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            return (
              <HapticButton
                key={d.id}
                id={`domain-tab-${d.id}`}
<<<<<<< HEAD
                variant={isSelected ? 'blue' : 'secondary'}
                skeuomorphic={true}
                onClick={() => onChangeDomain(d.id)}
                className={`py-3.5 sm:py-4 px-3 rounded-2xl text-center flex flex-col items-center justify-center gap-2 transition-all border min-h-[82px] sm:min-h-[90px] cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-[0_4px_14px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs hover:border-blue-300'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform duration-200 ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <DomainIcon className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold tracking-tight leading-snug whitespace-normal text-center min-w-0 [word-break:normal] [overflow-wrap:normal]">
                  {td(d.id)}
                </span>
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
              </HapticButton>
            );
          })}
        </div>
      </div>

<<<<<<< HEAD
      {/* 2. QUICK FACT PRESETS (Neutral / High-Contrast Blue Active state) */}
      <QuickFactButtons domain={domain} activeFacts={facts} onSelectPreset={onApplyPreset} />

      {/* 3. ACTIVE FACTS CHIPS (Neutral Slate Tactile Badges) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 text-slate-700">
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            <span>{t('factInput.activeFacts', { count: facts.length })}</span>
          </label>
          {facts.length > 0 && (
            <HapticButton
              variant="ghost"
              skeuomorphic={false}
              onClick={onClearFacts}
<<<<<<< HEAD
              className="text-[11px] font-mono flex items-center gap-1 py-1 px-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
=======
              className={`text-[11px] font-mono flex items-center gap-1 py-1 px-2 rounded-lg ${
                isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            >
              <Trash2 className="w-3 h-3" /> {t('factInput.clearAll')}
            </HapticButton>
          )}
        </div>

        {facts.length === 0 ? (
<<<<<<< HEAD
          <div className="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs font-mono text-slate-500">
            {t('factInput.noFacts')}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/80 min-h-[52px]">
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            {facts.map((f) => (
              <div
                key={f.key}
                id={`fact-chip-${f.key}`}
<<<<<<< HEAD
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-mono select-none cursor-pointer transition-all shadow-2xs hover:border-blue-400"
                onClick={() => onRemoveFact(f.key)}
                title="Click to remove fact"
              >
                <span className="font-bold text-slate-900">{f.key}</span>
                <span className="text-slate-400">=</span>
                <span className="font-semibold text-slate-700">{String(f.value)}</span>
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFact(f.key);
                  }}
<<<<<<< HEAD
                  className="ml-1 p-0.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 focus:outline-none cursor-pointer transition-colors"
=======
                  className={`ml-1 p-0.5 rounded focus:outline-none cursor-pointer transition-colors ${
                    isLight ? 'text-zinc-400 hover:text-red-600 hover:bg-zinc-100' : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800'
                  }`}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
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
<<<<<<< HEAD
        className="space-y-2 pt-2 border-t border-slate-200"
      >
        <label className="text-xs font-mono uppercase tracking-wider font-semibold block text-slate-700">
=======
        className={`space-y-2 pt-2 border-t ${isLight ? 'border-zinc-200' : 'border-[#2A2A2A]'}`}
      >
        <label
          className={`text-xs font-mono font-semibold block ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}
        >
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
          {t('factInput.addFact')}
        </label>

        {/* Quick select dropdown */}
        <div className="flex gap-2">
          <select
            value={selectedQuickKey}
            onChange={(e) => handleSelectQuickKey(e.target.value)}
<<<<<<< HEAD
            className="w-full border border-slate-300 bg-white text-xs rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-sans shadow-2xs"
=======
            className={`w-full border text-xs rounded-lg px-3 py-2 focus:outline-none font-sans ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-600'
                : 'bg-[#111111] border-[#2A2A2A] text-zinc-200 focus:border-[#FFAB00]'
            }`}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
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
<<<<<<< HEAD
            className="sm:col-span-2 border border-slate-300 bg-white text-xs rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-mono shadow-2xs"
=======
            className={`sm:col-span-2 border text-xs rounded-lg px-3 py-2 focus:outline-none font-mono ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-600'
                : 'bg-[#111111] border-[#2A2A2A] text-zinc-200 focus:border-[#FFAB00]'
            }`}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
          />
          <input
            type="text"
            placeholder={t('factInput.valuePlaceholder')}
            value={customVal}
            onChange={(e) => setCustomVal(e.target.value)}
<<<<<<< HEAD
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
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            <span>{t('factInput.assert')}</span>
          </HapticButton>
        </div>

        {/* Rapid Clinical Sign Toggle Chips */}
        <div className="pt-2">
<<<<<<< HEAD
          <span className="text-[11px] font-mono block mb-1.5 text-slate-500">
=======
          <span className={`text-[11px] font-mono block mb-1.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            {t('factInput.quickSigns')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {commonKeys.map((item) => {
              const isAsserted = facts.some((f) => f.key === item.key);
              return (
                <HapticButton
                  key={item.key}
                  type="button"
<<<<<<< HEAD
                  variant={isAsserted ? 'blue' : 'secondary'}
                  skeuomorphic={false}
=======
                  variant={isAsserted ? (isLight ? 'primary' : 'amber') : 'secondary'}
                  skeuomorphic={true}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
                  onClick={() => {
                    if (isAsserted) {
                      onRemoveFact(item.key);
                    } else {
                      onAddFact(item.key, item.defaultVal);
                    }
                  }}
<<<<<<< HEAD
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer inline-flex items-center gap-1 ${
                    isAsserted
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {isAsserted ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <Plus className="w-3 h-3 text-slate-500" />
                  )}
                  <span>{tf(item.label)}</span>
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
                </HapticButton>
              );
            })}
          </div>
        </div>
      </form>

<<<<<<< HEAD
      {/* 5. PRIMARY HIGH-ACCURACY EVALUATION CTA */}
      <HapticButton
        id="btn-evaluate-crisis-now"
        variant="blue"
        skeuomorphic={true}
        onClick={onEvaluate}
        disabled={isEvaluating}
        className="w-full py-3.5 md:py-4 px-6 rounded-xl font-extrabold text-sm md:text-base uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 transition-all cursor-pointer"
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
      >
        {isEvaluating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>{t('factInput.reasoning')}</span>
          </>
        ) : (
          <>
<<<<<<< HEAD
            <Zap className="w-5 h-5 fill-white text-white" />
=======
            <Zap className="w-5 h-5 fill-zinc-950 text-zinc-950" />
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            <span>{t('factInput.evaluate')}</span>
          </>
        )}
      </HapticButton>
    </div>
  );
};
