import { MEME_BATTLES_CONTRACT } from '@/lib/contract';
import { getWalletClient, waitForTransactionReceipt } from '@wagmi/core';
import type { NextApiRequest, NextApiResponse } from 'next';
import { config } from '../../lib/wagmi'; // Adjust the path as needed based on your folder structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { battleId, choice } = req.body;

  try {
    const client = await getWalletClient(config);
    const hash = await client.writeContract({
      address: MEME_BATTLES_CONTRACT.address,
      abi: MEME_BATTLES_CONTRACT.abi,
      functionName: 'vote',
      args: [battleId, choice],
    });

    await waitForTransactionReceipt(config, { hash });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.status(500).json({ success: false, error: 'Unknown error occurred' });
  }
}
