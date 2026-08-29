import { TriageSeverity } from '../types';

export interface SeverityTheme {
  badge: string;
  badgeText: string;
  badgeBg: string;
  badgeBorder: string;
  border: string;
  bgGlow: string;
  container: string;
  accent: string;
  icon: string;
  pulse: boolean;
  label: string;
}

export const SEVERITY_THEME: Record<TriageSeverity, SeverityTheme> = {
  critical: {
    badge: 'bg-red-600 text-white font-extrabold border-red-600 shadow-sm shadow-red-500/20',
    badgeText: 'text-white',
    badgeBg: 'bg-red-600',
    badgeBorder: 'border-red-600',
    border: 'border-red-300',
    bgGlow: 'from-red-50 to-white',
    container: 'border-red-300 bg-white shadow-md shadow-red-100 ring-1 ring-red-200',
    accent: '#DC2626',
    icon: 'CRITICAL',
    pulse: true,
    label: 'CRITICAL ALERT',
  },
  high: {
    badge: 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-xs',
    badgeText: 'text-slate-950',
    badgeBg: 'bg-amber-500',
    badgeBorder: 'border-amber-400',
    border: 'border-amber-300',
    bgGlow: 'from-amber-50 to-white',
    container: 'border-amber-300 bg-white shadow-md shadow-amber-50 ring-1 ring-amber-200',
    accent: '#D97706',
    icon: 'HIGH',
    pulse: false,
    label: 'HIGH SEVERITY',
  },
  moderate: {
    badge: 'bg-slate-100 text-slate-800 font-semibold border-slate-300 shadow-xs',
    badgeText: 'text-slate-800',
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-300',
    border: 'border-slate-200',
    bgGlow: 'from-slate-50 to-white',
    container: 'border-slate-200 bg-white shadow-sm',
    accent: '#2563EB',
    icon: 'MODERATE',
    pulse: false,
    label: 'MODERATE',
  },
  low: {
    badge: 'bg-emerald-100 text-emerald-800 font-semibold border-emerald-300 shadow-xs',
    badgeText: 'text-emerald-800',
    badgeBg: 'bg-emerald-100',
    badgeBorder: 'border-emerald-300',
    border: 'border-slate-200',
    bgGlow: 'from-emerald-50 to-white',
    container: 'border-slate-200 bg-white shadow-sm',
    accent: '#10B981',
    icon: 'LOW',
    pulse: false,
    label: 'LOW URGENCY',
  },
  informational: {
    badge: 'bg-blue-100 text-blue-800 font-semibold border-blue-300 shadow-xs',
    badgeText: 'text-blue-800',
    badgeBg: 'bg-blue-100',
    badgeBorder: 'border-blue-300',
    border: 'border-slate-200',
    bgGlow: 'from-blue-50 to-white',
    container: 'border-slate-200 bg-white shadow-sm',
    accent: '#2563EB',
    icon: 'INFO',
    pulse: false,
    label: 'INFORMATIONAL',
  },
};

export function getSeverityTheme(severity: TriageSeverity = 'moderate'): SeverityTheme {
  return SEVERITY_THEME[severity] || SEVERITY_THEME.moderate;
}
