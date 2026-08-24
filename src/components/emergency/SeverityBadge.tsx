import React from 'react';
import { TriageSeverity } from '../../types';
import { getSeverityTheme } from '../../utils/severityColor';
import { useLanguage } from '../../context/LanguageContext';

interface SeverityBadgeProps {
  severity?: TriageSeverity;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity = 'moderate',
  size = 'md',
  showPulse = true,
}) => {
  const theme = getSeverityTheme(severity);
  const { ts } = useLanguage();

  const sizeClasses = {
    sm: 'text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 tracking-wider font-bold',
    md: 'text-xs md:text-sm px-3 py-1 tracking-wider font-bold',
    lg: 'text-sm md:text-base px-4 py-1.5 tracking-wider font-extrabold',
  };

  // Compact label for small size / mobile views to prevent text overflow
  const getDisplayLabel = () => {
    if (size === 'sm') {
      return ts(severity, true);
    }
    return ts(severity);
  };

  return (
    <div
      id={`severity-badge-${severity}`}
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs uppercase whitespace-nowrap flex-shrink-0 transition-all duration-300 ${sizeClasses[size]} ${theme.badge}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center flex-shrink-0">
        {showPulse && theme.pulse && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${severity === 'critical' ? 'bg-white' : 'bg-current'}`}></span>
      </span>
      <span className="whitespace-nowrap">{getDisplayLabel()}</span>
    </div>
  );
};
