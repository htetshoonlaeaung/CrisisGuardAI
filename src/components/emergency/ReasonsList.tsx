import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ReasonsListProps {
  reasons: string[];
}

export const ReasonsList: React.FC<ReasonsListProps> = ({ reasons }) => {
  const { t } = useLanguage();
  if (!reasons || reasons.length === 0) return null;

  return (
    <div
      id="reasons-list-container"
      className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5 space-y-3 text-slate-900"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
        <Sparkles className="w-4 h-4 text-blue-600 fill-blue-600" />
        <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-bold text-slate-900">
          {t('lists.reasoning')}
        </h3>
      </div>

      <ul className="space-y-2">
        {reasons.map((reason, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-xs md:text-sm leading-relaxed font-sans text-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
