import React from 'react';
import { AlertOctagon, ShieldAlert } from 'lucide-react';
<<<<<<< HEAD
=======
import { useTheme } from '../../context/ThemeContext';
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
import { useLanguage } from '../../context/LanguageContext';

interface ProhibitionsListProps {
  prohibitions: string[];
}

export const ProhibitionsList: React.FC<ProhibitionsListProps> = ({ prohibitions }) => {
<<<<<<< HEAD
=======
  const { isLight } = useTheme();
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
  const { t } = useLanguage();
  if (!prohibitions || prohibitions.length === 0) return null;

  return (
    <div
      id="safety-prohibitions-container"
<<<<<<< HEAD
      className="rounded-xl border border-red-200 bg-red-50/80 p-4 md:p-5 space-y-3 shadow-xs"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-red-200">
        <ShieldAlert className="w-4 h-4 text-red-600" />
        <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-extrabold text-red-700">
=======
      className={`rounded-xl border p-4 md:p-5 space-y-3 shadow-md ${
        isLight ? 'bg-red-50/70 border-red-200' : 'border-red-500/40 bg-[#15181D]'
      }`}
    >
      <div className={`flex items-center gap-2 pb-2 border-b ${isLight ? 'border-red-200' : 'border-zinc-800'}`}>
        <ShieldAlert className="w-4 h-4 text-red-600" />
        <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider font-black text-red-600">
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
          {t('lists.prohibitions')}
        </h3>
      </div>

      <ul className="space-y-2">
        {prohibitions.map((item, index) => (
          <li
            key={index}
<<<<<<< HEAD
            className="flex items-start gap-2.5 text-xs md:text-sm leading-relaxed font-sans text-slate-800"
=======
            className={`flex items-start gap-2.5 text-xs md:text-sm leading-relaxed font-sans ${
              isLight ? 'text-zinc-900' : 'text-zinc-200'
            }`}
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
          >
            <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="font-semibold">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
