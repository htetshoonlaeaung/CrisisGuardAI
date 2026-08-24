import React, { useState } from 'react';
import { CrisisDomain, FactItem } from '../../types';
import { QUICK_FACTS, QuickFactPreset } from '../../data/quickFacts';
import { HapticButton } from '../ui/HapticButton';
import { useLanguage } from '../../context/LanguageContext';

interface QuickFactButtonsProps {
  domain: CrisisDomain;
  activeFacts?: FactItem[];
  onSelectPreset: (preset: QuickFactPreset) => void;
}

export const QuickFactButtons: React.FC<QuickFactButtonsProps> = ({
  domain,
  activeFacts = [],
  onSelectPreset,
}) => {
  const { t, td, tp, tpd } = useLanguage();
  const [clickedPresetId, setClickedPresetId] = useState<string | null>(null);
  const presets = QUICK_FACTS[domain] || [];

  const handlePresetClick = (preset: QuickFactPreset) => {
    setClickedPresetId(preset.id);
    onSelectPreset(preset);
  };

  const isPresetActive = (preset: QuickFactPreset): boolean => {
    if (clickedPresetId === preset.id) return true;
    if (!activeFacts || activeFacts.length === 0) return false;
    return Object.entries(preset.facts).every(([k, v]) =>
      activeFacts.some((f) => f.key === k && String(f.value) === String(v))
    );
  };

  return (
    <div id="quick-presets-panel" className="space-y-2">
      <div className="flex items-center justify-between text-[13px] font-mono font-bold uppercase tracking-wider text-slate-800">
        <div className="flex items-center">
          <span>{t('quickPresets.heading', { domain: td(domain) })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {presets.map((preset) => {
          const active = isPresetActive(preset);
          return (
            <HapticButton
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              type="button"
              variant="secondary"
              skeuomorphic={true}
              onClick={() => handlePresetClick(preset)}
              className={`p-3 text-left rounded-xl group w-full justify-start items-start flex-col transition-all border min-h-[58px] cursor-pointer ${
                active
                  ? 'skeuo-preset-active bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-2xs hover:border-blue-400'
              }`}
            >
              <div className="flex items-center w-full">
                <span
                  className={`text-[14px] font-semibold whitespace-normal flex-1 text-left leading-[1.3] [word-break:normal] [overflow-wrap:normal] transition-colors ${
                    active
                      ? 'text-blue-950 font-bold'
                      : 'text-slate-900 group-hover:text-blue-600 font-semibold'
                  }`}
                >
                  {tp(preset.id, preset.label)}
                </span>
              </div>
              <p
                className={`text-[11px] font-sans text-left line-clamp-2 w-full transition-colors ${
                  active
                    ? 'text-blue-900 font-medium'
                    : 'text-slate-500 group-hover:text-slate-700'
                }`}
              >
                {tpd(preset.id, preset.description)}
              </p>
            </HapticButton>
          );
        })}
      </div>
    </div>
  );
};
