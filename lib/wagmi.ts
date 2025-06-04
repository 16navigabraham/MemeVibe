import { createConfig } from '@wagmi/core';
import { base } from 'viem/chains';
import { http } from 'viem';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(), // or your RPC provider
  },
});
