import { prisma } from '@/lib/prisma';
import { syncClerkUser } from '@/lib/clerk-sync';

export default async function TestPage() {
  const user = await syncClerkUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Synchronisation</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">État de la synchronisation</h2>
        
        {user ? (
          <div className="space-y-4">
            <p><strong>ID Clerk:</strong> {user.clerkUserId}</p>
            {user.plan ? (
              <>
                <p><strong>Plan:</strong> {user.plan.name}</p>
                <p><strong>Limite d'API:</strong> {user.plan.apiLimit}</p>
              </>
            ) : (
              <p className="text-yellow-500">Aucun plan associé</p>
            )}
            <p><strong>Date de création:</strong> {user.createdAt.toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-red-500">Utilisateur non synchronisé</p>
        )}
      </div>
    </div>
  );
} 