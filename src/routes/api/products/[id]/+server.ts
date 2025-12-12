import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

// GET single product
export const GET: RequestHandler = async ({ params }) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) }
  });
  
  if (!product) {
    return json({ error: 'Product not found' }, { status: 404 });
  }
  
  return json(product);
};

// PUT update product (admin only)
export const PUT: RequestHandler = async ({ params, request }) => {
  const session = request.headers.get('x-admin-session');
  if (session !== 'authenticated') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const data = await request.json();
  
  try {
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
  } catch {
    return json({ error: 'Product not found' }, { status: 404 });
  }
};

// DELETE product (admin only)
export const DELETE: RequestHandler = async ({ params, request }) => {
  const session = request.headers.get('x-admin-session');
  if (session !== 'authenticated') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await prisma.product.delete({
      where: { id: parseInt(params.id) }
    });
    
    return json({ success: true });
  } catch {
    return json({ error: 'Product not found' }, { status: 404 });
  }
};
