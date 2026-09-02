import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WelcomeSplashProps {
  onContinue: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onContinue }) => {
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
          onClick={onContinue}
          className="crisisguard-welcome-skip"
        >
          {t('welcome.skip')}
        </button>

        <div className="crisisguard-welcome-brand" aria-label="CrisisGuard AI">
          <div className="crisisguard-welcome-logo-shell">
            <img
              src="/crisisguard-logo.png"
              alt="CrisisGuard AI"
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

        <div className={`crisisguard-welcome-actions ${isReady ? 'is-ready' : ''}`}>
          <button
            type="button"
            onClick={onContinue}
            className="crisisguard-welcome-continue"
            aria-label={t('welcome.continueAria')}
            tabIndex={isReady ? 0 : -1}
          >
            <span className="crisisguard-welcome-continue__icon" aria-hidden="true">
              <ArrowRight className="h-5 w-5" />
            </span>
            <span>{t('welcome.continue')}</span>
          </button>
        </div>
      </section>
    </main>
  );
};
