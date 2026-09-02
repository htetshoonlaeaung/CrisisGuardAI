import React from 'react';
import { TriageSeverity } from '../../types';
import { humanizeAction } from '../../utils/humanizeAction';
<<<<<<< HEAD
=======
import { getSeverityTheme } from '../../utils/severityColor';
import { useTheme } from '../../context/ThemeContext';
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface ActionHeadlineProps {
  action: string;
  severity: TriageSeverity;
}

export const ActionHeadline: React.FC<ActionHeadlineProps> = ({ action, severity }) => {
<<<<<<< HEAD
  const { t, ts, ta, language } = useLanguage();
=======
  const { isLight } = useTheme();
  const { t, ts, ta, language } = useLanguage();
  const theme = getSeverityTheme(severity);
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
  const humanized = language === 'my' ? ta(action) : humanizeAction(action);

  const getIcon = () => {
    switch (severity) {
      case 'critical':
<<<<<<< HEAD
        return <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-600 flex-shrink-0" />;
      case 'high':
        return <AlertTriangle className="w-7 h-7 md:w-8 md:h-8 text-amber-500 flex-shrink-0" />;
      case 'moderate':
        return <Info className="w-6 h-6 md:w-7 md:h-7 text-blue-600 flex-shrink-0" />;
      case 'low':
        return <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 flex-shrink-0" />;
      default:
        return <Info className="w-6 h-6 md:w-7 md:h-7 text-blue-600 flex-shrink-0" />;
=======
        return <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-500 flex-shrink-0" />;
      case 'high':
        return <AlertTriangle className="w-7 h-7 md:w-8 md:h-8 text-amber-500 flex-shrink-0" />;
      case 'moderate':
        return <Info className="w-6 h-6 md:w-7 md:h-7 text-cyan-600 flex-shrink-0" />;
      case 'low':
        return <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-emerald-500 flex-shrink-0" />;
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    }
  };

  const getContainerBg = () => {
<<<<<<< HEAD
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-slate-900 shadow-xs';
      case 'high':
        return 'bg-amber-50 border-amber-200 text-slate-900 shadow-xs';
      case 'moderate':
        return 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs';
      case 'low':
      default:
        return 'bg-emerald-50 border-emerald-200 text-slate-900 shadow-xs';
    }
=======
    if (isLight) {
      switch (severity) {
        case 'critical':
          return 'bg-red-50 border-red-200 text-zinc-900 shadow-sm';
        case 'high':
          return 'bg-amber-50 border-amber-200 text-zinc-900 shadow-sm';
        case 'moderate':
          return 'bg-cyan-50 border-cyan-200 text-zinc-900 shadow-sm';
        default:
          return 'bg-emerald-50 border-emerald-200 text-zinc-900 shadow-sm';
      }
    }
    return theme.container;
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
  };

  return (
    <div
      id="emergency-action-headline"
<<<<<<< HEAD
      className={`rounded-2xl border p-5 md:p-6 shadow-sm transition-all duration-300 ${getContainerBg()}`}
=======
      className={`rounded-2xl border p-5 md:p-6 shadow-xl transition-all duration-300 ${getContainerBg()}`}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    >
      <div className="flex items-start gap-4">
        {getIcon()}
        <div className="flex-1 space-y-1">
<<<<<<< HEAD
          <div className="text-[11px] md:text-xs font-mono uppercase tracking-widest font-extrabold flex items-center gap-2 text-slate-600">
            <span>{t('action.directive')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-slate-900 font-black">{ts(severity)}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-slate-950">
            {humanized}
          </h2>

          <p className="text-xs md:text-sm pt-1 font-sans text-slate-600">
=======
          <div
            className={`text-[11px] md:text-xs font-mono uppercase tracking-widest font-extrabold flex items-center gap-2 ${
              isLight ? 'text-zinc-600' : 'text-zinc-400'
            }`}
          >
            <span>{t('action.directive')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span className={isLight ? 'text-zinc-900 font-black' : 'text-zinc-300'}>{ts(severity)}</span>
          </div>

          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight ${
              isLight ? 'text-zinc-950' : 'text-white'
            }`}
          >
            {humanized}
          </h2>

          <p className={`text-xs md:text-sm pt-1 font-sans ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
            {t('action.directiveBody')}
          </p>
        </div>
      </div>
    </div>
  );
};
