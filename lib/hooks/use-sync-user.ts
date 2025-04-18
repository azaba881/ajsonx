import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { syncClerkUser } from '../clerk-sync';

export function useSyncUser() {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      syncClerkUser().catch(error => {
        console.error("Erreur lors de la synchronisation de l'utilisateur:", error);
      });
    }
  }, [isLoaded, userId]);
} 