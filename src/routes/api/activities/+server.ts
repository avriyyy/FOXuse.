import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET all activities (max 20)
export const GET: RequestHandler = async () => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    return json(activities);
  } catch (error) {
    console.error('GET /api/activities error:', error);
    return json({ error: 'Failed to fetch activities', details: String(error) }, { status: 500 });
  }
};

// POST create new activity (admin only)
export const POST: RequestHandler = async ({ request }) => {
  try {
    const session = request.headers.get('x-admin-session');
    if (session !== 'authenticated') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    const activity = await prisma.activity.create({
      data: {
        action: data.action,
        productName: data.productName,
        category: data.category,
        adminUser: data.adminUser || 'Admin'
      }
    });
    
    return json(activity, { status: 201 });
  } catch (error) {
    console.error('POST /api/activities error:', error);
    return json({ error: 'Failed to create activity', details: String(error) }, { status: 500 });
  }
};
