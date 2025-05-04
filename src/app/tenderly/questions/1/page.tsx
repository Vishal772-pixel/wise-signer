'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useNetwork } from '@/components/NetworkContext';
import { CUSTOM_CHAIN_ID } from '@/app/constants';

export default function TenderlyQuestion() {
    const { networkInfo } = useNetwork();
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

    // Check if user is on the correct network
    useEffect(() => {
        if (chainId === CUSTOM_CHAIN_ID) {
            setIsCorrectNetwork(true);
        } else {
            setIsCorrectNetwork(false);
        }
    }, [chainId]);

    // Handle switching to the configured network
    const handleSwitchNetwork = () => {
        if (switchChain) {
            switchChain({ chainId: CUSTOM_CHAIN_ID });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                {!isCorrectNetwork ? (
                    <div className="bg-zinc-800 p-6 rounded-lg mb-8">
                        <h2 className="text-xl font-semibold mb-2">Wrong Network</h2>
                        <p className="mb-4">
                            Please switch to the {networkInfo?.name} to continue with this challenge.
                        </p>
                        <button
                            onClick={handleSwitchNetwork}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Switch Network
                        </button>
                    </div>
                ) : (
                    <div className="bg-zinc-800 p-6 rounded-lg mb-8">
                        <h2 className="text-xl font-semibold mb-2">Challenge Instructions</h2>
                        <p className="mb-4">
                            You are now connected to {networkInfo?.name} and ready to complete the challenge!
                        </p>

                        {/* Challenge content goes here */}
                        <div className="mt-8 p-4 bg-zinc-700 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Your Task</h3>
                            <p>
                                For this challenge, you need to send a transaction with the following parameters:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Recipient: 0x123...456</li>
                                <li>Amount: 0.01 ETH</li>
                                <li>Gas Limit: 21000</li>
                            </ul>

                            {/* Challenge UI elements would go here */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

