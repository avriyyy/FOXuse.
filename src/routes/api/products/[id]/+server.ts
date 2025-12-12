import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET single product
export const GET: RequestHandler = async ({ params }) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) }
    });
    
    if (!product) {
      return json({ error: 'Product not found' }, { status: 404 });
    }
    
    return json(product);
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return json({ error: 'Failed to fetch product', details: String(error) }, { status: 500 });
  }
};

// PUT update product (admin only)
export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const session = request.headers.get('x-admin-session');
    if (session !== 'authenticated') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    const product = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        category: data.category,
        link: data.link || null
      }
    });
    
    return json(product);
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return json({ error: 'Failed to update product', details: String(error) }, { status: 500 });
  }
};

// DELETE product (admin only)
export const DELETE: RequestHandler = async ({ params, request }) => {
  try {
    const session = request.headers.get('x-admin-session');
    if (session !== 'authenticated') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await prisma.product.delete({
      where: { id: parseInt(params.id) }
    });
    
    return json({ success: true });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return json({ error: 'Failed to delete product', details: String(error) }, { status: 500 });
  }
};
