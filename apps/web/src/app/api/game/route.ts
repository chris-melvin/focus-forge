import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// GET /api/game - Get user's game state
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const gameState = await prisma.gameState.findUnique({
      where: { userId },
    });

    if (!gameState) {
      // Return default state if none exists
      return NextResponse.json({
        character: {
          level: 1,
          xp: 0,
          maxXp: 100,
          hp: 100,
          maxHp: 100,
          gold: 50,
          equipment: {},
        },
        inventory: [],
        hall: [],
        sessions: [],
        streak: 0,
        lastSessionDate: null,
        totalFocusHours: 0,
      });
    }

    return NextResponse.json({
      character: gameState.character,
      inventory: gameState.inventory,
      hall: gameState.hall,
      sessions: gameState.sessions,
      streak: gameState.streak,
      lastSessionDate: gameState.lastSessionDate,
      totalFocusHours: gameState.totalFocusHours,
      lastSyncedAt: gameState.lastSyncedAt,
    });
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game state' },
      { status: 500 }
    );
  }
}

// POST /api/game - Save game state
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { character, inventory, hall, sessions, streak, lastSessionDate, totalFocusHours } = body;

    // Upsert game state
    const gameState = await prisma.gameState.upsert({
      where: { userId },
      update: {
        character,
        inventory,
        hall,
        sessions,
        streak,
        lastSessionDate,
        totalFocusHours,
      },
      create: {
        userId,
        character,
        inventory,
        hall,
        sessions,
        streak,
        lastSessionDate,
        totalFocusHours,
      },
    });

    return NextResponse.json({
      success: true,
      lastSyncedAt: gameState.lastSyncedAt,
    });
  } catch (error) {
    console.error('Error saving game state:', error);
    return NextResponse.json(
      { error: 'Failed to save game state' },
      { status: 500 }
    );
  }
}
