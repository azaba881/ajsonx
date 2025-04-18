import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { syncClerkUser } from '@/lib/clerk-sync';

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const user = await syncClerkUser();
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Erreur lors de la synchronisation de l'utilisateur:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la synchronisation" },
      { status: 500 }
    );
  }
} 