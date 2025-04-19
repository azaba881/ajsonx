import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400
      });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occured', {
        status: 400
      });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    if (!id) {
      throw new Error('No user id in webhook data');
    }

    if (eventType === 'user.created') {
      await prisma.user.create({
        data: {
          clerkUserId: id,
          planId: 1
        }
      });

      return new Response('User created', { status: 201 });
    }

    if (eventType === 'user.deleted') {
      await prisma.user.delete({
        where: { clerkUserId: id }
      });

      return new Response('User deleted', { status: 200 });
    }

    return new Response('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error occured', { status: 400 });
  }
} 