import React from 'react';
import { ProofNode } from '../../types';
import { HapticButton } from '../ui/HapticButton';
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
  const { t, ta, tProof } = useLanguage();
  if (!isOpen || !proofTree) return null;

  const renderNode = (node: ProofNode, depth = 0) => {
    const getNodeIcon = () => {
      switch (node.type) {
        case 'rule':
          return <FileCode className="w-4 h-4 text-blue-600" />;
        case 'safety_invariant':
          return <ShieldAlert className="w-4 h-4 text-red-600" />;
        case 'evidence':
          return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
        default:
          return <GitBranch className="w-4 h-4 text-blue-600" />;
      }
    };

    const getNodeBg = () => {
      switch (node.type) {
        case 'rule':
          return 'bg-blue-50 border-blue-200 text-blue-950';
        case 'safety_invariant':
          return 'bg-red-50 border-red-200 text-red-950';
        case 'evidence':
          return 'bg-emerald-50 border-emerald-200 text-emerald-950';
        default:
          return 'bg-slate-50 border-slate-200 text-slate-900';
      }
    };

    return (
      <div
        key={node.label}
        className={`space-y-2 ${depth > 0 ? 'ml-4 sm:ml-6 pl-3 border-l-2 border-slate-200' : ''}`}
      >
        <div className={`p-3 rounded-xl border flex items-start gap-2.5 font-mono text-xs shadow-2xs ${getNodeBg()}`}>
          <div className="mt-0.5 flex-shrink-0">{getNodeIcon()}</div>
          <div className="flex-1 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <span className="uppercase text-[10px] tracking-wider opacity-70">[{t(`proof.node.${node.type}`)}]</span>
              <span>{tProof(node.label)}</span>
            </div>
            {node.details && (
              <div className="text-[11px] font-sans leading-relaxed p-2 rounded border bg-white border-slate-200 text-slate-800 shadow-2xs">
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 border border-blue-200 text-blue-800">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base tracking-tight text-slate-950">
                {t('proof.title')}
              </h3>
              <p className="text-xs font-mono text-blue-900 font-semibold">
                {t('proof.subtitle')}
              </p>
            </div>
          </div>

          <HapticButton
            variant="ghost"
            skeuomorphic={false}
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </HapticButton>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono">
            <span className="block text-[10px] uppercase text-slate-500">
              {t('proof.evaluatedGoal')}
            </span>
            <span className="font-bold text-sm text-blue-900">
              {actionHeadline ? ta(actionHeadline) : t('proof.defaultDirective')}
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 text-slate-600">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('proof.graph')}</span>
            </div>
            {renderNode(proofTree)}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-mono text-slate-600">
          <span>{t('proof.footer')}</span>
          <HapticButton
            variant="blue"
            skeuomorphic={true}
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            {t('proof.close')}
          </HapticButton>
        </div>
      </div>
    </div>
  );
};
