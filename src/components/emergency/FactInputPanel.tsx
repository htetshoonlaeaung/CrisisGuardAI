import React, { useState } from 'react';
import { Plus, RefreshCw, Trash2, X, Zap } from 'lucide-react';
import { CrisisDomain, FactItem } from '../../types';
import { QuickFactButtons } from './QuickFactButtons';
import { COMMON_FACT_KEYS, FactKeyConfig, QuickFactPreset } from '../../data/quickFacts';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDomainTheme } from '../../utils/domainTheme';

interface FactInputPanelProps {
  domain: CrisisDomain;
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
  const domainTheme = getDomainTheme(domain);
  const DomainIcon = domainTheme.Icon;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKey.trim()) return;
    onAddFact(customKey.trim().toLowerCase().replace(/\s+/g, '_'), customVal.trim() || 'true');
    setCustomKey('');
    setCustomVal('');
    setSelectedQuickKey('');
  };

  const handleSelectQuickKey = (key: string) => {
    setSelectedQuickKey(key);
    const item = commonKeys.find((k: FactKeyConfig) => k.key === key);
    if (item) {
      setCustomKey(item.key);
      setCustomVal(item.defaultVal);
    }
  };

  return (
    <div
      id="fact-input-panel"
      className={`rounded-2xl border p-4 md:p-6 shadow-xl backdrop-blur-md space-y-5 transition-colors duration-200 ${
        isLight
          ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50'
          : 'bg-[#111111] border-[#2A2A2A] text-[#F5F5F5] shadow-black/80'
      }`}
    >
      <div
        className={`rounded-xl border p-3 ${
          isLight ? domainTheme.activeSurfaceLight : domainTheme.activeSurface
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border"
            style={{
              backgroundColor: domainTheme.accentSoft,
              borderColor: domainTheme.accentBorder,
              color: domainTheme.accent,
            }}
          >
            <DomainIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className={`text-[11px] font-semibold ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t('assistance.selectedCategory')}
            </div>
            <h2 className="truncate text-lg font-black leading-tight">{td(domain)}</h2>
          </div>
        </div>
      </div>

      <QuickFactButtons domain={domain} activeFacts={facts} onSelectPreset={onApplyPreset} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            className={`text-xs font-semibold flex items-center gap-1.5 ${
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
              className={`text-[11px] flex items-center gap-1 py-1 px-2 rounded-lg ${
                isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Trash2 className="w-3 h-3" /> {t('factInput.clearAll')}
            </HapticButton>
          )}
        </div>

        {facts.length === 0 ? (
          <div
            className={`p-3.5 rounded-xl border border-dashed text-center text-xs ${
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
                className={`skeuo-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs select-none cursor-pointer transition-all ${
                  isLight ? 'bg-white border-zinc-300 text-zinc-900 shadow-xs' : 'bg-[#111111] text-zinc-100'
                }`}
                style={{
                  borderColor: isLight ? undefined : domainTheme.accentBorder,
                  backgroundColor: isLight ? undefined : domainTheme.accentSoft,
                }}
                onClick={() => onRemoveFact(f.key)}
                title={t('factInput.clickRemoveFact')}
              >
                <span className="font-bold" style={{ color: domainTheme.accent }}>{f.key}</span>
                <span className={isLight ? 'text-zinc-400' : 'text-zinc-500'}>=</span>
                <span className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                  {String(f.value)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFact(f.key);
                  }}
                  className={`ml-1 p-0.5 rounded focus:outline-none cursor-pointer transition-colors ${
                    isLight ? 'text-zinc-400 hover:text-red-600 hover:bg-zinc-100' : 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800'
                  }`}
                  title={t('factInput.removeFact')}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleAddCustom}
        className={`space-y-2 pt-2 border-t ${isLight ? 'border-zinc-200' : 'border-[#2A2A2A]'}`}
      >
        <label
          className={`text-xs font-semibold block ${
            isLight ? 'text-zinc-600' : 'text-zinc-400'
          }`}
        >
          {t('factInput.addFact')}
        </label>

        <div className="flex gap-2">
          <select
            value={selectedQuickKey}
            onChange={(e) => handleSelectQuickKey(e.target.value)}
            className="crisisguard-input w-full border text-xs rounded-lg px-3 py-2 focus:outline-none font-sans"
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
            className="crisisguard-input sm:col-span-2 border text-xs rounded-lg px-3 py-2 focus:outline-none font-sans"
          />
          <input
            type="text"
            placeholder={t('factInput.valuePlaceholder')}
            value={customVal}
            onChange={(e) => setCustomVal(e.target.value)}
            className="crisisguard-input sm:col-span-2 border text-xs rounded-lg px-3 py-2 focus:outline-none font-sans"
          />
          <HapticButton
            type="submit"
            variant="primary"
            skeuomorphic={true}
            disabled={!customKey.trim()}
            className="sm:col-span-1 rounded-lg text-xs py-2 px-3 flex items-center justify-center gap-1 text-white"
            style={{ backgroundColor: domainTheme.accent, borderColor: domainTheme.accent }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('factInput.assert')}</span>
          </HapticButton>
        </div>

        <div className="pt-2">
          <span className={`text-[11px] block mb-1.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {t('factInput.quickSigns')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {commonKeys.map((item) => {
              const isAsserted = facts.some((f) => f.key === item.key);
              return (
                <HapticButton
                  key={item.key}
                  type="button"
                  variant={isAsserted ? 'primary' : 'secondary'}
                  skeuomorphic={true}
                  onClick={() => {
                    if (isAsserted) {
                      onRemoveFact(item.key);
                    } else {
                      onAddFact(item.key, item.defaultVal);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                    isAsserted
                      ? 'text-white font-bold'
                      : isLight
                      ? 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
                      : 'text-zinc-300 hover:text-white bg-[#111111] border-[#2A2A2A]'
                  }`}
                  style={isAsserted ? {
                    backgroundColor: domainTheme.accent,
                    borderColor: domainTheme.accent,
                    color: '#FFFFFF',
                  } : undefined}
                >
                  {isAsserted ? '✓ ' : '+ '}
                  {tf(item.label)}
                </HapticButton>
              );
            })}
          </div>
        </div>
      </form>

      <HapticButton
        id="btn-evaluate-crisis-now"
        variant="primary"
        skeuomorphic={true}
        onClick={onEvaluate}
        disabled={isEvaluating || facts.length === 0}
        className="w-full py-3.5 md:py-4 px-6 rounded-xl font-black text-sm md:text-base uppercase tracking-wider transition-all text-white"
        style={{
          backgroundColor: domainTheme.accent,
          borderColor: domainTheme.accent,
        }}
      >
        {isEvaluating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>{t('factInput.reasoning')}</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 fill-current" />
            <span>{t('factInput.evaluate')}</span>
          </>
        )}
      </HapticButton>
    </div>
  );
};
