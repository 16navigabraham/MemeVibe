import { createClient } from '@vercel/edge-config';

if (!process.env.EDGE_CONFIG) {
  throw new Error('EDGE_CONFIG environment variable is not set');
}

const config = createClient(process.env.EDGE_CONFIG);

export async function saveNotificationToken(fid: number, token: string, url: string) {
  // Edge Config is read-only in runtime
  // Use Vercel CLI or Dashboard to update values
  throw new Error('Edge Config is read-only. Update values using Vercel CLI or Dashboard.');
}

export async function getAllActiveTokens() {
  try {
    const tokens = (await config.get('notification_tokens')) || {};
    return Object.values(tokens).map((t: any) => t.token);
  } catch (error) {
    console.error('Error getting active tokens:', error);
    return [];
  }
}

export async function deleteNotificationToken(fid: number) {
  // Edge Config is read-only in runtime
  // Use Vercel CLI or Dashboard to update values
  throw new Error('Edge Config is read-only. Update values using Vercel CLI or Dashboard.');
}