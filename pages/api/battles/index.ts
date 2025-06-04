// API route to fetch all battles

import type { NextApiRequest, NextApiResponse } from 'next';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { MEME_BATTLES_CONTRACT } from '@/lib/contract';

// Define battle type from contract
type Battle = {
  castA: string;
  castB: string;
  votesA: bigint;
  votesB: bigint;
  isActive: boolean;
  createdAt: bigint;
};

// Define battle response type
type BattleResponse = {
  id: number;
  castA: string;
  castB: string;
  votesA: number;
  votesB: number;
  isActive: boolean;
  createdAt: number;
};

const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get total battle count from contract
    const battleCount = await publicClient.readContract({
      address: MEME_BATTLES_CONTRACT.address,
      abi: MEME_BATTLES_CONTRACT.abi,
      functionName: 'battleCount'
    });

    // Fetch all battles
    const battles: BattleResponse[] = [];
    for (let i = 1; i <= Number(battleCount); i++) {
      const battle = await publicClient.readContract({
        address: MEME_BATTLES_CONTRACT.address,
        abi: MEME_BATTLES_CONTRACT.abi,
        functionName: 'battles',
        args: [BigInt(i)]
      }) as Battle;

      battles.push({
        id: i,
        castA: battle.castA,
        castB: battle.castB,
        votesA: Number(battle.votesA),
        votesB: Number(battle.votesB),
        isActive: battle.isActive,
        createdAt: Number(battle.createdAt)
      });
    }

    // Sort battles by creation time (newest first)
    const sortedBattles = battles.sort((a, b) => b.createdAt - a.createdAt);
    
    res.status(200).json(sortedBattles);
  } catch (error) {
    console.error('Error fetching battles:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch battles' 
    });
  }
}