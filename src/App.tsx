import React, { useState, useEffect } from 'react';
import { CrisisDomain, FactItem, EvaluateCrisisResponse, TriageSeverity } from './types';
import { api } from './services/api';
import { QuickFactPreset } from './data/quickFacts';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WelcomeSplash } from './components/WelcomeSplash';
import {
  ChangePasswordPage,
  AccountOnlyInvitation,
  ForgotPasswordPage,
  HistoryDetailPage,
  HistoryPage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  ResetPasswordPage,
} from './components/account/AccountPages';
import { ProfileMenu } from './components/account/ProfileMenu';
import { EmergencySelectionScreen } from './components/emergency/EmergencySelectionScreen';
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
import OfflineIndicator from './components/emergency/OfflineIndicator';
import { offlineEvaluator } from './services/offlineEvaluator';
import { offlineDataService } from './services/offlineDataService';
import { ArrowLeft, Check, Copy } from 'lucide-react';
import { HapticButton } from './components/ui/HapticButton';
import { getDomainTheme } from './utils/domainTheme';

const WELCOME_SESSION_KEY = 'crisisguard_welcome_completed';
const CONSULTATION_SESSION_KEY = 'crisisguard_consultation_token';
const PUBLIC_AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];
const ACCOUNT_ONLY_PATHS = ['/profile', '/history', '/change-password'];

