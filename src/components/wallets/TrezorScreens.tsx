"use client";

import { TransactionDetails } from "@/types";
import { useState, useEffect } from "react";

// Trezor wallet screens component props interface
export interface TrezorScreensProps {
    transactionDetails: TransactionDetails;
    currentScreen: number;
    onNavigate: (direction: 'next' | 'prev') => void;
    onSignTransaction: () => void;
}

const TrezorScreens = ({
    transactionDetails,
    currentScreen,
    onNavigate,
    onSignTransaction
}: TrezorScreensProps) => {
    // Render the appropriate screen content based on current screen index
    const renderScreenContent = () => {
        switch (currentScreen) {
            // Screen 1: Address/Recipient
            case 0:
                return (
                    <div className="text-center">
                        <div className="text-white text-xl font-medium mb-1">Address</div>
                        <div className="text-gray-400 text-lg mb-4">Recipient</div>
                        <div className="text-white text-base font-mono break-all px-2">
                            {transactionDetails.toAccount}
                        </div>
                        <div className="mt-4 text-gray-400 text-sm">
                            Swipe up
                        </div>
                    </div>
                );

            // Screen 2: Send From
            case 1:
                return (
                    <div className="text-center">
                        <div className="text-white text-xl font-medium mb-3">Send from</div>
                        <div className="mb-3">
                            <div className="text-gray-400 text-sm">Account</div>
                            <div className="text-white text-lg">ETH #1</div>
                        </div>
                        <div>
                            <div className="text-gray-400 text-sm">Derivation path</div>
                            <div className="text-white text-base font-mono">m/44'/0'/0'/0/0</div>
                        </div>
                    </div>
                );

            // Screen 3: Summary
            case 2:
                return (
                    <div className="text-center">
                        <div className="text-white text-xl font-medium mb-3">Summary</div>
                        <div className="mb-3">
                            <div className="text-gray-400 text-sm">Amount</div>
                            <div className="text-white text-lg">{transactionDetails.amount}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 text-sm">Maximum fee</div>
                            <div className="text-white text-base font-mono">{transactionDetails.estimatedFee.eth}</div>
                        </div>
                    </div>
                );

            // Screen 4: Sign Transaction
            case 3:
                return (
                    <div className="text-center">
                        <div className="text-white text-xl font-medium mb-3">Sign transaction</div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 border-4 border-green-400 rounded-full flex items-center justify-center mb-3">
                                <div className="w-12 h-12 border-2 border-green-300 rounded-full flex items-center justify-center">
                                    <div className="text-xl text-white">⚙️</div>
                                </div>
                            </div>
                            <div className="text-white text-lg">Hold to sign</div>
                        </div>
                    </div>
                );

            default:
                return <div className="text-white text-center">Unknown screen</div>;
        }
    };

    return (
        <div className="p-4">
            <div className="flex flex-col items-center">
                {/* Trezor device screen container */}
                <div className="mb-8 w-full max-w-xs mx-auto">
                    {/* Black screen with content */}
                    <div
                        className="bg-black border border-white p-6 min-h-[200px] flex items-center justify-center rounded-sm"
                    >
                        {renderScreenContent()}
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className="mt-4 flex justify-center gap-4">
                    {currentScreen > 0 && (
                        <button
                            onClick={() => onNavigate('prev')}
                            className="cursor-pointer text-black px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-lg"
                        >
                            Swipe Down
                        </button>
                    )}

                    {currentScreen < 3 ? (
                        <button
                            onClick={() => onNavigate('next')}
                            className="cursor-pointer text-black px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-lg"
                        >
                            Swipe Up
                        </button>
                    ) : (
                        <button
                            onClick={onSignTransaction}
                            className="cursor-pointer text-black px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-lg"
                        >
                            Hold to Sign
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


export default TrezorScreens;