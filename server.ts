import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { ruleEngine } from './src/server/ruleEngine';
import { db } from './src/server/database';
import { EvaluateCrisisRequest, EvaluateCrisisResponse, IncidentItem, RescueTeam } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // ==========================================
  // API ROUTES (MUST COME FIRST)
  // ==========================================

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CrisisGuard AI Engine',
      version: '3.0.0',
      reasoning_engine: 'SWI-Prolog & CLP(FD) Deterministic Symbolic Reasoner',
      timestamp: new Date().toISOString()
    });
  });

  // 1. Triage Crisis Evaluation Endpoint
  app.post('/api/v1/crisis/evaluate', (req, res) => {
    const startTime = Date.now();
    try {
      const { session_token, domain, submitted_facts } = req.body as EvaluateCrisisRequest;

      if (!session_token || !domain) {
        return res.status(400).json({ error: 'Missing required parameters: session_token and domain.' });
      }

      const facts = submitted_facts || [];

      // 1. Update session facts in DB
      const session = db.getOrCreateSession(session_token, domain);

      // 2. Accumulate facts for evaluation
      const allFactsMap = new Map<string, any>();
      for (const f of session.facts) {
        allFactsMap.set(f.key, f.value);
      }
      for (const f of facts) {
        allFactsMap.set(f.key, f.value);
      }
      const combinedFacts = Array.from(allFactsMap.entries()).map(([key, value]) => ({ key, value }));

      // 3. Execute deterministic first-order logic reasoning
      const result = ruleEngine.evaluate(domain, combinedFacts);
      const latencyMs = Date.now() - startTime;

      // 4. Update session severity & state
      db.updateSessionFacts(session_token, domain, facts, result.severity);

      // 5. Append immutable audit trail
      db.recordAudit(
        session_token,
        domain,
        result.action,
        result.severity,
        result.reasons,
        result.prohibited_actions,
        combinedFacts,
        latencyMs
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
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error: any) {
      console.error('Crisis evaluation error:', error);
      res.status(500).json({ error: 'Internal evaluation failure', details: error.message });
    }
  });

  // 2. Session Endpoints
  app.get('/api/v1/sessions/:token', (req, res) => {
    const session = db.getSession(req.params.token);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  });

  app.get('/api/v1/sessions/:token/audit', (req, res) => {
    const audits = db.getAuditHistory(req.params.token);
    res.json(audits);
  });

  app.get('/api/v1/audit/all', (req, res) => {
    const audits = db.getAuditHistory();
    res.json(audits);
  });

  // 3. Emergency Shelters Geolocation Endpoint
  app.get('/api/v1/shelters/nearby', (req, res) => {
    const lat = parseFloat(req.query.lat as string) || 37.7749;
    const lon = parseFloat(req.query.lon as string) || -122.4194;
    const radius = parseFloat(req.query.radius_km as string) || 50;
    const disasterType = req.query.disaster_type as string;

    const nearby = db.getNearbyShelters(lat, lon, radius, disasterType);
    res.json({
      query: { lat, lon, radius_km: radius, disaster_type: disasterType || 'all' },
      total_found: nearby.length,
      shelters: nearby
    });
  });

  // 4. CLP(FD) Constraint Logic Dispatch Scheduler
  app.post('/api/v1/scheduler/dispatch', (req, res) => {
    try {
      const { incidents, teams } = req.body as { incidents: IncidentItem[]; teams: RescueTeam[] };

      if (!incidents || !teams) {
        return res.status(400).json({ error: 'Missing incidents or teams list.' });
      }

      const dispatchResult = ruleEngine.solveDispatchCLPFD(incidents, teams);
      res.json(dispatchResult);
    } catch (error: any) {
      res.status(500).json({ error: 'CLP(FD) solver failure', details: error.message });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ CrisisGuard AI server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
