import React from 'react';
import { PhoneCall, Radio, AlertTriangle } from 'lucide-react';
import { CrisisDomain } from '../../types';

interface HeaderProps {
  currentDomain: CrisisDomain;
  onSelectDomain: (domain: CrisisDomain) => void;
  activeTab: 'triage' | 'cpr' | 'shelters' | 'dispatch' | 'audit';
  onSelectTab: (tab: 'triage' | 'cpr' | 'shelters' | 'dispatch' | 'audit') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0F172A] sticky top-0 z-40 backdrop-blur-md">
      {/* Top Emergency Dialing Toolbar */}
      <div className="bg-[#020617]/80 border-b border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-red-400 font-bold uppercase tracking-wider">CRITICAL EMERGENCY HOTLINES</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="dial-199-btn"
              href="tel:199"
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md font-black text-xs transition shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" /> 199 / 191 / 192
            </a>
            <a
              id="dial-poison-btn"
              href="tel:18002221222"
              className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-md text-xs font-semibold border border-slate-700 transition"
            >
              Poison: 1-800-222-1222
            </a>
            <a
              id="dial-sms-btn"
              href="sms:199"
              className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-xs border border-slate-700 transition"
            >
              SMS 199
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Branding & Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <img
            src="/crisisguard-logo.png"
            alt="CrisisGuard AI"
            className="h-10 w-auto max-w-[170px] object-contain sm:h-11 sm:max-w-[220px] md:h-12"
          />
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700 overflow-x-auto">
          <button
            id="nav-tab-triage"
            onClick={() => onSelectTab('triage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'triage'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Triage
          </button>
          <button
            id="nav-tab-cpr"
            onClick={() => onSelectTab('cpr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'cpr'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> 110 BPM Metronome
          </button>
          <button
            id="nav-tab-shelters"
            onClick={() => onSelectTab('shelters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'shelters'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Shelter Locator
          </button>
          <button
            id="nav-tab-dispatch"
            onClick={() => onSelectTab('dispatch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'dispatch'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            CLP(FD) Dispatch
          </button>
          <button
            id="nav-tab-audit"
            onClick={() => onSelectTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>
    </header>
  );
};
