import React, { useState, useEffect } from 'react';
import { TriageAuditTrail } from '../../types';
import { api } from '../../services/api';
import { SeverityBadge } from './SeverityBadge';
import { humanizeAction } from '../../utils/humanizeAction';
import { HapticButton } from '../ui/HapticButton';
import { useLanguage } from '../../context/LanguageContext';
import { History, Clock, Search, RefreshCw, AlertOctagon } from 'lucide-react';

interface AuditTrailPanelProps {
  sessionToken?: string;
}

export const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ sessionToken }) => {
  const { t, td, tr, ta, language } = useLanguage();
  const [audits, setAudits] = useState<TriageAuditTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  const fetchAudits = async () => {
    setLoading(true);
    try {
      if (sessionToken) {
        const data = await api.getSessionAudit(sessionToken);
        setAudits(data);
      } else {
        const data = await api.getAllAudits();
        setAudits(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [sessionToken]);

  const filteredAudits = audits.filter((a) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      a.recommended_action.toLowerCase().includes(q) ||
      a.domain.toLowerCase().includes(q) ||
      a.reasons.some((r) => r.toLowerCase().includes(q))
    );
  });

  return (
    <div id="audit-trail-panel" className="space-y-4 text-slate-900">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950">
                {t('audit.title')}
              </h2>
            </div>
            <p className="text-xs mt-0.5 text-slate-600">
              {t('audit.desc')}
            </p>
          </div>

          <HapticButton
            variant="secondary"
            skeuomorphic={false}
            onClick={fetchAudits}
            className="p-2.5 rounded-xl text-xs font-semibold self-start sm:self-auto bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('audit.refresh')}</span>
          </HapticButton>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('audit.search')}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full border border-slate-300 bg-white text-xs md:text-sm rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-sans shadow-2xs"
          />
        </div>
      </div>

      {/* Audit Entries List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
          {t('audit.loading')}
        </div>
      ) : filteredAudits.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
          {t('audit.empty')}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAudits.map((item) => (
            <div
              key={item.id}
              id={`audit-entry-${item.id}`}
              className="rounded-2xl border border-slate-200 bg-white hover:border-blue-300 p-4 md:p-5 shadow-sm space-y-3 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">#{item.id}</span>
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded border bg-blue-50 border-blue-200 text-blue-900 font-bold">
                      {td(item.domain)}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(item.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base md:text-lg text-slate-950">
                    {language === 'my' ? ta(item.recommended_action) : humanizeAction(item.recommended_action)}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <SeverityBadge severity={item.severity} size="sm" />
                  <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded border bg-slate-100 border-slate-200 text-slate-700 shadow-2xs">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{item.evaluation_latency_ms}ms</span>
                  </span>
                </div>
              </div>

              {/* Facts Snapshot */}
              {item.facts_snapshot && item.facts_snapshot.length > 0 && (
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center gap-1.5 shadow-2xs">
                  <span className="text-[11px] font-mono mr-1 text-slate-500">{t('audit.facts')}</span>
                  {item.facts_snapshot.map((f, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded border bg-white border-slate-300 text-slate-800 font-semibold shadow-2xs"
                    >
                      {f.key}={String(f.value)}
                    </span>
                  ))}
                </div>
              )}

              {/* Reasons */}
              <div className="space-y-1 font-sans">
                {item.reasons.slice(0, 2).map((r, i) => (
                  <div key={i} className="text-xs flex items-start gap-2 text-slate-700">
                    <span className="font-bold text-blue-600">✓</span>
                    <span>{tr(item.recommended_action, 'reasons', i, r)}</span>
                  </div>
                ))}
              </div>

              {/* Prohibitions */}
              {item.prohibited_actions && item.prohibited_actions.length > 0 && (
                <div className="text-xs p-2.5 rounded-lg flex items-start gap-2 border bg-red-50 border-red-200 text-red-900 shadow-2xs">
                  <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>{t('audit.strict')}</strong> {tr(item.recommended_action, 'prohibitions', 0, item.prohibited_actions[0])}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
