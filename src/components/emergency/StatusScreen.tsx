import React, { useState } from 'react';
import { Cpu, CheckCircle2, Server, Database, Sparkles, Layers } from 'lucide-react';
<<<<<<< HEAD
import { useLanguage } from '../../context/LanguageContext';

export const StatusScreen: React.FC = () => {
=======
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export const StatusScreen: React.FC = () => {
  const { isLight } = useTheme();
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
  const { t } = useLanguage();
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
<<<<<<< HEAD
    <div id="status-screen" className="space-y-5 text-slate-900">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950">
                {t('statusPage.title')}
              </h2>
            </div>
            <p className="text-xs mt-0.5 text-slate-600">
=======
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
                {t('statusPage.title')}
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
              {t('statusPage.desc')}
            </p>
          </div>

<<<<<<< HEAD
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
=======
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
              isLight
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-[rgba(255,171,0,0.15)] border border-[rgba(255,171,0,0.40)] text-[#FFAB00]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full animate-ping ${isLight ? 'bg-emerald-600' : 'bg-[#FFAB00]'}`} />
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            <span>{t('statusPage.allOperational')}</span>
          </div>
        </div>

        {/* Primary Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
<<<<<<< HEAD
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <Server className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-blue-100 text-blue-900 border-blue-300 font-bold">
                {t('statusPage.active')}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500">{t('statusPage.apiServer')}</div>
            <div className="text-sm font-bold text-slate-950">{t('statusPage.proxy')}</div>
            <div className="text-[11px] font-mono text-slate-500">Port 3000 • Latency &lt; 1ms</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-blue-100 text-blue-900 border-blue-300 font-bold">
                {t('statusPage.grounded')}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500">{t('statusPage.logicEngine')}</div>
            <div className="text-sm font-bold text-slate-950">{t('statusPage.firstOrder')}</div>
            <div className="text-[11px] font-mono text-slate-500">{t('statusPage.verified')}</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">
                {t('statusPage.healthy')}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500">{t('statusPage.dataStorage')}</div>
            <div className="text-sm font-bold text-slate-950">{t('statusPage.triagestore')}</div>
            <div className="text-[11px] font-mono text-slate-500">{t('statusPage.loadedData')}</div>
=======
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
                {t('statusPage.active')}
              </span>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>{t('statusPage.apiServer')}</div>
            <div className={`text-sm font-bold ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>{t('statusPage.proxy')}</div>
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
                {t('statusPage.grounded')}
              </span>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>{t('statusPage.logicEngine')}</div>
            <div className={`text-sm font-bold ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>{t('statusPage.firstOrder')}</div>
            <div className="text-[11px] font-mono text-zinc-500">{t('statusPage.verified')}</div>
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
                {t('statusPage.healthy')}
              </span>
            </div>
            <div className={`text-xs font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>{t('statusPage.dataStorage')}</div>
            <div className={`text-sm font-bold ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>{t('statusPage.triagestore')}</div>
            <div className="text-[11px] font-mono text-zinc-500">{t('statusPage.loadedData')}</div>
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
          </div>
        </div>
      </div>

      {/* Knowledge Bases Status */}
<<<<<<< HEAD
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
        <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-bold flex items-center gap-2 text-slate-900">
          <Layers className="w-4 h-4 text-blue-600" />
=======
      <div
        className={`rounded-2xl border p-4 md:p-6 shadow-xl backdrop-blur-md space-y-4 ${
          isLight ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50' : 'border-[#2A2A2A] bg-[#111111]'
        }`}
      >
        <h3 className={`text-xs md:text-sm font-mono uppercase tracking-wider font-bold flex items-center gap-2 ${
          isLight ? 'text-zinc-900' : 'text-zinc-200'
        }`}>
          <Layers className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
          <span>{t('statusPage.loadedKb')}</span>
        </h3>

        <div className="space-y-2.5">
          {healthData.knowledgeBases.map((kb, idx) => (
            <div
              key={idx}
<<<<<<< HEAD
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs md:text-sm text-blue-900">{kb.name}</span>
                  <span className="text-xs text-slate-600">• {kb.domain}</span>
                </div>
                <div className="text-[11px] font-mono mt-0.5 text-slate-500">
=======
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
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
                  {t('statusPage.clauses', { count: kb.rulesCount })}
                </div>
              </div>

<<<<<<< HEAD
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md self-start sm:self-auto border text-emerald-800 bg-emerald-100 border-emerald-300 font-bold shadow-2xs">
=======
              <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md self-start sm:self-auto border ${
                isLight
                  ? 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold'
                  : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
              }`}>
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('statusPage.compiled')}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
