"use client";

import dynamic from "next/dynamic";
import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { http, createPublicClient } from "viem";

const config = createConfig({
  chains: [base],
  connectors: [injected()],
  client: ({ chain }) => createPublicClient({ transport: http(chain.rpcUrls.default.http[0]) }),
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}