"use client";

import { useState } from "react";
import { FaLock, FaChevronDown, FaTimes, FaChevronUp, FaCopy } from "react-icons/fa";
import { SignatureDetails, TransactionDetails, WalletType } from "@/types";
import ChainButton from "@/components/ChainButton";
import TrezorScreens, { TrezorScreensProps, CHUNK_SIZE } from "@/components/wallets/TrezorScreens";

// Type guard to check if the data is a SignatureDetails
const isSignatureDetails = (data: any): data is SignatureDetails => {
    return data && 'requestFrom' in data && 'message' in data;
};

// Type guard to check if the data is a TransactionDetails
const isTransactionDetails = (data: any): data is TransactionDetails => {
    return data && 'fromAccount' in data && 'toAccount' in data;
};

// Interface for wallet popup props
interface WalletPopupProps {
    isOpen: boolean;
    onClose: () => void;
    walletType: WalletType;
    transactionOrSignatureDetails: TransactionDetails | SignatureDetails;
    onConfirm?: () => void;
    onReject?: () => void;
    safeRequiresAdditionalConfirmation?: boolean;
    safeAdditionalWalletType?: WalletType;
    networkName?: string;
}

const WalletPopupComponent = ({
    isOpen,
    onClose,
    onConfirm = () => { },
    onReject = () => { },
    walletType = "metamask",
    transactionOrSignatureDetails,
    safeAdditionalWalletType = "metamask",
}: WalletPopupProps) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    // State for Trezor screen navigation
    const [currentTrezorScreen, setCurrentTrezorScreen] = useState(0);
    // New state for transaction dropdown expanded state
    const [expandedTransactions, setExpandedTransactions] = useState<Record<number, boolean>>({});

    if (!isOpen) return null;

    // Determine the type of details we're dealing with
    const isSignature = isSignatureDetails(transactionOrSignatureDetails);
    const isTransaction = isTransactionDetails(transactionOrSignatureDetails);
    let networkName = "";
    if (isTransaction) {
        networkName = transactionOrSignatureDetails.networkName || "Ethereum Mainnet";
    }

    // Calculate total Trezor screens based on content type directly
    const totalTrezorScreens = (() => {
        if (isTransaction) {
            return 4; // 4 screens for transaction flow
        } else if (isSignature) {
            const signatureDetails = transactionOrSignatureDetails as SignatureDetails;
            // Estimate number of message screens needed (1 intro + message chunks + 1 confirmation)
            const messageLength = signatureDetails.message.length;
            const estimatedChunks = Math.ceil(messageLength / CHUNK_SIZE);
            return estimatedChunks + 2; // +2 for intro and confirmation screens
        }
        return 4; // Default fallback
    })();

    // Handle Trezor screen navigation
    const handleTrezorNavigation = (direction: 'next' | 'prev') => {
        if (direction === 'next' && currentTrezorScreen < totalTrezorScreens - 1) {
            setCurrentTrezorScreen(currentTrezorScreen + 1);
        } else if (direction === 'prev' && currentTrezorScreen > 0) {
            setCurrentTrezorScreen(currentTrezorScreen - 1);
        }
    };

    // New function to toggle transaction expansion
    const toggleTransaction = (index: number) => {
        setExpandedTransactions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Different UI elements based on wallet type
    const renderWalletHeader = () => {
        switch (walletType) {
            case "metamask":
                return (
                    <div className="flex items-center">
                        <div className="mr-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden">
                            <svg width="28" height="28" viewBox="0 0 318 318" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M274.1 35.5L174.6 109.4L193 65.8L274.1 35.5Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M44.4 35.5L143.1 110.1L125.6 65.8L44.4 35.5Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M238.3 206.8L211.8 247.4L268.5 263L284.8 207.7L238.3 206.8Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M33.9 207.7L50.1 263L106.8 247.4L80.3 206.8L33.9 207.7Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M103.6 152.5L87.9 180.9L144.1 184.2L142.1 123.6L103.6 152.5Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M214.9 152.5L175.9 122.9L174.6 184.2L230.7 180.9L214.9 152.5Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M106.8 247.4L140.6 230.9L111.4 208.1L106.8 247.4Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M177.9 230.9L211.8 247.4L207.1 208.1L177.9 230.9Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-medium text-xl text-gray-900">MetaMask</span>
                    </div>
                );
            case "safeWallet":
                return (
                    <div className="flex items-center">
                        <div className="mr-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaLock className="text-white text-xs" />
                        </div>
                        <span className="font-medium text-xl text-gray-900">Safe</span>
                    </div>
                );
            case "trezor":
                return (
                    <div className="flex items-center">
                        <div className="mr-2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <FaLock className="text-white text-xs" />
                        </div>
                        <span className="font-medium text-xl text-gray-900">Trezor</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center">
                        <div className="mr-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <FaLock className="text-gray-600 text-xs" />
                        </div>
                        <span className="font-medium text-xl text-gray-900">Wallet</span>
                    </div>
                );
        }
    };

    // Render transaction-specific content
    const renderTransactionWallet = (transactionDetails: TransactionDetails) => {
        return (
            <>
                {transactionDetails.upgradeAccount && (
                    <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-700 mb-1">Type: Smart Account</div>
                        <div className="text-sm font-mono text-gray-800">{transactionDetails.upgradeAccount}</div>
                        <div className="mb-2">
                            <span className="text-xs text-gray-500">Function:</span>
                            <span className="text-xs font-mono ml-2 text-gray-800 break-all">{transactionDetails.functionName}</span>
                        </div>
                    </div>
                )}

                <div className="mb-3">
                    <div className="text-sm text-gray-500 mb-1">From (your account)</div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mr-2"></div>
                        <span className="text-sm font-mono text-gray-800">{transactionDetails.fromAccount}</span>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="text-sm text-gray-500 mb-1">To</div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-2"></div>
                        <span className="text-sm font-mono text-gray-800">{transactionDetails.toAccount}</span>
                    </div>
                </div>

                <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-700">Amount</span>
                    <span className="text-sm font-medium text-gray-900">{transactionDetails.amount}</span>
                </div>

                <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-700">Estimated fee</span>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{transactionDetails.estimatedFee.usd}</div>
                        <div className="text-xs text-gray-500">{transactionDetails.estimatedFee.eth}</div>
                    </div>
                </div>

                {/* Details view button or transactions list */}
                {Array.isArray(transactionDetails.data) ? (
                    <div className="mb-4">
                        {transactionDetails.data.map((txData, index) => (
                            <div key={index} className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleTransaction(index)}
                                    className="cursor-pointer w-full text-left p-3 bg-white flex items-center justify-between"
                                >
                                    <span className="font-medium text-gray-800">Transaction {index + 1}</span>
                                    <FaChevronUp className="text-gray-500" />
                                </button>

                                {expandedTransactions[index] && (
                                    <div className="p-0">
                                        {/* Show contract address if available */}
                                        {transactionDetails.contracts && transactionDetails.contracts[index] && (
                                            <div className="p-3 border-t border-gray-200">
                                                <div className="flex items-start mb-1">
                                                    <span className="text-sm text-gray-600">Interacting with</span>
                                                </div>
                                                <div className="w-full bg-gray-900 text-white px-4 py-2 rounded-full text-base break-all">
                                                    {transactionDetails.contracts[index]}
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-gray-100 p-4 border-t border-gray-200">
                                            <div className="font-mono text-xs text-gray-800 break-all">
                                                {txData}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mb-4">
                        <button
                            onClick={() => setShowTransactionDetails(!showTransactionDetails)}
                            className="cursor-pointer w-full text-blue-600 text-sm border border-blue-600 rounded-md px-3 py-1 flex items-center justify-center"
                        >
                            View details <FaChevronDown className={`ml-1 text-xs transition-transform duration-200 ${showTransactionDetails ? 'transform rotate-180' : ''}`} />
                        </button>

                        {showTransactionDetails && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <div className="mb-2">
                                    <span className="text-xs text-gray-500">Function:</span>
                                    <span className="text-xs font-mono ml-2 text-gray-800 break-all">{transactionDetails.functionName}</span>
                                </div>

                                {transactionDetails.params && transactionDetails.params.length > 0 && (
                                    <div className="mb-2">
                                        {transactionDetails.params.map((param, index) => (
                                            <div key={index} className="flex items-start mt-2">
                                                <span className="text-xs text-gray-500 whitespace-nowrap mr-2">Param #{index + 1}</span>
                                                <span className="text-xs font-mono text-gray-800 break-all bg-gray-100 px-2 py-1 rounded flex-1">
                                                    {param}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <span className="text-xs text-gray-500">Data:</span>
                                    <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-xs text-gray-800 break-all">
                                        {transactionDetails.data}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </>)
    }

    // Render signature-specific content
    const renderSignatureWallet = (signatureDetails: SignatureDetails) => {
        return (
            <>
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                    <div className="text-sm font-medium text-yellow-800 mb-1">Signature Request</div>
                    <div className="text-sm text-gray-700">
                        From: <span className="font-medium">{signatureDetails.requestFrom}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-sm text-gray-700 mb-2">Message to sign:</div>
                    <pre className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 whitespace-pre-wrap break-words font-sans">
                        {signatureDetails.message}
                    </pre>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                    <p>This signature will not send a transaction or cost any gas fees.</p>
                </div>
            </>
        );
    };

    // Render the Trezor device UI for transactions
    const renderTrezorTransactionUI = () => {
        if (!isTransaction) return null;

        return (
            <TrezorScreens
                transactionDetails={transactionOrSignatureDetails as TransactionDetails}
                currentScreen={currentTrezorScreen}
                onNavigate={handleTrezorNavigation}
                onSignTransaction={onConfirm}
                onRejectTransaction={onReject}
                mode="transaction"
                totalScreens={totalTrezorScreens}
            />
        );
    };

    // Render the Trezor device UI for signatures
    const renderTrezorSignatureUI = () => {
        if (!isSignature) return null;

        return (
            <TrezorScreens
                signatureDetails={transactionOrSignatureDetails as SignatureDetails}
                currentScreen={currentTrezorScreen}
                onNavigate={handleTrezorNavigation}
                onSignMessage={onConfirm}
                onRejectMessage={onReject}
                mode="signature"
                totalScreens={totalTrezorScreens}
            />
        );
    };

    // Render the primary wallet popup
    const renderPrimaryWallet = () => {
        return (
            <div
                className="fixed inset-0 flex items-start justify-center pt-16 px-4 z-50"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
            >
                <div className={`w-full ${walletType === "trezor" ? "max-w-lg" : "max-w-md"} bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]`}>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                        {renderWalletHeader()}
                        <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-500">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* For Trezor wallet, show special device UI */}
                    {walletType === "trezor" && isTransaction ? (
                        <div className="overflow-y-auto">
                            {renderTrezorTransactionUI()}
                        </div>
                    ) : walletType === "trezor" && isSignature ? (
                        <div className="overflow-y-auto">
                            {renderTrezorSignatureUI()}
                        </div>
                    ) : (
                        <div className="flex flex-col overflow-hidden">
                            <div className="p-4 flex-1 overflow-y-auto">
                                <div className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {isSignature ? "Sign message" : "Confirm transaction"}
                                    </h3>
                                    <div className="text-sm text-gray-500">{networkName}</div>
                                </div>

                                {/* Render content based on type */}
                                {isTransaction && renderTransactionWallet(transactionOrSignatureDetails as TransactionDetails)}
                                {isSignature && renderSignatureWallet(transactionOrSignatureDetails as SignatureDetails)}
                            </div>

                            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                                <div className="flex gap-3">
                                    <ChainButton
                                        onClick={onReject}
                                        className="bg-white text-black hover:bg-gray-50 hover:text-gray-800 border border-gray-300"
                                    >
                                        Reject
                                    </ChainButton>
                                    <ChainButton
                                        onClick={() => onConfirm()}
                                        className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border border-blue-600"
                                    >
                                        {isSignature
                                            ? "Sign"
                                            : "Confirm"}
                                    </ChainButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render the appropriate wallet popup(s)
    return (
        <>
            {renderPrimaryWallet()}
        </>
    );
};

export default WalletPopupComponent;