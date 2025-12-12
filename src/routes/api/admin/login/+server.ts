import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();
  
  // Use env variables, fallback to default for dev
  const validUsername = env.ADMIN_USERNAME || 'avriyyy23';
  const validPassword = env.ADMIN_PASSWORD || 'avriyyy23';
  
  if (username === validUsername && password === validPassword) {
    return json({ success: true, user: username });
  }
  
  return json({ success: false, message: 'Invalid username or password' }, { status: 401 });
};
