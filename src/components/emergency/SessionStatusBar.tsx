import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TriageSeverity, CrisisDomain } from '../../types';
import { SeverityBadge } from './SeverityBadge';
import { useTheme } from '../../context/ThemeContext';
import { HapticButton } from '../ui/HapticButton';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  PhoneCall,
  Copy,
  Check,
  Sun,
  Moon,
  AlertTriangle,
  Sidebar,
  Zap,
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
            </button>
          </div>
        </div>

        {/* Rapid One-Tap Emergency Hotlines */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="tel:199"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-extrabold text-xs bg-red-600 hover:bg-red-500 text-white shadow-xs transition-all hbtn whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('common.emergency199')}</span>
          </a>
          <a
            href="tel:18002221222"
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors hbtn"
          >
            <span>{t('common.poison')}</span>
          </a>
        </div>
      </div>

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
            <span className="hidden md:inline font-mono">
              {isSidebarCollapsed ? t('common.taskbar') : t('common.hide')}
            </span>
          </HapticButton>

          <div className="flex min-w-0 items-center gap-2" aria-label="CrisisGuard AI">
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
            </div>
          </div>
        </div>

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
                className={`h-7 rounded-lg px-2.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  language === option
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {languageNames[option]}
              </button>
            ))}
          </div>

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
          </div>

          <div className="flex-shrink-0">
            <SeverityBadge severity={currentSeverity} size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
