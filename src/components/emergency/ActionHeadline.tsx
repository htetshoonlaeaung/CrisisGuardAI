import React from 'react';
import { TriageSeverity } from '../../types';
import { humanizeAction } from '../../utils/humanizeAction';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface ActionHeadlineProps {
  action: string;
  severity: TriageSeverity;
}

export const ActionHeadline: React.FC<ActionHeadlineProps> = ({ action, severity }) => {
  const { t, ts, ta, language } = useLanguage();
  const humanized = language === 'my' ? ta(action) : humanizeAction(action);

  const getIcon = () => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-600 flex-shrink-0" />;
      case 'high':
        return <AlertTriangle className="w-7 h-7 md:w-8 md:h-8 text-amber-500 flex-shrink-0" />;
      case 'moderate':
        return <Info className="w-6 h-6 md:w-7 md:h-7 text-blue-600 flex-shrink-0" />;
      case 'low':
        return <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 flex-shrink-0" />;
      default:
        return <Info className="w-6 h-6 md:w-7 md:h-7 text-blue-600 flex-shrink-0" />;
    }
  };

  const getContainerBg = () => {
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
  };

  return (
    <div
      id="emergency-action-headline"
      className={`rounded-2xl border p-5 md:p-6 shadow-sm transition-all duration-300 ${getContainerBg()}`}
    >
      <div className="flex items-start gap-4">
        {getIcon()}
        <div className="flex-1 space-y-1">
          <div className="text-[11px] md:text-xs font-mono uppercase tracking-widest font-extrabold flex items-center gap-2 text-slate-600">
            <span>{t('action.directive')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-slate-900 font-black">{ts(severity)}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-slate-950">
            {humanized}
          </h2>

          <p className="text-xs md:text-sm pt-1 font-sans text-slate-600">
            {t('action.directiveBody')}
          </p>
        </div>
      </div>
    </div>
  );
};
