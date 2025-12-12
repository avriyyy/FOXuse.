import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET subscribers (admin only)
export const GET: RequestHandler = async ({ request }) => {
  try {
    const session = request.headers.get('x-admin-session');
    if (session !== 'authenticated') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return json(subscribers);
  } catch (error) {
    console.error('GET /api/admin/subscribers error:', error);
    return json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
};
