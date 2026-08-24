import React, { useState } from 'react';
import { IncidentItem, RescueTeam, DispatchResponse } from '../../types';
import { api } from '../../services/api';
import { SeverityBadge } from './SeverityBadge';
import { HapticButton } from '../ui/HapticButton';
import { useLanguage } from '../../context/LanguageContext';
import { ListFilter, Play, CheckCircle2, Truck, Clock, Sparkles } from 'lucide-react';

export const DispatchScheduler: React.FC = () => {
  const { t } = useLanguage();
  const [incidents] = useState<IncidentItem[]>([
    {
      id: 'INC-01',
      name: 'Pyay Road Multi-Vehicle Crash & Trauma',
      severity: 'critical',
      victims_count: 4,
      hazard_type: 'road_accident',
      location: 'Pyay Road (Near 8-Mile Junction)',
    },
    {
      id: 'INC-02',
      name: 'Apartment Transformer & Electrical Fire',
      severity: 'critical',
      victims_count: 2,
      hazard_type: 'fire_hazard',
      location: 'Baho Road, Sanchaung Township',
    },
    {
      id: 'INC-03',
      name: 'Monsoon Flash Flood Lowland Entrapment',
      severity: 'high',
      victims_count: 3,
      hazard_type: 'natural_disaster',
      location: 'Hlaingthaya Lowlands / Strand Road',
    },
    {
      id: 'INC-04',
      name: 'Pedestrian Minor Fracture Staging',
      severity: 'moderate',
      victims_count: 1,
      hazard_type: 'medical',
      location: 'Sule Pagoda Road, Downtown Yangon',
    },
  ]);

  const [teams] = useState<RescueTeam[]>([
    { id: 1, name: 'YGH Trauma Response Unit (Paramedic)', type: 'paramedic', vehicle_capacity: 4, is_available: true, base_location: 'Yangon General Hospital' },
    { id: 2, name: 'Central Fire & Extrication Brigade #1', type: 'fire_rescue', vehicle_capacity: 6, is_available: true, base_location: 'Kyauktada Fire HQ' },
    { id: 3, name: 'Yangon River SAR Swiftwater Boat #2', type: 'flood_boat', vehicle_capacity: 4, is_available: true, base_location: 'Botahtaung Jetty' },
    { id: 4, name: 'North Okkalapa Ambulance Squad', type: 'paramedic', vehicle_capacity: 2, is_available: true, base_location: 'NOGH Substation' },
  ]);

  const [dispatchResult, setDispatchResult] = useState<DispatchResponse | null>(null);
  const [solving, setSolving] = useState(false);

  const handleSolve = async () => {
    setSolving(true);
    try {
      const res = await api.solveDispatch(incidents, teams);
      setDispatchResult(res);
    } catch {
      // Error handling
    } finally {
      setSolving(false);
    }
  };

  return (
    <div id="dispatch-scheduler-panel" className="space-y-5 text-slate-900">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950">
                {t('dispatch.title')}
              </h2>
            </div>
            <p className="text-xs mt-0.5 text-slate-600">
              {t('dispatch.desc')}
            </p>
          </div>

          <HapticButton
            id="btn-run-clpfd-solver"
            variant="blue"
            skeuomorphic={true}
            onClick={handleSolve}
            disabled={solving}
            className="py-2.5 px-5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{solving ? t('dispatch.solving') : t('dispatch.execute')}</span>
          </HapticButton>
        </div>

        {/* Solver Specs Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-xs font-mono">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="block text-[10px] text-slate-500">{t('dispatch.solverEngine')}</span>
            <span className="font-semibold text-blue-900">SWI-Prolog clpfd</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="block text-[10px] text-slate-500">{t('dispatch.incidentQueue')}</span>
            <span className="font-semibold text-slate-800">{t('dispatch.activeCalls', { count: incidents.length })}</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="block text-[10px] text-slate-500">{t('dispatch.fleetStatus')}</span>
            <span className="text-emerald-600 font-semibold">{t('dispatch.teamsReady', { count: teams.filter((team) => team.is_available).length })}</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="block text-[10px] text-slate-500">{t('dispatch.invariants')}</span>
            <span className="font-semibold text-blue-900">{t('dispatch.singleAssign')}</span>
          </div>
        </div>
      </div>

      {/* Solver Results View */}
      {dispatchResult && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600" />
              <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-extrabold text-blue-900">
                {t('dispatch.plan')}
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded border text-emerald-800 bg-emerald-100 border-emerald-300 font-bold">
              {t('dispatch.solvedIn', { ms: dispatchResult.total_latency_ms })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dispatchResult.plans.map((plan, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono font-bold text-blue-900">{plan.incident_id}</div>
                    <div className="text-sm font-bold text-slate-950">{plan.incident_name}</div>
                  </div>
                  <SeverityBadge severity={plan.severity} size="sm" />
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>{plan.team_name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t('dispatch.eta', { minutes: plan.estimated_arrival_minutes })}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {plan.constraints_satisfied.map((c, i) => (
                    <div key={i} className="text-[11px] font-mono flex items-center gap-1.5 text-slate-600">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0 text-blue-600" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incidents and Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incident Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm space-y-3">
          <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-bold text-slate-900">
            {t('dispatch.activeQueue', { count: incidents.length })}
          </h3>
          <div className="space-y-2">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shadow-2xs"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{inc.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {inc.location} • {inc.victims_count} victims
                  </div>
                </div>
                <SeverityBadge severity={inc.severity} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Rescue Teams */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm space-y-3">
          <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-bold text-slate-900">
            {t('dispatch.fleet', { count: teams.length })}
          </h3>
          <div className="space-y-2">
            {teams.map((team) => (
              <div
                key={team.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-blue-50 text-blue-600 border-blue-200">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{team.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Cap: {team.vehicle_capacity} • {team.base_location}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-blue-100 text-blue-900 border-blue-300">
                  {t('dispatch.ready')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
