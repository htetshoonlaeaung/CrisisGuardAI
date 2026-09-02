import React from 'react';
import { AlertOctagon, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface ProhibitionsListProps {
  prohibitions: string[];
}

export const ProhibitionsList: React.FC<ProhibitionsListProps> = ({ prohibitions }) => {
  const { isLight } = useTheme();
  const { t } = useLanguage();
  if (!prohibitions || prohibitions.length === 0) return null;

  return (
    <div
      id="safety-prohibitions-container"
      className={`rounded-xl border p-4 md:p-5 space-y-3 shadow-md ${
        isLight ? 'bg-red-50/70 border-red-200' : 'border-red-500/40 bg-[#15181D]'
      }`}
    >
      <div className={`flex items-center gap-2 pb-2 border-b ${isLight ? 'border-red-200' : 'border-zinc-800'}`}>
        <ShieldAlert className="w-4 h-4 text-red-600" />
        <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-black text-red-600">
          {t('lists.prohibitions')}
        </h3>
      </div>

      <ul className="space-y-2">
        {prohibitions.map((item, index) => (
          <li
            key={index}
            className={`flex items-start gap-2.5 text-xs md:text-sm leading-relaxed font-sans ${
              isLight ? 'text-zinc-900' : 'text-zinc-200'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="font-semibold">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
