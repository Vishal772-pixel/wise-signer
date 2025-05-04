'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Chain, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CUSTOM_CHAIN_ID, VIRTUAL_NET_DISPLAY_NAME } from '@/app/constants';
import '@rainbow-me/rainbowkit/styles.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Local storage key
const NETWORK_INFO_KEY = "tenderlyNetworkInfo";

// Network info interface
interface NetworkInfo {
    rpcUrl: string;
    chainId: string;
    networkId?: string;
    name: string;
}

// Context interface
interface NetworkContextType {
    networkInfo: NetworkInfo | null;
    isLoading: boolean;
    error: string | null;
}

// Create the context
const NetworkContext = createContext<NetworkContextType>({
    networkInfo: null,
    isLoading: true,
    error: null
});

// Custom hook to use the network context
export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
    children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
    children
}) => {
    const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
    const [wagmiConfig, setWagmiConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTenderlyPage, setIsTenderlyPage] = useState(false);
    const [isSimulatedPage, setIsSimulatedPage] = useState(false);
    const [queryClient] = useState(() => new QueryClient());

    // Check the current page type
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname;

            // Check if we're on a tenderly page
            setIsTenderlyPage(pathname.startsWith('/tenderly'));

            // Check if we're on a simulated page
            setIsSimulatedPage(pathname.startsWith('/simulated'));

            // Only need network for tenderly question pages, not welcome page
            const isTenderlyQuestions = pathname.startsWith('/tenderly/questions');
            const isTenderlyWelcome = pathname.startsWith('/tenderly/welcome');

            setIsTenderlyQuestionsPage(isTenderlyQuestions && !isTenderlyWelcome);
        }
    }, []);

    // Whether this is a page that requires network setup
    const [isTenderlyQuestionsPage, setIsTenderlyQuestionsPage] = useState(false);

    // Load network info from local storage
    useEffect(() => {
        const loadNetworkInfo = () => {
            try {
                if (typeof window === 'undefined') {
                    setIsLoading(false);
                    return null;
                }

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
            // Configure the wagmi client with the custom chain
            const customChain = {
                id: CUSTOM_CHAIN_ID,
                name: info.name || VIRTUAL_NET_DISPLAY_NAME,
                iconUrl: '/wise-signer.png',
                iconBackground: '#fff',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: {
                    default: {
                        http: [info.rpcUrl],
                    },
                    public: {
                        http: [info.rpcUrl],
                    }
                }
            } as const satisfies Chain;

            const config = getDefaultConfig({
                appName: 'Wise Signer',
                projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
                chains: [customChain],
                ssr: false,
            });

            setWagmiConfig(config);
        }
    }, []);

    // Loading state
    if (isLoading) {
        return <div>Loading network configuration...</div>;
    }

    // Error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Network setup required state - ONLY shown on Tenderly question pages
    if (!networkInfo && isTenderlyQuestionsPage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white p-8">
                <div className="bg-zinc-800 p-6 rounded-lg max-w-md text-center">
                    <h2 className="text-xl font-semibold mb-4">Network Setup Required</h2>
                    <p className="mb-6">
                        To continue, you need to set up a Tenderly Virtual Network for safely practicing
                        Ethereum transactions.
                    </p>
                    <a
                        href="/tenderly/welcome"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition inline-block"
                    >
                        Set Up Network
                    </a>
                </div>
            </div>
        );
    }

    if (isSimulatedPage) {
        return (
            <NetworkContext.Provider value={{ networkInfo, isLoading, error }}>
                {children}
            </NetworkContext.Provider>
        );
    }

    return (
        <>
            {networkInfo && wagmiConfig && isTenderlyPage ? (
                <QueryClientProvider client={queryClient}>
                    <WagmiProvider config={wagmiConfig}>
                        <RainbowKitProvider>
                            <NetworkContext.Provider value={{ networkInfo, isLoading, error }}>
                                <Header />
                                {children}
                                <Footer />
                            </NetworkContext.Provider>
                        </RainbowKitProvider>
                    </WagmiProvider>
                </QueryClientProvider>
            ) : (
                <NetworkContext.Provider value={{ networkInfo, isLoading, error }}>
                    <Header />
                    {children}
                    <Footer />
                </NetworkContext.Provider>
            )}
        </>
    );
};