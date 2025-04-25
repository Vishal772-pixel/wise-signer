"use client";

import { useState } from "react";
import { FaSearch, FaRegCopy, FaWallet, FaUser, FaCube, FaChartLine, FaList, FaCog, FaQuestion } from "react-icons/fa";
import { FakeWebsiteComponentProps } from "@/types";
import BrowserNavBar from "@/components/fakeWebsites/BrowserNavBar";

const URL = "https://opensea.io";
const WALLET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const SHORTENED_ADDRESS = `${WALLET_ADDRESS.substring(0, 8)}...${WALLET_ADDRESS.substring(WALLET_ADDRESS.length - 4)}`;

export default function Opensea({
    fakeWebsiteEdition,
    primaryButtonText = "Sign In",
    onPrimaryButtonClick,
    buttonDisabled = false,
}: FakeWebsiteComponentProps) {
    return (
        <div className="max-w-6xl mx-auto bg-[#111111] text-white rounded-lg shadow-md overflow-hidden mt-8 relative">
            <BrowserNavBar url={URL} />

            {/* Main Content */}
            <div className="min-h-[500px]">
                {/* Top Navigation */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
                    {/* Left Side - Empty now */}
                    <div className="flex items-center">
                        {/* Blue circle logo removed */}
                    </div>

                    {/* Center - Search Bar */}
                    <div className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="bg-[#222222] w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                                placeholder="Search OpenSea"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-400 text-sm">/</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sign In Button */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onPrimaryButtonClick}
                            disabled={buttonDisabled}
                            className={`px-4 py-2 rounded-lg flex items-center justify-center ${buttonDisabled ? 'bg-gray-700 text-gray-400' : 'bg-white text-black hover:bg-gray-100'
                                }`}
                        >
                            <FaWallet className="mr-2" />
                            {primaryButtonText}
                        </button>
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                            <FaUser className="text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="w-full bg-gradient-to-r from-purple-900 to-red-900 h-64 relative">
                    {/* Profile Picture */}
                    <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 border-[#111111] overflow-hidden">
                        <div className="w-full h-full bg-purple-600 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-md bg-purple-500 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-md bg-purple-400"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info & Tabs */}
                <div className="pt-20 px-8">
                    <div className="flex items-center">
                        <h1 className="text-4xl font-bold">{SHORTENED_ADDRESS}</h1>
                        <button className="ml-2 text-gray-400 hover:text-gray-300">
                            <FaRegCopy />
                        </button>
                    </div>

                    <div className="flex justify-between mt-6">
                        <div className="flex space-x-2">
                            <div className="px-4 text-sm text-center">
                                <div className="font-semibold">NET WORTH</div>
                                <div className="mt-1">0.00 ETH</div>
                            </div>
                            <div className="px-4 text-sm text-center">
                                <div className="font-semibold">USD VALUE</div>
                                <div className="mt-1">$0.00</div>
                            </div>
                            <div className="px-4 text-sm text-center">
                                <div className="font-semibold">NFTS</div>
                                <div className="mt-1">0%</div>
                            </div>
                            <div className="px-4 text-sm text-center">
                                <div className="font-semibold">TOKENS</div>
                                <div className="mt-1">0%</div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-800 mt-8">
                        <div className="flex space-x-8">
                            <button className="px-4 py-3 text-white border-b-2 border-white font-semibold">NFTs</button>
                            <button className="px-4 py-3 text-gray-400 hover:text-gray-300">Tokens</button>
                            <button className="px-4 py-3 text-gray-400 hover:text-gray-300">Listings</button>
                            <button className="px-4 py-3 text-gray-400 hover:text-gray-300">Offers</button>
                            <button className="px-4 py-3 text-gray-400 hover:text-gray-300">Portfolio</button>
                            <button className="px-4 py-3 text-gray-400 hover:text-gray-300">Created</button>
                            <button className="px-4 py-3 text-gray-400 hover:text-gray-300">Activity</button>
                        </div>
                    </div>

                    {/* Filter and display options */}
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <button className="p-2 border border-gray-700 rounded-md mr-3">
                                <FaList />
                            </button>
                            <div className="relative">
                                <div className="flex items-center bg-[#222222] rounded-lg px-3 py-2 border border-gray-700">
                                    <FaSearch className="text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Search for items"
                                        className="bg-transparent border-none focus:outline-none text-white w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="relative mr-2">
                                <select className="bg-[#222222] text-white px-4 py-2 pr-8 rounded-lg border border-gray-700 appearance-none focus:outline-none">
                                    <option>Recently received</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex space-x-1">
                                <button className="p-2 bg-[#222222] hover:bg-[#333333] rounded-lg border border-gray-700">
                                    <FaCog />
                                </button>
                                {/* Display options buttons */}
                                <button className="p-2 bg-[#222222] hover:bg-[#333333] rounded-lg border border-gray-700">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
                                        <rect x="3" y="14" width="7" height="7" rx="1" fill="white" />
                                        <rect x="14" y="3" width="7" height="7" rx="1" fill="white" />
                                        <rect x="14" y="14" width="7" height="7" rx="1" fill="white" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Empty state or NFTs would go here */}
                    <div className="py-16 flex justify-center items-center text-gray-500">
                        {/* You can add content for empty state here */}
                    </div>
                </div>
            </div>

            {fakeWebsiteEdition > 1 && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    Edition {fakeWebsiteEdition}
                </div>
            )}
        </div>
    );
}