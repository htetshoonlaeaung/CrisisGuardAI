import React from 'react';
import { ArrowRight, Moon, PhoneCall, Sun } from 'lucide-react';
import { CrisisDomain } from '../../types';
import { DOMAIN_ORDER, getDomainTheme } from '../../utils/domainTheme';
import { CrisisGuardLogo } from '../CrisisGuardLogo';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { HapticButton } from '../ui/HapticButton';

interface EmergencySelectionScreenProps {
  onSelectDomain: (domain: CrisisDomain) => void;
  accountMenu?: React.ReactNode;
}

export const EmergencySelectionScreen: React.FC<EmergencySelectionScreenProps> = ({
  onSelectDomain,
  accountMenu,
}) => {
  const { t, td, language, setLanguage, languageNames, isMyanmar } = useLanguage();
  const { themeMode, setThemeMode, isLight } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors ${
        isLight ? 'bg-[#F4F6F9] text-zinc-950' : 'bg-[#090909] text-zinc-100'
      } ${isMyanmar ? 'break-words' : ''}`}
    >
      <header className="border-b border-[#082B5C] bg-[#082B5C] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-2.5" aria-label="CrisisGuard AI">
            <div className="relative h-10 w-[39px] flex-shrink-0 overflow-hidden">
              <CrisisGuardLogo
                alt="CrisisGuard AI logo"
                className="h-full w-auto max-w-none object-contain object-left"
              />
            </div>
            <div className="flex min-w-0 items-baseline gap-1 text-[24px] font-black leading-none sm:text-[28px]">
              <span className="truncate text-white">CrisisGuard</span>
              <span className="text-[#EA002C]">AI</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:199"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-400/40 bg-red-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{t('common.emergency199')}</span>
            </a>

            <div
              className={`flex items-center gap-0.5 rounded-xl border p-1 ${
                isLight ? 'bg-zinc-100 border-zinc-300' : 'bg-[#111111] border-[#2A2A2A]'
              }`}
              role="group"
              aria-label={t('language.label')}
            >
              {(['en', 'my'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLanguage(option)}
                  aria-pressed={language === option}
                  aria-label={option === 'en' ? t('language.english') : t('language.myanmar')}
                  className={`h-8 rounded-lg px-2.5 text-xs font-bold transition-colors ${
                    language === option
                      ? isLight
                        ? 'bg-white text-zinc-950 shadow border border-zinc-300'
                        : 'bg-zinc-800 text-[#FFAB00]'
                      : isLight
                      ? 'text-zinc-700 hover:bg-zinc-200'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {languageNames[option]}
                </button>
              ))}
            </div>

            <div
              className={`flex items-center gap-0.5 rounded-xl border p-1 ${
                isLight ? 'bg-zinc-100 border-zinc-300' : 'bg-[#111111] border-[#2A2A2A]'
              }`}
            >
              <HapticButton
                variant={themeMode === 'dark' ? 'primary' : 'ghost'}
                skeuomorphic={false}
                onClick={() => setThemeMode('dark')}
                className={`h-8 w-8 rounded-lg p-0 ${
                  themeMode === 'dark'
                    ? 'bg-zinc-800 text-[#FFAB00]'
                    : isLight
                    ? 'text-zinc-700 hover:bg-zinc-200'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                title={t('common.darkMode')}
              >
                <Moon className="h-4 w-4" />
              </HapticButton>
              <HapticButton
                variant={themeMode === 'light' ? 'primary' : 'ghost'}
                skeuomorphic={false}
                onClick={() => setThemeMode('light')}
                className={`h-8 w-8 rounded-lg p-0 ${
                  themeMode === 'light'
                    ? 'bg-white text-zinc-950 border border-zinc-300'
                    : isLight
                    ? 'text-zinc-700 hover:bg-zinc-200'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                title={t('common.lightMode')}
              >
                <Sun className="h-4 w-4" />
              </HapticButton>
            </div>
            {accountMenu}
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">
            {t('domainSelection.heading')}
          </h1>
          <p className={`mt-3 text-base sm:text-lg ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
            {t('domainSelection.subtitle')}
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {DOMAIN_ORDER.map((domain) => {
            const theme = getDomainTheme(domain);
            const Icon = theme.Icon;

            return (
              <button
                key={domain}
                type="button"
                onClick={() => onSelectDomain(domain)}
                className={`group min-h-[10.5rem] w-full rounded-2xl border p-5 text-left transition-all active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 ${theme.accentRing} ${
                  isLight
                    ? 'bg-white border-zinc-200 shadow-sm hover:border-zinc-300 hover:bg-zinc-50'
                    : 'bg-[#111111] border-[#2A2A2A] hover:bg-[#151515]'
                }`}
                style={{
                  borderColor: undefined,
                }}
              >
                <div className="flex h-full flex-col">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl border"
                      style={{
                        backgroundColor: theme.accentSoft,
                        borderColor: theme.accentBorder,
                        color: theme.accent,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <ArrowRight
                      className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                        isLight ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-xl font-black">{td(domain)}</h2>
                  <p className={`mt-2 text-sm leading-6 ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                    {t(theme.descriptionKey)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
