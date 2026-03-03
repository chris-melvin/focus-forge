import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// POST /api/sync - Sync game state (for mobile apps)
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      character, 
      inventory, 
      hall, 
      sessions, 
      streak, 
      lastSessionDate, 
      totalFocusHours,
      lastSyncedAt 
    } = body;

    // Get server state
    const serverState = await prisma.gameState.findUnique({
      where: { userId },
    });

    // If no server state, create it
    if (!serverState) {
      const newState = await prisma.gameState.create({
        data: {
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
        serverState: {
          character: newState.character,
          inventory: newState.inventory,
          hall: newState.hall,
          sessions: newState.sessions,
          streak: newState.streak,
          lastSessionDate: newState.lastSessionDate,
          totalFocusHours: newState.totalFocusHours,
        },
        lastSyncedAt: newState.lastSyncedAt,
        conflict: false,
      });
    }

    // Simple conflict resolution: server wins if newer
    // TODO: Implement proper merge strategy
    const serverTime = new Date(serverState.lastSyncedAt).getTime();
    const clientTime = lastSyncedAt ? new Date(lastSyncedAt).getTime() : 0;

    if (clientTime > serverTime) {
      // Client has newer data, update server
      const updated = await prisma.gameState.update({
        where: { userId },
        data: {
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
        serverState: {
          character: updated.character,
          inventory: updated.inventory,
          hall: updated.hall,
          sessions: updated.sessions,
          streak: updated.streak,
          lastSessionDate: updated.lastSessionDate,
          totalFocusHours: updated.totalFocusHours,
        },
        lastSyncedAt: updated.lastSyncedAt,
        conflict: false,
      });
    } else {
      // Server has newer data, return it
      return NextResponse.json({
        success: true,
        serverState: {
          character: serverState.character,
          inventory: serverState.inventory,
          hall: serverState.hall,
          sessions: serverState.sessions,
          streak: serverState.streak,
          lastSessionDate: serverState.lastSessionDate,
          totalFocusHours: serverState.totalFocusHours,
        },
        lastSyncedAt: serverState.lastSyncedAt,
        conflict: true,
        message: 'Server has newer data',
      });
    }
  } catch (error) {
    console.error('Error syncing game state:', error);
    return NextResponse.json(
      { error: 'Failed to sync game state' },
      { status: 500 }
    );
  }
}
