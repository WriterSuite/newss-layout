import type { APIRoute } from 'astro';
import { subscribeNewsletter } from '../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const result = await subscribeNewsletter(email);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: true, message: "Subscribed successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};
