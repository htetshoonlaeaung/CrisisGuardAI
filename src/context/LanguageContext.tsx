import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CrisisDomain, TriageSeverity } from '../types';
import {
  Language,
  languageNames,
  translate,
  translateDomain,
  translateSeverity,
} from '../i18n/translations';
import {
  translateAction,
  translateEmergencyText,
  translateFactLabel,
  translateFacility,
  translateProofText,
  translatePresetDescription,
  translatePresetLabel,
  translateResultItem,
} from '../i18n/domainTranslations';

type ResultField = 'steps' | 'reasons' | 'prohibitions';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isMyanmar: boolean;
  languageNames: Record<Language, string>;
  t: (key: string, vars?: Record<string, string | number>) => string;
  td: (domain: CrisisDomain | 'all' | string) => string;
  ts: (severity: TriageSeverity, compact?: boolean) => string;
  ta: (action: string) => string;
  tx: (text: string) => string;
  tr: (action: string, field: ResultField, index: number, fallback: string) => string;
  tProof: (text: string) => string;
  tf: (factLabel: string) => string;
  tp: (presetId: string, fallback: string) => string;
  tpd: (presetId: string, fallback: string) => string;
  tFacility: (facility: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  isMyanmar: false,
  languageNames,
  t: (key, vars) => translate('en', key, vars),
  td: (domain) => translateDomain('en', domain),
  ts: (severity, compact) => translateSeverity('en', severity, compact),
  ta: (action) => translateAction('en', action),
  tx: (text) => text,
  tr: (_, __, ___, fallback) => fallback,
  tProof: (text) => text,
  tf: (factLabel) => factLabel,
  tp: (_, fallback) => fallback,
  tpd: (_, fallback) => fallback,
  tFacility: (facility) => facility,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('crisisguard_language');
    return saved === 'my' ? 'my' : 'en';
  });

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('crisisguard_language', nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language === 'my' ? 'my' : 'en';
    document.documentElement.classList.toggle('myanmar-lang', language === 'my');
  }, [language]);

  const value = useMemo<LanguageContextType>(() => {
    const isMyanmar = language === 'my';
    return {
      language,
      setLanguage,
      isMyanmar,
      languageNames,
      t: (key, vars) => translate(language, key, vars),
      td: (domain) => translateDomain(language, domain),
      ts: (severity, compact = false) => translateSeverity(language, severity, compact),
      ta: (action) => translateAction(language, action),
      tx: (text) => translateEmergencyText(language, text),
      tr: (action, field, index, fallback) => translateResultItem(language, action, field, index, fallback),
      tProof: (text) => translateProofText(language, text),
      tf: (factLabel) => translateFactLabel(language, factLabel),
      tp: (presetId, fallback) => translatePresetLabel(language, presetId, fallback),
      tpd: (presetId, fallback) => translatePresetDescription(language, presetId, fallback),
      tFacility: (facility) => translateFacility(language, facility),
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
