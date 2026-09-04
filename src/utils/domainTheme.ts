import {
  Car,
  Flame,
  HeartPulse,
  LucideIcon,
  Waves,
} from 'lucide-react';
import { CrisisDomain } from '../types';

export interface DomainTheme {
  id: CrisisDomain;
  Icon: LucideIcon;
  accent: string;
  accentSoft: string;
  accentBorder: string;
  accentText: string;
  accentTextStrong: string;
  accentBg: string;
  accentBgHover: string;
  accentRing: string;
  activeSurface: string;
  activeSurfaceLight: string;
  descriptionKey: string;
}

export const DOMAIN_ORDER: CrisisDomain[] = [
  'medical',
  'fire_hazard',
  'natural_disaster',
  'road_accident',
];

export const DOMAIN_THEMES: Record<CrisisDomain, DomainTheme> = {
  medical: {
    id: 'medical',
    Icon: HeartPulse,
    accent: '#2563EB',
    accentSoft: 'rgba(37,99,235,0.12)',
    accentBorder: 'rgba(37,99,235,0.38)',
    accentText: 'text-blue-600',
    accentTextStrong: 'text-blue-700',
    accentBg: 'bg-blue-600',
    accentBgHover: 'hover:bg-blue-700',
    accentRing: 'focus-visible:outline-blue-500',
    activeSurface: 'bg-blue-500/12 border-blue-400/55 text-blue-200',
    activeSurfaceLight: 'bg-blue-50 border-blue-300 text-blue-950',
    descriptionKey: 'domainSelection.description.medical',
  },
  fire_hazard: {
    id: 'fire_hazard',
    Icon: Flame,
    accent: '#F97316',
    accentSoft: 'rgba(249,115,22,0.12)',
    accentBorder: 'rgba(249,115,22,0.40)',
    accentText: 'text-orange-600',
    accentTextStrong: 'text-orange-700',
    accentBg: 'bg-orange-600',
    accentBgHover: 'hover:bg-orange-700',
    accentRing: 'focus-visible:outline-orange-500',
    activeSurface: 'bg-orange-500/12 border-orange-400/55 text-orange-200',
    activeSurfaceLight: 'bg-orange-50 border-orange-300 text-orange-950',
    descriptionKey: 'domainSelection.description.fire_hazard',
  },
  natural_disaster: {
    id: 'natural_disaster',
    Icon: Waves,
    accent: '#0D9488',
    accentSoft: 'rgba(13,148,136,0.12)',
    accentBorder: 'rgba(13,148,136,0.40)',
    accentText: 'text-teal-600',
    accentTextStrong: 'text-teal-700',
    accentBg: 'bg-teal-600',
    accentBgHover: 'hover:bg-teal-700',
    accentRing: 'focus-visible:outline-teal-500',
    activeSurface: 'bg-teal-500/12 border-teal-400/55 text-teal-200',
    activeSurfaceLight: 'bg-teal-50 border-teal-300 text-teal-950',
    descriptionKey: 'domainSelection.description.natural_disaster',
  },
  road_accident: {
    id: 'road_accident',
    Icon: Car,
    accent: '#D97706',
    accentSoft: 'rgba(217,119,6,0.12)',
    accentBorder: 'rgba(217,119,6,0.42)',
    accentText: 'text-amber-600',
    accentTextStrong: 'text-amber-700',
    accentBg: 'bg-amber-600',
    accentBgHover: 'hover:bg-amber-700',
    accentRing: 'focus-visible:outline-amber-500',
    activeSurface: 'bg-amber-500/12 border-amber-400/55 text-amber-200',
    activeSurfaceLight: 'bg-amber-50 border-amber-300 text-amber-950',
    descriptionKey: 'domainSelection.description.road_accident',
  },
};

export function getDomainTheme(domain: CrisisDomain): DomainTheme {
  return DOMAIN_THEMES[domain];
}
