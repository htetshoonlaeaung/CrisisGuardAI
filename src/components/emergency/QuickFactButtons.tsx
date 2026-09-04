import React, { useState } from 'react';
import { CrisisDomain, FactItem } from '../../types';
import { QUICK_FACTS, QuickFactPreset } from '../../data/quickFacts';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDomainTheme } from '../../utils/domainTheme';

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
  const { t, tp, tpd } = useLanguage();
  const [clickedPresetId, setClickedPresetId] = useState<string | null>(null);
  const presets = QUICK_FACTS[domain] || [];
  const domainTheme = getDomainTheme(domain);

  const handlePresetClick = (preset: QuickFactPreset) => {
    setClickedPresetId(preset.id);
    onSelectPreset(preset);
  };

  const isPresetActive = (preset: QuickFactPreset): boolean => {
    if (clickedPresetId === preset.id) return true;
    if (!activeFacts || activeFacts.length === 0) return false;
    return preset.facts.every((presetFact) =>
      activeFacts.some((f) => f.key === presetFact.key && String(f.value) === String(presetFact.value))
    );
  };

  return (
    <div id="quick-presets-panel" className="space-y-2">
      <div
        className={`flex items-center justify-between text-[13px] font-bold ${
          isLight ? domainTheme.accentTextStrong : ''
        }`}
        style={{ color: isLight ? undefined : domainTheme.accent }}
      >
        <div className="flex items-center">
          <span>{t('quickPresets.heading')}</span>
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
                  ? ''
                  : isLight
                  ? 'bg-white border-zinc-300 text-zinc-900 shadow-sm hover:bg-zinc-50'
                  : 'bg-[#111111] border-[#2A2A2A] text-zinc-100 hover:bg-[#151515]'
              }`}
              style={active ? {
                backgroundColor: domainTheme.accentSoft,
                borderColor: domainTheme.accent,
                color: domainTheme.accent,
              } : undefined}
            >
              <div className="flex items-center w-full">
                <span
                  className={`text-[14px] font-semibold whitespace-normal flex-1 text-left leading-[1.3] [word-break:normal] [overflow-wrap:normal] transition-colors ${
                    active
                      ? ''
                      : isLight
                      ? 'text-zinc-900 group-hover:text-zinc-950'
                      : 'text-zinc-100'
                  }`}
                  style={{ color: active || !isLight ? (active ? domainTheme.accent : undefined) : undefined }}
                >
                  {tp(preset.id, preset.label)}
                </span>
              </div>
              <p
                className={`text-[11px] font-sans text-left line-clamp-2 w-full transition-colors ${
                    active
                      ? isLight
                        ? 'text-zinc-800 font-medium'
                        : 'text-zinc-200 font-medium'
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
