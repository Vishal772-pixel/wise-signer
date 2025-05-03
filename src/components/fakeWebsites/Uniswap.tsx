"use client";

import { useState } from "react";
import { FaEthereum, FaChevronDown, FaArrowDown } from "react-icons/fa";
import { FakeWebsiteComponentProps } from "@/types";
import BrowserNavBar from "@/components/fakeWebsites/BrowserNavBar";

const URL = "https://app.uniswap.org/swap";
// Default values
const DEFAULT_INPUT_TOKEN = "ETH";
const DEFAULT_OUTPUT_TOKEN = "USDC";
const DEFAULT_INPUT_AMOUNT = 1;
const DEFAULT_OUTPUT_AMOUNT = 10000;
const ETH_PRICE_USD = 3500;

export default function UniswapInterface({
    questionId,
    primaryButtonText = "Swap",
    onPrimaryButtonClick,
    buttonDisabled = false,
}: FakeWebsiteComponentProps) {
    const [network] = useState("ZKsync");
    const [inputToken] = useState(DEFAULT_INPUT_TOKEN);
    const [outputToken] = useState(DEFAULT_OUTPUT_TOKEN);
    const [inputAmount] = useState(DEFAULT_INPUT_AMOUNT);
    const [outputAmount] = useState(DEFAULT_OUTPUT_AMOUNT);

    // Calculate exchange rate
    const exchangeRate = DEFAULT_OUTPUT_AMOUNT / DEFAULT_INPUT_AMOUNT;
    const slippage = 0.5; // 0.5%
    const gasEstimate = 0.0012; // ETH

    return (
        <div className="max-w-lg mx-auto bg-[#111111] text-white rounded-2xl shadow-md overflow-hidden mt-8 relative">
            <BrowserNavBar url={URL} />

            {/* Main Content */}
            <div className="p-6">
                {/* Header with network info */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Swap</h1>
                    <div className="flex items-center bg-[#222222] px-3 py-1 rounded-full text-sm">
                        <span className="mr-1 h-2 w-2 bg-green-500 rounded-full"></span>
                        {network}
                    </div>
                </div>

                {/* Swap Container */}
                <div className="bg-[#191919] rounded-2xl p-4">
                    {/* Input Section */}
                    <div className="mb-1">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400 text-sm">You pay</span>
                        </div>
                        <div className="bg-[#222222] rounded-2xl p-4">
                            <div className="flex justify-between">
                                <input
                                    type="text"
                                    value={inputAmount}
                                    readOnly
                                    className="bg-transparent text-2xl font-semibold w-2/3 focus:outline-none cursor-not-allowed"
                                />
                                <button className="flex items-center bg-[#333333] hover:bg-[#444444] py-2 px-3 rounded-full">
                                    <div className="w-6 h-6 bg-[#627EEA] rounded-full flex items-center justify-center mr-2">
                                        <FaEthereum className="text-white text-sm" />
                                    </div>
                                    <span>{inputToken}</span>
                                    <FaChevronDown className="ml-2 text-sm" />
                                </button>
                            </div>
                            <div className="text-gray-400 text-sm mt-1">${inputAmount * ETH_PRICE_USD}</div>
                        </div>
                    </div>

                    {/* Arrow button */}
                    <div className="flex justify-center -my-3 relative z-10">
                        <button className="bg-[#222222] w-10 h-10 rounded-xl flex items-center justify-center">
                            <FaArrowDown />
                        </button>
                    </div>

                    {/* Output Section */}
                    <div className="mt-1">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400 text-sm">You receive</span>
                        </div>
                        <div className="bg-[#222222] rounded-2xl p-4">
                            <div className="flex justify-between">
                                <input
                                    type="text"
                                    value={outputAmount}
                                    readOnly
                                    className="bg-transparent text-2xl font-semibold w-2/3 focus:outline-none cursor-not-allowed"
                                />
                                <button className="flex items-center bg-[#333333] hover:bg-[#444444] py-2 px-3 rounded-full">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                        <span className="text-white text-xs font-bold">$</span>
                                    </div>
                                    <span>{outputToken}</span>
                                    <FaChevronDown className="ml-2 text-sm" />
                                </button>
                            </div>
                            <div className="text-gray-400 text-sm mt-1">$10,000</div>
                        </div>
                    </div>

                    {/* Exchange Rate Info */}
                    <div className="mt-4 bg-[#222222] rounded-lg p-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Exchange rate</span>
                            <span>1 ETH = {exchangeRate.toLocaleString()} USDC</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Max slippage</span>
                            <span>{slippage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Network fee</span>
                            <span>~{gasEstimate} ETH (${(gasEstimate * ETH_PRICE_USD).toFixed(2)})</span>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <button
                        onClick={onPrimaryButtonClick}
                        disabled={buttonDisabled}
                        className={`w-full mt-4 py-4 rounded-xl font-semibold text-lg ${buttonDisabled
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-[#FF38DD] hover:bg-[#ff4de4] text-white'
                            }`}
                    >
                        {primaryButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}