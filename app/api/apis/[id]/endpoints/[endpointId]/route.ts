import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ApiService } from '@/lib/services/api-service';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; endpointId: string } }
) {
  try {
    const session = await auth();
    
    if (!session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await ApiService.deleteEndpoint(params.endpointId, session.userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'endpoint:', error);
    
    if (error.message.includes('non trouvé')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 