import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ApiService } from '@/lib/services/api-service';
import type { CreateEndpointInput } from '@/lib/types/api';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json() as CreateEndpointInput;
    
    // Validation basique
    if (!body.path || !body.method || !body.response) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Validation du chemin
    if (!body.path.startsWith('/')) {
      return NextResponse.json(
        { error: 'Le chemin doit commencer par /' },
        { status: 400 }
      );
    }

    // Validation de la méthode
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!validMethods.includes(body.method)) {
      return NextResponse.json(
        { error: 'Méthode HTTP invalide' },
        { status: 400 }
      );
    }

    const params = await context.params;
    console.log('Creating endpoint for API:', params.id, 'with path:', body.path);
    
    const endpoint = await ApiService.addEndpoint(params.id, session.userId, body);
    console.log('Endpoint created:', endpoint);
    
    return NextResponse.json(endpoint, { status: 201 });
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'endpoint:', error);
    
    if (error.message.includes('non trouvée')) {
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