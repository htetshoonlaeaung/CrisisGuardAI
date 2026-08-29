import React from 'react';
import { AlertOctagon, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProhibitionsListProps {
  prohibitions: string[];
}

export const ProhibitionsList: React.FC<ProhibitionsListProps> = ({ prohibitions }) => {
  const { t } = useLanguage();
  if (!prohibitions || prohibitions.length === 0) return null;

  return (
    <div
      id="safety-prohibitions-container"
      className="rounded-xl border border-red-200 bg-red-50/80 p-4 md:p-5 space-y-3 shadow-xs"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-red-200">
        <ShieldAlert className="w-4 h-4 text-red-600" />
        <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-extrabold text-red-700">
          {t('lists.prohibitions')}
        </h3>
      </div>

      <ul className="space-y-2">
        {prohibitions.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-xs md:text-sm leading-relaxed font-sans text-slate-800"
          >
            <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="font-semibold">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
