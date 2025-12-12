import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET all products
export const GET: RequestHandler = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    
    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    
    return json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return json({ error: 'Failed to fetch products', details: String(error) }, { status: 500 });
  }
};

// POST create new product (admin only)
export const POST: RequestHandler = async ({ request }) => {
  try {
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
        category: data.category,
        link: data.link || null
      }
    });
    
    return json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return json({ error: 'Failed to create product', details: String(error) }, { status: 500 });
  }
};
