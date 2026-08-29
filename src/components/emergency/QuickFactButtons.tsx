import React, { useState } from 'react';
import { CrisisDomain, FactItem } from '../../types';
import { QUICK_FACTS, QuickFactPreset } from '../../data/quickFacts';
import { HapticButton } from '../ui/HapticButton';
import { useLanguage } from '../../context/LanguageContext';
import {
  HeartPulse,
  Droplet,
  Wind,
  Brain,
  Flame,
  FlaskConical,
  Zap,
  Gauge,
  DoorClosed,
  Waves,
  Activity,
  AlertTriangle,
  Car,
  ShieldAlert,
  Siren,
  HelpCircle,
} from 'lucide-react';

const PRESET_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse,
  Droplet,
  Wind,
  Brain,
  Flame,
  FlaskConical,
  Zap,
  Gauge,
  DoorClosed,
  Waves,
  Activity,
  AlertTriangle,
  Car,
  ShieldAlert,
  Siren,
};

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

  const getBadgeBg = (preset: QuickFactPreset, active: boolean) => {
    if (preset.expectedSeverity === 'critical') {
      return active
        ? 'bg-red-500 text-white shadow-xs'
        : 'bg-red-100/90 text-red-600 border border-red-200/80 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/70';
    }
    if (
      preset.id.includes('burn') ||
      preset.id.includes('fire') ||
      preset.id.includes('gas') ||
      preset.id.includes('heat')
    ) {
      return active
        ? 'bg-amber-500 text-slate-950 shadow-xs'
        : 'bg-amber-100/90 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70';
    }
    if (
      preset.id.includes('poison') ||
      preset.id.includes('flood') ||
      preset.id.includes('earthquake') ||
      preset.id.includes('pedestrian')
    ) {
      return active
        ? 'bg-emerald-500 text-white shadow-xs'
        : 'bg-emerald-100/90 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70';
    }
    return active
      ? 'bg-blue-600 text-white shadow-xs'
      : 'bg-blue-100/90 text-blue-700 border border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/70';
  };

  return (
    <div id="quick-presets-panel" className="space-y-3">
      <div className="flex items-center justify-between text-[13px] font-mono font-bold uppercase tracking-wider text-slate-800">
        <div className="flex items-center">
          <span>{t('quickPresets.heading', { domain: td(domain) })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-3.5">
        {presets.map((preset) => {
          const active = isPresetActive(preset);
          const IconComp = PRESET_ICON_MAP[preset.icon] || HelpCircle;
          return (
            <HapticButton
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              type="button"
              variant="secondary"
              skeuomorphic={true}
              onClick={() => handlePresetClick(preset)}
              innerClassName="items-start justify-start w-full h-full gap-3 sm:gap-3.5"
              className={`p-3 sm:p-3.5 text-left rounded-2xl group w-full transition-all border min-h-[88px] sm:min-h-[96px] cursor-pointer ${
                active
                  ? 'skeuo-preset-active bg-blue-50/90 border-blue-600 text-blue-900 shadow-md ring-1 ring-blue-600/30'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-2xs hover:border-blue-400 hover:shadow-xs'
              }`}
            >
              {/* LEFT: ~30% ratio - Natural icon & severity condition */}
              <div className="w-[28%] sm:w-[30%] min-w-[64px] max-w-[84px] flex-shrink-0 flex flex-col items-center justify-start text-center gap-1.5 select-none">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${getBadgeBg(
                    preset,
                    active
                  )}`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                {preset.expectedSeverity === 'critical' ? (
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                      active
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40'
                    }`}
                  >
                    CRITICAL
                  </span>
                ) : (
                  <span
                    className={`text-[9px] font-mono font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                      active
                        ? 'bg-blue-200/80 text-blue-950 font-semibold'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}
                  >
                    {preset.expectedSeverity || 'CONDITION'}
                  </span>
                )}
              </div>

              {/* RIGHT: ~70% ratio - Condition Title & Descriptions */}
              <div className="flex-1 min-w-0 flex flex-col justify-start text-left pt-0.5">
                <span
                  className={`text-[13.5px] sm:text-[14px] font-bold whitespace-normal block text-left leading-tight [word-break:normal] [overflow-wrap:normal] transition-colors ${
                    active
                      ? 'text-blue-950 font-bold'
                      : 'text-slate-900 group-hover:text-blue-600'
                  }`}
                >
                  {tp(preset.id, preset.label)}
                </span>
                <p
                  className={`text-xs sm:text-[11.5px] font-sans text-left line-clamp-2 w-full mt-1.5 leading-relaxed transition-colors ${
                    active
                      ? 'text-blue-900 font-medium'
                      : 'text-slate-500 group-hover:text-slate-600'
                  }`}
                >
                  {tpd(preset.id, preset.description)}
                </p>
              </div>
            </HapticButton>
          );
        })}
      </div>
    </div>
  );
};
