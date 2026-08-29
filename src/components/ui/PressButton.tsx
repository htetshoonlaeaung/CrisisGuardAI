import React, { useState, useRef, useCallback } from 'react';

export type PressButtonVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'icon';

export interface PressButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: PressButtonVariant;
  className?: string;
  disabled?: boolean;
  scaleOnPress?: number; // default 0.93
  enableHaptic?: boolean;
}

/**
 * PressButton — Spring Press Effect with Physical Tactile Depth
 * - Depresses physically (scale 0.93) on press
 * - Springs back with cubic-bezier overshoot on release (Apple/Spotify bounce)
 * - Layered raised/swollen look via multi-depth box-shadows
 * - Responsive pointer events for both mobile touch and desktop click
 * - Input overload protected & accessible
 */
export const PressButton: React.FC<PressButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className = '',
  disabled = false,
  scaleOnPress = 0.93,
  enableHaptic = true,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const triggerHaptic = useCallback(() => {
    if (enableHaptic && typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore haptic if restricted by browser permissions
      }
    }
  }, [enableHaptic]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsPressed(true);
    triggerHaptic();
    if (props.onPointerDown) props.onPointerDown(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    if (props.onPointerUp) props.onPointerUp(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    if (props.onPointerLeave) props.onPointerLeave(e);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    if (props.onPointerCancel) props.onPointerCancel(e);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-blue-600 hover:bg-blue-700 text-white font-bold border border-blue-500/80
          shadow-[0_4px_14px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]
          active:shadow-[0_1px_4px_rgba(37,99,235,0.2)]
        `;
      case 'secondary':
        return `
          bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-200/90
          shadow-[0_3px_10px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
          active:shadow-[0_1px_3px_rgba(0,0,0,0.06)]
        `;
      case 'danger':
        return `
          bg-red-600 hover:bg-red-700 text-white font-bold border border-red-500
          shadow-[0_4px_14px_rgba(220,38,38,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]
          active:shadow-[0_1px_4px_rgba(220,38,38,0.2)]
        `;
      case 'warning':
        return `
          bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border border-amber-400
          shadow-[0_4px_14px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]
          active:shadow-[0_1px_4px_rgba(245,158,11,0.2)]
        `;
      case 'ghost':
        return `
          bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 border border-transparent
          active:bg-slate-200/60
        `;
      case 'icon':
        return `
          p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200
          shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]
          active:shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        `;
      case 'default':
      default:
        return `
          bg-white text-slate-900 font-semibold border border-slate-200
          shadow-[0_4px_14px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)]
          active:shadow-[0_1px_4px_rgba(0,0,0,0.12)]
        `;
    }
  };

  return (
    <button
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onClick={onClick}
      disabled={disabled}
      style={{
        transform: isPressed ? `scale(${scaleOnPress})` : 'scale(1)',
      }}
      className={`
        press-btn relative select-none cursor-pointer inline-flex items-center justify-center gap-2
        px-4 py-2.5 rounded-xl text-sm font-semibold
        transition-all duration-200 ease-spring
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        ${getVariantClasses()}
        ${isPressed ? 'is-pressed' : ''}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none w-full">
        {children}
      </span>
    </button>
  );
};
