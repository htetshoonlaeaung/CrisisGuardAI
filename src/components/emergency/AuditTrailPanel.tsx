import React, { useState, useEffect } from 'react';
import { TriageAuditTrail } from '../../types';
import { api } from '../../services/api';
import { SeverityBadge } from './SeverityBadge';
import { humanizeAction } from '../../utils/humanizeAction';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { History, Clock, Search, RefreshCw, AlertOctagon } from 'lucide-react';

interface AuditTrailPanelProps {
  sessionToken?: string;
}

export const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ sessionToken }) => {
  const { isLight } = useTheme();
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
    <div id="audit-trail-panel" className="space-y-4">
      {/* Header */}
      <div
        className={`rounded-2xl border p-4 md:p-6 shadow-xl backdrop-blur-md space-y-4 ${
          isLight ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50' : 'border-[#2A2A2A] bg-[#111111] text-zinc-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <History className={`w-5 h-5 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
              <h2 className={`text-lg md:text-xl font-extrabold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                {t('audit.title')}
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {t('audit.desc')}
            </p>
          </div>

          <HapticButton
            variant="secondary"
            onClick={fetchAudits}
            className={`p-2.5 rounded-xl text-xs font-semibold self-start sm:self-auto ${
              isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-800' : 'text-[#FFAB00]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('audit.refresh')}</span>
          </HapticButton>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('audit.search')}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="crisisguard-input w-full border text-xs md:text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none font-sans"
          />
        </div>
      </div>

      {/* Audit Entries List */}
      {loading ? (
        <div
          className={`p-12 text-center text-xs font-mono rounded-2xl border ${
            isLight ? 'border-zinc-200 bg-white text-zinc-500' : 'border-[#2A2A2A] bg-[#111111] text-zinc-500'
          }`}
        >
          {t('audit.loading')}
        </div>
      ) : filteredAudits.length === 0 ? (
        <div
          className={`p-12 text-center text-xs font-mono rounded-2xl border ${
            isLight ? 'border-zinc-200 bg-white text-zinc-500' : 'border-[#2A2A2A] bg-[#111111] text-zinc-500'
          }`}
        >
          {t('audit.empty')}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAudits.map((item) => (
            <div
              key={item.id}
              id={`audit-entry-${item.id}`}
              className={`rounded-2xl border p-4 md:p-5 shadow-lg space-y-3 transition-all ${
                isLight
                  ? 'bg-white border-zinc-200 text-zinc-900 hover:border-amber-500 shadow-zinc-200/50'
                  : 'border-[#2A2A2A] bg-[#111111] hover:border-[#FFAB00]/50'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-zinc-400">#{item.id}</span>
                    <span
                      className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${
                        isLight
                          ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                          : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#FFAB00]'
                      }`}
                    >
                      {td(item.domain)}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {new Date(item.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <h3 className={`font-extrabold text-base md:text-lg ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                    {language === 'my' ? ta(item.recommended_action) : humanizeAction(item.recommended_action)}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <SeverityBadge severity={item.severity} size="sm" />
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded border ${
                      isLight
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-700'
                        : 'text-[#FFAB00] bg-[#1A1A1A] border-[#2A2A2A]'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{item.evaluation_latency_ms}ms</span>
                  </span>
                </div>
              </div>

              {/* Facts Snapshot */}
              {item.facts_snapshot && item.facts_snapshot.length > 0 && (
                <div
                  className={`p-2.5 rounded-xl border flex flex-wrap items-center gap-1.5 ${
                    isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'
                  }`}
                >
                  <span className={`text-[11px] font-mono mr-1 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>{t('audit.facts')}</span>
                  {item.facts_snapshot.map((f, i) => (
                    <span
                      key={i}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        isLight
                          ? 'bg-white border-zinc-300 text-zinc-800 font-semibold'
                          : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-200'
                      }`}
                    >
                      {f.key}={String(f.value)}
                    </span>
                  ))}
                </div>
              )}

              {/* Reasons */}
              <div className="space-y-1 font-sans">
                {item.reasons.slice(0, 2).map((r, i) => (
                  <div key={i} className={`text-xs flex items-start gap-2 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    <span className={`font-bold ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`}>✓</span>
                    <span>{tr(item.recommended_action, 'reasons', i, r)}</span>
                  </div>
                ))}
              </div>

              {/* Prohibitions (Warnings strictly for real critical constraints) */}
              {item.prohibited_actions && item.prohibited_actions.length > 0 && (
                <div className={`text-xs p-2.5 rounded-lg flex items-start gap-2 border ${
                  isLight
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'
                }`}>
                  <AlertOctagon className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
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
