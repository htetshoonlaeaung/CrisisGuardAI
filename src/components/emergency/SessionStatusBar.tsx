import React, { useState } from 'react';
import { TriageSeverity, CrisisDomain } from '../../types';
import { SeverityBadge } from './SeverityBadge';
import { useTheme } from '../../context/ThemeContext';
import { HapticButton } from '../ui/HapticButton';
import {
  Shield,
  Sparkles,
  PhoneCall,
  Copy,
  Check,
  Sun,
  Moon,
  AlertTriangle,
  Sidebar
} from 'lucide-react';

interface SessionStatusBarProps {
  sessionToken: string;
  currentSeverity?: TriageSeverity;
  domain?: CrisisDomain;
  activeView?: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status';
  onChangeView?: (view: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status') => void;
  evaluationLatencyMs?: number;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const SessionStatusBar: React.FC<SessionStatusBarProps> = ({
  sessionToken,
  currentSeverity = 'moderate',
  evaluationLatencyMs,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const { themeMode, setThemeMode, isLight } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(sessionToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      id="session-status-bar"
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-xs'
          : 'bg-[#090909]/95 border-[#2A2A2A] text-zinc-100'
      }`}
    >
      {/* 1. Top emergency dispatch ribbon - Responsive single-row layout */}
      <div
        className={`px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 text-xs border-b transition-colors duration-200 ${
          isLight
            ? 'bg-zinc-100/90 border-zinc-200 text-zinc-700'
            : 'bg-[#111111] border-[#2A2A2A] text-zinc-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Grounding Badge (Amber/Gold system) */}
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] tracking-wide font-mono font-bold shadow-xs whitespace-nowrap truncate ${
              isLight
                ? 'bg-amber-100/80 border border-amber-300 text-amber-900'
                : 'bg-[rgba(255,171,0,0.12)] border border-[rgba(255,171,0,0.30)] text-[#FFAB00]'
            }`}
          >
            <Sparkles className={`w-3 h-3 flex-shrink-0 ${isLight ? 'text-amber-700 fill-amber-700' : 'text-[#FFAB00] fill-[#FFAB00]'}`} />
            <span><span className="hidden sm:inline">Grounding: </span>Prolog Symbolic KB</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
            <span>Session:</span>
            <button
              onClick={handleCopyToken}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-zinc-300 text-zinc-800 hover:text-black hover:bg-zinc-50 shadow-xs'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-300 hover:text-white hover:border-zinc-500'
              }`}
              title="Copy session token"
            >
              <span>{sessionToken ? sessionToken.slice(0, 8) + '...' : 'init'}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-400" />}
            </button>
          </div>
        </div>

        {/* Rapid One-Tap Emergency Hotlines */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <a
            href="tel:911"
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-[11px] sm:text-xs transition-all shadow-xs hbtn whitespace-nowrap ${
              isLight
                ? 'bg-[#EF4444] hover:bg-[#FF3B30] text-white border border-[#EF4444]'
                : 'bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] hover:text-red-300 border border-[#EF4444]/40 hover:border-[#EF4444]/60'
            }`}
          >
            <PhoneCall className="w-3 h-3" />
            <span>911 Emergency</span>
          </a>
          <a
            href="tel:18002221222"
            className={`hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-xs font-semibold transition-colors hbtn ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-800 shadow-xs hover:bg-zinc-100'
                : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-300 hover:text-white hover:border-zinc-500'
            }`}
          >
            <span>Poison: 1-800-222-1222</span>
          </a>
        </div>
      </div>

      {/* 2. Main Header bar with Sidebar Toggle & Adaptive Mobile Spacing */}
      <div
        className={`px-3 sm:px-4 py-2 flex items-center justify-between gap-2 transition-colors duration-200 ${
          isLight
            ? 'bg-white text-zinc-900'
            : 'bg-[#090909] text-zinc-100'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Haptic Sidebar Toggle Button */}
          <HapticButton
            id="header-sidebar-toggle-btn"
            variant="secondary"
            skeuomorphic={true}
            onClick={onToggleSidebar}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all flex-shrink-0 ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800 shadow-xs'
                : 'bg-[#1A1A1A] hover:bg-[#2A2A2A] border-[#2A2A2A] text-zinc-200 hover:text-white shadow-xs'
            }`}
            title="Toggle Left Taskbar / Sidebar"
          >
            <Sidebar className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
            <span className="hidden md:inline font-mono">
              {isSidebarCollapsed ? 'Taskbar' : 'Hide'}
            </span>
          </HapticButton>

          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black shadow-xs flex-shrink-0 ${
                isLight
                  ? 'bg-amber-100 border border-amber-300 text-amber-800'
                  : 'bg-[#1A1A1A] border border-[rgba(255,171,0,0.40)] text-[#FFAB00]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <span className={`font-extrabold text-xs sm:text-sm md:text-base tracking-tight truncate block ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                CrisisGuard <span className={isLight ? 'text-amber-600 font-black' : 'text-[#FFAB00]'}>AI</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right side controls: Compact theme toggles + Responsive Severity Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {evaluationLatencyMs !== undefined && (
            <span
              className={`hidden md:inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-lg border ${
                isLight
                  ? 'bg-amber-50 border-amber-200 text-amber-800 font-semibold'
                  : 'text-[#FFAB00] bg-[rgba(255,171,0,0.10)] border-[rgba(255,171,0,0.25)] font-semibold'
              }`}
            >
              <span>⚡ {evaluationLatencyMs}ms</span>
            </span>
          )}

          {/* Theme switcher with Haptic Buttons - Compact for mobile */}
          <div
            className={`flex items-center gap-0.5 p-0.5 sm:p-1 rounded-xl border flex-shrink-0 ${
              isLight
                ? 'bg-zinc-100 border-zinc-300 shadow-xs'
                : 'bg-[#111111] border-[#2A2A2A] shadow-xs'
            }`}
          >
            <HapticButton
              variant={themeMode === 'dark' ? 'primary' : 'ghost'}
              skeuomorphic={false}
              onClick={() => setThemeMode('dark')}
              className={`p-1 sm:p-1.5 rounded-lg text-xs transition-colors ${
                themeMode === 'dark'
                  ? 'bg-zinc-800 text-[#FFAB00] font-bold shadow'
                  : isLight
                  ? 'text-zinc-600 hover:text-black hover:bg-zinc-200'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </HapticButton>
            <HapticButton
              variant={themeMode === 'light' ? 'primary' : 'ghost'}
              skeuomorphic={false}
              onClick={() => setThemeMode('light')}
              className={`p-1 sm:p-1.5 rounded-lg text-xs transition-colors ${
                themeMode === 'light'
                  ? 'bg-white text-zinc-950 font-bold shadow border border-zinc-300'
                  : isLight
                  ? 'text-zinc-600'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </HapticButton>
            <HapticButton
              variant={themeMode === 'alert' ? 'danger' : 'ghost'}
              skeuomorphic={false}
              onClick={() => setThemeMode('alert')}
              className={`p-1 sm:p-1.5 rounded-lg text-xs transition-colors ${
                themeMode === 'alert' ? 'font-bold shadow' : isLight ? 'text-zinc-600' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Alert Mode"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </HapticButton>
          </div>

          <div className="flex-shrink-0">
            <SeverityBadge severity={currentSeverity} size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
