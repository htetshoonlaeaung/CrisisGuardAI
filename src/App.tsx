import React, { useState, useEffect } from 'react';
import { CrisisDomain, FactItem, EvaluateCrisisResponse, TriageSeverity } from './types';
import { api } from './services/api';
import { QuickFactPreset } from './data/quickFacts';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CollapsibleSidebar } from './components/emergency/CollapsibleSidebar';
import { SessionStatusBar } from './components/emergency/SessionStatusBar';
import { FactInputPanel } from './components/emergency/FactInputPanel';
import { ActionCard } from './components/emergency/ActionCard';
import { CPRMetronome } from './components/emergency/CPRMetronome';
import { ShelterMapView } from './components/emergency/ShelterMapView';
import { DispatchScheduler } from './components/emergency/DispatchScheduler';
import { AuditTrailPanel } from './components/emergency/AuditTrailPanel';
import { StatusScreen } from './components/emergency/StatusScreen';
import { ExplanationDrawer } from './components/emergency/ExplanationDrawer';

function AppContent() {
  const { isLight } = useTheme();
  const { t, isMyanmar } = useLanguage();

  const [sessionToken] = useState<string>(() => {
    const saved = localStorage.getItem('crisisguard_token');
    if (saved) return saved;
    const fresh = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem('crisisguard_token', fresh);
    return fresh;
  });

  const [domain, setDomain] = useState<CrisisDomain>('medical');
  const [facts, setFacts] = useState<FactItem[]>([
    { key: 'unconscious', value: 'true' },
    { key: 'breathing', value: 'none' },
  ]);
  const [latestResult, setLatestResult] = useState<EvaluateCrisisResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeView, setActiveView] = useState<'triage' | 'shelters' | 'scheduler' | 'audit' | 'status'>('triage');
  const [showMetronome, setShowMetronome] = useState(false);
  const [showProofDrawer, setShowProofDrawer] = useState(false);

  // Left taskbar state: collapsed vs expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : true;
  });

  // Automatic initial evaluation on load
  const runEvaluation = async (domainToUse = domain, factsToUse = facts) => {
    setIsEvaluating(true);
    try {
      const res = await api.evaluateCrisis({
        session_token: sessionToken,
        domain: domainToUse,
        submitted_facts: factsToUse,
      });
      setLatestResult(res);
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    runEvaluation();
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Responsive window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddFact = (key: string, value: string | boolean) => {
    setFacts((prev) => {
      const filtered = prev.filter((f) => f.key !== key);
      const updated = [...filtered, { key, value }];
      runEvaluation(domain, updated);
      return updated;
    });
  };

  const handleRemoveFact = (key: string) => {
    setFacts((prev) => {
      const updated = prev.filter((f) => f.key !== key);
      runEvaluation(domain, updated);
      return updated;
    });
  };

  const handleClearFacts = () => {
    setFacts([]);
    runEvaluation(domain, []);
  };

  const handleChangeDomain = (newDomain: CrisisDomain) => {
    setDomain(newDomain);
    setFacts([]);
    runEvaluation(newDomain, []);
  };

  const handleApplyPreset = (preset: QuickFactPreset) => {
    setFacts(preset.facts);
    runEvaluation(domain, preset.facts);
  };

  const currentSeverity: TriageSeverity = latestResult?.severity || 'moderate';

  return (
    <div
      className={`min-h-screen ${
        isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#090A0F] text-slate-100'
      } flex relative overflow-x-hidden transition-colors duration-200 ${isMyanmar ? 'break-words' : ''}`}
    >
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* 1. LEFT COLLAPSIBLE TASKBAR / SIDEBAR */}
      <CollapsibleSidebar
        activeView={activeView}
        onChangeView={setActiveView}
        currentSeverity={currentSeverity}
        sessionToken={sessionToken}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onCloseMobile={() => setIsSidebarCollapsed(true)}
      />

      {/* 2. MAIN APP VIEW CONTAINER (Responsive padding for collapsible taskbar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isSidebarCollapsed ? 'pl-0 lg:pl-20' : 'pl-0 lg:pl-72'
        }`}
      >
        {/* TOP STATUS BAR */}
        <SessionStatusBar
          sessionToken={sessionToken}
          currentSeverity={currentSeverity}
          domain={domain}
          activeView={activeView}
          onChangeView={setActiveView}
          evaluationLatencyMs={latestResult?.evaluation_latency_ms}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* MAIN BODY AREA */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-6">
          {/* VIEW 1: TRIAGE & DIRECTIVE EVALUATION DASHBOARD */}
          {activeView === 'triage' && (
            <div className="space-y-6">
              {/* Metronome Modal / Inline Panel if active */}
              {showMetronome && (
                <div className="mb-4">
                  <CPRMetronome onClose={() => setShowMetronome(false)} />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-start">
                {/* Left Column: Domain & Fact Assertion Panel (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <FactInputPanel
                    domain={domain}
                    onChangeDomain={handleChangeDomain}
                    facts={facts}
                    onAddFact={handleAddFact}
                    onRemoveFact={handleRemoveFact}
                    onClearFacts={handleClearFacts}
                    onEvaluate={() => runEvaluation(domain, facts)}
                    isEvaluating={isEvaluating}
                    onApplyPreset={handleApplyPreset}
                  />
                </div>

                {/* Right Column: AI Triage Directive & Action Protocols (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {latestResult ? (
                    <ActionCard
                      result={latestResult}
                      onOpenProofTree={() => setShowProofDrawer(true)}
                      onOpenMetronome={() => setShowMetronome(true)}
                      onOpenShelters={() => setActiveView('shelters')}
                    />
                  ) : (
                    <div className="p-8 md:p-12 text-center text-xs font-mono rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
                      {t('factInput.noFacts')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: NEARBY SHELTERS & GEO MAP */}
          {activeView === 'shelters' && <ShelterMapView initialDomain={domain} />}

          {/* VIEW 3: CLP(FD) RESOURCE DISPATCH SCHEDULER */}
          {activeView === 'scheduler' && <DispatchScheduler />}

          {/* VIEW 4: SESSION AUDIT TRAIL & XAI HISTORY */}
          {activeView === 'audit' && <AuditTrailPanel sessionToken={sessionToken} />}

          {/* VIEW 5: SYSTEM & PROLOG HEALTH STATUS */}
          {activeView === 'status' && <StatusScreen />}
        </main>

        {/* 3. XAI EXPLANATION PROOF DRAWER MODAL */}
        <ExplanationDrawer
          isOpen={showProofDrawer}
          onClose={() => setShowProofDrawer(false)}
          proofTree={latestResult?.proof_tree}
          actionHeadline={latestResult?.action_headline}
        />

        {/* 4. FOOTER */}
        <footer className="border-t border-slate-200 py-4 px-4 sm:px-6 text-center text-xs font-mono bg-white text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full inline-block bg-blue-600" />
              {t('common.appFooter')}
            </span>
            <span className="font-semibold text-blue-900">
              {t('common.footerEngine')}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
