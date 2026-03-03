# 🚂 Railway Deployment Guide

## Prerequisites

1. [Railway account](https://railway.app)
2. [Clerk account](https://clerk.com)
3. PostgreSQL database (Railway provides this)

## Step 1: Create Clerk Application

1. Go to https://dashboard.clerk.com
2. Create a new application
3. Copy the Publishable Key and Secret Key
4. Configure redirect URLs:
   - Development: `http://localhost:3000`
   - Production: `https://your-app.railway.app`

## Step 2: Deploy to Railway

### Option A: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Option B: Railway Dashboard

1. Go to https://railway.app/new
2. Select "Deploy from GitHub repo"
3. Choose `chris-melvin/focus-forge`
4. Set root directory to `apps/web`
5. Add PostgreSQL database (New > Database > Add PostgreSQL)

## Step 3: Configure Environment Variables

In Railway Dashboard > Variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Step 4: Database Migration

```bash
# Connect to Railway project
railway connect

# Run migration
railway run npx prisma migrate deploy
```

Or via Railway Dashboard:
1. Go to your service
2. Click "Deploy" tab
3. Add deploy command: `npx prisma migrate deploy && npm start`

## Step 5: Verify Deployment

1. Open your Railway app URL
2. Sign up / Sign in
3. Start a focus session
4. Check that data persists after refresh

## 📱 Mobile Sync Setup

For mobile apps to sync with Railway backend:

1. Update mobile app API base URL:
   ```typescript
   // apps/mobile/src/api/config.ts
   export const API_BASE_URL = 'https://your-app.railway.app';
   ```

2. Mobile uses the `/api/sync` endpoint with Clerk JWT tokens

3. Configure Clerk JWT template for mobile (optional but recommended)

## 🔧 Troubleshooting

### Build fails
- Check that `DATABASE_URL` is set
- Verify `prisma generate` runs during build

### Auth not working
- Verify Clerk keys are correct
- Check redirect URLs in Clerk dashboard

### Database connection error
- Ensure PostgreSQL is provisioned
- Check `DATABASE_URL` format: `postgresql://user:pass@host:port/db`

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Railway                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐         ┌─────────────────────────────┐  │
│  │  Next.js App │◄───────►│  Clerk Authentication       │  │
│  │  (Web + API) │         │  - Sign in/up               │  │
│  └──────────────┘         │  - JWT tokens               │  │
│         │                 └─────────────────────────────┘  │
│         │                                                    │
│         ▼                 ┌─────────────────────────────┐  │
│  ┌──────────────┐         │  PostgreSQL Database        │  │
│  │  Prisma ORM  │◄───────►│  - Users                    │  │
│  │  - GameState │         │  - GameState                │  │
│  └──────────────┘         └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Mobile Apps     │
                    │  - iOS/Android   │
                    │  - Sync via API  │
                    └──────────────────┘
```

## 🚀 Production Checklist

- [ ] Clerk app in Production mode
- [ ] Railway project connected to GitHub
- [ ] PostgreSQL database provisioned
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Health check endpoint responding
- [ ] Auth working (sign up/in)
- [ ] Game state persisting
- [ ] Custom domain (optional)

---

**Ready to deploy!** 🎮⚔️
