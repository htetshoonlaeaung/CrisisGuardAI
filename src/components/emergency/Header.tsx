import React from 'react';
import { Shield, PhoneCall, Radio, AlertTriangle } from 'lucide-react';
import { CrisisDomain } from '../../types';

interface HeaderProps {
  currentDomain: CrisisDomain;
  onSelectDomain: (domain: CrisisDomain) => void;
  activeTab: 'triage' | 'cpr' | 'shelters' | 'dispatch' | 'audit';
  onSelectTab: (tab: 'triage' | 'cpr' | 'shelters' | 'dispatch' | 'audit') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDomain,
  onSelectDomain,
  activeTab,
  onSelectTab
}) => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Emergency Dialing Toolbar */}
      <div className="bg-red-950/80 border-b border-red-900/50 px-4 py-2 text-xs font-semibold text-red-200">
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
              id="dial-911-btn"
              href="tel:911"
              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md font-black text-xs transition shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" /> 911 / 112
            </a>
            <a
              id="dial-poison-btn"
              href="tel:18002221222"
              className="inline-flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-amber-300 px-3 py-1 rounded-md text-xs font-bold transition"
            >
              Poison: 1-800-222-1222
            </a>
            <a
              id="dial-sms-btn"
              href="sms:911"
              className="inline-flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded-md text-xs transition"
            >
              SMS 911
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Branding & Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/30 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                CrisisGuard <span className="text-red-500">AI</span>
              </h1>
              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                SWI-Prolog • XAI
              </span>
            </div>
            <p className="text-xs text-neutral-400">Deterministic Life-Safety Decision Support System</p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800 overflow-x-auto">
          <button
            id="nav-tab-triage"
            onClick={() => onSelectTab('triage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'triage'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Triage
          </button>
          <button
            id="nav-tab-cpr"
            onClick={() => onSelectTab('cpr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cpr'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> 110 BPM Metronome
          </button>
          <button
            id="nav-tab-shelters"
            onClick={() => onSelectTab('shelters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'shelters'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            Shelter Locator
          </button>
          <button
            id="nav-tab-dispatch"
            onClick={() => onSelectTab('dispatch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dispatch'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            CLP(FD) Dispatch
          </button>
          <button
            id="nav-tab-audit"
            onClick={() => onSelectTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>
    </header>
  );
};
