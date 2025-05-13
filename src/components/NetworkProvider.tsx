"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Config } from "wagmi";
import { QueryClient } from "@tanstack/react-query";
import { CUSTOM_CHAIN_ID, VIRTUAL_NET_DISPLAY_NAME } from "@/app/constants";
import "@rainbow-me/rainbowkit/styles.css";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  NetworkInfo,
  NetworkContextProvider,
} from "@/components/NetworkContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Local storage key
const NETWORK_INFO_KEY = "tenderlyNetworkInfo";

// Dynamically import the Wagmi-related components with no SSR
const WagmiProviders = dynamic<{
  wagmiConfig: Config;
  queryClient: QueryClient;
  children: ReactNode;
}>(() => import("./WagmiProviders"), { ssr: false });

interface NetworkProviderProps {
  children: ReactNode;
}

interface BasicLayoutProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [queryClient] = useState<QueryClient>(() => new QueryClient());
  const [mounted, setMounted] = useState<boolean>(false);

  // Use Next.js pathname hook
  const pathname = usePathname();

  // Determine page types based on pathname
  const isTenderlyPage = pathname?.startsWith("/tenderly") || false;
  const isSimulatedPage = pathname?.startsWith("/simulated") || false;
  const isTenderlyQuestionsPage =
    pathname?.startsWith("/tenderly/questions") || false;
  const isTenderlyWelcomePage = pathname === "/tenderly/welcome";

  // Mark as mounted after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load network info from local storage
  useEffect(() => {
    // Only run in browser environment
    if (!mounted) return;

    const loadNetworkInfo = () => {
      try {
        const storedNetworkInfo = localStorage.getItem(NETWORK_INFO_KEY);

        if (storedNetworkInfo) {
          const parsedInfo = JSON.parse(storedNetworkInfo) as NetworkInfo;
          setNetworkInfo(parsedInfo);
          return parsedInfo;
        }

        return null;
      } catch (e) {
        console.error("Failed to parse network info:", e);
        setError("Failed to load network configuration");
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    const info = loadNetworkInfo();

    if (info) {
      try {
        // Configure the wagmi client with the custom chain
        const customChain = {
          id: CUSTOM_CHAIN_ID,
          name: info.name || VIRTUAL_NET_DISPLAY_NAME,
          iconUrl: "/wise-signer.png",
          iconBackground: "#fff",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: {
            default: {
              http: [info.rpcUrl],
            },
            public: {
              http: [info.rpcUrl],
            },
          },
        } as const satisfies Chain;

        const config = getDefaultConfig({
          appName: "Wise Signer",
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
          chains: [customChain],
          ssr: false,
        });

        if (config) {
          setWagmiConfig(config);
        } else {
          console.error("Failed to create wagmi config");
        }
      } catch (error) {
        console.error("Error creating wagmi config:", error);
      }
    }
  }, [mounted]);

  // Create a basic layout that will be consistent across server and client
  const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );

  // Create the network context value
  const networkContextValue = {
    networkInfo,
    isLoading,
    error,
  };

  // Not mounted yet - show minimal layout while hydrating
  if (!mounted) {
    return (
      <NetworkContextProvider value={networkContextValue}>
        <BasicLayout>
          <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
            <div className="text-center">
              <p className="text-zinc-400">Loading...</p>
            </div>
          </div>
        </BasicLayout>
      </NetworkContextProvider>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <NetworkContextProvider value={networkContextValue}>
        <BasicLayout>
          <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
            <div className="text-center">
              <p className="text-zinc-400">Loading network config...</p>
            </div>
          </div>
        </BasicLayout>
      </NetworkContextProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <NetworkContextProvider value={networkContextValue}>
        <BasicLayout>
          <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
            <div className="text-center">
              <p className="text-zinc-400">Error: {error}</p>
            </div>
          </div>
        </BasicLayout>
      </NetworkContextProvider>
    );
  }

  // For simulated pages or welcome page, we don't need Wagmi providers
  if (isSimulatedPage || isTenderlyWelcomePage) {
    return (
      <NetworkContextProvider value={networkContextValue}>
        <BasicLayout>{children}</BasicLayout>
      </NetworkContextProvider>
    );
  }

  // If on questions page but no network info, show setup required
  if ((!networkInfo || !wagmiConfig) && isTenderlyQuestionsPage) {
    return (
      <NetworkContextProvider value={networkContextValue}>
        <BasicLayout>
          <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white p-8">
            <div className="bg-zinc-800 p-6 rounded-lg max-w-md text-center">
              <h2 className="text-xl font-semibold mb-4">
                Network Setup Required
              </h2>
              <p className="mb-6">
                To continue, you need to set up a Tenderly Virtual Network for
                safely practicing Ethereum transactions.
              </p>
              <a
                href="/tenderly/welcome"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition inline-block"
              >
                Set Up Network
              </a>
            </div>
          </div>
        </BasicLayout>
      </NetworkContextProvider>
    );
  }

  // For Tenderly question pages with network info and valid wagmi config
  if (isTenderlyQuestionsPage && networkInfo && wagmiConfig) {
    // Critical: Use the dynamically imported Wagmi providers
    return (
      <NetworkContextProvider value={networkContextValue}>
        <WagmiProviders wagmiConfig={wagmiConfig} queryClient={queryClient}>
          <BasicLayout>{children}</BasicLayout>
        </WagmiProviders>
      </NetworkContextProvider>
    );
  }

  // Default case - just basic context
  return (
    <NetworkContextProvider value={networkContextValue}>
      <BasicLayout>{children}</BasicLayout>
    </NetworkContextProvider>
  );
};
