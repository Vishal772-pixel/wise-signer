"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaKey, FaExternalLinkAlt, FaNetworkWired, FaEthereum, FaWallet } from "react-icons/fa";

export default function WelcomePage() {
    const router = useRouter();
    const [apiKey, setApiKey] = useState<string>("");
    const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [setupStage, setSetupStage] = useState<string>("initial");
    const [setupProgress, setSetupProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [networkInfo, setNetworkInfo] = useState<any>(null);

    // Check for existing API key on component mount
    useEffect(() => {
        const storedKey = localStorage.getItem("tenderlyApiKey");
        if (storedKey) {
            setSavedApiKey(storedKey);
        }
    }, []);

    // Function to save API key
    const saveApiKey = () => {
        if (!apiKey.trim()) {
            setError("Please enter a valid API key");
            return;
        }

        localStorage.setItem("tenderlyApiKey", apiKey);
        setSavedApiKey(apiKey);
        setError(null);
    };

    // Function to use existing API key
    const useExistingKey = () => {
        setApiKey(savedApiKey || "");
        setupNetwork(savedApiKey || "");
    };

    // Function to use new API key
    const useNewKey = () => {
        setSavedApiKey(null);
        localStorage.removeItem("tenderlyApiKey");
    };

    // Setup the Tenderly network
    const setupNetwork = async (key: string) => {
        setIsLoading(true);
        setSetupStage("fork");
        setSetupProgress(10);
        setError(null);

        try {
            // Step 1: Fork mainnet
            setSetupProgress(20);
            const forkResponse = await createTenderlyFork(key);
            setSetupProgress(40);

            // Step 2: Fund a wallet
            setSetupStage("fund");
            setSetupProgress(60);
            await fundWallet(key, forkResponse.forkId);
            setSetupProgress(80);

            // Step 3: Deploy contracts
            setSetupStage("deploy");
            setSetupProgress(90);
            await deployContracts(key, forkResponse.forkId);

            // Setup complete
            setSetupProgress(100);
            setNetworkInfo({
                rpcUrl: forkResponse.rpcUrl,
                chainId: forkResponse.chainId,
                forkId: forkResponse.forkId
            });
            setSetupStage("complete");
            localStorage.setItem("tenderlyNetworkInfo", JSON.stringify({
                rpcUrl: forkResponse.rpcUrl,
                chainId: forkResponse.chainId,
                forkId: forkResponse.forkId
            }));
        } catch (err) {
            console.error("Setup error:", err);
            setError("Failed to setup the network. Please check your API key and try again.");
            setSetupStage("error");
        } finally {
            setIsLoading(false);
        }
    };

    // Create a Tenderly fork
    const createTenderlyFork = async (key: string) => {
        // This would be a real API call in production
        console.log("Creating Tenderly fork with key:", key);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Return mock fork data
        return {
            forkId: "mock-fork-" + Math.random().toString(36).substring(2, 9),
            rpcUrl: "https://rpc.tenderly.co/fork/" + Math.random().toString(36).substring(2, 9),
            chainId: "0x" + Math.floor(Math.random() * 10000).toString(16)
        };
    };

    // Fund a wallet on the forked network
    const fundWallet = async (key: string, forkId: string) => {
        // This would be a real API call in production
        console.log("Funding wallet on fork:", forkId);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    // Deploy contracts to the forked network
    const deployContracts = async (key: string, forkId: string) => {
        // This would be a real API call in production
        console.log("Deploying contracts to fork:", forkId);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2500));
    };

    // Add network to MetaMask
    const addNetworkToMetaMask = async () => {
        if (!networkInfo) return;

        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: networkInfo.chainId,
                        chainName: 'Tenderly Fork',
                        nativeCurrency: {
                            name: 'Ethereum',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: [networkInfo.rpcUrl]
                    }]
                });
            } catch (error) {
                console.error("Error adding network to MetaMask:", error);
                setError("Failed to add network to MetaMask. Please try adding it manually.");
            }
        } else {
            setError("MetaMask is not installed. Please install MetaMask to continue.");
        }
    };

    // Start the challenge
    const startChallenge = () => {
        router.push("/connected/questions/1");
    };

    // Render different content based on current stage
    const renderContent = () => {
        // If checking for existing API key
        if (setupStage === "initial") {
            if (savedApiKey) {
                return (
                    <div className="bg-zinc-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
                        <p className="mb-6">We found a saved Tenderly API key. Would you like to:</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={useExistingKey}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <FaNetworkWired />
                                Continue with Saved Network
                            </button>
                            <button
                                onClick={useNewKey}
                                className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                            >
                                <FaKey />
                                Use New API Key
                            </button>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                        <h2 className="text-2xl font-semibold mb-4">Tenderly Setup</h2>
                        <p className="mb-6">
                            To use the Tenderly Virtualnet, we need your Tenderly API key. This will let us create
                            a forked network for you to safely practice transactions.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Tenderly API Key</label>
                            <input
                                type="text"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Tenderly API key"
                                className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-white"
                            />

                            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}

                            <div className="mt-4">
                                <a
                                    href="https://youtube.com/watch?v=dQw4w9WgXcQ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                                >
                                    <FaExternalLinkAlt size={12} />
                                    Watch tutorial: How to get your Tenderly API key
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={saveApiKey}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <FaKey />
                            Save API Key & Continue
                        </button>
                    </div>
                );
            }
        }

        // If setting up the network
        if (["fork", "fund", "deploy"].includes(setupStage)) {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Setting Up Your Environment</h2>

                    <div className="mb-6">
                        <div className="w-full bg-zinc-700 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${setupProgress}%` }}
                            ></div>
                        </div>

                        <div className="mt-4 text-zinc-300">
                            {setupStage === "fork" && (
                                <div className="flex items-center gap-2">
                                    <FaEthereum className="text-blue-400 animate-pulse" />
                                    <span>Creating Ethereum mainnet fork...</span>
                                </div>
                            )}
                            {setupStage === "fund" && (
                                <div className="flex items-center gap-2">
                                    <FaWallet className="text-green-400 animate-pulse" />
                                    <span>Funding your test wallet with ETH...</span>
                                </div>
                            )}
                            {setupStage === "deploy" && (
                                <div className="flex items-center gap-2">
                                    <FaNetworkWired className="text-purple-400 animate-pulse" />
                                    <span>Deploying challenge contracts...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-800 rounded text-red-200 text-sm mb-4">
                            {error}
                            <button
                                onClick={() => setSetupStage("initial")}
                                className="text-red-300 underline ml-2"
                            >
                                Try again
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // If setup is complete
        if (setupStage === "complete") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Setup Complete!</h2>

                    <div className="mb-6 p-4 bg-zinc-700 rounded">
                        <h3 className="font-medium text-lg mb-2">Your Virtual Network</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-zinc-400">RPC URL:</span> {networkInfo?.rpcUrl}</p>
                            <p><span className="text-zinc-400">Chain ID:</span> {networkInfo?.chainId}</p>
                            <p><span className="text-zinc-400">Fork ID:</span> {networkInfo?.forkId}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={addNetworkToMetaMask}
                            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition flex items-center justify-center gap-2"
                        >
                            <FaWallet />
                            Add to MetaMask
                        </button>

                        <button
                            onClick={startChallenge}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                            Start Challenge
                        </button>
                    </div>
                </div>
            );
        }

        // If there was an error
        if (setupStage === "error") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Setup Error</h2>

                    <div className="p-4 bg-red-900/30 border border-red-800 rounded text-red-200 mb-6">
                        {error || "An unexpected error occurred during setup."}
                    </div>

                    <button
                        onClick={() => setSetupStage("initial")}
                        className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-zinc-900 to-black text-white">
            <div className="text-center max-w-2xl mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Tenderly Virtualnet Setup
                </h1>
                <p className="text-lg text-gray-300">
                    We'll create a forked version of Ethereum mainnet where you can safely practice
                    wallet transactions without risking real assets.
                </p>
            </div>

            {renderContent()}
        </div>
    );
}

// Add TypeScript interface for window.ethereum
declare global {
    interface Window {
        ethereum?: {
            request: (args: any) => Promise<any>;
        };
    }
}