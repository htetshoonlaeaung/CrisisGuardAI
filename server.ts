import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { ruleEngine } from './src/server/ruleEngine';
import { AppUser, AuthSession, GuestSession, db } from './src/server/database';
import { CrisisDomain, EvaluateCrisisRequest, EvaluateCrisisResponse, FactItem, IncidentItem, RescueTeam } from './src/types';

const SESSION_COOKIE = 'cg_session';
const GUEST_COOKIE = 'cg_guest';
const CSRF_COOKIE = 'cg_csrf';
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;
const PASSWORD_MIN_LENGTH = 8;
const IS_PROD = process.env.NODE_ENV === 'production';
const APP_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:3000';

type AuthenticatedRequest = Request & {
  authSession?: AuthSession;
  guestSession?: GuestSession;
  user?: AppUser;
};

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, cookie) => {
    const [rawKey, ...rawValue] = cookie.trim().split('=');
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rawValue.join('=') || '');
    return acc;
  }, {});
}

function setCookie(res: Response, name: string, value: string, options: { httpOnly?: boolean; maxAgeMs?: number } = {}) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'SameSite=Lax',
  ];
  if (options.httpOnly) parts.push('HttpOnly');
  if (IS_PROD) parts.push('Secure');
  if (options.maxAgeMs !== undefined) parts.push(`Max-Age=${Math.floor(options.maxAgeMs / 1000)}`);
  res.append('Set-Cookie', parts.join('; '));
}

function clearCookie(res: Response, name: string) {
  setCookie(res, name, '', { maxAgeMs: 0 });
}

function publicUser(user: AppUser) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
  };
}

