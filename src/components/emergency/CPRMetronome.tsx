import React, { useState, useEffect, useRef } from 'react';
import { HeartPulse, Play, Square, Volume2, VolumeX, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';

interface CPRMetronomeProps {
  onClose?: () => void;
}

export const CPRMetronome: React.FC<CPRMetronomeProps> = ({ onClose }) => {
  const { isLight } = useTheme();
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
      className={`rounded-2xl border p-4 md:p-6 shadow-2xl space-y-5 ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50' : 'border-[#2A2A2A] bg-[#111111] text-zinc-100'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-zinc-200' : 'border-[#2A2A2A]'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md ${
            isLight ? 'bg-red-100 border border-red-300 text-red-600' : 'bg-[#1A1A1A] border border-[#EF4444]/40 text-[#EF4444]'
          }`}>
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`font-extrabold text-sm md:text-base tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              AHA CPR Audio-Visual Metronome
            </h3>
            <p className={`text-xs font-mono ${isLight ? 'text-red-700 font-bold' : 'text-[#FFAB00]'}`}>
              110 Beats Per Minute • 30:2 Cycle Guide
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HapticButton
            variant="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-8 h-8 rounded-lg p-0 ${isLight ? 'bg-zinc-100 border border-zinc-300' : ''}`}
            title={isMuted ? 'Unmute beat' : 'Mute beat'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            ) : (
              <Volume2 className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
            )}
          </HapticButton>
          {onClose && (
            <HapticButton
              variant="secondary"
              onClick={onClose}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </HapticButton>
          )}
        </div>
      </div>

      {/* Visual Heartbeat & Rhythm Pulse */}
      <div className={`flex flex-col items-center justify-center py-6 rounded-xl border relative overflow-hidden ${
        isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'
      }`}>
        <div
          className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-100 ${
            isPushing
              ? isLight
                ? 'scale-110 bg-[#EF4444] border-red-600 text-white shadow-xl shadow-red-500/30'
                : 'scale-110 bg-[#FFAB00] border-white text-zinc-950 shadow-2xl shadow-amber-500/40'
              : isLight
              ? 'scale-95 bg-white border-zinc-300 text-zinc-800 shadow-sm'
              : 'scale-95 bg-[#1A1A1A] border-[rgba(255,171,0,0.40)] text-[#FFAB00]'
          }`}
        >
          <span className="text-2xl md:text-3xl font-black font-mono tracking-wider">
            {phase === 'breaths' ? 'BREATH' : isPushing ? 'PUSH' : 'RECOIL'}
          </span>
          <span className="text-xs font-mono font-bold opacity-90">
            {phase === 'breaths' ? 'Give 2 breaths' : 'Compress 2"'}
          </span>
        </div>

        {/* Real-time counters */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-6 px-4 text-center">
          <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-zinc-200' : 'bg-[#111111] border-[#2A2A2A]'}`}>
            <div className={`text-[10px] font-mono uppercase ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Current Beat</div>
            <div className={`text-xl font-bold font-mono ${isLight ? 'text-zinc-950' : 'text-white'}`}>{(beatCount % 30) || 30}/30</div>
          </div>
          <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-zinc-200' : 'bg-[#111111] border-[#2A2A2A]'}`}>
            <div className={`text-[10px] font-mono uppercase ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>CPR Cycle</div>
            <div className={`text-xl font-bold font-mono ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`}>#{cycleCount}</div>
          </div>
          <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-white border-zinc-200' : 'bg-[#111111] border-[#2A2A2A]'}`}>
            <div className={`text-[10px] font-mono uppercase ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Cadence</div>
            <div className={`text-xl font-bold font-mono ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`}>110 BPM</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <HapticButton
          variant={isActive ? 'secondary' : (isLight ? 'primary' : 'amber')}
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${
            isLight && !isActive ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950' : ''
          }`}
        >
          {isActive ? (
            <>
              <Square className={`w-4 h-4 fill-current ${isLight ? 'text-zinc-700' : 'text-[#FFAB00]'}`} />
              <span>Pause Metronome</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-zinc-950" />
              <span>Start Metronome (110 BPM)</span>
            </>
          )}
        </HapticButton>

        <HapticButton
          variant="secondary"
          onClick={handleReset}
          className={`p-3 rounded-xl ${isLight ? 'bg-zinc-100 border-zinc-300' : ''}`}
          title="Reset counter"
        >
          <RotateCcw className={`w-5 h-5 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`} />
        </HapticButton>
      </div>

      {/* AHA Rules & Guardrails */}
      <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 font-sans ${
        isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#111111] border-[#2A2A2A]'
      }`}>
        <div className={`font-semibold flex items-center gap-1.5 font-mono ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
          <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
          <span>AHA Guidelines for High-Quality CPR</span>
        </div>
        <div className={`space-y-1 pl-5 list-disc ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          <div>• Push hard and fast in center of chest: 2–2.4 inches (5–6 cm) deep.</div>
          <div>• Allow full chest recoil between compressions; do not lean on chest.</div>
          <div>• Minimize interruptions to compressions (&lt; 10 seconds).</div>
          <div>• Deliver 30 compressions followed by 2 rescue breaths (or continuous compressions if hands-only).</div>
        </div>
      </div>
    </div>
  );
};
