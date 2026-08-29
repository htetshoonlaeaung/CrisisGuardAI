import React, { useState } from 'react';
import { EvaluateCrisisResponse } from '../../types';
import { ActionHeadline } from './ActionHeadline';
import { ReasonsList } from './ReasonsList';
import { ProhibitionsList } from './ProhibitionsList';
import { SeverityBadge } from './SeverityBadge';
import { TTS } from '../../utils/textToSpeech';
import { HapticButton } from '../ui/HapticButton';
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
      className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-5 transition-all duration-300 text-slate-900"
    >
      {/* 1. Header with latency and severity */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={result.severity} size="md" />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border border-slate-200 bg-slate-100 text-slate-700 font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('action.logicInference', { ms: result.evaluation_latency_ms })}</span>
          </div>
        </div>

        {/* Quick action toolbar */}
        <div className="flex items-center gap-2">
          <HapticButton
            id="btn-tts-read-aloud"
            variant="secondary"
            skeuomorphic={false}
            onClick={handleToggleSpeech}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
              isSpeaking
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title={t('action.readAloud')}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-600" />
            )}
            <span>{isSpeaking ? t('action.stopSpeech') : t('action.readDirectives')}</span>
          </HapticButton>

          <HapticButton
            id="btn-view-xai-proof"
            variant="secondary"
            skeuomorphic={false}
            onClick={onOpenProofTree}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
            title={t('action.inspectProofTitle')}
          >
            <GitBranch className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">{t('action.inspectTree')}</span>
          </HapticButton>
        </div>
      </div>

      {/* 2. Action Headline banner */}
      <ActionHeadline action={result.action_headline} severity={result.severity} />

      {/* 3. CPR Special Metronome Alert Banner if cardiac emergency */}
      {isCardiacOrArrest && onOpenMetronome && (
        <div
          id="cpr-metronome-launcher-banner"
          className="rounded-xl border border-red-200 bg-red-50/80 ring-1 ring-red-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-red-300 bg-white flex items-center justify-center animate-cpr-pulse flex-shrink-0">
              <HeartPulse className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-extrabold text-sm uppercase tracking-wide text-slate-950">
                {t('action.cprAvailable')}
              </div>
              <div className="text-xs text-slate-600">
                {t('action.cprDesc')}
              </div>
            </div>
          </div>
          <HapticButton
            variant="danger"
            skeuomorphic={true}
            onClick={onOpenMetronome}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200"
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
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5 space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-bold flex items-center gap-2 text-slate-900">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              <span>{t('action.protocol')}</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
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
                      ? 'bg-emerald-50 border-emerald-300 text-slate-500 line-through opacity-80'
                      : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-800 shadow-2xs'
                  }`}
                >
                  <button className="mt-0.5 flex-shrink-0 focus:outline-none cursor-pointer">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1 text-xs md:text-sm leading-relaxed">
                    <span className="font-mono font-bold mr-2 text-blue-600">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200">
        {onOpenShelters && (
          <HapticButton
            variant="secondary"
            skeuomorphic={false}
            onClick={onOpenShelters}
            className="w-full py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{t('action.shelters')}</span>
          </HapticButton>
        )}
        <a
          href="tel:199"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-extrabold text-xs md:text-sm bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200 transition-all hbtn"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{t('action.callDispatcher')}</span>
        </a>
      </div>
    </div>
  );
};
