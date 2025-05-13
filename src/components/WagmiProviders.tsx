"use client";

import React, { ReactNode } from "react";
import { WagmiProvider, Config } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

interface WagmiProvidersProps {
  children: ReactNode;
  wagmiConfig: Config;
  queryClient: QueryClient;
}

const WagmiProviders: React.FC<WagmiProvidersProps> = ({
  children,
  wagmiConfig,
  queryClient,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default WagmiProviders;