function hasCompletedWelcome(): boolean {
  try {
    return sessionStorage.getItem(WELCOME_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function storeWelcomeCompletion() {
  try {
    sessionStorage.setItem(WELCOME_SESSION_KEY, 'true');
  } catch {
    // If sessionStorage is unavailable, navigation should still work.
  }
}

function getCurrentPath(): string {
  return typeof window === 'undefined' ? '/' : window.location.pathname;
}

function AppContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { themeMode, isLight } = useTheme();
  const { t, isMyanmar } = useLanguage();
  const { user } = useAuth();

  const [sessionToken, setSessionToken] = useState<string>(() => {
    const saved = sessionStorage.getItem(CONSULTATION_SESSION_KEY);
    if (saved) return saved;
    const fresh = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem(CONSULTATION_SESSION_KEY, fresh);
    return fresh;
  });

  const [domain, setDomain] = useState<CrisisDomain | null>(null);
  const [facts, setFacts] = useState<FactItem[]>([]);
  const [latestResult, setLatestResult] = useState<EvaluateCrisisResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeView, setActiveView] = useState<'triage' | 'shelters' | 'scheduler' | 'audit' | 'status'>('triage');
  const [showMetronome, setShowMetronome] = useState(false);
  const [showProofDrawer, setShowProofDrawer] = useState(false);
  const [copiedSession, setCopiedSession] = useState(false);

  useEffect(() => {
    if (user) return;
    api.ensureGuestSession().catch((error) => {
      console.warn('Guest session initialization failed:', error);
    });
  }, [user]);

  // Left taskbar state: collapsed vs expanded
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : true;
  });

  const runEvaluation = async (domainToUse = domain, factsToUse = facts) => {
    if (!domainToUse || factsToUse.length === 0) {
      setLatestResult(null);
      setIsEvaluating(false);
      return;
    }

    setIsEvaluating(true);
    try {
      // 1. Online attempt with FastAPI backend
      const res = await api.evaluateCrisis({
        session_token: sessionToken,
        domain: domainToUse,
        submitted_facts: factsToUse,
      });
      setLatestResult(res);

      // Cache session and audit trail in IndexedDB asynchronously
      if (user) {
        offlineDataService.saveSession(sessionToken, domainToUse, factsToUse, res.severity).catch(console.error);
        offlineDataService.saveAuditTrail(
          sessionToken,
          domainToUse,
          res.action_headline,
          res.severity,
          res.reasons,
          res.prohibited_actions,
          factsToUse,
          res.evaluation_latency_ms
        ).catch(console.error);
      }
    } catch (err) {
      console.warn('[OfflineFallback] Online evaluation unavailable, evaluating locally via IndexedDB:', err);
      // 2. Offline evaluation fallback via client-side rule engine
      const offlineResult = offlineEvaluator.evaluate(factsToUse);
      if (offlineResult) {
        const fallbackRes: EvaluateCrisisResponse = {
          session_token: sessionToken,
          domain: domainToUse,
          severity: offlineResult.severity,
          action_headline: offlineResult.action_headline,
          step_by_step_instructions: offlineResult.step_by_step_instructions,
          reasons: [
            ...offlineResult.reasons,
            'Evaluated locally on-device via IndexedDB offline rule engine.'
          ],
          prohibited_actions: offlineResult.prohibited_actions,
          evaluation_latency_ms: offlineResult.evaluation_latency_ms || 2,
          timestamp: new Date().toISOString(),
          proof_tree: {
            type: 'rule',
            label: `offline_rule: ${offlineResult.action_headline}`,
            details: `offline edge evaluation for ${domainToUse}`,
            children: factsToUse.map((f) => ({ type: 'evidence', label: `${f.key}(${f.value})` }))
          }
        };
        setLatestResult(fallbackRes);
        if (user) {
          await offlineDataService.saveSession(sessionToken, domainToUse, factsToUse, offlineResult.severity);
          await offlineDataService.saveAuditTrail(
            sessionToken,
            domainToUse,
            offlineResult.action_headline,
            offlineResult.severity,
            fallbackRes.reasons,
            offlineResult.prohibited_actions,
            factsToUse,
            offlineResult.evaluation_latency_ms || 2
          );
        }
      } else {
        // Safe global fallback if no specific rule matched
        const fallbackRes: EvaluateCrisisResponse = {
          session_token: sessionToken,
          domain: domainToUse,
          severity: 'critical',
          action_headline: 'call_emergency_services_immediately',
          step_by_step_instructions: [
            'Call 911 / 199 / 191 municipal emergency dispatch immediately',
            'Provide exact location coordinates and visible landmarks',
            'Do not leave victim unattended or enter hazardous areas'
          ],
          reasons: [
            'Offline mode: Uncertain input pattern. Immediate municipal dispatch recommended.',
            'First aid guidance persisted locally to IndexedDB.'
          ],
          prohibited_actions: [
            'Do not administer prescription medications without physician guidance.',
            'Do not enter hazardous areas.'
          ],
          evaluation_latency_ms: 2,
          timestamp: new Date().toISOString(),
          proof_tree: {
            type: 'rule',
            label: 'offline_fallback: SAFE_DEFAULT',
            details: 'offline emergency safety invariant',
            children: [{ type: 'safety_invariant', label: 'Fail-Safe Default Invariant' }]
          }
        };
        setLatestResult(fallbackRes);
        if (user) {
          await offlineDataService.saveSession(sessionToken, domainToUse, factsToUse, 'critical');
          await offlineDataService.saveAuditTrail(
            sessionToken,
            domainToUse,
            'call_emergency_services_immediately',
            'critical',
            fallbackRes.reasons,
            fallbackRes.prohibited_actions,
            factsToUse,
            2
          );
        }
      }
    } finally {
      setIsEvaluating(false);
    }
  };

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
    setLatestResult(null);
  };

  const handleSelectDomain = async (newDomain: CrisisDomain) => {
    try {
      const session = await api.createSession({ domain: newDomain });
      setSessionToken(session.session_token);
      sessionStorage.setItem(CONSULTATION_SESSION_KEY, session.session_token);
    } catch (error) {
      console.warn('Unable to pre-create consultation session:', error);
      const fresh = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      setSessionToken(fresh);
      sessionStorage.setItem(CONSULTATION_SESSION_KEY, fresh);
    }
    setDomain(newDomain);
    setFacts([]);
    setLatestResult(null);
    setShowMetronome(false);
    setShowProofDrawer(false);
    setActiveView('triage');
  };

  const handleChangeEmergency = () => {
    setDomain(null);
    setFacts([]);
    setLatestResult(null);
    setShowMetronome(false);
    setShowProofDrawer(false);
    setActiveView('triage');
  };

  const handleApplyPreset = (preset: QuickFactPreset) => {
    setFacts(preset.facts);
    runEvaluation(domain, preset.facts);
  };

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionToken);
    setCopiedSession(true);
    window.setTimeout(() => setCopiedSession(false), 2000);
  };

  const currentSeverity: TriageSeverity = latestResult?.severity || 'informational';

  // Compute root background and style classes based on Theme Mode & Palette
  const getThemeWrapperClass = () => {
    if (themeMode === 'light') {
      return 'bg-[#F4F6F9] text-zinc-900';
    }
    if (themeMode === 'alert') {
      return 'bg-[#090909] text-zinc-100 ring-1 ring-red-500/30 shadow-inner';
    }
    // Default 'dark' mode (#090909 canvas with #111111 card surfaces)
    return 'bg-[#090909] text-zinc-100';
  };

  if (!domain) {
    return (
      <EmergencySelectionScreen
        onSelectDomain={handleSelectDomain}
        accountMenu={<ProfileMenu onNavigate={onNavigate} />}
      />
    );
  }

  const domainTheme = getDomainTheme(domain);
  const DomainIcon = domainTheme.Icon;

  return (
    <div className={`min-h-screen transition-colors duration-300 flex relative overflow-x-hidden ${getThemeWrapperClass()} ${isMyanmar ? 'break-words' : ''}`}>
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity duration-200"
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
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          accountMenu={<ProfileMenu onNavigate={onNavigate} />}
        />

        {/* MAIN BODY AREA */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-6">
          <section
            className={`rounded-2xl border p-4 md:p-5 ${
              isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#111111] border-[#2A2A2A]'
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    backgroundColor: domainTheme.accentSoft,
                    borderColor: domainTheme.accentBorder,
                    color: domainTheme.accent,
                  }}
                >
                  <DomainIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {t('assistance.selectedCategory')}
                  </p>
                  <h1 className="truncate text-2xl font-black">{t(`domain.${domain}`)}</h1>
                </div>
              </div>
              <HapticButton
                type="button"
                variant="secondary"
                skeuomorphic={false}
                onClick={handleChangeEmergency}
                className={`min-h-11 rounded-xl px-4 py-2 text-sm font-bold ${
                  isLight ? 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200' : ''
                }`}
                style={{ borderColor: domainTheme.accentBorder }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t('assistance.changeEmergency')}</span>
              </HapticButton>
            </div>
          </section>

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
                    <div
                      className={`rounded-2xl border p-8 md:p-12 text-center ${
                        isLight
                          ? 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
                          : 'bg-[#111111] border-[#2A2A2A] text-zinc-400'
                      }`}
                    >
                      <div
                        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border"
                        style={{
                          backgroundColor: domainTheme.accentSoft,
                          borderColor: domainTheme.accentBorder,
                          color: domainTheme.accent,
                        }}
                      >
                        <DomainIcon className="h-6 w-6" />
                      </div>
                      <h2 className="text-xl font-black text-current">{t('assistance.chooseSituation')}</h2>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-6">
                        {t('assistance.chooseSituationBody')}
                      </p>
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

          <details
            className={`rounded-2xl border p-4 ${
              isLight ? 'bg-white border-zinc-200 text-zinc-700 shadow-sm' : 'bg-[#111111] border-[#2A2A2A] text-zinc-300'
            }`}
          >
            <summary className="cursor-pointer text-sm font-bold">
              {t('assistance.technicalDetails')}
            </summary>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <div className={`rounded-xl border p-3 ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'}`}>
                <div className="text-xs font-bold uppercase text-zinc-500">{t('assistance.sessionToken')}</div>
                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate text-xs">{sessionToken}</code>
                  <HapticButton
                    type="button"
                    variant="ghost"
                    skeuomorphic={false}
                    onClick={handleCopySession}
                    className="h-8 w-8 rounded-lg p-0"
                    title={t('common.copySessionToken')}
                  >
                    {copiedSession ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </HapticButton>
                </div>
              </div>
              <div className={`rounded-xl border p-3 ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'}`}>
                <div className="text-xs font-bold uppercase text-zinc-500">{t('assistance.inferenceTiming')}</div>
                <p className="mt-2 text-xs">
                  {latestResult ? t('action.logicInference', { ms: latestResult.evaluation_latency_ms }) : t('assistance.noResult')}
                </p>
              </div>
              <div className={`rounded-xl border p-3 ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A]'}`}>
                <div className="text-xs font-bold uppercase text-zinc-500">{t('assistance.knowledgeBase')}</div>
                <p className="mt-2 text-xs">{t(`domain.${domain}`)}</p>
              </div>
            </div>
          </details>
        </main>

        {/* 3. XAI EXPLANATION PROOF DRAWER MODAL */}
        <ExplanationDrawer
          isOpen={showProofDrawer}
          onClose={() => setShowProofDrawer(false)}
          proofTree={latestResult?.proof_tree}
          actionHeadline={latestResult?.action_headline}
        />

        {/* 4. FOOTER */}
        <footer
          className={`border-t py-4 px-4 sm:px-6 text-center text-xs font-mono transition-colors ${
            isLight
              ? 'bg-white border-zinc-200 text-zinc-600'
              : 'bg-[#090909] border-[#2A2A2A] text-zinc-400'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 justify-center">
              <span className={`w-2 h-2 rounded-full inline-block ${isLight ? 'bg-amber-600' : 'bg-[#FFAB00]'}`} />
              {t('common.appFooter')}
            </span>
            <span className={`font-semibold ${isLight ? 'text-amber-800' : 'text-[#FFAB00]'}`}>
              {t('common.footerEngine')}
            </span>
          </div>
        </footer>

        {/* 5. OFFLINE INDEXEDDB STATUS BADGE & SYNC CONTROLS */}
        <OfflineIndicator position="bottom-right" />
      </div>
    </div>
  );
}

export function App() {
  const [path, setPath] = useState(getCurrentPath);
  const [welcomeComplete, setWelcomeComplete] = useState(hasCompletedWelcome);

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCurrentPath());
      setWelcomeComplete(hasCompletedWelcome());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (path === '/' && welcomeComplete) {
      window.history.replaceState(null, '', '/app');
      setPath('/app');
    }
  }, [path, welcomeComplete]);

  const navigateToLogin = () => {
    storeWelcomeCompletion();
    setWelcomeComplete(true);
    window.history.pushState(null, '', '/login');
    setPath('/login');
  };

  const shouldShowWelcome = path === '/' && !welcomeComplete;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          {shouldShowWelcome ? (
            <WelcomeSplash
              onEmergencyHelp={() => {
                storeWelcomeCompletion();
                setWelcomeComplete(true);
                window.history.pushState(null, '', '/app');
                setPath('/app');
              }}
              onLogin={navigateToLogin}
              onRegister={() => {
                storeWelcomeCompletion();
                setWelcomeComplete(true);
                window.history.pushState(null, '', '/register');
                setPath('/register');
              }}
            />
          ) : (
            <RoutedApp path={path} setPath={setPath} setWelcomeComplete={setWelcomeComplete} />
          )}
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

function RoutedApp({
  path,
  setPath,
  setWelcomeComplete,
}: {
  path: string;
  setPath: (path: string) => void;
  setWelcomeComplete: (complete: boolean) => void;
}) {
  const { user, loading } = useAuth();
  const params = new URLSearchParams(window.location.search);

  const navigate = (nextPath: string) => {
    storeWelcomeCompletion();
    setWelcomeComplete(true);
    window.history.pushState(null, '', nextPath);
    setPath(nextPath);
  };

  useEffect(() => {
    if (path === '/' && hasCompletedWelcome()) {
      navigate('/app');
    }
  }, [path]);

  useEffect(() => {
    if (loading) return;
    if (user && (path === '/login' || path === '/register' || path === '/')) {
      window.history.replaceState(null, '', '/app');
      setPath('/app');
    }
  }, [loading, path, setPath, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090909] text-sm font-bold text-zinc-300">
        Loading account...
      </div>
    );
  }

  if (!user) {
    if (path === '/register') return <RegisterPage onNavigate={navigate} />;
    if (path === '/forgot-password') return <ForgotPasswordPage onNavigate={navigate} />;
    if (path === '/reset-password') return <ResetPasswordPage token={params.get('token') || ''} onNavigate={navigate} />;
    if (path === '/login') return <LoginPage onNavigate={navigate} />;
    if (ACCOUNT_ONLY_PATHS.some((accountPath) => path === accountPath || path.startsWith(`${accountPath}/`))) {
      return <AccountOnlyInvitation onNavigate={navigate} />;
    }
    return <AppContent onNavigate={navigate} />;
  }

  if (path === '/login' || path === '/register' || path === '/') {
    return null;
  }

  if (path === '/profile') return <ProfilePage onNavigate={navigate} />;
  if (path === '/history') return <HistoryPage onNavigate={navigate} />;
  if (path.startsWith('/history/')) {
    return <HistoryDetailPage token={decodeURIComponent(path.replace('/history/', ''))} onNavigate={navigate} />;
  }
  if (path === '/change-password') return <ChangePasswordPage onNavigate={navigate} />;

  return <AppContent onNavigate={navigate} />;
}
