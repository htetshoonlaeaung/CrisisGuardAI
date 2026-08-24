import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  MapPin,
  ListFilter,
  History,
  Cpu,
  PhoneCall,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  AlertTriangle,
  Copy,
  Check,
  X
} from 'lucide-react';
import { TriageSeverity } from '../../types';
import { SeverityBadge } from './SeverityBadge';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface CollapsibleSidebarProps {
  activeView: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status';
  onChangeView: (view: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status') => void;
  currentSeverity: TriageSeverity;
  sessionToken: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeView,
  onChangeView,
  currentSeverity,
  sessionToken,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const { themeMode, setThemeMode } = useTheme();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(sessionToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { id: 'triage', labelKey: 'nav.triage', icon: Activity, tag: 'CORE' },
    { id: 'shelters', labelKey: 'nav.shelters', icon: MapPin, tag: 'GEO' },
    { id: 'scheduler', labelKey: 'nav.scheduler', icon: ListFilter, tag: 'SOLVER' },
    { id: 'audit', labelKey: 'nav.audit', icon: History, tag: 'LOGS' },
    { id: 'status', labelKey: 'nav.status', icon: Cpu, tag: 'KB' },
  ] as const;

  const handleNavClick = (viewId: typeof navItems[number]['id']) => {
    onChangeView(viewId);
    if (onCloseMobile && window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <aside
      id="collapsible-left-sidebar"
      className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-r border-slate-800 bg-[#0F172A] text-slate-200 shadow-2xl backdrop-blur-xl overflow-y-auto overflow-x-hidden ${
        isCollapsed
          ? '-translate-x-full lg:translate-x-0 lg:w-20'
          : 'translate-x-0 w-72 max-w-[85vw]'
      }`}
    >
      {/* Top Brand & Collapse Toggle */}
      <div className="w-full">
        <div
          className={`flex items-center ${
            isCollapsed
              ? 'lg:flex-col lg:justify-center p-3 gap-2'
              : 'justify-between p-4'
          } border-b border-slate-800 bg-[#0F172A]`}
        >
          <div className={`flex min-w-0 flex-col items-start overflow-hidden ${isCollapsed ? 'lg:items-center' : ''}`}>
            {isCollapsed ? (
              <img
                src="/crisisguard-logo.png"
                alt="CrisisGuard AI"
                className="h-11 w-auto max-w-[54px] object-contain object-left"
              />
            ) : (
              <div className="flex min-w-0 items-center gap-2.5 whitespace-nowrap" aria-label="CrisisGuard AI">
                <div className="relative h-12 w-[47px] flex-shrink-0 overflow-hidden">
                  <img
                    src="/crisisguard-logo.png"
                    alt=""
                    aria-hidden="true"
                    className="h-full w-auto max-w-none object-contain object-left"
                  />
                </div>
                <div className="flex items-baseline text-[22px] font-black leading-none tracking-tight">
                  <span className="text-white">CrisisGuard</span>
                  <span className="text-red-500">AI</span>
                </div>
              </div>
            )}
            {!isCollapsed && (
              <span className="mt-1 text-[10px] font-mono uppercase tracking-wider font-semibold truncate text-blue-400">
                {t('common.prologSymbolicLogic')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Haptic Toggle Button */}
            <HapticButton
              id="sidebar-toggle-btn"
              variant="icon"
              skeuomorphic={false}
              onClick={onToggleCollapse}
              className="w-8 h-8 rounded-lg p-0 flex items-center justify-center flex-shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              title={isCollapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              )}
            </HapticButton>

            {/* Mobile close button when expanded */}
            {!isCollapsed && onCloseMobile && (
              <HapticButton
                variant="ghost"
                skeuomorphic={false}
                onClick={onCloseMobile}
                className="w-8 h-8 p-0 rounded-lg lg:hidden text-slate-400 hover:text-white flex items-center justify-center"
                title={t('common.closeDrawer')}
              >
                <X className="w-4 h-4" />
              </HapticButton>
            )}
          </div>
        </div>

        {/* Grounding Star Badge Ribbon */}
        <div
          className={`px-3 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center ${
            isCollapsed ? 'justify-center' : 'gap-2'
          }`}
          title={isCollapsed ? `${t('common.groundingPrefix')}${t('common.groundingKb')} (${t('common.deterministicAuditable')})` : undefined}
        >
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0 bg-blue-950/60 border border-blue-800 text-blue-400">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-mono font-bold leading-tight truncate text-blue-400">
                {t('common.groundingFormal')}
              </div>
              <div className="text-[10px] truncate text-slate-400">
                {t('common.deterministicAuditable')}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items with Haptic feel */}
        <nav className="p-2.5 md:p-3 space-y-1.5">
          <div className="px-2 pb-1">
            {!isCollapsed ? (
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400">
                {t('common.operationalViews')}
              </span>
            ) : (
              <div className="w-full h-px my-1 bg-slate-800" />
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <HapticButton
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                variant={isActive ? 'blue' : 'ghost'}
                skeuomorphic={false}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-start gap-3 px-3 py-2.5'
                } rounded-xl text-xs md:text-sm font-medium transition-all duration-150 relative group ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
                title={isCollapsed ? t(item.labelKey) : undefined}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-lg transition-colors flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{t(item.labelKey)}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                        isActive
                          ? 'bg-blue-700 border-blue-500 text-white font-semibold'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white shadow-xs" />
                )}
              </HapticButton>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Severity, Theme Switcher & Token */}
      <div className="p-2.5 md:p-3 border-t border-slate-800 bg-[#0F172A] space-y-2.5">
        {/* Severity Indicator */}
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <div className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-700 bg-slate-800/90 shadow-2xs">
              <span className="text-[11px] font-mono text-slate-300">{t('common.status')}</span>
              <SeverityBadge severity={currentSeverity} size="sm" />
            </div>
          ) : (
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                currentSeverity === 'critical'
                  ? 'bg-red-600 animate-ping'
                  : currentSeverity === 'high'
                  ? 'bg-amber-500'
                  : currentSeverity === 'moderate'
                  ? 'bg-blue-400'
                  : 'bg-emerald-400'
              }`}
              title={`Severity: ${currentSeverity}`}
            />
          )}
        </div>

        {/* 1-Tap Emergency Hotline CTA */}
        <div className="space-y-1.5">
          <a
            href="tel:199"
            className={`w-full py-2.5 ${
              isCollapsed ? 'px-0' : 'px-3'
            } rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hbtn bg-red-600 hover:bg-red-500 text-white`}
            title={t('common.call199Direct')}
          >
            <PhoneCall className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{t('common.emergency199Short')}</span>}
          </a>
        </div>

        {/* Theme Switcher */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="text-[10px] font-mono uppercase font-bold block text-slate-400">
              {t('common.themeMode')}
            </span>
          )}
          <div
            className={`relative ${
              isCollapsed ? 'flex flex-col gap-1' : 'grid grid-cols-3 gap-1'
            } p-1 rounded-xl border border-slate-700/80 bg-slate-900/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]`}
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
                        // ignore
                      }
                    }
                    setThemeMode(item.id);
                  }}
                  className={`relative z-10 py-1.5 flex items-center justify-center ${
                    isCollapsed ? 'w-full px-0' : ''
                  } rounded-lg text-xs transition-colors duration-200 cursor-pointer select-none ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={item.label}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-theme-switch-indicator"
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
        </div>

        {/* Session Token */}
        {!isCollapsed && (
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono border-t border-slate-800 text-slate-400">
            <span className="truncate">{t('common.sess')} {sessionToken.slice(0, 8)}...</span>
            <HapticButton
              variant="ghost"
              skeuomorphic={false}
              onClick={handleCopyToken}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title={t('common.copyToken')}
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </HapticButton>
          </div>
        )}
      </div>
    </aside>
  );
};
