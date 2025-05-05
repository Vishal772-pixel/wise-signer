"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useNetwork } from "@/components/NetworkContext";
import dynamic from 'next/dynamic';

// Dynamically import ConnectButton with no SSR to avoid errors
const ConnectButton = dynamic(
    () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
    { ssr: false }
);

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { networkInfo, isLoading } = useNetwork();
    const [showConnectButton, setShowConnectButton] = useState(false);
    const [isTenderlyPage, setIsTenderlyPage] = useState(false);

    // Check if we have a network configured to show the connect button
    // and check if we're on a tenderly page
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname;
            const onTenderlyPage = pathname.startsWith('/tenderly');
            setIsTenderlyPage(onTenderlyPage);

            // Only show connect button if we have network info AND we're on a tenderly page
            setShowConnectButton(!isLoading && !!networkInfo && onTenderlyPage);
        }
    }, [isLoading, networkInfo]);

    return (
        <nav
            className="px-8 py-2 border-b border-zinc-800 flex flex-row justify-between items-center text-white bg-zinc-900"
        >
            <div className="flex items-center gap-3">
                <Image
                    src="/cyfrin.svg"
                    alt="Cyfrin Logo"
                    width={50}
                    height={50}
                />
                <a
                    href="/"
                    className="text-xl font-semibold text-white hover:text-gray-300 transition"
                >
                    Wise Signer
                </a>
            </div>

            <div className="flex items-center gap-4">
                <a
                    href="/about"
                    className="text-white hover:text-gray-300 transition"
                >
                    about
                </a>

                {/* Only render ConnectButton wrapper when needed */}
                {showConnectButton && isTenderlyPage && (
                    <div className="mr-2">
                        <ConnectButton
                            showBalance={false}
                            accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'full',
                            }}
                            chainStatus={{
                                smallScreen: 'icon',
                                largeScreen: 'full',
                            }}
                        />
                    </div>
                )}

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="cursor-pointer flex items-center gap-1 px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition"
                        onMouseUp={(e) => {
                            // If left-click and not on the arrow part, navigate to Tenderly Virtualnet
                            if (e.button === 0 && !(e.clientX > e.currentTarget.getBoundingClientRect().right - 30)) {
                                window.location.href = "/simulated/questions/1";
                            }
                        }}
                    >
                        Play Now
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <a
                                href="/simulated/questions/1"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                            >
                                Simulated Wallet
                            </a>
                            <a
                                href="/tenderly/welcome"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                            >
                                Tenderly Virtualnet
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;