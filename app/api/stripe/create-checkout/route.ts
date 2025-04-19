import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil" as const,
});

export async function POST(request: Request) {
  try {
    const { planId, userId } = await request.json();

    if (!planId || !userId) {
      return new Response('Paramètres manquants', { status: 400 });
    }

    // Récupérer le plan depuis la base de données
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return new Response('Plan invalide', { status: 400 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return new Response('Utilisateur non trouvé', { status: 404 });
    }

    // Créer ou récupérer le client Stripe
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          userId: user.id.toString(),
          clerkUserId: userId
        }
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: customer.id
        }
      });
    }

    // Vérifier que le plan a un prix Stripe configuré
    if (!plan.stripePriceId) {
      return new Response('Plan non configuré pour Stripe', { status: 400 });
    }

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: plan.stripePriceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id.toString(),
        planId: plan.id.toString()
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err);
    return new Response('Erreur serveur', { status: 500 });
  }
}