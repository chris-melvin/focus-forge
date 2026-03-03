# Railway Deployment Plan

## Current State
- ✅ Frontend: Next.js with localStorage (single user, offline)
- ❌ No backend API
- ❌ No database
- ❌ No authentication

## Target State for Railway
- ✅ Frontend: Next.js (same)
- ✅ Backend: Next.js API routes + Prisma
- ✅ Database: PostgreSQL (Railway)
- ✅ Auth: Clerk (easy integration)
- ✅ Real-time sync via WebSocket (optional)

## Architecture

```
┌─────────────────────────────────────────────┐
│            Railway Deployment               │
├─────────────────────────────────────────────┤
│  ┌──────────────┐      ┌─────────────────┐ │
│  │  Next.js     │◄────►│  Clerk Auth     │ │
│  │  (Frontend)  │      │                 │ │
│  └──────────────┘      └─────────────────┘ │
│         │                                   │
│         ▼                                   │
│  ┌──────────────┐      ┌─────────────────┐ │
│  │  API Routes  │◄────►│  PostgreSQL     │ │
│  │  (/api/*)    │      │  (Prisma)       │ │
│  └──────────────┘      └─────────────────┘ │
└─────────────────────────────────────────────┘
```

## Database Schema

### User
- id (Clerk user ID)
- email
- createdAt
- updatedAt

### GameState
- id
- userId
- character (JSON)
- inventory (JSON)
- hall (JSON)
- sessions (JSON)
- streak
- lastSessionDate
- totalFocusHours
- createdAt
- updatedAt

## Implementation Steps

1. Add Prisma + PostgreSQL
2. Add Clerk authentication
3. Create API routes for game state
4. Migrate from localStorage to API
5. Create railway.json config
6. Deploy

Ready to implement? 🚂
