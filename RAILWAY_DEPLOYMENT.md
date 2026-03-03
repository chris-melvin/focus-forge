# 🚂 Railway Deployment Guide

## Overview

This guide will help you deploy Focus Forge to Railway with:
- PostgreSQL database
- Clerk authentication
- Automatic deployments
- Custom domain (optional)

## Prerequisites

1. [Railway account](https://railway.app)
2. [Clerk account](https://clerk.com)
3. GitHub repository connected to Railway

## Step 1: Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy the **Publishable Key** and **Secret Key**
4. Enable OAuth providers (Google, GitHub, etc.) if desired

## Step 2: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `focus-forge` repository

## Step 3: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create the database

## Step 4: Configure Environment Variables

In your Railway project settings, add these environment variables:

```env
# Database (Railway provides this automatically)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Clerk Authentication (from Step 1)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Step 5: Deploy

1. Railway will automatically detect the `railway.json` configuration
2. The build process will:
   - Install dependencies
   - Build the shared package
   - Generate Prisma client
   - Build Next.js app
   - Run database migrations
3. Once deployed, your app will be available at the Railway URL

## Step 6: Database Migrations

For the first deployment, you need to run migrations:

```bash
# Using Railway CLI
railway run npx prisma migrate dev --name init
```

Or manually via Railway Dashboard:
1. Go to your service
2. Click "Deploy" tab
3. Run the migration command in the console

## Step 7: Custom Domain (Optional)

1. In Railway dashboard, go to your service
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update Clerk allowed origins to include your domain

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Railway                             │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐         ┌──────────────────────────┐  │
│  │   Next.js    │◄───────►│      PostgreSQL          │  │
│  │   (Web App)  │         │  - GameState table       │  │
│  └──────┬───────┘         │  - User table            │  │
│         │                 └──────────────────────────┘  │
│         │                                               │
│         │                 ┌──────────────────────────┐  │
│         └────────────────►│      Clerk Auth          │  │
│                           │  - User authentication   │  │
│                           └──────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Environment Variables Reference

| Variable | Description | Source |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | Railway Postgres |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Clerk Dashboard |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign in page path | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign up page path | `/sign-up` |

## Troubleshooting

### Build fails
- Check that `packages/shared` builds successfully
- Ensure Prisma schema is valid
- Verify all environment variables are set

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check that PostgreSQL service is running
- Ensure migrations have been applied

### Auth not working
- Verify Clerk keys are correct
- Check allowed origins in Clerk dashboard
- Ensure middleware is configured correctly

## Local Development with Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run locally with Railway environment
railway run npm run dev
```

## Switching Back to Static Export

If you want to deploy to GitHub Pages instead:

```bash
# Set environment variable
STATIC_EXPORT=true npm run build
```

Or modify `next.config.ts` to always use `output: 'export'`.

## Cost

Railway free tier includes:
- $5/month credit
- 512 MB RAM
- 1 GB disk
- 100 GB egress

This is sufficient for a small Focus Forge instance. Upgrade as needed.

## Support

- Railway Docs: https://docs.railway.app
- Clerk Docs: https://clerk.com/docs
- Prisma Docs: https://www.prisma.io/docs
