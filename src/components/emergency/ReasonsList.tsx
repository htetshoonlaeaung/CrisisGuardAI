import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface ReasonsListProps {
  reasons: string[];
}

export const ReasonsList: React.FC<ReasonsListProps> = ({ reasons }) => {
  const { isLight } = useTheme();
  const { t } = useLanguage();
  if (!reasons || reasons.length === 0) return null;

  return (
    <div
      id="reasons-list-container"
      className={`rounded-xl border p-4 md:p-5 space-y-3 ${
        isLight ? 'bg-cyan-50/50 border-cyan-200 text-zinc-900' : 'border-zinc-800/80 bg-[#111315]'
      }`}
    >
      <div className={`flex items-center gap-2 pb-2 border-b ${isLight ? 'border-cyan-200' : 'border-zinc-800'}`}>
        <Sparkles className={`w-4 h-4 ${isLight ? 'text-cyan-700 fill-cyan-700' : 'text-[#8FE7F4] fill-[#8FE7F4]'}`} />
        <h3 className={`text-xs md:text-sm font-mono uppercase tracking-wider font-bold ${isLight ? 'text-cyan-950' : 'text-zinc-200'}`}>
          {t('lists.reasoning')}
        </h3>
      </div>

      <ul className="space-y-2">
        {reasons.map((reason, index) => (
          <li
            key={index}
            className={`flex items-start gap-2.5 text-xs md:text-sm leading-relaxed font-sans ${
              isLight ? 'text-zinc-800' : 'text-zinc-300'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isLight ? 'text-cyan-700' : 'text-[#8FE7F4]'}`} />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
