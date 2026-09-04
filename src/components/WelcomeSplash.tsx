import React, { useEffect, useState } from 'react';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CrisisGuardLogo } from './CrisisGuardLogo';

interface WelcomeSplashProps {
  onEmergencyHelp: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onEmergencyHelp, onLogin, onRegister }) => {
  const { language, setLanguage, t, isMyanmar } = useLanguage();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main
      className={`crisisguard-welcome-page ${isMyanmar ? 'crisisguard-welcome-page--myanmar' : ''}`}
      aria-labelledby="welcome-heading"
    >
      <div className="crisisguard-welcome-language" role="group" aria-label={t('language.label')}>
        {(['en', 'my'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            aria-pressed={language === option}
            className="crisisguard-welcome-language__button"
          >
            {option === 'en' ? t('language.english') : t('language.myanmar')}
          </button>
        ))}
      </div>

      <section className="crisisguard-welcome-panel">
        <button
          type="button"
          onClick={onEmergencyHelp}
          className="crisisguard-welcome-skip"
        >
          {t('welcome.skip')}
        </button>

        <div className="crisisguard-welcome-brand" aria-label="CrisisGuard AI">
          <div className="crisisguard-welcome-logo-shell">
            <CrisisGuardLogo
              alt="CrisisGuard AI"
              active={!isReady}
              repeatWhileActive
              className="crisisguard-welcome-logo"
            />
          </div>

          <div className="crisisguard-welcome-wordmark" aria-hidden="true">
            <span>CrisisGuard</span>
            <span>AI</span>
          </div>
        </div>

        <div className="crisisguard-welcome-copy">
          <h1 id="welcome-heading">{t('welcome.heading')}</h1>
          <p>{t('welcome.supporting')}</p>
        </div>

        <div className={`crisisguard-welcome-loading ${isReady ? 'is-complete' : ''}`}>
          <p aria-live="polite">{isReady ? '' : t('welcome.preparing')}</p>
          <div className="crisisguard-welcome-progress" aria-hidden="true">
            <span />
          </div>
        </div>

        <div className="crisisguard-welcome-actions is-ready">
          <button
            type="button"
            onClick={onEmergencyHelp}
            className="crisisguard-welcome-continue"
            aria-label={t('account.getEmergencyHelp')}
          >
            <span className="crisisguard-welcome-continue__icon" aria-hidden="true">
              <ArrowRight className="h-5 w-5" />
            </span>
            <span>{t('account.getEmergencyHelp')}</span>
          </button>
          <p className="mt-3 text-sm font-semibold text-[#E8F3FA]">{t('account.optionalHelp')}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/30 px-3 py-2 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <LogIn className="h-4 w-4" />
              {t('account.logIn')}
            </button>
            <button
              type="button"
              onClick={onRegister}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/30 px-3 py-2 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <UserPlus className="h-4 w-4" />
              {t('account.createAccount')}
            </button>
          </div>
          <p className="mt-3 text-xs font-semibold text-[#CBD5E1]">{t('account.guestTemporary')}</p>
        </div>
      </section>
    </main>
  );
};
