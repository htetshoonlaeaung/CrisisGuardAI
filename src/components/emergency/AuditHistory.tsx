import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { TriageAuditTrail, TriageSeverity } from '../../types';
import { api } from '../../services/api';

export const AuditHistory: React.FC = () => {
  const [audits, setAudits] = useState<TriageAuditTrail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    setLoading(true);
    try {
      const data = await api.getAllAudits();
      setAudits(data);
    } catch (err) {
      console.error('Failed to load audits:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (sev: TriageSeverity) => {
    if (sev === 'critical') return 'bg-red-600 text-white';
    if (sev === 'high') return 'bg-amber-600 text-white';
    if (sev === 'moderate') return 'bg-yellow-500 text-black';
    return 'bg-emerald-600 text-white';
  };

  return (
    <div id="audit-history-view" className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Immutable Decision Audit Log</h2>
            <p className="text-xs text-neutral-400">
              Timestamped cryptographic evaluation records, safety invariants, and inference latencies
            </p>
          </div>
        </div>

        <button
          onClick={loadAudits}
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-2 transition border border-neutral-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Audits
        </button>
      </div>

      {/* Audit List */}
      {audits.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm">
          <FileText className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          No triage events evaluated yet. Run a triage evaluation to generate audit records.
        </div>
      ) : (
        <div className="space-y-3">
          {audits.map((audit) => (
            <div
              key={audit.id}
              className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl space-y-3 hover:border-neutral-700 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-neutral-400">#AUDIT-{audit.id}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${getSeverityBadge(audit.severity)}`}>
                    {audit.severity}
                  </span>
                  <span className="text-xs font-bold text-neutral-300 font-mono">[{audit.domain}]</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Latency: {audit.evaluation_latency_ms} ms
                  </span>
                  <span>{new Date(audit.created_at).toLocaleTimeString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">
                  {audit.recommended_action.replace(/_/g, ' ')}
                </h4>
              </div>

              {/* Observed Facts Snapshot */}
              {audit.facts_snapshot && audit.facts_snapshot.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-neutral-400 self-center mr-1">Observed Facts:</span>
                  {audit.facts_snapshot.map((f, idx) => (
                    <span
                      key={idx}
                      className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 text-[10px] font-mono text-neutral-300"
                    >
                      {f.key}: <strong>{String(f.value)}</strong>
                    </span>
                  ))}
                </div>
              )}

              {/* Safety Prohibitions Logged */}
              {audit.prohibited_actions && audit.prohibited_actions.length > 0 && (
                <div className="text-xs text-red-300/90 bg-red-950/20 p-2.5 rounded-xl border border-red-900/30">
                  <strong className="text-red-400">Logged Prohibitions:</strong> {audit.prohibited_actions.join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
