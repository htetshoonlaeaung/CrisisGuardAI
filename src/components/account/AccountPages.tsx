import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  History,
  KeyRound,
  Loader2,
  Mail,
  Save,
  Shield,
  UserRound,
} from 'lucide-react';
import { CrisisDomain, EmergencySession } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { DOMAIN_ORDER } from '../../utils/domainTheme';
import { CrisisGuardLogo } from '../CrisisGuardLogo';

type NavigateFn = (path: string) => void;

const fieldClass = 'crisisguard-input min-h-11 w-full rounded-xl border px-3 text-sm outline-none transition';
const passwordFieldClass = 'crisisguard-input crisisguard-password-input min-h-11 w-full rounded-xl border px-3 text-sm outline-none transition';

function AuthShell({ children }: { children: React.ReactNode }) {
  const { isLight } = useTheme();
  return (
    <main className={`min-h-screen px-4 py-8 ${isLight ? 'bg-[#F4F6F9] text-zinc-950' : 'bg-[#090909] text-zinc-100'}`}>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-6 flex items-center justify-center gap-2" aria-label="CrisisGuard AI">
          <div className="relative h-12 w-[47px] overflow-hidden">
            <CrisisGuardLogo alt="CrisisGuard AI logo" className="h-full w-auto max-w-none object-contain object-left" />
          </div>
          <div className="flex items-baseline gap-1 text-[28px] font-black leading-none">
            <span>CrisisGuard</span>
            <span className="text-[#EA002C]">AI</span>
          </div>
        </div>
        <section className={`rounded-2xl border p-5 shadow-xl ${isLight ? 'border-zinc-200 bg-white' : 'border-[#2A2A2A] bg-[#111111]'}`}>
          {children}
        </section>
      </div>
    </main>
  );
}

