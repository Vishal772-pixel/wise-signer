"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaKey, FaExternalLinkAlt, FaNetworkWired, FaEthereum, FaWallet, FaLink, FaRedo, FaSave, FaUserPlus, FaFileAlt } from "react-icons/fa";
import ManualSetupInstructions from "@/components/ManualSetupInstructions";
import { SEPOLIA_NETWORK_ID, CUSTOM_CHAIN_ID, VIRTUAL_NET_NAME, VIRTUAL_NET_DISPLAY_NAME, VIRTUAL_NET_DESCRIPTION } from "@/app/constants";

// Local storage keys
const NETWORK_INFO_KEY = "tenderlyNetworkInfo";

// TypeScript interfaces
interface NetworkInfo {
    rpcUrl: string;
    chainId: string;
    networkId?: string;
    name: string;
}

// Extract the public RPC URL
interface TenderlyRpc {
    url: string;
    name: string;
}

type SetupOptionType = "" | "existing" | "create";
type SetupStageType = "initial" | "creating" | "complete" | "error";

export default function WelcomePage() {
    const router = useRouter();
    const [setupOption, setSetupOption] = useState<SetupOptionType>(""); // "existing" or "create"
    const [endpointUrl, setEndpointUrl] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");
    const [accountSlug, setAccountSlug] = useState<string>("me");
    const [projectSlug, setProjectSlug] = useState<string>("project");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
    const [setupStage, setSetupStage] = useState<SetupStageType>("initial"); // initial, creating, complete, error
    const [showManualSetup, setShowManualSetup] = useState<boolean>(false);

    // Check for existing network info on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedNetworkInfo = localStorage.getItem(NETWORK_INFO_KEY);
            if (storedNetworkInfo) {
                try {
                    const parsedInfo = JSON.parse(storedNetworkInfo);
                    setNetworkInfo(parsedInfo);
                    // Pre-fill endpoint URL if we have stored network info
                    setEndpointUrl(parsedInfo.rpcUrl || "");
                } catch (e) {
                    console.error("Failed to parse stored network info:", e);
                }
            }
        }
    }, []);

    // Handle option selection
    const handleOptionSelect = (option: SetupOptionType) => {
        setSetupOption(option);
        setShowManualSetup(false);
        setError(null);
    };

    // Handle existing endpoint submission
    const handleExistingEndpoint = () => {
        if (!endpointUrl.trim()) {
            setError("Please enter a valid endpoint URL");
            return;
        }

        // Validate URL format
        try {
            new URL(endpointUrl);
        } catch (e) {
            setError("Please enter a valid URL");
            return;
        }

        setIsLoading(true);
        setError(null);

        // Save the endpoint info
        const networkInfo: NetworkInfo = {
            rpcUrl: endpointUrl,
            chainId: `0x${CUSTOM_CHAIN_ID.toString(16)}`, // Default chain ID in hex
            name: VIRTUAL_NET_DISPLAY_NAME
        };

        try {
            localStorage.setItem(NETWORK_INFO_KEY, JSON.stringify(networkInfo));
            setNetworkInfo(networkInfo);
            setSetupStage("complete");
        } catch (e) {
            setError("Failed to save network information");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle creation of new virtual network
    const handleCreateNetwork = async () => {
        if (!apiKey.trim()) {
            setError("Please enter a valid API key");
            return;
        }

        if (!accountSlug.trim()) {
            setError("Please enter a valid account slug");
            return;
        }

        if (!projectSlug.trim()) {
            setError("Please enter a valid project slug");
            return;
        }

        setIsLoading(true);
        setSetupStage("creating");
        setError(null);

        const createVirtualNetBody = JSON.stringify({
            slug: VIRTUAL_NET_NAME,
            display_name: VIRTUAL_NET_DISPLAY_NAME,
            description: VIRTUAL_NET_DESCRIPTION,
            fork_config: {
                network_id: SEPOLIA_NETWORK_ID,
                block_number: "latest"
            },
            virtual_network_config: {
                chain_config: {
                    chain_id: CUSTOM_CHAIN_ID
                }
            },
            sync_state_config: {
                enabled: false
            },
            explorer_page_config: {
                enabled: false,
                verification_visibility: "src"
            }
        })

        try {
            // Make the API call to create a VirtualNet
            const response = await fetch(`https://api.tenderly.co/api/v1/account/${accountSlug.trim()}/project/${projectSlug.trim()}/vnets`, {
                method: 'POST',
                headers: {
                    'X-Access-Key': apiKey,
                    'Content-Type': 'application/json'
                },
                body: createVirtualNetBody
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to create VirtualNet: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
            }

            if (response.status === 409) {
                setError("You already have a Wise Signer virtual network set up! Go to the virtual networks page on your Tenderly dashboard, grab the public endpoint, and add it via the 'I Already Have a Network' option.");
                setSetupStage("error");
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            const publicRpc = data.rpcs?.find((rpc: TenderlyRpc) => rpc.name === "Public RPC");
            const rpcUrl = publicRpc?.url || data.rpcs?.[0]?.url;

            if (!rpcUrl) {
                throw new Error("No RPC URL found in the Tenderly response");
            }

            // Save network information
            const networkInfo: NetworkInfo = {
                rpcUrl: rpcUrl,
                chainId: `0x${CUSTOM_CHAIN_ID.toString(16)}`,
                networkId: data.id,
                name: VIRTUAL_NET_DISPLAY_NAME
            };

            localStorage.setItem(NETWORK_INFO_KEY, JSON.stringify(networkInfo));
            setNetworkInfo(networkInfo);
            setSetupStage("complete");
        } catch (error) {
            console.error("Error creating Tenderly VirtualNet:", error);
            setError(error instanceof Error ? error.message : "Failed to create the virtual network. Please check your credentials and try again.");
            setSetupStage("error");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset setup process
    const resetSetup = () => {
        setSetupOption("");
        setEndpointUrl("");
        setApiKey("");
        setError(null);
        setShowManualSetup(false);
        setSetupStage("initial");
    };

    // Clear stored network and restart
    const useNewNetwork = () => {
        localStorage.removeItem(NETWORK_INFO_KEY);
        setNetworkInfo(null);
        setSetupStage("initial");
        resetSetup();
    };

    const addNetworkToWallet = async () => {
        if (!networkInfo) return;

        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: networkInfo.chainId,
                        chainName: networkInfo.name || VIRTUAL_NET_DISPLAY_NAME,
                        nativeCurrency: {
                            name: 'Ethereum',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: [networkInfo.rpcUrl]
                    }]
                });
            } catch (error) {
                console.log(error)
            }
        } else {
            setError("MetaMask or blockchain wallet is not installed. Please install a blockchain wallet to continue.");
        }
    };

    // Start the challenge
    const startChallenge = () => {
        router.push("/tenderly/questions/1");
    };

    // Use the existing network from localStorage
    const useExistingNetwork = () => {
        if (networkInfo) {
            setSetupStage("complete");
        }
    };

    // Render the main content based on the current state
    const renderContent = () => {
        // If manual setup instructions are shown
        if (showManualSetup) {
            return <ManualSetupInstructions onBack={() => setShowManualSetup(false)} />;
        }

        // If we already have network info saved
        if (networkInfo && setupStage === "initial") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
                    <p className="mb-6">We found a saved Tenderly Network configuration. Would you like to:</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => setSetupStage("complete")}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaNetworkWired />
                            Continue with Saved Network
                        </button>
                        <button
                            onClick={useNewNetwork}
                            className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaRedo />
                            Setup New Network
                        </button>
                    </div>
                </div>
            );
        }

        // Initial option selection screen
        if (setupStage === "initial" && !setupOption) {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-6">Tenderly Network Setup</h2>
                    <p className="mb-8">
                        To use the Ethereum transaction practice environment, you need a Tenderly Virtual Network.
                        Choose one of the following options:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button
                            onClick={() => handleOptionSelect("existing")}
                            className="p-6 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition text-left flex flex-col h-full cursor-pointer"
                        >
                            <div className="flex items-center mb-3">
                                <FaNetworkWired className="text-blue-400 mr-3" size={24} />
                                <h3 className="text-xl font-medium">I Already Have a Network</h3>
                            </div>
                            <p className="text-zinc-300 text-sm mb-4">
                                Use an existing Tenderly Virtual Network you've already set up.
                            </p>
                        </button>

                        <button
                            onClick={() => handleOptionSelect("create")}
                            className="p-6 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition text-left flex flex-col h-full cursor-pointer"
                        >
                            <div className="flex items-center mb-3">
                                <FaEthereum className="text-green-400 mr-3" size={24} />
                                <h3 className="text-xl font-medium">Create New Network</h3>
                            </div>
                            <p className="text-zinc-300 text-sm mb-4">
                                Set up a new Tenderly Virtual Network for practicing transactions.
                            </p>
                        </button>
                    </div>

                    <div className="mt-6">
                        <a
                            href="https://docs.tenderly.co/tenderly-dashboard/networks/virtual-networks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                        >
                            <FaExternalLinkAlt size={12} />
                            Learn more about Tenderly Virtual Networks
                        </a>
                    </div>
                </div>
            );
        }

        // Form for entering existing endpoint
        if (setupStage === "initial" && setupOption === "existing") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <button
                        onClick={resetSetup}
                        className="text-zinc-400 hover:text-zinc-300 flex items-center gap-1 text-sm mb-4 cursor-pointer"
                    >
                        ← Back to options
                    </button>

                    <h2 className="text-2xl font-semibold mb-4">Use Existing Network</h2>
                    <p className="mb-6">
                        Enter the RPC endpoint URL of your existing Tenderly Virtual Network.
                        This will be stored locally in your browser.
                    </p>

                    {/* Show option to use stored network if we have one */}
                    {networkInfo && (
                        <div className="mb-6 p-4 bg-zinc-700 rounded-lg">
                            <div className="flex items-center mb-2">
                                <FaNetworkWired className="text-blue-400 mr-3" size={20} />
                                <h3 className="text-lg font-medium">Use Your Saved Network</h3>
                            </div>
                            <p className="text-zinc-300 text-sm mb-3">
                                We found a network configuration stored in your browser.
                            </p>
                            <div className="text-sm mb-4">
                                <p><span className="text-zinc-400">RPC URL:</span> {networkInfo.rpcUrl}</p>
                                <p><span className="text-zinc-400">Chain ID:</span> {networkInfo.chainId}</p>
                            </div>
                            <button
                                onClick={useExistingNetwork}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <FaNetworkWired />
                                Use This Network
                            </button>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">RPC Endpoint URL</label>
                        <input
                            type="url"
                            value={endpointUrl}
                            onChange={(e) => setEndpointUrl(e.target.value)}
                            placeholder="https://virtual.sepolia.rpc.tenderly.co/your-endpoint-id"
                            className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-white"
                        />

                        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
                    </div>

                    <button
                        onClick={handleExistingEndpoint}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <FaSave />
                        Save Network
                    </button>
                </div>
            );
        }

        // Form for creating a new network
        if (setupStage === "initial" && setupOption === "create") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <button
                        onClick={resetSetup}
                        className="text-zinc-400 hover:text-zinc-300 flex items-center gap-1 text-sm mb-4 cursor-pointer"
                    >
                        ← Back to options
                    </button>

                    <h2 className="text-2xl font-semibold mb-4">Create New Network</h2>
                    <p className="mb-6">
                        We'll help you set up a new Tenderly Virtual Network. You'll need a Tenderly account
                        and API key to continue.
                    </p>

                    <div className="mb-6 p-4 bg-zinc-700 rounded flex items-center">
                        <FaUserPlus className="text-blue-400 mr-4" size={24} />
                        <div>
                            <h3 className="font-medium mb-1">Don't have a Tenderly account?</h3>
                            <p className="text-sm text-zinc-300 mb-2">
                                Create a free account to get started with Tenderly.
                            </p>
                            <a
                                href="https://dashboard.tenderly.co/register"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                            >
                                <FaExternalLinkAlt size={12} />
                                Create Tenderly Account
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="mb-6 p-4 bg-zinc-700 rounded-lg">
                            <div className="flex items-center mb-2">
                                <FaFileAlt className="text-yellow-400 mr-3" size={20} />
                                <h3 className="text-lg font-medium">Don't want to enter your API key?</h3>
                            </div>
                            <p className="text-zinc-300 text-sm mb-3">
                                You can manually set up a Tenderly Virtual Network using their dashboard. However, we only use the API key to generate the network, and it won't be stored in your browser.
                            </p>
                            <button
                                onClick={() => setShowManualSetup(true)}
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm cursor-pointer"
                            >
                                <FaExternalLinkAlt size={12} />
                                Show manual setup instructions
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Tenderly API Key</label>
                            <input
                                type="text"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Tenderly API key"
                                className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-white"
                            />
                            <p className="text-xs text-zinc-400 mt-1">
                                Your API key will only be stored in memory during setup and won't persist after page refresh.
                            </p>
                            <a
                                href="https://docs.tenderly.co/account/projects/how-to-generate-api-access-token"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm mt-2"
                            >
                                <FaExternalLinkAlt size={12} />
                                How to get your Tenderly API key
                            </a>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Account Slug</label>
                            <input
                                type="text"
                                value={accountSlug}
                                onChange={(e) => setAccountSlug(e.target.value)}
                                placeholder="Default: me"
                                className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-white"
                            />
                            <p className="text-xs text-zinc-400 mt-1">
                                <a href="https://docs.tenderly.co/account/projects/account-project-slug"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm mt-2">
                                    <FaExternalLinkAlt size={12} />
                                    Where to find account slug?
                                </a>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Project Slug</label>
                            <input
                                type="text"
                                value={projectSlug}
                                onChange={(e) => setProjectSlug(e.target.value)}
                                placeholder="Default: project"
                                className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-white"
                            />
                            <p className="text-xs text-zinc-400 mt-1">
                                <a href="https://docs.tenderly.co/account/projects/account-project-slug"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm mt-2">
                                    <FaExternalLinkAlt size={12} />
                                    Where to find project slug?
                                </a>
                            </p>
                        </div>

                        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
                    </div>

                    <div className="flex gap-4 justify-start">
                        <button
                            onClick={handleCreateNetwork}
                            disabled={isLoading}
                            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 ${isLoading ? 'disabled:bg-zinc-600 disabled:cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <FaNetworkWired />
                            Create Network
                        </button>
                    </div>
                </div>
            );
        }

        // Creating network in progress
        if (setupStage === "creating") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Creating Your Network</h2>

                    <div className="mb-6">
                        <div className="w-full bg-zinc-700 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 animate-pulse"
                                style={{ width: "60%" }}
                            ></div>
                        </div>

                        <div className="mt-4 text-zinc-300">
                            <div className="flex items-center gap-2">
                                <FaEthereum className="text-blue-400 animate-pulse" />
                                <span>Creating Sepolia fork with Tenderly VirtualNet...</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Setup complete - display network info
        if (setupStage === "complete" && networkInfo) {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Setup Complete!</h2>

                    <div className="mb-6 p-4 bg-zinc-700 rounded">
                        <h3 className="font-medium text-lg mb-2">Your Virtual Network</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-zinc-400">RPC URL:</span> {networkInfo.rpcUrl}</p>
                            <p><span className="text-zinc-400">Chain ID:</span> {networkInfo.chainId}</p>
                            {networkInfo.networkId && (
                                <p><span className="text-zinc-400">Network ID:</span> {networkInfo.networkId}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={addNetworkToWallet}
                                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaWallet />
                                Add to Wallet
                            </button>

                            <button
                                onClick={useNewNetwork}
                                className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaRedo />
                                Restart Virtual Network Setup
                            </button>
                        </div>

                        <button
                            onClick={startChallenge}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Start Challenge
                        </button>
                    </div>
                </div>
            );
        }

        // Setup error
        if (setupStage === "error") {
            return (
                <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">Setup Error</h2>

                    <div className="p-4 bg-red-900/30 border border-red-800 rounded text-red-200 mb-6">
                        {error || "An unexpected error occurred during setup."}
                    </div>

                    <button
                        onClick={resetSetup}
                        className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition cursor-pointer"
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
                    Tenderly Network Setup
                </h1>
                <p className="text-lg text-gray-300">
                    Set up your Ethereum practice environment to safely learn transaction signing
                    without risking real assets.
                </p>
            </div>

            {renderContent()}
        </div>
    );
}