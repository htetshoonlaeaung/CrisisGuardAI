import React, { useEffect, useState } from 'react';

interface CrisisGuardLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  active?: boolean;
  repeatWhileActive?: boolean;
}

export const CrisisGuardLogo: React.FC<CrisisGuardLogoProps> = ({
  active,
  repeatWhileActive = false,
  className = '',
  onAnimationEnd,
  onFocus,
  onMouseEnter,
  tabIndex,
  ...props
}) => {
  const isControlled = typeof active === 'boolean';
  const [isPaused, setIsPaused] = useState(isControlled ? !active : false);

  useEffect(() => {
    if (isControlled) {
      setIsPaused(!active);
    }
  }, [active, isControlled]);

  const logoClassName = [
    'crisisguard-logo-flip',
    repeatWhileActive ? 'crisisguard-logo-flip--repeat' : '',
    isPaused ? 'is-paused' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <img
      {...props}
      src="/crisisguard-logo.png"
      className={logoClassName}
      tabIndex={tabIndex ?? 0}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        onFocus?.(event);
      }}
      onAnimationEnd={(event) => {
        onAnimationEnd?.(event);
        if (!repeatWhileActive) {
          setIsPaused(true);
        }
      }}
    />
  );
};
