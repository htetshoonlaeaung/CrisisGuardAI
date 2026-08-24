import React, { useState, useEffect, useRef } from 'react';
import { HeartPulse, Play, Square, Volume2, VolumeX, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { HapticButton } from '../ui/HapticButton';
import { useLanguage } from '../../context/LanguageContext';

interface CPRMetronomeProps {
  onClose?: () => void;
}

export const CPRMetronome: React.FC<CPRMetronomeProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(1);
  const [phase, setPhase] = useState<'compressions' | 'breaths'>('compressions');
  const [isPushing, setIsPushing] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // 110 BPM = 60 / 110 * 1000 = ~545.45 ms per beat
  const BPM = 110;
  const intervalMs = (60 / BPM) * 1000;

  const playClickSound = (isHighTone: boolean = false) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!audioCtxRef.current) return;

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHighTone ? 1046.5 : 880, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(0.3, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.08);
    } catch {
      // Audio context policy
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setIsPushing(true);
        setTimeout(() => setIsPushing(false), 200);

        setBeatCount((prev) => {
          const next = prev + 1;
          const isCycleBoundary = next % 30 === 0;

          playClickSound(isCycleBoundary);

          if (isCycleBoundary) {
            setPhase('breaths');
            setTimeout(() => setPhase('compressions'), 3000);
            setCycleCount((c) => c + 1);
          }
          return next;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, isMuted, intervalMs]);

  const handleReset = () => {
    setBeatCount(0);
    setCycleCount(1);
    setPhase('compressions');
  };

  return (
    <div
      id="cpr-metronome-panel"
      className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-5 text-slate-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs bg-red-100 border border-red-300 text-red-600">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm md:text-base tracking-tight text-slate-950">
              {t('cpr.title')}
            </h3>
            <p className="text-xs font-mono text-red-700 font-bold">
              110 Beats Per Minute • 30:2 Cycle Guide
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HapticButton
            variant="icon"
            skeuomorphic={false}
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-lg p-0 bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900"
            title={isMuted ? t('cpr.unmute') : t('cpr.mute')}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-700" />
            )}
          </HapticButton>
          {onClose && (
            <HapticButton
              variant="secondary"
              skeuomorphic={false}
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t('common.close')}</span>
            </HapticButton>
          )}
        </div>
      </div>

      {/* Visual Heartbeat & Rhythm Pulse */}
      <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-slate-200 bg-slate-50 relative overflow-hidden">
        <div
          className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-100 ${
            isPushing
              ? 'scale-110 bg-red-600 border-red-700 text-white shadow-lg shadow-red-200'
              : 'scale-95 bg-white border-slate-300 text-slate-800 shadow-xs'
          }`}
        >
          <span className="text-2xl md:text-3xl font-black font-mono tracking-wider">
            {phase === 'breaths' ? t('cpr.breath') : isPushing ? t('cpr.push') : t('cpr.recoil')}
          </span>
          <span className="text-xs font-mono font-bold opacity-90">
            {phase === 'breaths' ? t('cpr.giveBreaths') : t('cpr.compress')}
          </span>
        </div>

        {/* Real-time counters */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-6 px-4 text-center">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs">
            <div className="text-[10px] font-mono uppercase text-slate-500">{t('cpr.currentBeat')}</div>
            <div className="text-xl font-bold font-mono text-slate-950">{(beatCount % 30) || 30}/30</div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs">
            <div className="text-[10px] font-mono uppercase text-slate-500">{t('cpr.cycle')}</div>
            <div className="text-xl font-bold font-mono text-blue-600">#{cycleCount}</div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs">
            <div className="text-[10px] font-mono uppercase text-slate-500">{t('cpr.cadence')}</div>
            <div className="text-xl font-bold font-mono text-red-600">110 BPM</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <HapticButton
          variant={isActive ? 'secondary' : 'blue'}
          skeuomorphic={true}
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${
            !isActive ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
        >
          {isActive ? (
            <>
              <Square className="w-4 h-4 fill-current text-slate-700" />
              <span>{t('cpr.pause')}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-white" />
              <span>{t('cpr.start')}</span>
            </>
          )}
        </HapticButton>

        <HapticButton
          variant="secondary"
          skeuomorphic={false}
          onClick={handleReset}
          className="p-3 rounded-xl bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900"
          title={t('cpr.reset')}
        >
          <RotateCcw className="w-5 h-5 text-slate-700" />
        </HapticButton>
      </div>

      {/* AHA Rules & Guardrails */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5 font-sans">
        <div className="font-semibold flex items-center gap-1.5 font-mono text-slate-900">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('cpr.guidelines')}</span>
        </div>
        <div className="space-y-1 pl-5 list-disc text-slate-600">
          <div>• {t('cpr.rule1')}</div>
          <div>• {t('cpr.rule2')}</div>
          <div>• {t('cpr.rule3')}</div>
          <div>• {t('cpr.rule4')}</div>
        </div>
      </div>
    </div>
  );
};
