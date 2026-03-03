import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { initialState } from '@focus-forge/shared';

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let gameState = await prisma.gameState.findUnique({
      where: { userId },
    });

    // Create initial game state if doesn't exist
    if (!gameState) {
      gameState = await prisma.gameState.create({
        data: {
          userId,
          character: initialState.character,
          inventory: initialState.inventory,
          hall: initialState.hall,
          sessions: initialState.sessions,
          streak: initialState.streak,
          lastSessionDate: initialState.lastSessionDate,
          totalFocusHours: initialState.totalFocusHours,
        },
      });
    }

    return NextResponse.json(gameState);
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const gameState = await prisma.gameState.upsert({
      where: { userId },
      update: {
        character: data.character,
        inventory: data.inventory,
        hall: data.hall,
        sessions: data.sessions,
        streak: data.streak,
        lastSessionDate: data.lastSessionDate,
        totalFocusHours: data.totalFocusHours,
      },
      create: {
        userId,
        character: data.character || initialState.character,
        inventory: data.inventory || initialState.inventory,
        hall: data.hall || initialState.hall,
        sessions: data.sessions || initialState.sessions,
        streak: data.streak || initialState.streak,
        lastSessionDate: data.lastSessionDate,
        totalFocusHours: data.totalFocusHours || 0,
      },
    });

    return NextResponse.json(gameState);
  } catch (error) {
    console.error('Error updating game state:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
