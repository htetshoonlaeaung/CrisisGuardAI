import React, { useState } from 'react';
<<<<<<< HEAD
import { motion } from 'motion/react';
=======
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
import { TriageSeverity, CrisisDomain } from '../../types';
import { SeverityBadge } from './SeverityBadge';
import { useTheme } from '../../context/ThemeContext';
import { HapticButton } from '../ui/HapticButton';
import { useLanguage } from '../../context/LanguageContext';
<<<<<<< HEAD
=======
import { CrisisGuardLogo } from '../CrisisGuardLogo';
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
import {
  Sparkles,
  PhoneCall,
  Copy,
  Check,
  Sun,
  Moon,
<<<<<<< HEAD
  AlertTriangle,
  Sidebar,
  Zap,
=======
  Sidebar
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
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
  const { language, setLanguage, languageNames, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(sessionToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      id="session-status-bar"
<<<<<<< HEAD
      className="sticky top-0 z-40 border-b border-slate-800 bg-[#0F172A] text-white shadow-sm transition-colors duration-200"
    >
      {/* 1. Top emergency dispatch ribbon - Clean Slate bar */}
      <div className="px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2 text-xs border-b border-slate-800/80 bg-[#020617]/70 text-slate-300">
        <div className="flex items-center gap-2 min-w-0">
          {/* Grounding Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-200 shadow-2xs whitespace-nowrap truncate">
            <Sparkles className="w-3 h-3 text-blue-400 fill-blue-400 flex-shrink-0" />
            <span><span className="hidden sm:inline">{t('common.groundingPrefix')}</span>{t('common.groundingKb')}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <span>{t('common.session')}</span>
            <button
              onClick={handleCopyToken}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700 bg-slate-800/90 text-slate-300 hover:text-white hover:border-slate-500 font-mono text-[11px] transition-colors cursor-pointer"
              title={t('common.copySessionToken')}
            >
              <span>{sessionToken ? sessionToken.slice(0, 8) + '...' : 'init'}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
=======
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
        isLight
          ? 'bg-[#082B5C]/95 border-[#082B5C] text-white shadow-xs'
          : 'bg-[#082B5C]/95 border-[#082B5C] text-white'
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
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* Grounding Badge (Amber/Gold system) */}
          <div
            className={`inline-flex max-w-[52vw] items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] tracking-wide font-mono font-bold shadow-xs whitespace-nowrap truncate sm:max-w-none ${
              isLight
                ? 'bg-amber-100/80 border border-amber-300 text-amber-900'
                : 'bg-[rgba(255,171,0,0.12)] border border-[rgba(255,171,0,0.30)] text-[#FFAB00]'
            }`}
          >
            <Sparkles className={`w-3 h-3 flex-shrink-0 ${isLight ? 'text-amber-700 fill-amber-700' : 'text-[#FFAB00] fill-[#FFAB00]'}`} />
            <span><span className="hidden sm:inline">{t('common.groundingPrefix')}</span>{t('common.groundingKb')}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
            <span>{t('common.session')}</span>
            <button
              onClick={handleCopyToken}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white border-zinc-300 text-zinc-800 hover:text-black hover:bg-zinc-50 shadow-xs'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-300 hover:text-white hover:border-zinc-500'
              }`}
              title={t('common.copySessionToken')}
            >
              <span>{sessionToken ? sessionToken.slice(0, 8) + '...' : 'init'}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-400" />}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            </button>
          </div>
        </div>

        {/* Rapid One-Tap Emergency Hotlines */}
<<<<<<< HEAD
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="tel:199"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-extrabold text-xs bg-red-600 hover:bg-red-500 text-white shadow-xs transition-all hbtn whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5" />
=======
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <a
            href="tel:199"
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-[11px] sm:text-xs transition-all shadow-xs hbtn whitespace-nowrap ${
              isLight
                ? 'bg-[#EF4444] hover:bg-[#FF3B30] text-white border border-[#EF4444]'
                : 'bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] hover:text-red-300 border border-[#EF4444]/40 hover:border-[#EF4444]/60'
            }`}
          >
            <PhoneCall className="w-3 h-3" />
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            <span>{t('common.emergency199')}</span>
          </a>
          <a
            href="tel:18002221222"
<<<<<<< HEAD
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors hbtn"
=======
            className={`hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-xs font-semibold transition-colors hbtn ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-800 shadow-xs hover:bg-zinc-100'
                : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-300 hover:text-white hover:border-zinc-500'
            }`}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
          >
            <span>{t('common.poison')}</span>
          </a>
        </div>
      </div>

<<<<<<< HEAD
      {/* 2. Main Header bar with Sidebar Toggle */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 bg-[#0F172A] text-white">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Sidebar Toggle Button */}
          <HapticButton
            id="header-sidebar-toggle-btn"
            variant="secondary"
            skeuomorphic={false}
            onClick={onToggleSidebar}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all flex-shrink-0"
            title={t('common.toggleSidebar')}
          >
            <Sidebar className="w-4 h-4 text-blue-400" />
=======
      {/* 2. Main Header bar with Sidebar Toggle & Adaptive Mobile Spacing */}
        <div
          className={`min-w-0 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 transition-colors duration-200 ${
          isLight
            ? 'bg-[#082B5C] text-white'
            : 'bg-[#082B5C] text-white'
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
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
            title={t('common.toggleSidebar')}
          >
            <Sidebar className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            <span className="hidden md:inline font-mono">
              {isSidebarCollapsed ? t('common.taskbar') : t('common.hide')}
            </span>
          </HapticButton>

          <div className="flex min-w-0 items-center gap-2" aria-label="CrisisGuard AI">
<<<<<<< HEAD
            <div className="relative h-10 w-[39px] flex-shrink-0 overflow-hidden sm:h-11 sm:w-[43px] md:h-12 md:w-[47px]">
              <img
                src="/crisisguard-logo.png"
                alt=""
                aria-hidden="true"
                className="h-full w-auto max-w-none object-contain object-left"
              />
            </div>
            <div className="flex min-w-0 items-baseline gap-1.5 text-[26px] sm:text-[28px] font-black leading-none tracking-tight">
              <span className="truncate text-white">CrisisGuard</span>
              <span className="text-red-500">AI</span>
=======
            <div className="relative h-8 w-[31px] flex-shrink-0 overflow-hidden sm:h-11 sm:w-[43px] md:h-12 md:w-[47px]">
              <CrisisGuardLogo
                alt="CrisisGuard AI logo"
                className="h-full w-auto max-w-none object-contain object-left"
              />
            </div>
            <div className="flex min-w-0 items-baseline gap-1 sm:gap-2 text-[20px] sm:text-[28px] font-black leading-none">
              <span className="truncate text-[#FFFFFF]">CrisisGuard</span>
              <span className="text-[#EA002C]">AI</span>
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {evaluationLatencyMs !== undefined && (
            <span className="hidden md:inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 font-semibold shadow-2xs">
              <Zap className="w-3 h-3 text-blue-400" />
              <span>{evaluationLatencyMs}ms</span>
            </span>
          )}

          {/* Language Selector */}
          <div
            className="flex items-center gap-0.5 p-0.5 sm:p-1 rounded-xl border border-slate-700 bg-slate-800/90 shadow-2xs flex-shrink-0"
=======
        {/* Right side controls: Compact theme toggles + Responsive Severity Pill */}
        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2.5">
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

          <div
            className={`flex items-center gap-0.5 p-0.5 sm:p-1 rounded-xl border flex-shrink-0 ${
              isLight
                ? 'bg-zinc-100 border-zinc-300 shadow-xs'
                : 'bg-[#111111] border-[#2A2A2A] shadow-xs'
            }`}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            role="group"
            aria-label={t('language.label')}
          >
            {(['en', 'my'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLanguage(option)}
                aria-pressed={language === option}
                aria-label={option === 'en' ? t('language.english') : t('language.myanmar')}
<<<<<<< HEAD
                className={`h-7 rounded-lg px-2.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  language === option
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
=======
                className={`h-7 rounded-lg px-2 text-[11px] font-bold transition-colors ${
                  language === option
                    ? isLight
                      ? 'bg-white text-zinc-950 shadow border border-zinc-300'
                      : 'bg-zinc-800 text-[#FFAB00] shadow'
                    : isLight
                    ? 'text-zinc-600 hover:text-black hover:bg-zinc-200'
                    : 'text-zinc-400 hover:text-zinc-200'
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
                }`}
              >
                {languageNames[option]}
              </button>
            ))}
          </div>

<<<<<<< HEAD
          {/* Theme switcher */}
          <div
            className="relative flex items-center p-0.5 sm:p-1 rounded-xl border border-slate-700/80 bg-slate-900/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.06)] flex-shrink-0"
            role="radiogroup"
            aria-label="Theme selector"
          >
            {[
              {
                id: 'dark' as const,
                label: t('common.darkMode'),
                icon: Moon,
                activeBg: 'bg-amber-500 text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.4)]',
              },
              {
                id: 'light' as const,
                label: t('common.lightMode'),
                icon: Sun,
                activeBg: 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(255,255,255,0.35)]',
              },
              {
                id: 'alert' as const,
                label: t('common.alertMode'),
                icon: AlertTriangle,
                activeBg: 'bg-red-600 text-white shadow-[0_2px_8px_rgba(220,38,38,0.45)]',
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = themeMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) {
                      try {
                        navigator.vibrate(10);
                      } catch {
                        // ignore if permissions prevent
                      }
                    }
                    setThemeMode(item.id);
                  }}
                  className={`relative z-10 p-1.5 rounded-lg text-xs transition-colors duration-200 cursor-pointer select-none ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={item.label}
                  aria-checked={isActive}
                  role="radio"
                >
                  {isActive && (
                    <motion.div
                      layoutId="header-theme-switch-indicator"
                      className={`absolute inset-0 rounded-lg ${item.activeBg}`}
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 28,
                      }}
                    />
                  )}
                  <motion.span
                    className="relative z-10 block"
                    animate={{
                      scale: isActive ? 1.05 : 0.92,
                      rotate: isActive ? 0 : item.id === 'dark' ? -20 : item.id === 'light' ? 45 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive
                          ? item.id === 'alert'
                            ? 'text-white'
                            : 'text-slate-950'
                          : 'text-slate-400'
                      }`}
                    />
                  </motion.span>
                </button>
              );
            })}
=======
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
              title={t('common.darkMode')}
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
              title={t('common.lightMode')}
            >
              <Sun className="w-3.5 h-3.5" />
            </HapticButton>
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
          </div>

          <div className="flex-shrink-0">
            <SeverityBadge severity={currentSeverity} size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