function normalizeEmail(email: unknown) {
  return String(email || '').trim().toLowerCase();
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Password must include at least one letter and one number.';
  return '';
}

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function rateLimit(name: string, maxAttempts: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${name}:${req.ip}:${normalizeEmail(req.body?.email) || ''}`;
    const now = Date.now();
    const bucket = rateBuckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (bucket.count >= maxAttempts) {
      return res.status(429).json({ error: 'Too many attempts. Please wait and try again.' });
    }
    bucket.count += 1;
    return next();
  };
}

function attachAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const cookies = parseCookies(req.headers.cookie);
  const authSession = db.getAuthSession(cookies[SESSION_COOKIE]);
  const user = authSession ? db.getUser(authSession.user_id) : undefined;
  if (authSession && user) {
    req.authSession = authSession;
    req.user = user;
  }
  next();
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.authSession) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  return next();
}

function requireCsrf(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const sessionCsrf = req.authSession?.csrf_token || req.guestSession?.csrf_token;
  if (!sessionCsrf) return res.status(401).json({ error: 'Session required.' });

  const cookies = parseCookies(req.headers.cookie);
  const csrfHeader = String(req.headers['x-csrf-token'] || '');
  if (!csrfHeader || csrfHeader !== sessionCsrf || cookies[CSRF_COOKIE] !== sessionCsrf) {
    return res.status(403).json({ error: 'Security check failed. Refresh and try again.' });
  }
  return next();
}

function attachOrCreateGuest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && req.authSession) return next();
  const cookies = parseCookies(req.headers.cookie);
  let guestSession = db.getGuestSession(cookies[GUEST_COOKIE]);
  if (!guestSession) {
    guestSession = db.createGuestSession();
    setCookie(res, GUEST_COOKIE, guestSession.id, { httpOnly: true, maxAgeMs: 1000 * 60 * 60 * 6 });
  }
  req.guestSession = guestSession;
  setCookie(res, CSRF_COOKIE, guestSession.csrf_token, { maxAgeMs: 1000 * 60 * 60 * 6 });
  return next();
}

function issueSessionCookies(res: Response, authSession: AuthSession) {
  setCookie(res, SESSION_COOKIE, authSession.id, { httpOnly: true, maxAgeMs: SESSION_MAX_AGE_MS });
  setCookie(res, CSRF_COOKIE, authSession.csrf_token, { maxAgeMs: SESSION_MAX_AGE_MS });
}

function clearSessionCookies(res: Response) {
  clearCookie(res, SESSION_COOKIE);
  clearCookie(res, CSRF_COOKIE);
}

function currentOwner(req: AuthenticatedRequest) {
  return {
    userId: req.user?.id,
    guestSessionId: req.user ? undefined : req.guestSession?.id,
  };
}

async function deliverPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;

  const resetUrl = `${APP_ORIGIN.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Reset your CrisisGuard AI password',
      html: `<p>Use this secure link to reset your CrisisGuard AI password. It expires in 30 minutes and can be used once.</p><p><a href="${resetUrl}">Reset password</a></p>`,
    }),
  });
  return response.ok;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(attachAuth);

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'CrisisGuard AI Engine',
      version: '3.0.0',
      auth: 'cookie_session',
      database: 'persistent_local_app_database',
      reasoning_engine: 'SWI-Prolog & CLP(FD) Deterministic Symbolic Reasoner',
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/v1/auth/register', rateLimit('register', 5, 15 * 60 * 1000), async (req, res) => {
    const fullName = String(req.body?.full_name || '').trim();
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const confirmPassword = String(req.body?.confirm_password || '');

    if (fullName.length < 2) return res.status(400).json({ error: 'Full name is required.' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });
    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });
    if (db.findUserByEmail(email)) return res.status(409).json({ error: 'An account already exists for that email.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = db.createUser(fullName, email, passwordHash);
    if (!user) return res.status(409).json({ error: 'An account already exists for that email.' });

    const authSession = db.createAuthSession(user.id);
    issueSessionCookies(res, authSession);
    return res.status(201).json({ user: publicUser(user), csrf_token: authSession.csrf_token });
  });

  app.post('/api/v1/auth/login', rateLimit('login', 8, 15 * 60 * 1000), async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const user = db.findUserByEmail(email);
    const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!user || !passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const authSession = db.createAuthSession(user.id);
    issueSessionCookies(res, authSession);
    return res.json({ user: publicUser(user), csrf_token: authSession.csrf_token });
  });

  app.post('/api/v1/auth/logout', requireAuth, requireCsrf, (req: AuthenticatedRequest, res) => {
    db.deleteAuthSession(req.authSession?.id);
    clearSessionCookies(res);
    return res.json({ success: true });
  });

  app.get('/api/v1/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
    if (!req.user || !req.authSession) return res.status(401).json({ error: 'Authentication required.' });
    issueSessionCookies(res, req.authSession);
    return res.json({ user: publicUser(req.user), csrf_token: req.authSession.csrf_token });
  });

  app.get('/api/v1/auth/csrf', requireAuth, (req: AuthenticatedRequest, res) => {
    return res.json({ csrf_token: req.authSession?.csrf_token });
  });

  app.get('/api/v1/guest/session', attachOrCreateGuest, (req: AuthenticatedRequest, res) => {
    return res.json({
      guest: true,
      expires_at: req.guestSession?.expires_at,
      csrf_token: req.guestSession?.csrf_token,
      message: 'Guest history is temporary. Sign in to keep your consultations.',
    });
  });

  app.patch('/api/v1/profile', requireAuth, requireCsrf, (req: AuthenticatedRequest, res) => {
    const fullName = String(req.body?.full_name || '').trim();
    if (fullName.length < 2) return res.status(400).json({ error: 'Full name must be at least 2 characters.' });
    const updated = db.updateUserName(req.user!.id, fullName);
    if (!updated) return res.status(404).json({ error: 'Account not found.' });
    return res.json({ user: publicUser(updated) });
  });

  app.post('/api/v1/auth/change-password', requireAuth, requireCsrf, rateLimit('change-password', 6, 15 * 60 * 1000), async (req: AuthenticatedRequest, res) => {
    const currentPassword = String(req.body?.current_password || '');
    const newPassword = String(req.body?.new_password || '');
    const confirmPassword = String(req.body?.confirm_new_password || '');

    if (!(await bcrypt.compare(currentPassword, req.user!.password_hash))) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    if (newPassword !== confirmPassword) return res.status(400).json({ error: 'New passwords do not match.' });
    const passwordError = validatePassword(newPassword);
    if (passwordError) return res.status(400).json({ error: passwordError });

    db.updatePasswordHash(req.user!.id, await bcrypt.hash(newPassword, 12));
    clearSessionCookies(res);
    return res.json({ success: true, message: 'Password changed. Please log in again.' });
  });

  app.post('/api/v1/auth/forgot-password', rateLimit('forgot-password', 5, 15 * 60 * 1000), async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const user = db.findUserByEmail(email);
    let deliveryConfigured = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

    if (user) {
      const token = crypto.randomBytes(32).toString('base64url');
      db.createPasswordResetToken(
        user.id,
        hashResetToken(token),
        new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString()
      );
      if (deliveryConfigured) {
        try {
          deliveryConfigured = await deliverPasswordResetEmail(user.email, token);
        } catch (error) {
          console.warn('[Auth] Password reset email delivery failed:', error);
          deliveryConfigured = false;
        }
      }
    }

    return res.json({
      message: 'If an account exists for that email, password reset instructions will be sent.',
      delivery_configured: deliveryConfigured,
    });
  });

  app.post('/api/v1/auth/reset-password', rateLimit('reset-password', 8, 15 * 60 * 1000), async (req, res) => {
    const token = String(req.body?.token || '');
    const password = String(req.body?.password || '');
    const confirmPassword = String(req.body?.confirm_password || '');
    if (!token) return res.status(400).json({ error: 'Reset token is required.' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });
    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const resetToken = db.consumePasswordResetToken(hashResetToken(token));
    if (!resetToken) return res.status(400).json({ error: 'Reset link is invalid or expired.' });

    db.updatePasswordHash(resetToken.user_id, await bcrypt.hash(password, 12));
    clearSessionCookies(res);
    return res.json({ success: true, message: 'Password reset. Please log in with your new password.' });
  });

  app.post('/api/v1/crisis/evaluate', attachOrCreateGuest, requireCsrf, (req: AuthenticatedRequest, res) => {
    const startTime = Date.now();
    try {
      const { session_token, domain, submitted_facts } = req.body as EvaluateCrisisRequest;
      if (!session_token || !domain) {
        return res.status(400).json({ error: 'Missing required parameters: session_token and domain.' });
      }

      const facts = submitted_facts || [];
      const owner = currentOwner(req);
      const session = db.getOrCreateSession(session_token, domain, owner.userId, owner.guestSessionId);
      const allFactsMap = new Map<string, string | boolean | number>();
      for (const fact of session.facts) allFactsMap.set(fact.key, fact.value);
      for (const fact of facts) allFactsMap.set(fact.key, fact.value);
      const combinedFacts = Array.from(allFactsMap.entries()).map(([key, value]) => ({ key, value }));

      const result = ruleEngine.evaluate(domain, combinedFacts);
      const latencyMs = Date.now() - startTime;
      db.updateSessionFacts(session_token, domain, facts, result.severity, owner.userId, owner.guestSessionId, 'completed');
      db.recordAudit(
        session_token,
        domain,
        result.action,
        result.severity,
        result.reasons,
        result.prohibited_actions,
        combinedFacts,
        latencyMs,
        owner.userId,
        owner.guestSessionId,
        result.step_by_step_instructions
      );

      const response: EvaluateCrisisResponse = {
        session_token,
        domain,
        severity: result.severity,
        action_headline: result.action,
        step_by_step_instructions: result.step_by_step_instructions,
        reasons: result.reasons,
        prohibited_actions: result.prohibited_actions,
        proof_tree: result.proof_tree,
        evaluation_latency_ms: latencyMs,
        timestamp: new Date().toISOString(),
      };

      return res.json(response);
    } catch (error: any) {
      console.error('Crisis evaluation error:', error);
      return res.status(500).json({ error: 'Internal evaluation failure' });
    }
  });

  app.post('/api/v1/sessions/create', attachOrCreateGuest, requireCsrf, (req: AuthenticatedRequest, res) => {
    const domain = String(req.body?.domain || '') as CrisisDomain;
    if (!domain) return res.status(400).json({ error: 'Domain is required.' });
    const sessionToken = crypto.randomUUID();
    const owner = currentOwner(req);
    const session = db.getOrCreateSession(sessionToken, domain, owner.userId, owner.guestSessionId);
    return res.status(201).json(session);
  });

  app.get('/api/v1/sessions/:token', attachOrCreateGuest, (req: AuthenticatedRequest, res) => {
    const owner = currentOwner(req);
    const session = owner.userId
      ? db.getUserConsultationDetail(owner.userId, req.params.token)
      : db.getGuestConsultationDetail(owner.guestSessionId!, req.params.token);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    return res.json(session);
  });

  app.post('/api/v1/sessions/:token/facts', attachOrCreateGuest, requireCsrf, (req: AuthenticatedRequest, res) => {
    const owner = currentOwner(req);
    const session = db.getSession(req.params.token, owner.userId, owner.guestSessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    const facts = Array.isArray(req.body?.facts) ? req.body.facts : Array.isArray(req.body) ? req.body : [];
    const updated = db.updateSessionFacts(req.params.token, session.domain, facts, session.current_severity, owner.userId, owner.guestSessionId, 'in_progress');
    return res.json(updated.facts);
  });

  app.get('/api/v1/sessions/:token/audit', attachOrCreateGuest, (req: AuthenticatedRequest, res) => {
    const owner = currentOwner(req);
    if (!db.getSession(req.params.token, owner.userId, owner.guestSessionId)) return res.status(404).json({ error: 'Session not found.' });
    return res.json(db.getAuditHistory(req.params.token, owner.userId, owner.guestSessionId));
  });

  app.get('/api/v1/history', requireAuth, (req: AuthenticatedRequest, res) => {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit || '20'), 10), 1), 50);
    const offset = Math.max(parseInt(String(req.query.offset || '0'), 10), 0);
    const domain = req.query.domain ? String(req.query.domain) : undefined;
    return res.json(db.getUserConsultations(req.user!.id, domain, limit, offset));
  });

  app.get('/api/v1/history/:token', requireAuth, (req: AuthenticatedRequest, res) => {
    const detail = db.getUserConsultationDetail(req.user!.id, req.params.token);
    if (!detail) return res.status(404).json({ error: 'Consultation not found.' });
    return res.json(detail);
  });

  app.get('/api/v1/audit/all', requireAuth, (req: AuthenticatedRequest, res) => {
    return res.json(db.getAuditHistory(undefined, req.user!.id));
  });

  app.get('/api/v1/shelters/nearby', (req, res) => {
    const lat = parseFloat(req.query.lat as string) || 37.7749;
    const lon = parseFloat((req.query.lon || req.query.lng) as string) || -122.4194;
    const radius = parseFloat(req.query.radius_km as string) || 50;
    const disasterType = req.query.disaster_type as string;

    const nearby = db.getNearbyShelters(lat, lon, radius, disasterType);
    res.json({
      query: { lat, lon, radius_km: radius, disaster_type: disasterType || 'all' },
      total_found: nearby.length,
      total: nearby.length,
      shelters: nearby,
    });
  });

  app.post('/api/v1/scheduler/dispatch', attachOrCreateGuest, requireCsrf, (req, res) => {
    try {
      const { incidents, teams } = req.body as { incidents: IncidentItem[]; teams: RescueTeam[] };
      if (!incidents || !teams) return res.status(400).json({ error: 'Missing incidents or teams list.' });
      return res.json(ruleEngine.solveDispatchCLPFD(incidents, teams));
    } catch (error: any) {
      return res.status(500).json({ error: 'CLP(FD) solver failure' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }

      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        if (vite.ssrFixStacktrace) vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n  CrisisGuard AI Fullstack Server is active');
    console.log(`  Local:  http://localhost:${PORT}`);
    console.log(`  Health: http://localhost:${PORT}/api/health\n`);
  });
}

startServer();
