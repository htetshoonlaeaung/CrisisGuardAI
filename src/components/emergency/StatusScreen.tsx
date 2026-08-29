import React, { useState } from 'react';
import { Cpu, CheckCircle2, Server, Database, Sparkles, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const StatusScreen: React.FC = () => {
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
              {t('statusPage.desc')}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>{t('statusPage.allOperational')}</span>
          </div>
        </div>

        {/* Primary Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
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
          </div>
        </div>
      </div>

      {/* Knowledge Bases Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
        <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-bold flex items-center gap-2 text-slate-900">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>{t('statusPage.loadedKb')}</span>
        </h3>

        <div className="space-y-2.5">
          {healthData.knowledgeBases.map((kb, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs md:text-sm text-blue-900">{kb.name}</span>
                  <span className="text-xs text-slate-600">• {kb.domain}</span>
                </div>
                <div className="text-[11px] font-mono mt-0.5 text-slate-500">
                  {t('statusPage.clauses', { count: kb.rulesCount })}
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md self-start sm:self-auto border text-emerald-800 bg-emerald-100 border-emerald-300 font-bold shadow-2xs">
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
