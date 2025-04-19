'use server'

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function handleUpgrade(planId: number) {
  const session = await auth();
  
  if (!session?.userId) {
    return { error: "Authentication required" };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stripe/create-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        planId,
        userId: session.userId
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur HTTP: ${response.status} - ${text}`);
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error("URL de redirection manquante dans la réponse");
    }

    return { url: data.url };

  } catch (error) {
    console.error("Erreur lors de la mise à niveau:", error);
    
    return { 
      error: error instanceof Error 
        ? error.message 
        : "Erreur inconnue lors du traitement du paiement"
    };
  }
}