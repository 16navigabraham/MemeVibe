import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'

// Initialize the Farcaster Frame connector with recommended options
export const farcaster = farcasterFrame()

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcaster
  ]
})
