import React, { useState } from 'react';
<<<<<<< HEAD
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Building2,
  Cpu,
  Radio,
  Sparkles,
  Activity,
  Search,
  SlidersHorizontal,
  Plus,
=======
import {
  Activity,
  MapPin,
  ListFilter,
  History,
  Cpu,
  PhoneCall,
  Sparkles,
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Copy,
  Check,
<<<<<<< HEAD
} from 'lucide-react';
import { TriageSeverity } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
=======
  X
} from 'lucide-react';
import { TriageSeverity } from '../../types';
import { SeverityBadge } from './SeverityBadge';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { CrisisGuardLogo } from '../CrisisGuardLogo';
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9

interface CollapsibleSidebarProps {
  activeView: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status';
  onChangeView: (view: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status') => void;
  currentSeverity: TriageSeverity;
  sessionToken: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

<<<<<<< HEAD
interface NavItem {
  id: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status' | 'savings';
  targetView: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeView,
  onChangeView,
=======
export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeView,
  onChangeView,
  currentSeverity,
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
  sessionToken,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const { themeMode, setThemeMode, isLight } = useTheme();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
<<<<<<< HEAD
  const [filterQuery, setFilterQuery] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
=======
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9

  const handleCopyToken = () => {
    navigator.clipboard.writeText(sessionToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

<<<<<<< HEAD
  const navItems: NavItem[] = [
    {
      id: 'triage',
      targetView: 'triage',
      label: 'Emergency Triage',
      icon: ShieldAlert,
    },
    {
      id: 'shelters',
      targetView: 'shelters',
      label: 'Shelter Hubs & Map',
      icon: Building2,
    },
    {
      id: 'scheduler',
      targetView: 'scheduler',
      label: 'Dispatch Engine',
      icon: Cpu,
    },
    {
      id: 'audit',
      targetView: 'audit',
      label: 'Live Comms & Audio',
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      id: 'savings',
      targetView: 'scheduler',
      label: 'Resource Optimization',
      icon: Sparkles,
    },
    {
      id: 'status',
      targetView: 'status',
      label: 'Ops & Telemetry',
      icon: Activity,
    },
  ];

  const handleNavClick = (viewId: 'triage' | 'shelters' | 'scheduler' | 'audit' | 'status') => {
=======
  const navItems = [
    { id: 'triage', labelKey: 'nav.triage', icon: Activity, tag: 'CORE' },
    { id: 'shelters', labelKey: 'nav.shelters', icon: MapPin, tag: 'GEO' },
    { id: 'scheduler', labelKey: 'nav.scheduler', icon: ListFilter, tag: 'SOLVER' },
    { id: 'audit', labelKey: 'nav.audit', icon: History, tag: 'LOGS' },
    { id: 'status', labelKey: 'nav.status', icon: Cpu, tag: 'KB' },
  ] as const;

  const handleNavClick = (viewId: typeof navItems[number]['id']) => {
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    onChangeView(viewId);
    if (onCloseMobile && window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

<<<<<<< HEAD
  const filteredNavItems = navItems.filter((item) =>
    !filterQuery || item.label.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <aside
      id="collapsible-left-sidebar"
      className={`fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsed
          ? '-translate-x-full lg:translate-x-0 lg:w-[84px]'
          : 'translate-x-0 w-[270px] sm:w-[285px] max-w-[88vw]'
      } p-3 sm:p-4 flex flex-col pointer-events-none select-none`}
    >
      {/* Exact Ultra-Modern Frosted Glass Pill Container */}
      <div
        className={`w-full h-full rounded-[36px] border flex flex-col justify-between overflow-hidden pointer-events-auto transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-3xl relative ${
          isLight
            ? 'bg-[#E5E7EB]/95 border-black/15 text-black shadow-slate-400/40'
            : 'bg-[#1E212B]/90 border-white/10 text-slate-200 shadow-black/70'
        }`}
      >
        {/* Subtle Inner Ambient Glow matching dark mode palette */}
        <div
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-slate-500/10 dark:bg-purple-600/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-slate-500/10 dark:bg-blue-600/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Unfolded Floating Edge Toggle Button (< on right edge of card) */}
        {!isCollapsed && (
          <button
            id="sidebar-toggle-btn"
            onClick={onToggleCollapse}
            className="absolute top-9 -right-0.5 z-20 w-6 h-6 rounded-l-full bg-white hover:bg-slate-100 text-black dark:bg-[#2C303E] dark:hover:bg-[#373C4D] dark:text-white flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 border border-black/15 dark:border-white/10"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5 -ml-0.5 text-black dark:text-white" />
          </button>
        )}

        {/* Top Segment: Traffic Lights, User Header, Search, Navigation, Onboarding */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 min-h-0 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-10 text-black dark:text-white">
          {/* macOS Style Traffic Lights Window Controls */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} pb-4`}>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-xs" />
            </div>
          </div>

          {/* User Profile / Responder Identity */}
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center mb-4' : 'gap-3 mb-4'
            }`}
          >
            <button
              onClick={onToggleCollapse}
              className="relative flex-shrink-0 cursor-pointer focus:outline-none"
              title="User Profile"
            >
              <div className="w-10 h-10 rounded-full p-[1.5px] shadow-md hover:scale-105 transition-transform bg-black/20 dark:bg-white/10">
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#CBD5E1] dark:bg-[#383E4E]">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="50" className="fill-[#CBD5E1] dark:fill-[#383E4E]" />
                    <circle cx="50" cy="42" r="17.5" fill="#FFFFFF" />
                    <path
                      d="M21.2 88.5 C 28.5 70.5, 41 65, 50 65 C 59 65, 71.5 70.5, 78.8 88.5 A 50 50 0 0 1 21.2 88.5 Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
              </div>
            </button>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-black tracking-tight text-black dark:text-white leading-snug truncate">
                  Sophia
                </div>
                <div className="text-[12px] text-black/80 dark:text-slate-400 font-bold leading-tight truncate">
                  Reynolds
                </div>
              </div>
            )}
          </div>

          {/* Search Box / Pill */}
          <div className="mb-5">
            {isCollapsed ? (
              <button
                onClick={onToggleCollapse}
                className="w-10 h-10 mx-auto rounded-full bg-white dark:bg-[#2C303E] flex items-center justify-center shadow-md hover:bg-slate-100 dark:hover:bg-[#373C4D] transition-all cursor-pointer group border border-black/15 dark:border-white/10"
                title="Search..."
              >
                <Search className="w-4 h-4 text-black dark:text-white group-hover:scale-110 transition-transform" />
              </button>
            ) : (
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#2A2E3D] text-black dark:text-white font-bold text-xs pl-8 pr-3 py-2 rounded-full shadow-md outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/20 border border-black/20 dark:border-white/10 transition-all placeholder:text-black/60 dark:placeholder:text-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-black dark:text-slate-300 absolute left-3 pointer-events-none" />
                {filterQuery && (
                  <button
                    onClick={() => setFilterQuery('')}
                    className="absolute right-3 text-black dark:text-white hover:text-slate-700 dark:hover:text-slate-300 text-xs font-black cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Hairline Divider */}
          <div className="w-full h-px bg-black/20 dark:bg-white/10 mb-3" />

          {/* MENU Section Label */}
          <div className="mb-2 px-1">
            {!isCollapsed ? (
              <span className="text-[11px] font-black tracking-wider text-black dark:text-slate-400 uppercase">
                OPERATIONS MENU
              </span>
            ) : (
              <span className="text-[9px] font-black tracking-wider text-black dark:text-slate-400 uppercase block text-center">
                OPS
              </span>
            )}
          </div>

          {/* Navigation Items in exact visual order and icon layout */}
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isTargetActive = activeView === item.targetView && item.id !== 'savings';

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleNavClick(item.targetView)}
                  className={`w-full group text-left rounded-xl py-2 px-2.5 transition-all relative flex items-center cursor-pointer ${
                    isTargetActive
                      ? 'text-black dark:text-white font-black bg-white/70 dark:bg-white/10 shadow-xs border border-black/20 dark:border-white/10'
                      : 'text-black dark:text-slate-300 font-bold hover:bg-black/10 dark:hover:bg-white/5'
                  } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon
                        className="w-4.5 h-4.5 text-black dark:text-white stroke-[2.5]"
                      />
                    </div>

                    {!isCollapsed && (
                      <span className="text-[13.5px] tracking-tight truncate font-black text-black dark:text-slate-200 group-hover:underline decoration-1 underline-offset-2">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs ${
                        item.badgeColor || 'bg-[#1D68FE] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* QUICK INCIDENT ACTION Section Header */}
          <div className="mt-6 mb-2 px-1">
            {!isCollapsed ? (
              <span className="text-[11px] font-black tracking-wider text-black dark:text-slate-400 uppercase">
                RAPID ACTION
              </span>
            ) : (
              <span className="text-[9px] font-black tracking-wider text-black dark:text-slate-400 uppercase block text-center">
                ACTION
              </span>
            )}
          </div>

          {/* Quick Emergency Triage Action Card / Button */}
          <div className="mt-1">
            {!isCollapsed ? (
              <div
                onClick={() => handleNavClick('triage')}
                className="w-full py-4 px-3 rounded-2xl bg-white/75 dark:bg-[#282C3A]/80 hover:bg-white dark:hover:bg-[#323748] border border-black/20 dark:border-white/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2 shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/30 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-[12px] font-black text-black dark:text-slate-200 group-hover:underline transition-colors">
                  New Incident Triage
                </span>
              </div>
            ) : (
              <div className="flex justify-center py-1">
                <button
                  onClick={() => handleNavClick('triage')}
                  className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 hover:scale-110 transition-transform cursor-pointer"
                  title="New Incident Triage"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Settings matching reference image footer */}
        <div className="p-3.5 sm:p-4 border-t border-black/20 dark:border-white/10 relative z-10 text-black dark:text-white">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowSettingsModal((prev) => !prev)}
                className="flex items-center gap-2 text-[13px] font-black text-black dark:text-slate-300 hover:underline dark:hover:text-white transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-black dark:text-slate-300" />
                <span className="text-black dark:text-slate-200">Settings</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setThemeMode(isLight ? 'dark' : 'light')}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-black dark:text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                  title={isLight ? 'Dark Mode' : 'Light Mode'}
                >
                  {isLight ? <Moon className="w-3.5 h-3.5 text-black" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setShowSettingsModal((prev) => !prev)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black dark:text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                title="Settings"
              >
                <SlidersHorizontal className="w-4 h-4 text-black dark:text-slate-300" />
              </button>
            </div>
          )}

          {/* Inline Settings Popover */}
          <AnimatePresence>
            {showSettingsModal && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="mt-2 p-2.5 rounded-2xl bg-white dark:bg-[#252936] border border-black/15 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-2xl text-xs space-y-2"
              >
                <div className="flex items-center justify-between pb-1 border-b border-black/10 dark:border-white/10">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Settings
                  </span>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  <span>Token: {sessionToken.slice(0, 8)}...</span>
                  <button
                    onClick={handleCopyToken}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-800 dark:text-white cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1">
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`py-1 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer ${
                      themeMode === 'dark' ? 'bg-blue-600 text-white font-bold' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`py-1 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer ${
                      themeMode === 'light' ? 'bg-blue-600 text-white font-bold' : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
=======
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
                <div className="flex items-baseline text-[20px] font-black leading-none">
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
              isCollapsed ? 'flex flex-col gap-1' : 'grid grid-cols-2 gap-1'
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
      </div>
    </aside>
  );
};
