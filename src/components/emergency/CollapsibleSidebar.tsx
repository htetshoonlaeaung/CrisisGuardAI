import React, { useState } from 'react';
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
import { CrisisGuardLogo } from '../CrisisGuardLogo';

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
  const { themeMode, setThemeMode, isLight } = useTheme();
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
      className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-r ${
        isCollapsed
          ? '-translate-x-full lg:translate-x-0 lg:w-20'
          : 'translate-x-0 w-72 max-w-[85vw]'
      } ${
        isLight
          ? 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
          : 'bg-[#090909] border-[#2A2A2A] text-zinc-200 shadow-2xl'
      } backdrop-blur-xl overflow-y-auto overflow-x-hidden`}
    >
      {/* Top Brand & Collapse Toggle */}
      <div className="w-full">
        <div
          className={`flex items-center ${
            isCollapsed
              ? 'lg:flex-col lg:justify-center p-3 gap-2'
              : 'justify-between p-4'
          } border-b ${
            isLight ? 'border-zinc-200 bg-zinc-50' : 'border-[#2A2A2A] bg-[#090909]'
          }`}
        >
          <div className={`flex min-w-0 flex-col items-start overflow-hidden ${isCollapsed ? 'lg:items-center' : ''}`}>
            {isCollapsed ? (
              <CrisisGuardLogo
                alt="CrisisGuard AI"
                className="h-11 w-auto max-w-[54px] object-contain object-left"
              />
            ) : (
              <div className="flex min-w-0 items-center gap-2.5 whitespace-nowrap" aria-label="CrisisGuard AI">
                <div className="relative h-12 w-[47px] flex-shrink-0 overflow-hidden">
                  <CrisisGuardLogo
                    alt="CrisisGuard AI logo"
                    className="h-full w-auto max-w-none object-contain object-left"
                  />
                </div>
                <div className="flex items-baseline text-[20px] font-bold leading-none">
                  <span className="text-[#0B2F63]">CrisisGuard</span>
                  <span className="text-[#EF233C]">AI</span>
                </div>
              </div>
            )}
            {!isCollapsed && (
              <span
                className={`mt-1 text-[10px] font-mono uppercase tracking-wider font-semibold truncate ${
                  isLight ? 'text-amber-800' : 'text-[#FFAB00]'
                }`}
              >
                {t('common.prologSymbolicLogic')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Haptic Toggle Button */}
            <HapticButton
              id="sidebar-toggle-btn"
              variant="icon"
              onClick={onToggleCollapse}
              className={`w-8 h-8 rounded-lg p-0 flex items-center justify-center flex-shrink-0 ${
                isLight ? 'bg-zinc-100 hover:bg-zinc-200 border border-zinc-300' : ''
              }`}
              title={isCollapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
            >
              {isCollapsed ? (
                <ChevronRight className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
              ) : (
                <ChevronLeft className={`w-4 h-4 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`} />
              )}
            </HapticButton>

            {/* Mobile close button when expanded */}
            {!isCollapsed && onCloseMobile && (
              <HapticButton
                variant="ghost"
                onClick={onCloseMobile}
                className="w-8 h-8 p-0 rounded-lg lg:hidden text-zinc-500 hover:text-zinc-900 flex items-center justify-center"
                title={t('common.closeDrawer')}
              >
                <X className="w-4 h-4" />
              </HapticButton>
            )}
          </div>
        </div>

        {/* Grounding Star Badge Ribbon */}
        <div
          className={`px-3 py-2 border-b flex items-center ${
            isCollapsed ? 'justify-center' : 'gap-2'
          } ${
            isLight ? 'bg-amber-50/60 border-zinc-200' : 'bg-[#111111] border-[#2A2A2A]'
          }`}
          title={isCollapsed ? `${t('common.groundingPrefix')}${t('common.groundingKb')} (${t('common.deterministicAuditable')})` : undefined}
        >
          <div
            className={`inline-flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0 ${
              isLight ? 'bg-amber-100 border border-amber-300 text-amber-800' : 'bg-[rgba(255,171,0,0.12)] border border-[rgba(255,171,0,0.30)] text-[#FFAB00]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className={`text-[11px] font-mono font-bold leading-tight truncate ${isLight ? 'text-amber-900' : 'text-[#FFAB00]'}`}>
                {t('common.groundingFormal')}
              </div>
              <div className={`text-[10px] truncate ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {t('common.deterministicAuditable')}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items with Haptic feel */}
        <nav className="p-2.5 md:p-3 space-y-1.5">
          <div className="px-2 pb-1">
            {!isCollapsed ? (
              <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {t('common.operationalViews')}
              </span>
            ) : (
              <div className={`w-full h-px my-1 ${isLight ? 'bg-zinc-200' : 'bg-[#2A2A2A]'}`} />
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <HapticButton
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                variant={isActive ? (isLight ? 'primary' : 'amber') : 'ghost'}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-start gap-3 px-3 py-2.5'
                } rounded-xl text-xs md:text-sm font-medium transition-all duration-150 relative group ${
                  isActive
                    ? isLight
                      ? 'bg-zinc-900 text-white font-bold shadow-md'
                      : 'bg-[#1A1A1A] text-[#FFAB00] border border-[rgba(255,171,0,0.50)] shadow-lg shadow-amber-500/10 font-bold'
                    : isLight
                    ? 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 border border-transparent'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#111111] border border-transparent'
                }`}
                title={isCollapsed ? t(item.labelKey) : undefined}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-lg transition-colors flex-shrink-0 ${
                    isActive
                      ? isLight ? 'text-amber-400' : 'text-[#FFAB00]'
                      : isLight ? 'text-zinc-500 group-hover:text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-200'
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
                          ? isLight
                            ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                            : 'bg-[rgba(255,171,0,0.15)] border-[rgba(255,171,0,0.35)] text-[#FFAB00]'
                          : isLight
                          ? 'bg-zinc-100 border-zinc-200 text-zinc-500'
                          : 'bg-zinc-800/40 border-[#2A2A2A] text-zinc-500'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full shadow-sm ${
                      isLight ? 'bg-amber-600' : 'bg-[#FFAB00] shadow-[0_0_8px_rgba(255,171,0,0.5)]'
                    }`}
                  />
                )}
              </HapticButton>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Severity, Theme Switcher & Token */}
      <div className={`p-2.5 md:p-3 border-t space-y-2.5 ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-[#2A2A2A] bg-[#090909]'}`}>
        {/* Severity Indicator */}
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <div
              className={`w-full flex items-center justify-between p-2 rounded-xl border ${
                isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#111111] border-[#2A2A2A]'
              }`}
            >
              <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>{t('common.status')}</span>
              <SeverityBadge severity={currentSeverity} size="sm" />
            </div>
          ) : (
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                currentSeverity === 'critical'
                  ? 'bg-[#EF4444] animate-ping'
                  : currentSeverity === 'high'
                  ? 'bg-amber-500'
                  : currentSeverity === 'moderate'
                  ? 'bg-yellow-400'
                  : 'bg-[#FFAB00]'
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
            } rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hbtn ${
              isLight
                ? 'bg-[#EF4444] hover:bg-[#FF3B30] text-white border border-[#EF4444]'
                : 'bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] hover:text-red-200 border border-[#EF4444]/40 hover:border-[#EF4444]/60'
            }`}
            title={t('common.call199Direct')}
          >
            <PhoneCall className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{t('common.emergency199Short')}</span>}
          </a>
        </div>

        {/* Theme Switcher with Haptic buttons */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className={`text-[10px] font-mono uppercase font-bold block ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t('common.themeMode')}
            </span>
          )}
          <div
            className={`${
              isCollapsed ? 'flex flex-col gap-1' : 'grid grid-cols-3 gap-1'
            } p-1 rounded-xl border ${
              isLight ? 'bg-zinc-200/80 border-zinc-300' : 'bg-[#111111] border-[#2A2A2A]'
            }`}
          >
            <HapticButton
              variant={themeMode === 'dark' ? 'primary' : 'ghost'}
              onClick={() => setThemeMode('dark')}
              className={`py-1.5 ${isCollapsed ? 'w-full px-0' : ''} rounded-lg text-xs ${
                themeMode === 'dark'
                  ? 'bg-zinc-800 text-[#FFAB00] font-bold shadow'
                  : isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400'
              }`}
              title={t('common.darkMode')}
            >
              <Moon className="w-3.5 h-3.5" />
            </HapticButton>
            <HapticButton
              variant={themeMode === 'light' ? 'primary' : 'ghost'}
              onClick={() => setThemeMode('light')}
              className={`py-1.5 ${isCollapsed ? 'w-full px-0' : ''} rounded-lg text-xs ${
                themeMode === 'light'
                  ? 'bg-white text-zinc-950 font-bold shadow border border-zinc-300'
                  : 'text-zinc-400'
              }`}
              title={t('common.lightMode')}
            >
              <Sun className="w-3.5 h-3.5" />
            </HapticButton>
            <HapticButton
              variant={themeMode === 'alert' ? 'danger' : 'ghost'}
              onClick={() => setThemeMode('alert')}
              className={`py-1.5 ${isCollapsed ? 'w-full px-0' : ''} rounded-lg text-xs ${
                themeMode === 'alert' ? 'font-bold shadow' : isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}
              title={t('common.alertMode')}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </HapticButton>
          </div>
        </div>

        {/* Session Token */}
        {!isCollapsed && (
          <div
            className={`pt-1 flex items-center justify-between text-[10px] font-mono border-t ${
              isLight ? 'border-zinc-200 text-zinc-600' : 'border-[#2A2A2A] text-zinc-400'
            }`}
          >
            <span className="truncate">{t('common.sess')} {sessionToken.slice(0, 8)}...</span>
            <HapticButton
              variant="ghost"
              onClick={handleCopyToken}
              className={`p-1 rounded ${isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-[#FFAB00]'}`}
              title={t('common.copyToken')}
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </HapticButton>
          </div>
        )}
      </div>
    </aside>
  );
};
