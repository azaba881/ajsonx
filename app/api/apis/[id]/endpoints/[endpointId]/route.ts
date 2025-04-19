import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ApiService } from '@/lib/services/api-service';

export async function DELETE(
  request: NextRequest,
) {
  try {
    const session = await auth();
    
    if (!session.userId) {
      return Response.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Get params from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const endpointId = pathParts[pathParts.length - 1];

    await ApiService.deleteEndpoint(endpointId, session.userId);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'endpoint:', error);
    
    if (error.message.includes('non trouvé')) {
      return Response.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return Response.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
