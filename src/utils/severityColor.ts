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
<<<<<<< HEAD
    badge: 'bg-red-600 text-white font-extrabold border-red-600 shadow-sm shadow-red-500/20',
    badgeText: 'text-white',
    badgeBg: 'bg-red-600',
    badgeBorder: 'border-red-600',
    border: 'border-red-300',
    bgGlow: 'from-red-50 to-white',
    container: 'border-red-300 bg-white shadow-md shadow-red-100 ring-1 ring-red-200',
    accent: '#DC2626',
    icon: 'CRITICAL',
=======
    badge: 'bg-[#EF4444] text-white font-black border-[#EF4444] shadow-md shadow-[#EF4444]/40',
    badgeText: 'text-white',
    badgeBg: 'bg-[#EF4444]',
    badgeBorder: 'border-[#EF4444]',
    border: 'border-[#EF4444]/70',
    bgGlow: 'from-[#EF4444]/15 via-[#111111] to-[#090909]',
    container: 'border-[#EF4444]/60 bg-[#111111] shadow-2xl shadow-black/90 ring-1 ring-[#EF4444]/40',
    accent: '#EF4444',
    icon: '⚠️',
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    pulse: true,
    label: 'CRITICAL ALERT',
  },
  high: {
<<<<<<< HEAD
    badge: 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-xs',
    badgeText: 'text-slate-950',
    badgeBg: 'bg-amber-500',
    badgeBorder: 'border-amber-400',
    border: 'border-amber-300',
    bgGlow: 'from-amber-50 to-white',
    container: 'border-amber-300 bg-white shadow-md shadow-amber-50 ring-1 ring-amber-200',
    accent: '#D97706',
    icon: 'HIGH',
=======
    badge: 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-sm shadow-amber-500/20',
    badgeText: 'text-zinc-950',
    badgeBg: 'bg-amber-500',
    badgeBorder: 'border-amber-400',
    border: 'border-amber-500/60',
    bgGlow: 'from-amber-950/20 via-[#111111] to-[#090909]',
    container: 'border-amber-500/50 bg-[#111111] shadow-xl shadow-black/80 ring-1 ring-amber-500/30',
    accent: '#F59E0B',
    icon: '🟠',
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    pulse: false,
    label: 'HIGH SEVERITY',
  },
  moderate: {
<<<<<<< HEAD
    badge: 'bg-slate-100 text-slate-800 font-semibold border-slate-300 shadow-xs',
    badgeText: 'text-slate-800',
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-300',
    border: 'border-slate-200',
    bgGlow: 'from-slate-50 to-white',
    container: 'border-slate-200 bg-white shadow-sm',
    accent: '#2563EB',
    icon: 'MODERATE',
=======
    badge: 'bg-[#1A1A1A] text-[#FFE066] font-semibold border-[rgba(255,171,0,0.40)] shadow-sm shadow-amber-500/10',
    badgeText: 'text-[#FFE066]',
    badgeBg: 'bg-[#1A1A1A]',
    badgeBorder: 'border-[rgba(255,171,0,0.40)]',
    border: 'border-[#333333]',
    bgGlow: 'from-[rgba(255,171,0,0.06)] via-[#111111] to-[#090909]',
    container: 'border-[#333333] bg-[#111111] shadow-xl shadow-black/80',
    accent: '#FFAB00',
    icon: '🟡',
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    pulse: false,
    label: 'MODERATE',
  },
  low: {
<<<<<<< HEAD
    badge: 'bg-emerald-100 text-emerald-800 font-semibold border-emerald-300 shadow-xs',
    badgeText: 'text-emerald-800',
    badgeBg: 'bg-emerald-100',
    badgeBorder: 'border-emerald-300',
    border: 'border-slate-200',
    bgGlow: 'from-emerald-50 to-white',
    container: 'border-slate-200 bg-white shadow-sm',
    accent: '#10B981',
    icon: 'LOW',
=======
    badge: 'bg-[rgba(255,171,0,0.12)] text-[#FFAB00] font-bold border-[rgba(255,171,0,0.40)] shadow-sm',
    badgeText: 'text-[#FFAB00]',
    badgeBg: 'bg-[rgba(255,171,0,0.12)]',
    badgeBorder: 'border-[rgba(255,171,0,0.40)]',
    border: 'border-[#2A2A2A]',
    bgGlow: 'from-[rgba(255,171,0,0.08)] via-[#111111] to-[#090909]',
    container: 'border-[#2A2A2A] bg-[#111111] shadow-xl shadow-black/80',
    accent: '#FFAB00',
    icon: '🟢',
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    pulse: false,
    label: 'LOW URGENCY',
  },
  informational: {
<<<<<<< HEAD
    badge: 'bg-blue-100 text-blue-800 font-semibold border-blue-300 shadow-xs',
    badgeText: 'text-blue-800',
    badgeBg: 'bg-blue-100',
    badgeBorder: 'border-blue-300',
    border: 'border-slate-200',
    bgGlow: 'from-blue-50 to-white',
    container: 'border-slate-200 bg-white shadow-sm',
    accent: '#2563EB',
    icon: 'INFO',
=======
    badge: 'bg-[rgba(255,171,0,0.12)] text-[#FFAB00] font-bold border-[rgba(255,171,0,0.40)] shadow-sm',
    badgeText: 'text-[#FFAB00]',
    badgeBg: 'bg-[rgba(255,171,0,0.12)]',
    badgeBorder: 'border-[rgba(255,171,0,0.40)]',
    border: 'border-[#2A2A2A]',
    bgGlow: 'from-[rgba(255,171,0,0.08)] via-[#111111] to-[#090909]',
    container: 'border-[#2A2A2A] bg-[#111111] shadow-xl shadow-black/80',
    accent: '#FFAB00',
    icon: 'ℹ️',
>>>>>>> 1f78cff6a42a99d4ddfd96b4b6bd6f6380d68fa9
    pulse: false,
    label: 'INFORMATIONAL',
  },
};

export function getSeverityTheme(severity: TriageSeverity = 'moderate'): SeverityTheme {
  return SEVERITY_THEME[severity] || SEVERITY_THEME.moderate;
}
