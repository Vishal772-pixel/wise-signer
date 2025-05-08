"use client";

import { useState } from "react";
import { FaInfo, FaGasPump, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { FakeWebsiteComponentProps } from "@/types";
import BrowserNavBar from "@/components/fakeWebsites/BrowserNavBar";
import ChainButton from "../ChainButton";

const URL = "https://app.aave.com/supply";
// Default values
const DEFAULT_INPUT_AMOUNT = 100;
const DEFAULT_USD_VALUE = 100.00;
const WALLET_BALANCE = 9.03;

export default function Aave2({
    questionId,
    primaryButtonText = "Supply USDC",
    onPrimaryButtonClick,
    buttonDisabled = false,
}: FakeWebsiteComponentProps) {
    // State
    const [inputAmount] = useState(DEFAULT_INPUT_AMOUNT);
    const [usdValue] = useState(DEFAULT_USD_VALUE);
    const [isLoading, setIsLoading] = useState(false);

    // Handle supply button click
    const handleSupply = () => {
        if (onPrimaryButtonClick) {
            setIsLoading(true);
            onPrimaryButtonClick();
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-[#1C2032] text-white rounded-lg shadow-md overflow-hidden mt-8 relative">
            <BrowserNavBar url={URL} />

            {/* Modal Header with Close Button */}
            <div className="flex justify-between items-center p-5 border-b border-gray-700">
                <h1 className="text-xl font-bold">Supply USDC</h1>
                <button className="text-gray-400 hover:text-white">
                    <FaTimes size={20} />
                </button>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Amount Input Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-gray-400 flex items-center">
                            Amount <FaInfo className="ml-1 text-xs" />
                        </label>
                    </div>
                    <div className="bg-[#252A3F] rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                value={inputAmount}
                                readOnly
                                className="bg-transparent text-2xl font-semibold w-1/2 focus:outline-none cursor-not-allowed"
                            />
                            <div className="flex items-center">
                                <button className="text-gray-400 mr-2 hover:text-white">
                                    <FaTimes size={16} />
                                </button>
                                <div className="flex items-center bg-[#303650] py-2 px-3 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                        <span className="text-white text-sm">$</span>
                                    </div>
                                    <span>USDC</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-400 text-sm">${usdValue.toFixed(2)}</span>
                            <div className="flex items-center">
                                <span className="text-gray-400 text-sm mr-2">Wallet balance {WALLET_BALANCE}K</span>
                                <button className="bg-[#303650] text-blue-400 text-xs font-semibold px-2 py-1 rounded">
                                    MAX
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Overview */}
                <div>
                    <h2 className="text-gray-400 mb-2">Transaction overview</h2>
                    <div className="bg-[#252A3F] rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                            <span>Supply APY</span>
                            <span>3.05 %</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Collateralization</span>
                            <span className="text-green-500">Enabled</span>
                        </div>
                    </div>
                </div>

                {/* Gas Fee Info */}
                <div className="flex items-center mt-4 text-gray-400 text-sm">
                    <FaGasPump className="mr-2" />
                    <span>$ 0.78</span>
                    <FaInfo className="ml-1 text-xs" />
                </div>

                {/* Supply Button */}
                <ChainButton
                    onClick={handleSupply}
                    disabled={buttonDisabled || isLoading}
                    className={`w-full mt-6 py-4 rounded-lg font-semibold text-center ${buttonDisabled || isLoading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="mr-2 h-5 w-5 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
                            Supplying USDC
                        </div>
                    ) : (
                        primaryButtonText
                    )}
                </ChainButton>
            </div>
        </div>
    );
}