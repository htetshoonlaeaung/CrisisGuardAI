import React from 'react';
import { ProofNode } from '../../types';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, GitBranch, ShieldAlert, CheckCircle2, FileCode, Layers } from 'lucide-react';

interface ExplanationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  proofTree?: ProofNode;
  actionHeadline?: string;
}

export const ExplanationDrawer: React.FC<ExplanationDrawerProps> = ({
  isOpen,
  onClose,
  proofTree,
  actionHeadline,
}) => {
  const { isLight } = useTheme();
  const { t, ta, tProof } = useLanguage();
  if (!isOpen || !proofTree) return null;

  const renderNode = (node: ProofNode, depth = 0) => {
    const getNodeIcon = () => {
      switch (node.type) {
        case 'rule':
          return <FileCode className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />;
        case 'safety_invariant':
          return <ShieldAlert className="w-4 h-4 text-[#EF4444]" />;
        case 'evidence':
          return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        default:
          return <GitBranch className={`w-4 h-4 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />;
      }
    };

    const getNodeBg = () => {
      if (isLight) {
        switch (node.type) {
          case 'rule':
            return 'bg-amber-50 border-amber-200 text-amber-950';
          case 'safety_invariant':
            return 'bg-red-50 border-red-200 text-red-950';
          case 'evidence':
            return 'bg-emerald-50 border-emerald-200 text-emerald-950';
          default:
            return 'bg-zinc-50 border-zinc-200 text-zinc-900';
        }
      }
      switch (node.type) {
        case 'rule':
          return 'bg-[rgba(255,171,0,0.10)] border-[rgba(255,171,0,0.35)] text-[#FFD000]';
        case 'safety_invariant':
          return 'bg-[#EF4444]/15 border-[#EF4444]/60 text-red-200';
        case 'evidence':
          return 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200';
        default:
          return 'bg-[#111111] border-[#2A2A2A] text-zinc-200';
      }
    };

    return (
      <div
        key={node.label}
        className={`space-y-2 ${depth > 0 ? (isLight ? 'ml-4 sm:ml-6 pl-3 border-l-2 border-zinc-300' : 'ml-4 sm:ml-6 pl-3 border-l-2 border-[#2A2A2A]') : ''}`}
      >
        <div className={`p-3 rounded-xl border flex items-start gap-2.5 font-mono text-xs ${getNodeBg()}`}>
          <div className="mt-0.5 flex-shrink-0">{getNodeIcon()}</div>
          <div className="flex-1 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <span className="uppercase text-[10px] tracking-wider opacity-70">[{t(`proof.node.${node.type}`)}]</span>
              <span>{tProof(node.label)}</span>
            </div>
            {node.details && (
              <div
                className={`text-[11px] font-sans leading-relaxed p-2 rounded border ${
                  isLight
                    ? 'bg-white border-zinc-200 text-zinc-800'
                    : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-300'
                }`}
              >
                {tProof(node.details)}
              </div>
            )}
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="space-y-2 mt-2">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id="xai-proof-drawer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity"
    >
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col ${
          isLight
            ? 'bg-white border-zinc-300 text-zinc-900'
            : 'border-[#2A2A2A] bg-[#111111] text-zinc-100'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 md:p-5 border-b ${
            isLight ? 'border-zinc-200 bg-zinc-50' : 'border-[#2A2A2A] bg-[#090909]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isLight
                  ? 'bg-amber-100 border border-amber-300 text-amber-800'
                  : 'bg-[#1A1A1A] border border-[rgba(255,171,0,0.40)] text-[#FFAB00]'
              }`}
            >
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`font-extrabold text-sm md:text-base tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                {t('proof.title')}
              </h3>
              <p className={`text-xs font-mono ${isLight ? 'text-amber-800 font-semibold' : 'text-[#FFAB00]'}`}>
                {t('proof.subtitle')}
              </p>
            </div>
          </div>

          <HapticButton
            variant="ghost"
            onClick={onClose}
            className={`p-1.5 rounded-lg ${isLight ? 'text-zinc-500 hover:text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            <X className="w-5 h-5" />
          </HapticButton>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div
            className={`p-3 rounded-xl border text-xs font-mono ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#090909] border-[#2A2A2A] text-zinc-400'
            }`}
          >
            <span className="block text-[10px] uppercase text-zinc-500">
              {t('proof.evaluatedGoal')}
            </span>
            <span className={`font-bold text-sm ${isLight ? 'text-amber-900' : 'text-[#FFAB00]'}`}>
              {actionHeadline ? ta(actionHeadline) : t('proof.defaultDirective')}
            </span>
          </div>

          <div className="space-y-3">
            <div
              className={`text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
              <span>{t('proof.graph')}</span>
            </div>
            {renderNode(proofTree)}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs font-mono ${
            isLight
              ? 'border-zinc-200 bg-zinc-50 text-zinc-600'
              : 'border-[#2A2A2A] bg-[#090909] text-zinc-400'
          }`}
        >
          <span>{t('proof.footer')}</span>
          <HapticButton
            variant={isLight ? 'primary' : 'amber'}
            onClick={onClose}
            className={`px-4 py-2 rounded-xl font-bold ${
              isLight ? 'bg-zinc-900 hover:bg-black text-white' : 'skeuo-btn-amber text-zinc-950 font-bold'
            }`}
          >
            {t('proof.close')}
          </HapticButton>
        </div>
      </div>
    </div>
  );
};
