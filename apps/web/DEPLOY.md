# 🚂 Railway Deployment Guide (Better Auth)

## Prerequisites

1. [Railway account](https://railway.app)
2. GitHub repo: `chris-melvin/focus-forge`
3. PostgreSQL database (Railway provides this)

---

## Step 1: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `chris-melvin/focus-forge`
5. Click **"Add Variables"**

---

## Step 2: Add PostgreSQL Database

1. In your project, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Wait for provisioning (~30 seconds)
4. Railway auto-adds `DATABASE_URL`

---

## Step 3: Configure Environment Variables

Go to your service → **Variables** tab:

```
# Database (auto-added by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Better Auth - Generate secret:
# Run: openssl rand -base64 32
BETTER_AUTH_SECRET=your-random-secret-here
BETTER_AUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Optional: OAuth providers
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GITHUB_CLIENT_ID=...
# GITHUB_CLIENT_SECRET=...
```

---

## Step 4: Configure Build Settings

Go to **Settings** tab:

| Setting | Value |
|---------|-------|
| Root Directory | `apps/web` |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npx prisma migrate deploy && npm start` |

---

## Step 5: Deploy

1. Click **"Deploy"** or push to GitHub
2. Wait for build to complete

---

## Step 6: Run Database Migration

**Via Railway Dashboard:**
1. Go to your service
2. Click **"Shell"** (top right)
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

**Or via CLI:**
```bash
npm install -g @railway/cli
railway login
railway link
railway run npx prisma migrate deploy
```

---

## Step 7: Verify Deployment

1. Open your Railway URL
2. Click **"Sign Up"**
3. Create account with email/password
4. Sign in
5. Start a focus session
6. Refresh - data should persist!

---

## 📱 Mobile Sync Setup

Update mobile API URL:

```typescript
// apps/mobile/src/api/client.ts
const API_BASE_URL = 'https://your-app.up.railway.app';
```

Mobile uses session cookies for auth (handled automatically by Better Auth).

---

## 🔧 Troubleshooting

### Build fails
```
Error: Cannot find module '@prisma/client'
```
**Fix:** Ensure `npx prisma generate` runs before build

### Database error
```
Error: P1001: Can't reach database
```
**Fix:** Check `DATABASE_URL` is set correctly

### Auth not working
- Verify `BETTER_AUTH_SECRET` is set (min 32 chars)
- Check `BETTER_AUTH_URL` matches your domain
- Ensure cookies are enabled

### Migration fails
```
Error: P3005: Database error
```
**Fix:** Run `npx prisma migrate reset` (⚠️ deletes data)

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Railway                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐         ┌─────────────────────────────┐  │
│  │  Next.js App │◄───────►│  Better Auth                │  │
│  │  (Web + API) │         │  - Email/password           │  │
│  └──────────────┘         │  - Sessions (cookies)       │  │
│         │                 └─────────────────────────────┘  │
│         │                                                    │
│         ▼                 ┌─────────────────────────────┐  │
│  ┌──────────────┐         │  PostgreSQL Database        │  │
│  │  Prisma ORM  │◄───────►│  - Users (Better Auth)      │  │
│  │  - GameState │         │  - Sessions                 │  │
│  └──────────────┘         │  - GameState                │  │
│                           └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP + Cookies
                    ┌──────────────────┐
                    │  Mobile Apps     │
                    │  - iOS/Android   │
                    │  - Sync via API  │
                    └──────────────────┘
```

---

## 🚀 Production Checklist

- [x] Railway project created
- [x] PostgreSQL database added
- [x] Environment variables set
- [x] Build settings configured
- [x] Database migrations run
- [x] App deployed successfully
- [x] Auth working (sign up/in)
- [x] Game state persisting
- [ ] Custom domain (optional)

---

**Deploy URL:** `https://your-project.up.railway.app`

**Ready to forge!** ⚔️🎮
