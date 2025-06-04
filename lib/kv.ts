import { kv } from '@vercel/kv';

export async function saveNotificationToken(fid: number, token: string, url: string) {
  await kv.set(`notification:${fid}`, { token, url });
}

export async function getNotificationToken(fid: number) {
  return kv.get(`notification:${fid}`);
}

export async function deleteNotificationToken(fid: number) {
  await kv.del(`notification:${fid}`);
}

export async function getAllActiveTokens() {
  const keys = await kv.keys('notification:*');
  const tokens = await Promise.all(
    keys.map(key => kv.get(key))
  );
  return tokens.filter(Boolean).map(t => (t as any).token);
}