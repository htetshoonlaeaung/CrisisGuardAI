import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Copy,
  Check,
} from 'lucide-react';
import { TriageSeverity } from '../../types';
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
  sessionToken,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const { themeMode, setThemeMode, isLight } = useTheme();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(sessionToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    onChangeView(viewId);
    if (onCloseMobile && window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

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
      </div>
    </aside>
  );
};
