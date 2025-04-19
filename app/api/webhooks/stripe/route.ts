import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil" as const,
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("Signature manquante", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Erreur webhook:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscriptionData = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId || !session?.metadata?.planId) {
      return new NextResponse("Métadonnées manquantes", { status: 400 });
    }

    // Trouver l'utilisateur par son clerkUserId
    const user = await prisma.user.findUnique({
      where: { clerkUserId: session.metadata.userId }
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        planId: parseInt(session.metadata.planId),
        stripeCustomerId: session.customer as string,
        subscriptionStatus: "active",
        currentPeriodEnd: new Date((subscriptionData as any).current_period_end * 1000),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscriptionData = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Trouver l'utilisateur par son stripeCustomerId
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: session.customer as string }
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        subscriptionStatus: "active",
        currentPeriodEnd: new Date((subscriptionData as any).current_period_end * 1000),
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    // Trouver l'utilisateur par son stripeCustomerId
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer as string }
    });

    if (!user) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 });
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        planId: 1, // Retour au plan gratuit
        subscriptionStatus: "canceled",
        currentPeriodEnd: null,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
} 