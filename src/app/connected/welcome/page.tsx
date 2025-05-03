"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaKey, FaExternalLinkAlt, FaNetworkWired, FaEthereum, FaWallet, FaLink, FaRedo } from "react-icons/fa";

// Constants for the VirtualNet
const VIRTUAL_NET_NAME = "ethereum-practice-testnet";
const VIRTUAL_NET_DISPLAY_NAME = "Ethereum Practice TestNet";
const VIRTUAL_NET_DESCRIPTION = "Forked Sepolia network for practicing transactions";
const SEPOLIA_NETWORK_ID = "11155111"; // Sepolia network ID
const CUSTOM_CHAIN_ID = 12345; // Custom chain ID for our fork

export default function WelcomePage() {
    const router = useRouter();
    const [apiKey, setApiKey] = useState<string>("");
    const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
    const [accountSlug, setAccountSlug] = useState<string>("");
    const [projectSlug, setProjectSlug] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [setupStage, setSetupStage] = useState<string>("initial");
    const [setupProgress, setSetupProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [networkInfo, setNetworkInfo] = useState<any>(null);
    const [existingNetworks, setExistingNetworks] = useState<any[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Check for existing network info on component mount (no API key storage)
    useEffect(() => {
        // We only store network info, not sensitive API keys
        const storedNetworkInfo = localStorage.getItem("tenderlyNetworkInfo");

        if (storedNetworkInfo) {
            try {
                setNetworkInfo(JSON.parse(storedNetworkInfo));
            } catch (e) {
                console.error("Failed to parse stored network info:", e);
            }
        }
    }, []);

    // Function to save API key and account/project info
    const saveApiKey = () => {
        if (!apiKey.trim()) {
            setError("Please enter a valid API key");
            return;
        }

        let slugsValid = true;

        if (showAdvanced) {
            if (!accountSlug.trim()) {
                setError("Please enter your Tenderly account slug");
                slugsValid = false;
            }

            if (!projectSlug.trim()) {
                setError("Please enter your Tenderly project slug");
                slugsValid = false;
            }
        }

        if (!slugsValid) return;

        // Set default slugs if not provided
        const finalAccountSlug = accountSlug.trim() || "me";
        const finalProjectSlug = projectSlug.trim() || "project";

        // Store in memory only - avoid storing API keys in localStorage
        setSavedApiKey(apiKey);
        setAccountSlug(finalAccountSlug);
        setProjectSlug(finalProjectSlug);
        setError(null);

        // Check for existing networks
        checkExistingNetworks(apiKey, finalAccountSlug, finalProjectSlug);
    };

    // Function to check for existing virtual networks
    const checkExistingNetworks = async (key: string, account: string, project: string) => {
        setIsLoading(true);
        setSetupStage("checking");
        setSetupProgress(10);
        setError(null);

        console.log(key)
        console.log(account)
        console.log(project)

        try {
            // Fetch list of existing networks
            // This would be a real API call in production
            // For now, we'll check for our specific network ID
            const matchingNetwork = await findExistingNetwork(key, account, project);

            if (matchingNetwork) {
                setExistingNetworks([matchingNetwork]);
                setSetupStage("found");
            } else {
                setSetupStage("not_found");
            }
        } catch (err) {
            console.error("Error checking networks:", err);
            setError("Failed to check existing networks. Please verify your API key and try again.");
            setSetupStage("error");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to find our specific virtual network
    const findExistingNetwork = async (key: string, account: string, project: string) => {
        try {
            // Make the actual API call to list VirtualNets
            const response = await fetch(`https://api.tenderly.co/api/v1/account/${account}/project/${project}/vnets`, {
                method: 'GET',
                headers: {
                    'X-Access-Key': key,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to list VirtualNets: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();

            // Find our specific network by slug
            const existingNetwork = data.find((network: any) => network.slug === VIRTUAL_NET_NAME);

            return existingNetwork || null;
        } catch (error) {
            console.error("Error finding Tenderly VirtualNet:", error);
            throw error;
        }
    };

    // Function to use existing network
    const useExistingNetwork = async (networkId: string) => {
        setIsLoading(true);
        setSetupStage("loading");
        setSetupProgress(50);

        try {
            // Get network details by ID
            const networkDetails = await getNetworkDetails(apiKey, accountSlug, projectSlug, networkId);

            // Extract the RPC URL from the network details
            const rpcUrl = networkDetails.rpcs.find((rpc: any) => rpc.name === "Public RPC")?.url ||
                networkDetails.rpcs[0]?.url;

            setNetworkInfo({
                rpcUrl: rpcUrl,
                chainId: `0x${CUSTOM_CHAIN_ID.toString(16)}`, // Convert to hex format for MetaMask
                networkId: networkId,
                name: networkDetails.display_name
            });

            localStorage.setItem("tenderlyNetworkInfo", JSON.stringify({
                rpcUrl: rpcUrl,
                chainId: `0x${CUSTOM_CHAIN_ID.toString(16)}`,
                networkId: networkId,
                name: networkDetails.display_name
            }));

            setSetupStage("complete");
        } catch (err) {
            console.error("Error loading network:", err);
            setError("Failed to load the selected network. Please try again.");
            setSetupStage("error");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to get network details
    const getNetworkDetails = async (key: string, account: string, project: string, networkId: string) => {
        try {
            // Make the actual API call to get VirtualNet details
            const response = await fetch(`https://api.tenderly.co/api/v1/account/${account}/project/${project}/vnets/${networkId}`, {
                method: 'GET',
                headers: {
                    'X-Access-Key': key,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to get VirtualNet details: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error getting Tenderly VirtualNet details:", error);
            throw error;
        }
    };

    // Function to create a new network
    const setupNewNetwork = async () => {
        setIsLoading(true);
        setSetupStage("fork");
        setSetupProgress(10);
        setError(null);

        try {
            // Step 1: Create a new virtual testnet
            setSetupProgress(30);
            const vnetResponse = await createTenderlyVirtualNet(apiKey, accountSlug, projectSlug);
            setSetupProgress(60);

            // Step 2: Fund wallets if needed
            setSetupStage("fund");
            setSetupProgress(80);
            // This step could be implemented if needed

            // Setup complete
            setSetupProgress(100);
            setNetworkInfo({
                rpcUrl: vnetResponse.rpcUrl,
                chainId: `0x${CUSTOM_CHAIN_ID.toString(16)}`, // Convert to hex format for MetaMask
                networkId: vnetResponse.networkId,
                name: VIRTUAL_NET_DISPLAY_NAME
            });

            localStorage.setItem("tenderlyNetworkInfo", JSON.stringify({
                rpcUrl: vnetResponse.rpcUrl,
                chainId: `0x${CUSTOM_CHAIN_ID.toString(16)}`,
                networkId: vnetResponse.networkId,
                name: VIRTUAL_NET_DISPLAY_NAME
            }));

            setSetupStage("complete");
        } catch (err) {
            console.error("Setup error:", err);
            setError("Failed to setup the network. Please check your API key and try again.");
            setSetupStage("error");
        } finally {
            setIsLoading(false);
        }
    };

    // Create a Tenderly Virtual TestNet
    const createTenderlyVirtualNet = async (key: string, account: string, project: string) => {
        try {
            // Make the actual API call to create a VirtualNet
            const response = await fetch(`https://api.tenderly.co/api/v1/account/${account}/project/${project}/vnets`, {
                method: 'POST',
                headers: {
                    'X-Access-Key': key,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    slug: VIRTUAL_NET_NAME,
                    display_name: VIRTUAL_NET_DISPLAY_NAME,
                    description: VIRTUAL_NET_DESCRIPTION,
                    fork_config: {
                        network_id: SEPOLIA_NETWORK_ID,
                        block_number: "latest"
                    },
                    virtual_network_config: {
                        chain_config: {
                            chain_id: CUSTOM_CHAIN_ID.toString()
                        }
                    },
                    sync_state_config: {
                        enabled: false
                    },
                    explorer_page_config: {
                        enabled: true,
                        verification_visibility: "src"
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to create VirtualNet: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();

            // Extract the public RPC URL
            const publicRpc = data.rpcs?.find((rpc: any) => rpc.name === "Public RPC");
            const rpcUrl = publicRpc?.url || data.rpcs?.[0]?.url;

            if (!rpcUrl) {
                throw new Error("No RPC URL found in the Tenderly response");
            }

            return {
                networkId: data.id,
                rpcUrl: rpcUrl,
                chainId: CUSTOM_CHAIN_ID
            };
        } catch (error) {
            console.error("Error creating Tenderly VirtualNet:", error);
            throw error;
        }
    };

    // Function to use existing API key
    const useExistingKey = () => {
        if (!networkInfo) {
            // If we don't have network info, we need to get a new API key
            setSetupStage("initial");
            return;
        }

        // If we have network info but no API key, we can skip right to the complete state
        // The user will need to provide their API key again for any operations that require it
        setSetupStage("complete");
    };

    // Function to use new API key
    const useNewKey = () => {
        setSavedApiKey(null);
        setNetworkInfo(null);
        localStorage.removeItem("tenderlyNetworkInfo");
        setSetupStage("initial");
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
                        chainName: networkInfo.name || 'Tenderly Sepolia Fork',
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

    // Generate Safe App magic link
    const getSafeAppLink = () => {
        if (!networkInfo) return "";

        const baseUrl = "https://flat-oil-scrawny.on-fleek.app";
        const params = new URLSearchParams({
            chainId: networkInfo.chainId.startsWith("0x") ? parseInt(networkInfo.chainId, 16).toString() : networkInfo.chainId,
            chain: networkInfo.name || "Tenderly Sepolia Fork",
            shortName: "tenderly-fork",
            rpc: networkInfo.rpcUrl,
            currency: "ETH",
            symbol: "ETH",
            expAddr: `${baseUrl}/address/{{address}}`,
            expTx: `${baseUrl}/tx/{{hash}}`,
            l2: "true",
            testnet: "true"
        });

        return `${baseUrl}?${params.toString()}`;
    };

    // Open Safe App
    const openSafeApp = () => {
        const link = getSafeAppLink();
        if (link) {
            window.open(link, "_blank");
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
            if (networkInfo) {
                return (
                    <div className="bg-zinc-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
                        <p className="mb-6">We found an existing Tenderly VirtualNet. Would you like to:</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={useExistingKey}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <FaNetworkWired />
                                Continue with Existing VirtualNet
                            </button>
                            <button
                                onClick={useNewKey}
                                className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                            >
                                <FaKey />
                                Setup New VirtualNet
                            </button>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                        <h2 className="text-2xl font-semibold mb-4">Tenderly Setup</h2>
                        <p className="mb-6">
                            To create a forked Sepolia testnet using Tenderly VirtualNet, we need your Tenderly API key.
                            This lets us create a safe environment for you to practice transactions.
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

                            <div className="mt-4">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="text-zinc-400 hover:text-zinc-300 text-sm"
                                >
                                    {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
                                </button>

                                {showAdvanced && (
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Account Slug (optional)</label>
                                            <input
                                                type="text"
                                                value={accountSlug}
                                                onChange={(e) => setAccountSlug(e.target.value)}
                                                placeholder="Default: me"
                                                className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Project Slug (optional)</label>
                                            <input
                                                type="text"
                                                value={projectSlug}
                                                onChange={(e) => setProjectSlug(e.target.value)}
                                                placeholder="Default: project"
                                                className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}

                            <div className="mt-4">
                                <a
                                    href="https://docs.tenderly.co/account/projects/how-to-generate-api-access-token"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                                >
                                    <FaExternalLinkAlt size={12} />
                                    Documentation: How to get your Tenderly API key
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={saveApiKey}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <FaKey />
                            Continue
                        </button>
                    </div>
                );
            }
        }

        // If checking for existing networks
        if (setupStage === "checking") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Checking for Existing Networks</h2>

                    <div className="mb-6">
                        <div className="w-full bg-zinc-700 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${setupProgress}%` }}
                            ></div>
                        </div>

                        <div className="mt-4 text-zinc-300">
                            <div className="flex items-center gap-2">
                                <FaNetworkWired className="text-blue-400 animate-pulse" />
                                <span>Searching for existing Tenderly VirtualNets...</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // If existing networks found
        if (setupStage === "found") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Existing Network Found</h2>

                    <p className="mb-4">
                        We found an existing Tenderly VirtualNet. Would you like to use it or create a new one?
                    </p>

                    <div className="mb-6 p-4 bg-zinc-700 rounded">
                        <h3 className="font-medium text-lg mb-2">{existingNetworks[0].display_name || VIRTUAL_NET_DISPLAY_NAME}</h3>
                        <p className="text-sm text-zinc-400 mb-4">
                            {existingNetworks[0].description || VIRTUAL_NET_DESCRIPTION}
                        </p>

                        <button
                            onClick={() => useExistingNetwork(existingNetworks[0].id)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
                        >
                            <FaNetworkWired />
                            Use This Network
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={setupNewNetwork}
                            className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                        >
                            <FaRedo />
                            Create New Network
                        </button>
                    </div>
                </div>
            );
        }

        // If no existing networks found
        if (setupStage === "not_found") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">No Existing Network Found</h2>

                    <p className="mb-6">
                        We didn't find any existing Tenderly VirtualNets. Let's create a new one.
                    </p>

                    <button
                        onClick={setupNewNetwork}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        <FaNetworkWired />
                        Create New VirtualNet
                    </button>
                </div>
            );
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
                                    <span>Creating Sepolia fork with Tenderly VirtualNet...</span>
                                </div>
                            )}
                            {setupStage === "fund" && (
                                <div className="flex items-center gap-2">
                                    <FaWallet className="text-green-400 animate-pulse" />
                                    <span>Setting up your test environment...</span>
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

        // If loading an existing network
        if (setupStage === "loading") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Loading Network</h2>

                    <div className="mb-6">
                        <div className="w-full bg-zinc-700 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${setupProgress}%` }}
                            ></div>
                        </div>

                        <div className="mt-4 text-zinc-300">
                            <div className="flex items-center gap-2">
                                <FaNetworkWired className="text-blue-400 animate-pulse" />
                                <span>Loading Tenderly VirtualNet details...</span>
                            </div>
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
                            {networkInfo?.networkId && (
                                <p><span className="text-zinc-400">Network ID:</span> {networkInfo.networkId}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={addNetworkToMetaMask}
                                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition flex items-center justify-center gap-2"
                            >
                                <FaWallet />
                                Add to MetaMask
                            </button>

                            <button
                                onClick={openSafeApp}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
                            >
                                <FaLink />
                                Open in Safe App
                            </button>
                        </div>

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
                    Tenderly VirtualNet Setup
                </h1>
                <p className="text-lg text-gray-300">
                    We'll create a forked version of Ethereum Sepolia where you can safely practice
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
            isMetaMask?: boolean;
        };
    }
}