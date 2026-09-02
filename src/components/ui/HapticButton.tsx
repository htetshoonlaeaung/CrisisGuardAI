import React, { useState, useCallback, useRef } from 'react';

export type HapticButtonVariant = 'primary' | 'amber' | 'cyan' | 'secondary' | 'danger' | 'ghost' | 'icon' | 'tab';

interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: HapticButtonVariant;
  className?: string;
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
        return skeuomorphic
          ? 'skeuo-btn-amber font-black text-zinc-950'
          : 'bg-[#FFAB00] hover:bg-[#FFD000] text-zinc-950 font-bold border border-[#FFAB00] shadow-md shadow-[#FFAB00]/25';
      case 'primary':
        return skeuomorphic
          ? 'skeuo-btn bg-[#181B20] hover:bg-[#20252C] text-zinc-100 font-semibold border border-zinc-700/80'
          : 'bg-[#181B20] hover:bg-[#20252C] text-zinc-100 font-semibold border border-zinc-700/80 shadow-sm';
      case 'secondary':
        return skeuomorphic
          ? 'skeuo-btn bg-[#111111] hover:bg-[#1A1A1A] text-zinc-200 hover:text-white font-medium border border-[#2A2A2A]'
          : 'bg-[#090909] hover:bg-[#111111] text-zinc-300 hover:text-white font-medium border border-[#2A2A2A]';
      case 'danger':
        return skeuomorphic
          ? 'skeuo-btn bg-red-950/80 hover:bg-red-900 text-red-200 font-bold border border-red-600/70 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
          : 'bg-[#EF4444] hover:bg-[#FF3B30] text-white font-bold border border-[#EF4444] shadow-md shadow-[#EF4444]/30';
      case 'ghost':
        return 'bg-transparent hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100 border border-transparent';
      case 'icon':
        return skeuomorphic
          ? 'skeuo-btn p-2 rounded-xl bg-[#111111] hover:bg-[#1A1A1A] text-zinc-400 hover:text-[#FFAB00] border border-[#2A2A2A]'
          : 'p-2 rounded-xl bg-[#111111] hover:bg-[#1A1A1A] text-zinc-400 hover:text-[#FFAB00] border border-[#2A2A2A]';
      case 'tab':
        return 'bg-transparent text-zinc-400 hover:text-zinc-200 border border-transparent';
      default:
        return 'bg-[#181B20] text-zinc-100 border border-[#2A2A2A]';
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
      className={`hbtn select-none cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#FFAB00] ${
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
      <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none w-full">
        {children}
      </span>
    </button>
  );
};
