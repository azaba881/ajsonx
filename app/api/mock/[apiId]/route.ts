import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { apiId: string } }
) {
  try {
    const url = new URL(request.url);
    const rawPath = url.pathname.replace(`/api/mock/${params.apiId}`, '');
    const path = rawPath || '/';
    
    console.log('Mock API Debug:', {
      apiId: params.apiId,
      rawPath,
      normalizedPath: path,
      fullUrl: url.toString(),
      fullPath: url.pathname
    });

    // Récupérer l'API et ses endpoints
    const api = await prisma.api.findUnique({
      where: { id: params.apiId },
      include: {
        endpoints: true,
        mockData: true
      }
    });

    if (!api) {
      console.log('API non trouvée:', {
        requestedId: params.apiId,
      });
      return NextResponse.json(
        { error: 'API not found', requestedId: params.apiId },
        { status: 404 }
      );
    }

    console.log('API trouvée:', {
      id: api.id,
      hasMockData: !!api.mockData,
      endpointsCount: api.endpoints.length,
      endpoints: api.endpoints.map(e => ({
        path: e.path,
        method: e.method,
        hasResponse: !!e.response
      }))
    });

    // Trouver l'endpoint correspondant
    const endpoint = api.endpoints.find(e => {
      const matches = e.path === path && e.method === 'GET';
      console.log('Checking endpoint:', {
        endpointPath: e.path,
        requestPath: path,
        method: e.method,
        matches
      });
      return matches;
    });

    if (!endpoint) {
      console.log('Endpoint non trouvé:', {
        requestedPath: path,
        availablePaths: api.endpoints.map(e => e.path)
      });
      return NextResponse.json(
        { 
          error: 'Endpoint not found',
          requestedPath: path,
          availableEndpoints: api.endpoints.map(e => ({
            path: e.path,
            method: e.method
          }))
        },
        { status: 404 }
      );
    }

    console.log('Endpoint trouvé:', {
      path: endpoint.path,
      method: endpoint.method,
      hasResponse: !!endpoint.response
    });

    // Retourner la réponse mockée
    return NextResponse.json(endpoint.response);
  } catch (error: any) {
    console.error('Erreur dans la route mock:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { apiId: string } }
) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(`/api/mock/${params.apiId}`, '');

    // Récupérer l'API et ses endpoints
    const api = await prisma.api.findUnique({
      where: { id: params.apiId },
      include: {
        endpoints: true
      }
    });

    if (!api) {
      return NextResponse.json(
        { error: 'API not found' },
        { status: 404 }
      );
    }

    // Trouver l'endpoint correspondant
    const endpoint = api.endpoints.find(e => e.path === path && e.method === 'POST');
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint not found' },
        { status: 404 }
      );
    }

    // Retourner la réponse mockée
    return NextResponse.json(endpoint.response);
  } catch (error: any) {
    console.error('Error in mock API route:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { apiId: string } }
) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(`/api/mock/${params.apiId}`, '');

    // Récupérer l'API et ses endpoints
    const api = await prisma.api.findUnique({
      where: { id: params.apiId },
      include: {
        endpoints: true
      }
    });

    if (!api) {
      return NextResponse.json(
        { error: 'API not found' },
        { status: 404 }
      );
    }

    // Trouver l'endpoint correspondant
    const endpoint = api.endpoints.find(e => e.path === path && e.method === 'PUT');
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint not found' },
        { status: 404 }
      );
    }

    // Retourner la réponse mockée
    return NextResponse.json(endpoint.response);
  } catch (error: any) {
    console.error('Error in mock API route:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { apiId: string } }
) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(`/api/mock/${params.apiId}`, '');

    // Récupérer l'API et ses endpoints
    const api = await prisma.api.findUnique({
      where: { id: params.apiId },
      include: {
        endpoints: true
      }
    });

    if (!api) {
      return NextResponse.json(
        { error: 'API not found' },
        { status: 404 }
      );
    }

    // Trouver l'endpoint correspondant
    const endpoint = api.endpoints.find(e => e.path === path && e.method === 'DELETE');
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint not found' },
        { status: 404 }
      );
    }

    // Retourner la réponse mockée
    return NextResponse.json(endpoint.response);
  } catch (error: any) {
    console.error('Error in mock API route:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 