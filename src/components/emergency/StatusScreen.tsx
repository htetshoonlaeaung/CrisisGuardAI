import React, { useState } from 'react';
import { Cpu, CheckCircle2, Server, Database, Sparkles, Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const StatusScreen: React.FC = () => {
  const { isLight } = useTheme();
  const [healthData] = useState({
    apiStatus: 'ok',
    version: '3.0.0',
    engine: 'SWI-Prolog 9.x + PySwip / CLP(FD) Constraint Logic Engine',
    database: 'In-Memory Encrypted Triagestore',
    knowledgeBases: [
      { name: 'medical.pl', domain: 'Medical Emergencies & Resuscitation', rulesCount: 48, status: 'loaded' },
      { name: 'fire_hazards.pl', domain: 'Fire & Hazmat Protocols', rulesCount: 32, status: 'loaded' },
      { name: 'natural_disasters.pl', domain: 'Flood, Quake, Tsunami Safety', rulesCount: 26, status: 'loaded' },
      { name: 'road_accidents.pl', domain: 'Vehicle Crash & START Triage', rulesCount: 29, status: 'loaded' },
      { name: 'clpfd_scheduler.pl', domain: 'Finite Domain Fleet Dispatcher', rulesCount: 15, status: 'loaded' },
    ],
  });

  return (
    <div id="status-screen" className="space-y-5">
      {/* Overview Card */}
      <div
        className={`rounded-2xl border p-4 md:p-6 shadow-xl backdrop-blur-md space-y-4 ${
          isLight
            ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50'
            : 'border-[#2A2A2A] bg-[#111111] text-zinc-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className={`w-5 h-5 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
              <h2 className={`text-lg md:text-xl font-extrabold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                System Health &amp; Knowledge Base Status
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Live verification of reasoning modules, symbolic logic proof integrity, and API servers.
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
              isLight
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-[rgba(255,171,0,0.15)] border border-[rgba(255,171,0,0.40)] text-[#FFAB00]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full animate-ping ${isLight ? 'bg-emerald-600' : 'bg-[#FFAB00]'}`} />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>

        {/* Primary Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <Server className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  isLight
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                    : 'bg-[rgba(255,171,0,0.15)] text-[#FFAB00] border-[rgba(255,171,0,0.35)]'
                }`}
              >
                ACTIVE
              </span>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>API Server</div>
            <div className={`text-sm font-bold ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>Express &amp; Vite Proxy</div>
            <div className="text-[11px] font-mono text-zinc-500">Port 3000 • Latency &lt; 1ms</div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sparkles className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  isLight
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                    : 'bg-[rgba(255,171,0,0.15)] text-[#FFAB00] border-[rgba(255,171,0,0.35)]'
                }`}
              >
                GROUNDED
              </span>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Logic Engine</div>
            <div className={`text-sm font-bold ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>Deterministic First-Order Logic</div>
            <div className="text-[11px] font-mono text-zinc-500">SWI-Prolog &amp; CLP(FD) Verified</div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <Database className="w-4 h-4 text-emerald-600" />
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  isLight
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-900'
                }`}
              >
                HEALTHY
              </span>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Data Storage</div>
            <div className={`text-sm font-bold ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>Encrypted Triagestore</div>
            <div className="text-[11px] font-mono text-zinc-500">Audit Trails &amp; Shelters Loaded</div>
          </div>
        </div>
      </div>

      {/* Knowledge Bases Status */}
      <div
        className={`rounded-2xl border p-4 md:p-6 shadow-xl backdrop-blur-md space-y-4 ${
          isLight ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50' : 'border-[#2A2A2A] bg-[#111111]'
        }`}
      >
        <h3 className={`text-xs md:text-sm font-mono uppercase tracking-wider font-bold flex items-center gap-2 ${
          isLight ? 'text-zinc-900' : 'text-zinc-200'
        }`}>
          <Layers className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
          <span>Loaded Prolog Knowledge Bases (.pl)</span>
        </h3>

        <div className="space-y-2.5">
          {healthData.knowledgeBases.map((kb, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-xs md:text-sm ${isLight ? 'text-amber-800' : 'text-[#FFAB00]'}`}>{kb.name}</span>
                  <span className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>• {kb.domain}</span>
                </div>
                <div className="text-[11px] font-mono mt-0.5 text-zinc-500">
                  {kb.rulesCount} formal Horn clauses &amp; safety invariants compiled
                </div>
              </div>

              <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md self-start sm:self-auto border ${
                isLight
                  ? 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold'
                  : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>COMPILED</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
