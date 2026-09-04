import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, History, KeyRound, LogIn, LogOut, UserPlus, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface ProfileMenuProps {
  onNavigate: (path: string) => void;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'CG';
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <div className="hidden max-w-60 text-right text-[11px] font-semibold leading-4 text-white/80 lg:block">
          <p>{t('account.optionalHelp')}</p>
          <p className="text-[#CBD5E1]">{t('account.guestTemporary')}</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/login')}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <LogIn className="h-4 w-4" />
          {t('account.logIn')}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('/register')}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#FFAB00] px-3 py-2 text-sm font-black text-[#090909] hover:bg-[#FFD000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <UserPlus className="h-4 w-4" />
          {t('account.createAccount')}
        </button>
      </div>
    );
  }

  const itemClass = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-zinc-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-black text-[#082B5C]">
          {initials(user.full_name)}
        </span>
        <span className="hidden max-w-32 truncate text-sm font-bold sm:inline">{user.full_name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-white/15 bg-[#082B5C] p-2 shadow-2xl"
        >
          <button className={itemClass} role="menuitem" onClick={() => { setOpen(false); onNavigate('/profile'); }}>
            <UserRound className="h-4 w-4" />
            {t('account.myProfile')}
          </button>
          <button className={itemClass} role="menuitem" onClick={() => { setOpen(false); onNavigate('/history'); }}>
            <History className="h-4 w-4" />
            {t('account.myHistory')}
          </button>
          <button className={itemClass} role="menuitem" onClick={() => { setOpen(false); onNavigate('/change-password'); }}>
            <KeyRound className="h-4 w-4" />
            {t('account.changePassword')}
          </button>
          <button
            className={`${itemClass} text-red-100 hover:bg-red-500/20`}
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await logout();
              onNavigate('/app');
            }}
          >
            <LogOut className="h-4 w-4" />
            {t('account.logOut')}
          </button>
        </div>
      )}
    </div>
  );
};
