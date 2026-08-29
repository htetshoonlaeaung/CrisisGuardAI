import React, { useState, useCallback, useRef } from 'react';

export type HapticButtonVariant = 'primary' | 'amber' | 'cyan' | 'blue' | 'secondary' | 'danger' | 'ghost' | 'icon' | 'tab';

interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: HapticButtonVariant;
  className?: string;
  innerClassName?: string;
  disabled?: boolean;
  ripple?: boolean;
  skeuomorphic?: boolean;
}

interface RipplePoint {
  x: number;
  y: number;
  id: number;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  innerClassName,
  disabled = false,
  ripple = true,
  skeuomorphic = true,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const addRipple = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || !ripple) return;
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left;
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 550);
  }, [disabled, ripple]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsPressed(true);
    addRipple(e);
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

  const getVariantStyles = () => {
    switch (variant) {
      case 'amber':
      case 'cyan':
      case 'blue':
        return skeuomorphic
          ? 'skeuo-btn-blue font-bold text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white font-bold border border-blue-600 shadow-sm shadow-blue-200';
      case 'primary':
        return skeuomorphic
          ? 'skeuo-btn bg-blue-600 hover:bg-blue-700 text-white font-semibold border border-blue-600 shadow-sm'
          : 'bg-blue-600 hover:bg-blue-700 text-white font-semibold border border-blue-600 shadow-xs';
      case 'secondary':
        return skeuomorphic
          ? 'skeuo-btn bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium border border-slate-200 shadow-2xs'
          : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium border border-slate-200';
      case 'danger':
        return skeuomorphic
          ? 'skeuo-btn bg-red-600 hover:bg-red-700 text-white font-bold border border-red-600 shadow-md shadow-red-200'
          : 'bg-red-600 hover:bg-red-700 text-white font-bold border border-red-600 shadow-sm shadow-red-200';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent';
      case 'icon':
        return skeuomorphic
          ? 'skeuo-btn p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
          : 'p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200';
      case 'tab':
        return 'bg-transparent text-slate-500 hover:text-slate-900 border border-transparent';
      default:
        return 'bg-white text-slate-800 border border-slate-200';
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
        transform: isPressed ? 'scale(0.93)' : undefined,
      }}
      className={`hbtn press-btn relative select-none cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-200 ease-spring disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none focus-visible:outline-2 focus-visible:outline-blue-600 ${
        isPressed ? 'is-pressed' : ''
      } ${getVariantStyles()} ${className}`}
      {...props}
    >
      {/* Google Material style ripple effect */}
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="ripple-dot"
          style={{
            left: `${x - 20}px`,
            top: `${y - 20}px`,
            width: '40px',
            height: '40px',
          }}
          aria-hidden="true"
        />
      ))}
      <span className={`relative z-10 flex pointer-events-none w-full ${innerClassName ?? 'items-center justify-center gap-2'}`}>
        {children}
      </span>
    </button>
  );
};
