// lib/client.ts

import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org') // You can use Alchemy or Infura URL if needed
});
