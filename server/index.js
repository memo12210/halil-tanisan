import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import {
  verifyCredentials,
  isAuthenticated,
  setSessionCookie,
  clearSessionCookie,
} from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';
const LOGIN_DELAY_MS = 500; // fixed delay blunts brute-force / timing probing

const REQUIRED_ENV = ['ADMIN_USER', 'ADMIN_PASSWORD_HASH', 'SESSION_SECRET'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing required env var(s): ${missingEnv.join(', ')}. Run \`npm run setup-admin\` first.`);
  process.exit(1);
}

const config = {
  adminUser: process.env.ADMIN_USER,
  passwordHash: process.env.ADMIN_PASSWORD_HASH,
};

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));

app.post('/api/login', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, LOGIN_DELAY_MS));
  const { username, password } = req.body ?? {};
  try {
    const ok = await verifyCredentials(username, password, config);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    setSessionCookie(res, { secure: isProd });
    return res.status(200).json({ authenticated: true });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  clearSessionCookie(res);
  return res.status(200).json({ authenticated: false });
});

app.get('/api/me', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ authenticated: false });
  }
  return res.status(200).json({ authenticated: true });
});

if (isProd) {
  const distDir = path.resolve(__dirname, '..', 'dist');
  if (existsSync(distDir)) {
    app.use(express.static(distDir));
    // SPA fallback: any non-API, non-asset path returns index.html (so /login resolves).
    // Express 5 (path-to-regexp v8) rejects bare '*' — use a regex catch-all instead.
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }
}

// TODO(deploy): behind a TLS-terminating proxy (nginx/Cloudflare), the prod
// `Secure` cookie requires `app.set('trust proxy', 1)` or login will silently
// fail to persist. Add when STEP 1 is actually deployed.
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
