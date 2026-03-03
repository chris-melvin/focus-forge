# 🚂 Railway Deployment - Step by Step

## Prerequisites
- Railway account: https://railway.app
- GitHub repo connected to Railway
- Your code pushed to GitHub

---

## Step 1: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `chris-melvin/focus-forge`
5. Click **"Add Variables"** (we'll set these in Step 3)

---

## Step 2: Add PostgreSQL Database

1. In your Railway project, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Wait for it to provision (takes ~30 seconds)
4. Railway automatically adds `DATABASE_URL` to your environment variables

---

## Step 3: Configure Environment Variables

Go to your service → **Variables** tab, add these:

```
# Database (already added by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Better Auth (generate a random secret)
BETTER_AUTH_SECRET=your-random-secret-key-min-32-chars
BETTER_AUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Optional: Google OAuth (for social login)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**To generate BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Step 4: Configure Build Settings

1. Go to your service → **Settings** tab
2. **Root Directory**: `apps/web`
3. **Build Command**: 
   ```
   npm install && npx prisma generate && npm run build
   ```
4. **Start Command**:
   ```
   npx prisma migrate deploy && npm start
   ```

---

## Step 5: Deploy

1. Click **"Deploy"** button (or push to GitHub)
2. Watch the build logs
3. Wait for "Build successful" message

---

## Step 6: Run Database Migration

After first deploy, run migration:

**Option A: Railway CLI**
```bash
npm install -g @railway/cli
railway login
railway link
railway run npx prisma migrate deploy
```

**Option B: Railway Dashboard**
1. Go to your service
2. Click "Deploy" tab
3. Open "Shell" (top right)
4. Run: `npx prisma migrate deploy`

---

## Step 7: Verify Deployment

1. Open your Railway URL (e.g., `https://focus-forge.up.railway.app`)
2. Click "Sign Up" and create an account
3. Sign in
4. Start a focus session
5. Refresh page - data should persist

---

## Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is set
- Verify PostgreSQL is provisioned

### "Build failed"
- Check build logs for errors
- Ensure `npx prisma generate` runs before build

### "Auth not working"
- Verify `BETTER_AUTH_SECRET` is set
- Check `BETTER_AUTH_URL` matches your domain

### "Migration failed"
- Run manually: `railway run npx prisma migrate deploy`
- Check database is accessible

---

## 🎉 Done!

Your app should now be live at your Railway URL!

**Next:** Set up custom domain (optional) in Railway Settings → Domains
