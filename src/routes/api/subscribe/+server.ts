import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// POST subscribe
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existing) {
      return json({ message: 'Already subscribed' }, { status: 200 });
    }

    await prisma.subscriber.create({
      data: { email }
    });

    return json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {
    console.error('POST /api/subscribe error:', error);
    return json({ error: 'Failed to subscribe' }, { status: 500 });
  }
};
