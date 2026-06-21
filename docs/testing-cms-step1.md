# Testing the CMS — STEP 1 (Authentication)

A step-by-step guide to verify the hidden `/login` and its Express auth backend.
STEP 1 is **authentication only** — there is no dashboard or content editing yet, so a
successful login simply returns you to the public site (`/`).

## 0. Prerequisites

- Node 20.6+ (the server uses the built-in `node --env-file`; this repo is on v26).
- `openssl` on your PATH (used by the credential generator).
- Dependencies installed:
  ```bash
  npm install
  ```

## 1. Generate the admin credentials (one time)

```bash
npm run setup-admin
```

Expected:
- Prints `Username: admin` and a `Password: <random>` line **once**.
- Writes `.env` with `ADMIN_USER`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`.

**Save the printed password** — it is shown only once (only the bcrypt *hash* is stored).

Verify the file was written with the three keys (the password hash, not plaintext):
```bash
grep -cE '^(ADMIN_USER|ADMIN_PASSWORD_HASH|SESSION_SECRET)=' .env   # -> 3
git check-ignore .env                                              # -> .env (it is gitignored)
```

Re-running `npm run setup-admin` prompts before overwriting and rotates both the password
and the session secret (invalidating any existing login).

## 2. Run the automated checks

```bash
# Unit tests (pure auth logic + the env-file builder)
node --test scripts/setup-admin.test.mjs server/auth.test.js   # -> pass 7, fail 0

# Type check (frontend)
npm run typecheck                                              # -> no errors
```

## 3. Start the app (dev)

```bash
npm run dev
```

This runs **two** processes via `concurrently`:
- Vite dev server: http://localhost:5173 (the site + `/login`)
- API server: http://localhost:3001 (proxied as `/api/*` from :5173)

Leave this running for the steps below. Always use the **5173** origin in the browser —
Vite proxies `/api` to the server for you.

## 4. Test the login flow in the browser

1. Open http://localhost:5173/login
   - **Expect:** a centered "Sign in" form with Username and Password fields.
2. Enter `admin` + a **wrong** password, submit.
   - **Expect:** you stay on `/login` and see an inline error **"Invalid credentials"**.
3. Enter `admin` + the **correct** password (from step 1), submit.
   - **Expect:** you are redirected to `/` (the portfolio home).
4. Confirm the session is real and secure. Open DevTools → Console and run:
   ```js
   document.cookie                       // -> "" (cookie is httpOnly, invisible to JS)
   await (await fetch('/api/me')).json() // -> { authenticated: true }
   ```
   In DevTools → Application → Cookies you should see a `cms_session` cookie flagged
   **HttpOnly** and **SameSite=Strict**.
5. Revisit http://localhost:5173/login while logged in.
   - **Expect:** the form does **not** show; you are redirected straight to `/`
     (the page checks `/api/me` on mount).

## 5. Test the API directly (optional, with curl)

Replace `THE_PASSWORD` with the password from step 1. These hit the API on :3001.

```bash
# Not logged in yet
curl -s -o /dev/null -w "me:%{http_code}\n" http://localhost:3001/api/me            # me:401

# Wrong password
curl -s -o /dev/null -w "wrong:%{http_code}\n" -X POST http://localhost:3001/api/login \
  -H 'Content-Type: application/json' -d '{"username":"admin","password":"nope"}'    # wrong:401

# Correct password — store the cookie, then reuse it
curl -s -c /tmp/cms.cookies -o /dev/null -w "login:%{http_code}\n" -X POST http://localhost:3001/api/login \
  -H 'Content-Type: application/json' -d '{"username":"admin","password":"THE_PASSWORD"}'  # login:200
curl -s -b /tmp/cms.cookies -o /dev/null -w "me:%{http_code}\n" http://localhost:3001/api/me            # me:200

# Log out, then confirm the session is gone (send AND re-store the cookie jar)
curl -s -b /tmp/cms.cookies -c /tmp/cms.cookies -o /dev/null -w "logout:%{http_code}\n" \
  -X POST http://localhost:3001/api/logout                                            # logout:200
curl -s -b /tmp/cms.cookies -o /dev/null -w "after:%{http_code}\n" http://localhost:3001/api/me         # after:401

rm -f /tmp/cms.cookies
```

> Note: there is no logout button in the UI yet (no dashboard in STEP 1). Logout is
> currently API-only, as shown above.

## 6. Verify no secret leaks into the client bundle

```bash
npm run build
! grep -rIlF -- "$(grep ADMIN_PASSWORD_HASH .env | cut -d= -f2-)" dist && echo "no hash in bundle"
```
Expected: prints `no hash in bundle` — the password hash never reaches the browser.

## 7. (Optional) Test the production server

The dev proxy is not used in production; one Express process serves both the built site
and the API.

```bash
npm run build      # produces dist/
npm start          # NODE_ENV=production, serves dist/ + /api on :3001
```
Open http://localhost:3001/ (site) and http://localhost:3001/login (form). The login flow
is the same as step 4. Note: in production the session cookie is `Secure`, so it only
persists over HTTPS — over plain http://localhost the cookie may not stick. For a real
deployment behind a TLS-terminating proxy you'll also need `app.set('trust proxy', 1)`
(flagged as a deploy TODO in `server/index.js`).

## Quick checklist

- [ ] `npm run setup-admin` prints the password once and writes `.env`
- [ ] `node --test ...` → 7 passing
- [ ] `npm run typecheck` → clean
- [ ] `/login` shows the form; wrong password → inline "Invalid credentials"
- [ ] correct password → redirect to `/`, `/api/me` → authenticated
- [ ] `cms_session` cookie is HttpOnly + SameSite=Strict (not in `document.cookie`)
- [ ] logged-in revisit to `/login` → redirects to `/`
- [ ] logout (curl) → `/api/me` returns 401
- [ ] password hash absent from `dist/`
