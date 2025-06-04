// lib/walletClient.ts

import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

export const getWalletClient = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Wallet not detected. Use Warpcast wallet or MetaMask.');
  }

  const walletClient = createWalletClient({
    chain: base,
    transport: custom(window.ethereum),
  });

  return walletClient;
};
