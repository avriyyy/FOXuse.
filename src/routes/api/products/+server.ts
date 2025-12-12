import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET all products
export const GET: RequestHandler = async ({ url }) => {
  const category = url.searchParams.get('category');
  
  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: 'desc' }
  });
  
  return json(products);
};

// POST create new product (admin only)
export const POST: RequestHandler = async ({ request, cookies }) => {
  // Check admin session
  const session = request.headers.get('x-admin-session');
  if (session !== 'authenticated') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const data = await request.json();
  
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      status: data.status || 'Planning',
      category: data.category
    }
  });
  
  return json(product, { status: 201 });
};