function Alert({ type, children }: { type: 'error' | 'success' | 'info'; children: React.ReactNode }) {
  const classes = {
    error: 'border-red-500/40 bg-red-500/10 text-red-200',
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    info: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
  }[type];
  const Icon = type === 'error' ? AlertCircle : CheckCircle2;
  return (
    <div className={`flex gap-2 rounded-xl border p-3 text-sm ${classes}`}>
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function PasswordInput({ id, label, value, onChange, autoComplete }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      <span className="relative block">
        <input
          id={id}
          className={`${passwordFieldClass} pr-11`}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          onClick={() => setShow((value) => !value)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
          aria-label={show ? t('account.hidePassword') : t('account.showPassword')}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}

function SubmitButton({ loading, children, icon }: { loading: boolean; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FFAB00] px-4 py-2 text-sm font-black text-[#090909] transition hover:bg-[#FFD000] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function LoginPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onNavigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <h1 className="text-2xl font-black">{t('account.loginTitle')}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('account.loginSubtitle')}</p>
        </div>
        <Alert type="info">{t('account.optionalHelp')}</Alert>
        {error && <Alert type="error">{error}</Alert>}
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">{t('account.email')}</span>
          <input className={fieldClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </label>
        <PasswordInput id="login-password" label={t('account.password')} value={password} onChange={setPassword} autoComplete="current-password" />
        <button type="button" className="text-sm font-bold text-[#FFAB00] hover:underline" onClick={() => onNavigate('/forgot-password')}>
          {t('account.forgotPassword')}
        </button>
        <SubmitButton loading={loading} icon={<KeyRound className="h-4 w-4" />}>{t('account.logIn')}</SubmitButton>
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#3B82F6] px-4 py-2 text-sm font-black text-[#3B82F6] transition hover:bg-[#3B82F6]/10"
          onClick={() => onNavigate('/app')}
        >
          {t('account.continueGuest')}
        </button>
        <p className="text-center text-sm text-zinc-500">{t('account.guestTemporary')}</p>
        <p className="text-center text-sm text-zinc-500">
          {t('account.noAccount')}{' '}
          <button type="button" className="font-bold text-[#FFAB00] hover:underline" onClick={() => onNavigate('/register')}>
            {t('account.createAccount')}
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      onNavigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <h1 className="text-2xl font-black">{t('account.registerTitle')}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('account.registerSubtitle')}</p>
        </div>
        <Alert type="info">{t('account.optionalHelp')}</Alert>
        {error && <Alert type="error">{error}</Alert>}
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">{t('account.fullName')}</span>
          <input className={fieldClass} value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} autoComplete="name" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">{t('account.email')}</span>
          <input className={fieldClass} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" required />
        </label>
        <PasswordInput id="register-password" label={t('account.password')} value={form.password} onChange={(password) => setForm({ ...form, password })} autoComplete="new-password" />
        <PasswordInput id="register-confirm" label={t('account.confirmPassword')} value={form.confirm_password} onChange={(confirm_password) => setForm({ ...form, confirm_password })} autoComplete="new-password" />
        <SubmitButton loading={loading} icon={<UserRound className="h-4 w-4" />}>{t('account.createAccount')}</SubmitButton>
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#3B82F6] px-4 py-2 text-sm font-black text-[#3B82F6] transition hover:bg-[#3B82F6]/10"
          onClick={() => onNavigate('/app')}
        >
          {t('account.continueGuest')}
        </button>
        <p className="text-center text-sm text-zinc-500">
          {t('account.haveAccount')}{' '}
          <button type="button" className="font-bold text-[#FFAB00] hover:underline" onClick={() => onNavigate('/login')}>
            {t('account.logIn')}
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

export function AccountOnlyInvitation({ onNavigate }: { onNavigate: NavigateFn }) {
  const { t } = useLanguage();

  return (
    <AuthShell>
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F2742] text-white">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black">{t('account.accountOnlyTitle')}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{t('account.accountOnlyBody')}</p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#FFAB00] px-4 py-2 text-sm font-black text-[#090909] hover:bg-[#FFD000]"
          onClick={() => onNavigate('/app')}
        >
          {t('account.getEmergencyHelp')}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-bold dark:border-[#2A2A2A]" onClick={() => onNavigate('/login')}>
            {t('account.logIn')}
          </button>
          <button type="button" className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-bold dark:border-[#2A2A2A]" onClick={() => onNavigate('/register')}>
            {t('account.createAccount')}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

export function ForgotPasswordPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [unconfigured, setUnconfigured] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setNotice('');
    setUnconfigured(false);
    try {
      const response = await api.forgotPassword(email);
      setNotice(response.message);
      setUnconfigured(!response.delivery_configured);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <form className="space-y-4" onSubmit={submit}>
        <button type="button" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#FFAB00]" onClick={() => onNavigate('/login')}>
          <ArrowLeft className="h-4 w-4" /> {t('account.backToLogin')}
        </button>
        <div>
          <h1 className="text-2xl font-black">{t('account.resetTitle')}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t('account.resetSubtitle')}</p>
        </div>
        {notice && <Alert type={unconfigured ? 'info' : 'success'}>{notice}{unconfigured ? ` ${t('account.emailUnconfigured')}` : ''}</Alert>}
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">{t('account.email')}</span>
          <input className={fieldClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </label>
        <SubmitButton loading={loading} icon={<Mail className="h-4 w-4" />}>{t('account.sendReset')}</SubmitButton>
      </form>
    </AuthShell>
  );
}

export function ResetPasswordPage({ token, onNavigate }: { token: string; onNavigate: NavigateFn }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await api.resetPassword({ token, password, confirm_password: confirmPassword });
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <form className="space-y-4" onSubmit={submit}>
        <h1 className="text-2xl font-black">{t('account.newPasswordTitle')}</h1>
        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}
        <PasswordInput id="reset-password" label={t('account.newPassword')} value={password} onChange={setPassword} autoComplete="new-password" />
        <PasswordInput id="reset-confirm" label={t('account.confirmPassword')} value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
        <SubmitButton loading={loading} icon={<KeyRound className="h-4 w-4" />}>{t('account.updatePassword')}</SubmitButton>
        {message && (
          <button type="button" className="w-full text-sm font-bold text-[#FFAB00] hover:underline" onClick={() => onNavigate('/login')}>
            {t('account.backToLogin')}
          </button>
        )}
      </form>
    </AuthShell>
  );
}

function AccountLayout({ title, children, onBack }: { title: string; children: React.ReactNode; onBack: () => void }) {
  const { isLight } = useTheme();
  return (
    <main className={`min-h-screen px-4 py-6 ${isLight ? 'bg-[#F4F6F9] text-zinc-950' : 'bg-[#090909] text-zinc-100'}`}>
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-100 hover:text-[#FFAB00] dark:hover:bg-[#111111]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <section className={`rounded-2xl border p-5 shadow-xl ${isLight ? 'border-zinc-200 bg-white' : 'border-[#2A2A2A] bg-[#111111]'}`}>
          <h1 className="mb-5 text-2xl font-black">{title}</h1>
          {children}
        </section>
      </div>
    </main>
  );
}

export function ProfilePage({ onNavigate }: { onNavigate: NavigateFn }) {
  const { user, setUser } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState(user?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setName(user?.full_name || ''), [user]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await api.updateProfile({ full_name: name });
      setUser(response.user);
      setMessage(t('account.profileSaved'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.genericError'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AccountLayout title={t('account.myProfile')} onBack={() => onNavigate('/app')}>
      <form className="grid gap-5 md:grid-cols-[12rem_1fr]" onSubmit={save}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#082B5C] text-3xl font-black text-white">
            {user.full_name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
          </div>
          <p className="text-center text-sm text-zinc-500">{t('account.defaultAvatar')}</p>
        </div>
        <div className="space-y-4">
          {message && <Alert type="success">{message}</Alert>}
          {error && <Alert type="error">{error}</Alert>}
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">{t('account.fullName')}</span>
            <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <div>
            <span className="mb-1.5 block text-sm font-bold">{t('account.email')}</span>
            <div className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-3 text-sm text-zinc-600 dark:border-[#2A2A2A] dark:bg-[#090909] dark:text-zinc-300">{user.email}</div>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-bold">{t('account.createdAt')}</span>
            <div className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-3 text-sm text-zinc-600 dark:border-[#2A2A2A] dark:bg-[#090909] dark:text-zinc-300">
              {new Date(user.created_at).toLocaleString()}
            </div>
          </div>
          <SubmitButton loading={loading} icon={<Save className="h-4 w-4" />}>{t('account.saveProfile')}</SubmitButton>
        </div>
      </form>
    </AccountLayout>
  );
}

export function ChangePasswordPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const { setUser } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_new_password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await api.changePassword(form);
      setUser(null);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('account.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountLayout title={t('account.changePassword')} onBack={() => onNavigate('/app')}>
      <form className="mx-auto max-w-md space-y-4" onSubmit={submit}>
        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}
        <PasswordInput id="current-password" label={t('account.currentPassword')} value={form.current_password} onChange={(current_password) => setForm({ ...form, current_password })} autoComplete="current-password" />
        <PasswordInput id="new-password" label={t('account.newPassword')} value={form.new_password} onChange={(new_password) => setForm({ ...form, new_password })} autoComplete="new-password" />
        <PasswordInput id="confirm-new-password" label={t('account.confirmNewPassword')} value={form.confirm_new_password} onChange={(confirm_new_password) => setForm({ ...form, confirm_new_password })} autoComplete="new-password" />
        <SubmitButton loading={loading} icon={<KeyRound className="h-4 w-4" />}>{t('account.updatePassword')}</SubmitButton>
        {message && (
          <button type="button" className="w-full text-sm font-bold text-[#FFAB00] hover:underline" onClick={() => onNavigate('/login')}>
            {t('account.backToLogin')}
          </button>
        )}
      </form>
    </AccountLayout>
  );
}

export function HistoryPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const { t, td } = useLanguage();
  const [domain, setDomain] = useState<CrisisDomain | 'all'>('all');
  const [items, setItems] = useState<EmergencySession[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const visibleCount = items.length;

  const load = async (nextOffset = 0, append = false) => {
    setLoading(true);
    try {
      const response = await api.getHistory({ domain, limit: 10, offset: nextOffset });
      setItems((prev) => append ? [...prev, ...response.items] : response.items);
      setTotal(response.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(0, false);
  }, [domain]);

  return (
    <AccountLayout title={t('account.myHistory')} onBack={() => onNavigate('/app')}>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(['all', ...DOMAIN_ORDER] as Array<CrisisDomain | 'all'>).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDomain(option)}
              className={`rounded-xl border px-3 py-2 text-sm font-bold ${domain === option ? 'border-[#FFAB00] bg-[#FFAB00] text-[#090909]' : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-[#2A2A2A] dark:text-zinc-300 dark:hover:bg-[#090909]'}`}
            >
              {option === 'all' ? td('all') : td(option)}
            </button>
          ))}
        </div>

        {loading && visibleCount === 0 ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 p-8 text-sm text-zinc-500 dark:border-[#2A2A2A]">
            <Loader2 className="h-4 w-4 animate-spin" /> {t('account.loadingHistory')}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 p-8 text-center dark:border-[#2A2A2A]">
            <History className="mx-auto mb-2 h-8 w-8 text-zinc-500" />
            <p className="font-bold">{t('account.historyEmpty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <button
                key={item.session_token}
                type="button"
                onClick={() => onNavigate(`/history/${item.session_token}`)}
                className="w-full rounded-xl border border-zinc-200 p-4 text-left transition hover:border-[#FFAB00] hover:bg-zinc-50 dark:border-[#2A2A2A] dark:hover:bg-[#090909]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-black">{td(item.domain)}</span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600 dark:bg-[#090909] dark:text-zinc-300">{item.status || 'in_progress'}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-500">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {new Date(item.updated_at).toLocaleString()}</span>
                  <span>{item.current_severity}</span>
                  <span>{item.facts?.length || 0} {t('account.facts')}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {visibleCount < total && (
          <button type="button" disabled={loading} onClick={() => load(visibleCount, true)} className="mx-auto flex rounded-xl border border-[#FFAB00] px-4 py-2 text-sm font-black text-[#FFAB00] disabled:opacity-70">
            {loading ? t('account.loadingHistory') : t('account.loadMore')}
          </button>
        )}
      </div>
    </AccountLayout>
  );
}

export function HistoryDetailPage({ token, onNavigate }: { token: string; onNavigate: NavigateFn }) {
  const { t, td } = useLanguage();
  const [detail, setDetail] = useState<EmergencySession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistoryDetail(token).then(setDetail).finally(() => setLoading(false));
  }, [token]);

  const latestAudit = useMemo(() => detail?.audit_trail?.[0], [detail]);

  return (
    <AccountLayout title={t('account.historyDetail')} onBack={() => onNavigate('/history')}>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> {t('account.loadingHistory')}</div>
      ) : !detail ? (
        <Alert type="error">{t('account.historyNotFound')}</Alert>
      ) : (
        <div className="space-y-5">
          <Alert type="info">{t('account.pastConsultation')}</Alert>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 p-3 dark:border-[#2A2A2A]"><span className="text-xs font-bold text-zinc-500">{t('account.category')}</span><p className="font-black">{td(detail.domain)}</p></div>
            <div className="rounded-xl border border-zinc-200 p-3 dark:border-[#2A2A2A]"><span className="text-xs font-bold text-zinc-500">{t('account.status')}</span><p className="font-black">{detail.status || 'in_progress'}</p></div>
            <div className="rounded-xl border border-zinc-200 p-3 dark:border-[#2A2A2A]"><span className="text-xs font-bold text-zinc-500">{t('account.dateTime')}</span><p className="font-black">{new Date(detail.updated_at).toLocaleString()}</p></div>
          </div>
          <section>
            <h2 className="mb-2 text-lg font-black">{t('account.questionsAnswers')}</h2>
            <div className="flex flex-wrap gap-2">
              {(detail.facts || []).map((fact) => (
                <span key={`${fact.key}-${String(fact.value)}`} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-[#2A2A2A]">
                  <strong>{fact.key}</strong>: {String(fact.value)}
                </span>
              ))}
              {(!detail.facts || detail.facts.length === 0) && <p className="text-sm text-zinc-500">{t('account.noFacts')}</p>}
            </div>
          </section>
          {latestAudit && (
            <section className="space-y-3">
              <h2 className="text-lg font-black">{t('account.savedGuidance')}</h2>
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-[#2A2A2A]">
                <p className="text-sm font-bold text-zinc-500">{latestAudit.severity}</p>
                <h3 className="mt-1 text-xl font-black">{latestAudit.recommended_action.replace(/_/g, ' ')}</h3>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
                  {(latestAudit.step_by_step_instructions || []).map((step) => <li key={step}>{step}</li>)}
                </ol>
              </div>
            </section>
          )}
        </div>
      )}
    </AccountLayout>
  );
}
