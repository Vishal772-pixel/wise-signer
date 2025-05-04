'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useNetwork } from './NetworkContext';
import { useAccount, useChainId } from 'wagmi';

interface ChallengeWrapperProps {
    children: ReactNode;
    setupPath?: string;
}

export const ChallengeWrapper: React.FC<ChallengeWrapperProps> = ({
    children,
    setupPath = '/tenderly/welcome'
}) => {
    const { networkInfo, isLoading } = useNetwork();
    const router = useRouter();

    // This will throw an error if WagmiProvider is not present,
    // so we need to handle it
    let isConnected = false;
    try {
        // Try to use Wagmi hooks, but catch errors
        const { isConnected: connected } = useAccount();
        isConnected = connected;
    } catch (error) {
        // If Wagmi hooks fail, we'll handle the content differently
        console.warn("Wagmi provider not available yet");
    }

    useEffect(() => {
        // If there's no network configured, redirect to setup
        if (!isLoading && !networkInfo) {
            router.push(setupPath);
        }
    }, [networkInfo, isLoading, setupPath, router]);

    // If loading or we need to redirect, show a loading state
    if (isLoading || !networkInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Checking Network Configuration...</h2>
                    <p className="text-zinc-400">Please wait while we verify your environment</p>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
                <div className="text-center">
                    <p className="text-zinc-400">Please connect your wallet to continue</p>
                </div>
            </div>
        )
    }

    return <>{children}</>;
};