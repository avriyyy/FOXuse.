import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// POST send notification (admin only)
export const POST: RequestHandler = async ({ request }) => {
  try {
    const session = request.headers.get('x-admin-session');
    if (session !== 'authenticated') {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message, link } = await request.json();

    if (!subject || !message) {
      return json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // configure transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: env.MAIL_USER,
            pass: env.MAIL_PASS
        }
    });

    const subscribers = await prisma.subscriber.findMany();
    const emails = subscribers.map(s => s.email);

    if (emails.length === 0) {
        return json({ message: 'No subscribers to notify' });
    }

    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #db2777;">FOXuse. Update</h2>
            <p>${message}</p>
            ${link ? `<a href="${link}" style="display: inline-block; background-color: #db2777; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Check it out</a>` : ''}
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">You are receiving this because you subscribed to FOXuse updates.</p>
        </div>
    `;

    // Send email (bcc to hide recipients)
    await transporter.sendMail({
        from: `"FOXuse Team" <${env.MAIL_USER}>`,
        bcc: emails,
        subject: subject,
        html: htmlContent
    });

    return json({ message: `Notification sent to ${emails.length} subscribers` });
  } catch (error) {
    console.error('POST /api/admin/notify error:', error);
    return json({ error: 'Failed to send notification', details: String(error) }, { status: 500 });
  }
};
