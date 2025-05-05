'use client';

import { useState, useEffect } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { useNetwork } from '@/components/NetworkContext';
import { CUSTOM_CHAIN_ID } from '@/app/constants';

export default function TenderlyQuestion() {
    const { networkInfo } = useNetwork();

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

