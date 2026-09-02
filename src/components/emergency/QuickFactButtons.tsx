import React, { useState } from 'react';
import { CrisisDomain, FactItem } from '../../types';
import { QUICK_FACTS, QuickFactPreset } from '../../data/quickFacts';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
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
  const { isLight } = useTheme();
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
      <div
        className={`flex items-center justify-between text-[13px] font-mono font-bold ${
          isLight ? 'text-amber-800' : 'text-[#FFAB00]'
        }`}
      >
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
              className={`p-3 text-left rounded-xl group w-full justify-start items-start flex-col transition-all border min-h-[58px] ${
                active
                  ? 'skeuo-preset-active'
                  : isLight
                  ? 'bg-white hover:bg-amber-50/50 border-zinc-300 text-zinc-900 shadow-sm hover:border-amber-400'
                  : 'bg-[#111111] hover:bg-[rgba(255,171,0,0.06)] border-[#2A2A2A] text-zinc-100 hover:border-[rgba(255,171,0,0.30)]'
              }`}
            >
              <div className="flex items-center w-full">
                <span
                  className={`text-[14px] font-semibold whitespace-normal flex-1 text-left leading-[1.3] [word-break:normal] [overflow-wrap:normal] transition-colors ${
                    active
                      ? isLight
                        ? 'text-amber-950'
                        : 'text-[#FFAB00]'
                      : isLight
                      ? 'text-zinc-900 group-hover:text-amber-800'
                      : 'text-zinc-100 group-hover:text-[#FFAB00]'
                  }`}
                >
                  {tp(preset.id, preset.label)}
                </span>
              </div>
              <p
                className={`text-[11px] font-sans text-left line-clamp-2 w-full transition-colors ${
                  active
                    ? isLight
                      ? 'text-amber-900/90 font-medium'
                      : 'text-[#FFE066] font-medium'
                    : isLight
                    ? 'text-zinc-500 group-hover:text-zinc-800'
                    : 'text-zinc-400 group-hover:text-zinc-300'
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
