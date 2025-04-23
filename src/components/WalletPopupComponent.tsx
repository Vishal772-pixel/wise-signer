"use client";

import { useState } from "react";
import { FaLock, FaChevronDown } from "react-icons/fa";
import { WalletType } from "@/types";

// Interface for wallet popup props
interface WalletPopupProps {
    isOpen: boolean;
    onClose: () => void;
    walletType: WalletType;
    fromAccount?: string;
    toAccount?: string;
    amount?: string;
    estimatedFee?: {
        usd: string;
        eth: string;
    };
    functionName?: string;
    transactionData?: string;
    onConfirm?: () => void;
    onReject?: () => void;
    // For SafeWallet
    safeThreshold?: number;
    safeConfirmations?: number;
    safeRequiresAdditionalConfirmation?: boolean;
    safeAdditionalWalletType?: WalletType;
}

const WalletPopupComponent = ({
    isOpen,
    onClose,
    walletType = "metamask",
    fromAccount = "0x03FdC65e...25dEA",
    toAccount = "0x6b175474...71d0f",
    amount = "0 ETH",
    estimatedFee = { usd: "$3.1902", eth: "0.00127608ETH" },
    functionName = "approve(address,uint256)",
    transactionData = "0x095ea7b3000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    onConfirm = () => { },
    onReject = () => { },
    safeThreshold = 2,
    safeConfirmations = 0,
    safeRequiresAdditionalConfirmation = false,
    safeAdditionalWalletType = "metamask"
}: WalletPopupProps) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    const [showSecondaryWallet, setShowSecondaryWallet] = useState(false);

    if (!isOpen) return null;

    // Handle confirmation for Safe wallets differently
    const handleConfirm = () => {
        if (walletType === "safeWallet" && safeRequiresAdditionalConfirmation) {
            setShowSecondaryWallet(true);
        } else {
            onConfirm();
        }
    };

    // Handle secondary wallet confirmation (for Safe)
    const handleSecondaryConfirm = () => {
        setShowSecondaryWallet(false);
        onConfirm();
    };

    // Different UI elements based on wallet type
    const renderWalletHeader = () => {
        switch (walletType) {
            case "metamask":
                return (
                    <div className="flex items-center">
                        <div className="mr-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <FaLock className="text-white text-xs" />
                        </div>
                        <span className="font-medium text-gray-900">MetaMask</span>
                    </div>
                );
            case "safeWallet":
                return (
                    <div className="flex items-center">
                        <div className="mr-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaLock className="text-white text-xs" />
                        </div>
                        <span className="font-medium text-gray-900">Safe</span>
                    </div>
                );
            case "trezor":
                return (
                    <div className="flex items-center">
                        <div className="mr-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                            <FaLock className="text-white text-xs" />
                        </div>
                        <span className="font-medium text-gray-900">Trezor</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center">
                        <div className="mr-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <FaLock className="text-gray-600 text-xs" />
                        </div>
                        <span className="font-medium text-gray-900">Wallet</span>
                    </div>
                );
        }
    };

    // Safe-specific UI elements
    const renderSafeDetails = () => {
        if (walletType !== "safeWallet") return null;

        return (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm font-medium text-blue-800 mb-2">Multi-signature wallet</div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Required confirmations:</span>
                    <span className="font-medium">{safeThreshold}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current confirmations:</span>
                    <span className="font-medium">{safeConfirmations} of {safeThreshold}</span>
                </div>
                {safeConfirmations > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                        This transaction has been proposed and signed by another owner
                    </div>
                )}
            </div>
        );
    };

    // Render the primary wallet popup
    const renderPrimaryWallet = () => {
        return (
            <div
                className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform"
                style={{
                    animation: 'slideIn 0.3s ease-out forwards'
                }}
            >
                <style jsx>{`
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                        }
                        to {
                            transform: translateX(0);
                        }
                    }
                `}</style>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    {renderWalletHeader()}
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Confirm transaction</h3>
                        <div className="text-sm text-gray-500">Ethereum mainnet</div>
                    </div>

                    {/* Render Safe-specific UI if applicable */}
                    {renderSafeDetails()}

                    <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">From (your account)</div>
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mr-2"></div>
                            <span className="text-sm font-mono text-gray-800">{fromAccount}</span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">To</div>
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm font-mono text-gray-800">{toAccount}</span>
                        </div>
                    </div>

                    <div className="flex justify-between mb-3">
                        <span className="text-sm text-gray-700">Amount</span>
                        <span className="text-sm font-medium text-gray-900">{amount}</span>
                    </div>

                    <div className="flex justify-between mb-3">
                        <span className="text-sm text-gray-700">Estimated fee</span>
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{estimatedFee.usd}</div>
                            <div className="text-xs text-gray-500">{estimatedFee.eth}</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <button
                            onClick={() => setShowTransactionDetails(!showTransactionDetails)}
                            className="w-full text-blue-600 text-sm border border-blue-600 rounded-md px-3 py-1 flex items-center justify-center"
                        >
                            View details <FaChevronDown className={`ml-1 text-xs transition-transform duration-200 ${showTransactionDetails ? 'transform rotate-180' : ''}`} />
                        </button>

                        {showTransactionDetails && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <div className="mb-2">
                                    <span className="text-xs text-gray-500">Function:</span>
                                    <span className="text-xs font-mono ml-2 text-gray-800">{functionName}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Data:</span>
                                    <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-xs text-gray-800 break-all">
                                        {transactionData}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onReject}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                        >
                            {walletType === "safeWallet" && safeConfirmations === 0
                                ? "Propose & Sign"
                                : walletType === "safeWallet"
                                    ? "Confirm"
                                    : "Sign"}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render the secondary wallet popup (for Safe transactions that need additional signature)
    const renderSecondaryWallet = () => {
        if (!showSecondaryWallet) return null;

        // Create smaller secondary wallet popup
        return (
            <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform" style={{ animation: 'slideIn 0.3s ease-out forwards' }}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    {safeAdditionalWalletType === "metamask" ? (
                        <div className="flex items-center">
                            <div className="mr-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <FaLock className="text-white text-xs" />
                            </div>
                            <span className="font-medium text-gray-900">MetaMask</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div className="mr-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                <FaLock className="text-white text-xs" />
                            </div>
                            <span className="font-medium text-gray-900">Trezor</span>
                        </div>
                    )}
                    <button onClick={() => setShowSecondaryWallet(false)} className="text-gray-400 hover:text-gray-500">
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Sign message</h3>
                        <div className="text-sm text-gray-500">Required for Safe transaction</div>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                        <p className="text-sm text-yellow-800">
                            Safe requires an additional signature to propose this transaction
                        </p>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm text-gray-700 mb-2">Message to sign:</div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono break-all">
                            {`Safe transaction: ${fromAccount.substring(0, 8)}...${fromAccount.substring(fromAccount.length - 4)}`}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowSecondaryWallet(false)}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSecondaryConfirm}
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                        >
                            Sign
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render the appropriate wallet popup(s)
    return (
        <>
            {renderPrimaryWallet()}
            {renderSecondaryWallet()}
        </>
    );
};

export default WalletPopupComponent;