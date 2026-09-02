import React, { useState } from 'react';
import { EvaluateCrisisResponse } from '../../types';
import { ActionHeadline } from './ActionHeadline';
import { ReasonsList } from './ReasonsList';
import { ProhibitionsList } from './ProhibitionsList';
import { SeverityBadge } from './SeverityBadge';
import { TTS } from '../../utils/textToSpeech';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Volume2,
  VolumeX,
  HeartPulse,
  GitBranch,
  PhoneCall,
  Clock,
  CheckSquare,
  Square,
  MapPin
} from 'lucide-react';

interface ActionCardProps {
  result: EvaluateCrisisResponse;
  onOpenProofTree: () => void;
  onOpenMetronome?: () => void;
  onOpenShelters?: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  result,
  onOpenProofTree,
  onOpenMetronome,
  onOpenShelters,
}) => {
  const { isLight } = useTheme();
  const { t, tr, ta } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const translatedReasons = result.reasons.map((reason, index) =>
    tr(result.action_headline, 'reasons', index, reason)
  );
  const translatedProhibitions = result.prohibited_actions.map((prohibition, index) =>
    tr(result.action_headline, 'prohibitions', index, prohibition)
  );
  const translatedSteps = result.step_by_step_instructions.map((step, index) =>
    tr(result.action_headline, 'steps', index, step)
  );

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      TTS.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      TTS.speak(
        ta(result.action_headline),
        result.severity,
        translatedReasons,
        translatedProhibitions,
        translatedSteps,
        () => setIsSpeaking(false)
      );
    }
  };

  const isCardiacOrArrest =
    result.action_headline.toLowerCase().includes('cpr') ||
    result.action_headline.toLowerCase().includes('cardiac') ||
    result.action_headline.toLowerCase().includes('arrest');

  return (
    <div
      id="emergency-action-card"
      className={`rounded-2xl border p-4 md:p-6 shadow-xl backdrop-blur-md space-y-5 transition-all duration-300 ${
        isLight
          ? result.severity === 'critical'
            ? 'bg-white border-red-300 shadow-red-100/60 ring-1 ring-red-200'
            : result.severity === 'high'
            ? 'bg-white border-amber-300 shadow-amber-100/60'
            : 'bg-white border-zinc-200 shadow-zinc-200/50'
          : result.severity === 'critical'
          ? 'bg-[#111111] border-[#EF4444]/60 shadow-black/90 ring-1 ring-[#EF4444]/40'
          : result.severity === 'high'
          ? 'bg-[#111111] border-amber-500/50 shadow-black/80 ring-1 ring-amber-500/30'
          : 'bg-[#111111] border-[#2A2A2A] shadow-black/80'
      }`}
    >
      {/* 1. Header with latency and severity */}
      <div className={`flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b ${isLight ? 'border-zinc-200' : 'border-[#2A2A2A]'}`}>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={result.severity} size="md" />
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border ${
              isLight
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-[rgba(255,171,0,0.10)] border-[rgba(255,171,0,0.25)] text-[#FFAB00]'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
            <span>{t('action.logicInference', { ms: result.evaluation_latency_ms })}</span>
          </div>
        </div>

        {/* Quick action toolbar */}
        <div className="flex items-center gap-2">
          <HapticButton
            id="btn-tts-read-aloud"
            variant={isSpeaking ? (isLight ? 'primary' : 'amber') : 'secondary'}
            onClick={handleToggleSpeech}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              isLight && !isSpeaking ? 'bg-zinc-100 border-zinc-300 text-zinc-800' : ''
            }`}
            title={t('action.readAloud')}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4 text-zinc-950" />
            ) : (
              <Volume2 className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
            )}
            <span>{isSpeaking ? t('action.stopSpeech') : t('action.readDirectives')}</span>
          </HapticButton>

          <HapticButton
            id="btn-view-xai-proof"
            variant="secondary"
            onClick={onOpenProofTree}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              isLight ? 'bg-zinc-100 border-zinc-300 text-amber-800' : 'text-[#FFAB00] hover:border-[rgba(255,171,0,0.40)]'
            }`}
            title={t('action.inspectProofTitle')}
          >
            <GitBranch className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
            <span className="hidden sm:inline">{t('action.inspectTree')}</span>
          </HapticButton>
        </div>
      </div>

      {/* 2. Action Headline banner */}
      <ActionHeadline action={result.action_headline} severity={result.severity} />

      {/* 3. CPR Special Metronome Alert Banner if cardiac emergency (Red Alert System Preserved) */}
      {isCardiacOrArrest && onOpenMetronome && (
        <div
          id="cpr-metronome-launcher-banner"
          className={`rounded-xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${
            isLight
              ? 'bg-red-50 border-red-200 ring-1 ring-red-200'
              : 'border-[#EF4444]/50 bg-[#1A1A1A] ring-1 ring-[#EF4444]/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full border flex items-center justify-center animate-cpr-pulse flex-shrink-0 ${
                isLight ? 'bg-white border-red-300' : 'bg-[#090909] border-[#EF4444]'
              }`}
            >
              <HeartPulse className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div>
              <div className={`font-black text-sm uppercase tracking-wide ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                {t('action.cprAvailable')}
              </div>
              <div className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                {t('action.cprDesc')}
              </div>
            </div>
          </div>
          <HapticButton
            variant="danger"
            onClick={onOpenMetronome}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs whitespace-nowrap"
          >
            {t('action.launchCpr')}
          </HapticButton>
        </div>
      )}

      {/* 4. Strict Prohibitions (Safety Invariants) */}
      <ProhibitionsList prohibitions={translatedProhibitions} />

      {/* 5. Step-by-Step Tactical Protocol Checklist */}
      {result.step_by_step_instructions && result.step_by_step_instructions.length > 0 && (
        <div
          id="tactical-instructions-panel"
          className={`rounded-xl border p-4 md:p-5 space-y-3 ${
            isLight ? 'bg-zinc-50 border-zinc-200' : 'border-[#2A2A2A] bg-[#090909]'
          }`}
        >
          <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-zinc-200' : 'border-[#2A2A2A]'}`}>
            <h3 className={`text-xs md:text-sm font-mono font-bold flex items-center gap-2 ${
              isLight ? 'text-zinc-900' : 'text-zinc-200'
            }`}>
              <CheckSquare className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
              <span>{t('action.protocol')}</span>
            </h3>
            <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t('action.tapSteps')}
            </span>
          </div>

          <div className="space-y-2">
            {translatedSteps.map((step, idx) => {
              const isChecked = !!checkedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 active:scale-[0.99] ${
                    isChecked
                      ? isLight
                        ? 'bg-emerald-50 border-emerald-300 text-zinc-500 line-through opacity-80'
                        : 'bg-emerald-950/20 border-emerald-800/40 text-zinc-400 line-through opacity-80'
                      : isLight
                      ? 'bg-white hover:bg-zinc-100/80 border-zinc-200 text-zinc-800 shadow-xs'
                      : 'bg-[#111111] hover:bg-[#1A1A1A] border-[#2A2A2A] text-zinc-100'
                  }`}
                >
                  <button className="mt-0.5 flex-shrink-0 focus:outline-none cursor-pointer">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
                    )}
                  </button>
                  <div className="flex-1 text-xs md:text-sm leading-relaxed">
                    <span className={`font-mono font-bold mr-2 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`}>
                      0{idx + 1}.
                    </span>
                    <span>{step}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Reasons / Evidence List (XAI) */}
      <ReasonsList reasons={translatedReasons} />

      {/* 7. Bottom Quick Action Triggers */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t ${isLight ? 'border-zinc-200' : 'border-[#2A2A2A]'}`}>
        {onOpenShelters && (
          <HapticButton
            variant="secondary"
            onClick={onOpenShelters}
            className={`w-full py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold ${
              isLight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300' : ''
            }`}
          >
            <MapPin className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
            <span>{t('action.shelters')}</span>
          </HapticButton>
        )}
        <a
          href="tel:199"
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm shadow-md transition-all hbtn ${
            isLight
              ? 'bg-[#EF4444] hover:bg-[#FF3B30] text-white border border-[#EF4444]'
              : 'bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] hover:text-white border border-[#EF4444]/40 hover:border-[#EF4444]/60'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>{t('action.callDispatcher')}</span>
        </a>
      </div>
    </div>
  );
};
