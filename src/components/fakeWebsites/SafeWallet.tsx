"use client";

import { useEffect, useState } from "react";
import { FaWallet, FaCopy, FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FakeWebsiteComponentProps } from "@/types";
import BrowserNavBar from "@/components/fakeWebsites/BrowserNavBar";
import ChainButton from "@/components/ChainButton";
import { FRIEND_WALLET, ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3, YOUR_WALLET, ARBITRUM_WETH, MULTI_SIGNATURE_WALLET } from "@/data/questions";

const URL = "https://app.safe.global";

interface SiteDatas {
    [key: number]: SiteData;
}

interface SiteData {
    chainPrefix: string;
    chain: string;
    recipient: string;
    amount: string;
    wadValue: string;
    nonce: number;
    rawData: string;
    title: string;
    rawDataSize: string;
    targetContract: string;
    targetFunction: string;
    domainHash?: string;
    messageHash?: string;
    eip712Hash?: string;
}

const dataSix: SiteData = {
    "chainPrefix": "arb",
    "chain": "arbitrum",
    "recipient": FRIEND_WALLET,
    "amount": "1",
    "wadValue": "1000000000000000000",
    "nonce": 29,
    "rawData": "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000",
    "title": "Send tokens",
    "rawDataSize": "68 bytes",
    "targetContract": "WETH 1",
    "targetFunction": "transfer"
}

const dataSeven = dataSix

const dataEight: SiteData = {
    "chainPrefix": "zks",
    "chain": "zksync",
    "recipient": ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3,
    "amount": "0.1",
    "wadValue": "100000000000000000",
    "nonce": 1,
    "rawData": "0x474cf53d0000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000004087d2046a7435911fc26dcfac1c2db26957ab720000000000000000000000000000000000000000000000000000000000000000",
    "title": "Aave",
    "rawDataSize": "NONE",
    "targetContract": "WrappedTokenGatewayV3",
    "targetFunction": "depositETH",
    "domainHash": "0xe0392d263ff13e09757bfce9b182ead6ceabd9d1b404aa7df77e65b304969130",
    "messageHash": "0x02def9296d874a88cd65d1adfdb9c220a186f812113ae9a6080836932e3df670",
    "eip712Hash": "0x87414b6a2a5c6664ddbc9b79392a2fd4ac5a294a6b807b70b28641b3b8af297b"
}

// safe-hash tx --safe-address 0x4087d2046A7435911fC26DCFac1c2Db26957Ab72 --nonce 3 --safe-version 1.4.1 --chain arbitrum --to 0x82af49447d8a07e3bd95bd0d56f35241523fbab1 --data 0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000  --offline
const dataNine: SiteData = {
    "chainPrefix": "arb",
    "chain": "arbitrum",
    "recipient": ARBITRUM_WETH,
    "amount": "0.01",
    "wadValue": "10000000000000000",
    "nonce": 3,
    "rawData": "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000002386f26fc10000",
    "title": "Send tokens",
    "rawDataSize": "68 bytes",
    "targetContract": "WETH 1",
    "targetFunction": "transfer",
    "domainHash": "0x886981c7ac254ace571077f0a055e84e72dac298c286f3b83638eaa308820d082",
    "messageHash": "0xa95cd534867e78aa5866b22e278984004eca36cff555462c50be402f7b292832",
    "eip712Hash": "0x46fcaf713a45a85097ddb1b9e0fbcc247e822d2032c8f69e73685c7d8f507fa0"
}


const dataNinePointOne: SiteData = {
    "chainPrefix": "arb",
    "chain": "arbitrum",
    "recipient": FRIEND_WALLET,
    "amount": "0.01",
    "wadValue": "10000000000000000",
    "nonce": 5,
    "rawData": "0xd4d9bdcd" + dataNine["eip712Hash"]!.replace("0x", ""),
    "title": "Nested transaction:",
    "rawDataSize": "68 bytes",
    "targetContract": MULTI_SIGNATURE_WALLET,
    "targetFunction": "approveHash",
    "domainHash": "0x3269807350d9dc0089b20781ce2f4ca71614ada2a1a116d0c79a6d801e033f8d",
    "messageHash": "0x870f0b85c95ffc9657a8ba0b4fbdc43d4cca1ed8400290ab97b19b5befe51e49",
    "eip712Hash": "0xde604d0d4e6cdb1cf39e8ff1b8c3ece230c2ec921b2538d6bbdb9cae54534c06"
}

const dataTen: SiteData = {
    "chainPrefix": "zks",
    "chain": "zksync",
    "recipient": ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3,
    "amount": "0.1",
    "wadValue": "100000000000000000",
    "nonce": 1,
    "rawData": "0x474cf53d0000000000000000000000009f07eebdf3675f60dcec65a092f1821fb99726f3000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000000",
    "title": "Aave",
    "rawDataSize": "NONE",
    "targetContract": "WrappedTokenGatewayV3",
    "targetFunction": "depositETH",
    "domainHash": "0x6b7b2f6fc32adea40689c72912cf0fd00f9a2455204e0a2edfd9e5684b64db1b",
    "messageHash": "0xe0392d263ff13e09757bfce9b182ead6ceabd9d1b404aa7df77e65b304969130",
    "eip712Hash": "0xdcab1ef0579aa50678fcb3a1e815b6e7fa271ad33db76832199632fa61c47bf4"
}

const siteDatas: SiteDatas = {
    6: dataSix,
    7: dataSeven,
    8: dataEight,
    9: dataNine,
    91: dataNinePointOne,
    10: dataTen
}

function isWethSend(questionId: number): boolean {
    return questionId === 6 || questionId === 7;
}

export default function SafeWallet({
    questionId,
    primaryButtonText = "Sign",
    onPrimaryButtonClick,
    buttonDisabled = false,
}: FakeWebsiteComponentProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showTransactionDetails, setShowTransactionDetails] = useState(true);
    const [copiedText, setCopiedText] = useState("");
    const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

    // Declare state variables with proper types matching your interfaces
    const [wethSend, setWethSend] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>('');
    const [formattedAmount, setFormattedAmount] = useState<string>('');
    const [chainPrefix, setChainPrefix] = useState<string>('');
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [zeroAddress, setZeroAddress] = useState<string>('');
    const [rawDataSize, setRawDataSize] = useState<string>('');
    const [wadValue, setWadValue] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [nonce, setNonce] = useState<number>(0);
    const [targetContract, setTargetContract] = useState<string>('');
    const [targetFunction, setTargetFunction] = useState<string>('');
    const [rawData, setRawData] = useState<string>('');
    const [domainHash, setDomainHash] = useState<string | undefined>(undefined);
    const [messageHash, setMessageHash] = useState<string | undefined>(undefined);
    const [eip712Hash, setEip712Hash] = useState<string | undefined>(undefined);
    const [localQuestionId, setLocalQuestionId] = useState(questionId);

    useEffect(() => {
        setLocalQuestionId(questionId);
    }, [questionId]);

    useEffect(() => {
        if (localQuestionId && siteDatas[localQuestionId]) {
            setWethSend(isWethSend(localQuestionId));
            setAmount(siteDatas[localQuestionId].amount);
            setFormattedAmount(parseFloat(siteDatas[localQuestionId].amount).toString());
            setChainPrefix(siteDatas[localQuestionId].chainPrefix);
            setRecipientAddress(siteDatas[localQuestionId].chainPrefix + ":" + siteDatas[localQuestionId].recipient);
            setZeroAddress(siteDatas[localQuestionId].chainPrefix + ":0x0000000000000000000000000000000000000000");
            setRawDataSize(siteDatas[localQuestionId].rawDataSize);
            setWadValue(siteDatas[localQuestionId].wadValue);
            setTitle(siteDatas[localQuestionId].title);
            setNonce(siteDatas[localQuestionId].nonce);
            setTargetContract(siteDatas[localQuestionId].targetContract);
            setTargetFunction(siteDatas[localQuestionId].targetFunction);
            setRawData(siteDatas[localQuestionId].rawData);
            setDomainHash(siteDatas[localQuestionId].domainHash);
            setMessageHash(siteDatas[localQuestionId].messageHash);
            setEip712Hash(siteDatas[localQuestionId].eip712Hash);
        }
    }, [localQuestionId, siteDatas]);

    // Handle primary button click (Next)
    const handleNext = () => {
        if (!showConfirmation) {
            setShowConfirmation(true);
        }
    };

    // Toggle transaction details section
    const toggleTransactionDetails = () => {
        setShowTransactionDetails(!showTransactionDetails);
    };

    // Copy text to clipboard function
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedText(text);
                setShowCopiedTooltip(true);

                // Hide tooltip after 2 seconds
                setTimeout(() => {
                    setShowCopiedTooltip(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className="max-w-6xl mx-auto bg-[#111111] text-white rounded-lg shadow-md overflow-hidden mt-8 relative">
            <BrowserNavBar url={URL} />

            {/* Copied tooltip */}
            {showCopiedTooltip && (
                <div className="absolute top-20 right-6 bg-green-500 text-black py-2 px-4 rounded-md z-50 shadow-lg">
                    Copied to clipboard!
                </div>
            )}

            {/* Sidebar */}
            <div className="flex min-h-[600px]">
                <div className="w-64 bg-[#121212] border-r border-gray-800 p-4">
                    {/* Sidebar content */}
                    <div className="mb-6">
                        <div className="mb-4 bg-purple-100 bg-opacity-20 p-2 rounded-md">
                            <span className="text-purple-300 text-sm">
                                {chainPrefix}
                            </span>
                        </div>

                        <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mr-2 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                                {localQuestionId === 10 ? "1/3" : "2/10"}
                            </div>
                            <div>
                                <div className="text-sm">Enthusiastic {chainPrefix}...</div>
                                {localQuestionId === 91 ?
                                    // MULTI_SIGNATURE_SIGNER_WALLET
                                    <div className="text-xs text-gray-400">{chainPrefix}:0x5031...3e81</div>
                                    :
                                    // MULTI_SIGNATURE_WALLET truncated
                                    <div className="text-xs text-gray-400">{chainPrefix}:0x4087...Ab72</div>
                                }
                            </div>
                            <button className="ml-auto text-gray-400">
                                <FaChevronDown />
                            </button>
                        </div>

                        <div className="flex space-x-2 mb-6">
                            <button className="p-2 bg-[#1a1a1a] hover:bg-[#222222] rounded-md">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                                    <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                                    <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                                    <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                            <button className="p-2 bg-[#1a1a1a] hover:bg-[#222222] rounded-md">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="4" y="6" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
                                    <rect x="4" y="14" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </button>
                            <button className="p-2 bg-[#1a1a1a] hover:bg-[#222222] rounded-md">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 12H3M3 12L10 5M3 12L10 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation links */}
                    <div className="space-y-1">
                        <button className="w-full bg-green-500 text-black py-3 px-4 rounded-lg font-medium mb-4">
                            New transaction
                        </button>

                        <button className="w-full text-left flex items-center px-4 py-3 rounded-lg hover:bg-[#1a1a1a]">
                            <FaWallet className="mr-3 text-gray-400" />
                            Assets
                        </button>

                        <button className="w-full text-left flex items-center px-4 py-3 rounded-lg hover:bg-[#1a1a1a]">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400">
                                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Transactions
                        </button>

                        <button className="w-full text-left flex items-center px-4 py-3 rounded-lg hover:bg-[#1a1a1a]">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400">
                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M9 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Address book
                        </button>

                        <button className="w-full text-left flex items-center px-4 py-3 rounded-lg hover:bg-[#1a1a1a]">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400">
                                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Settings
                        </button>
                    </div>

                    {/* Bottom toggle */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="16" r="1" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-6">
                    {!showConfirmation && wethSend ? (
                        /* Transaction creation screen */
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold">New transaction</h1>
                                <div className="flex items-center text-sm">
                                    <span className="mr-2">{chainPrefix}</span>
                                    <img
                                        src="/frog-square.png"
                                        alt="Chain logo"
                                        className="w-6 h-6 rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1 bg-green-500 mb-8 rounded-full"></div>

                            {/* Transaction form */}
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 19C20 16.2386 16.4183 14 12 14C7.58172 14 4 16.2386 4 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <h2 className="text-xl font-semibold">{title}</h2>
                                    <div className="ml-auto flex items-center">
                                        <span className="text-gray-400 mr-2">Nonce #</span>
                                        <span className="bg-[#222] px-3 py-1 rounded">{nonce}</span>
                                    </div>
                                </div>

                                {/* Recipient input */}
                                <div className="mb-6">
                                    <label className="block text-green-400 mb-2 text-sm">
                                        Recipient address or ENS
                                    </label>
                                    <div className="flex items-center bg-[#222] border border-[#333] rounded-lg p-3">
                                        <div className="flex items-center flex-grow overflow-hidden">
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                                            <input
                                                type="text"
                                                value={recipientAddress}
                                                className="bg-transparent border-none focus:outline-none w-full text-ellipsis overflow-hidden"
                                                readOnly
                                            />
                                        </div>
                                        <div className="ml-2 flex-shrink-0">
                                            <button
                                                className="p-2 bg-[#222] hover:bg-[#333] rounded-md cursor-pointer"
                                                onClick={() => copyToClipboard(recipientAddress)}
                                            >
                                                <FaCopy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount input */}
                                <div className="mb-6">
                                    <label className="block text-gray-400 mb-2 text-sm flex items-center">
                                        Amount <span className="text-red-400">*</span>
                                    </label>
                                    <div className="flex">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formattedAmount}
                                                className="w-full bg-[#222] border border-[#333] rounded-l-lg p-3 focus:outline-none focus:border-blue-500"
                                                readOnly
                                            />
                                        </div>
                                        <div className="bg-[#222] border border-l-0 border-[#333] rounded-r-lg p-3 flex items-center">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-gray-600 rounded-full mr-2 flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                                                </div>
                                                <span>Wrapped Ether</span>
                                                <span className="ml-2 text-gray-400 text-sm">1 WETH</span>
                                            </div>
                                            <FaChevronDown className="ml-2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Next button */}
                                <div className="mt-8">
                                    <button onClick={handleNext} className="cursor-pointer px-8 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Transaction confirmation screen */
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold">Confirm transaction</h1>
                                <div className="flex items-center text-sm">
                                    <span className="mr-2">{chainPrefix}</span>
                                    <img
                                        src="/frog-square.png"
                                        alt="Chain logo"
                                        className="w-6 h-6 rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1 bg-green-500 mb-8 rounded-full"></div>

                            {/* Transaction confirmation */}
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 19C20 16.2386 16.4183 14 12 14C7.58172 14 4 16.2386 4 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <h2 className="text-xl font-semibold">{title}</h2>
                                    <div className="ml-auto flex items-center">
                                        <span className="text-gray-400 mr-2">Nonce #</span>
                                        <span className="bg-[#222] px-3 py-1 rounded">{nonce}</span>
                                    </div>
                                </div>

                                {/* Transaction summary */}
                                <div className="mb-6">
                                    <span className="text-gray-500 dark:text-gray-400 w-16">call </span>
                                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 text-sm">{targetFunction}</span>
                                    <span className="text-gray-500 dark:text-gray-400 mx-1">on</span>
                                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-purple-400 text-sm">{targetContract}</span>
                                    <div className="flex flex-col space-y-4 py-1">
                                        {wethSend && (
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">To</span>
                                                    <div className="flex items-center">
                                                        <span className="font-mono bg-gray-800 px-2 py-1 rounded text-base text-blue-400">
                                                            {recipientAddress}
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard(recipientAddress)}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">Amount</span>
                                                    <div className="flex items-center">
                                                        <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2"></div>
                                                        <span className="text-base">
                                                            <span className="ml-1 text-white">{amount}</span>
                                                            <span className="px-1 text-purple-400 font-medium">WETH</span>
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard(amount)}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>)
                                        }
                                        {!wethSend && (localQuestionId === 8 || localQuestionId === 10) && (
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">Value:</span>
                                                    <div className="flex items-center px-6">
                                                        <span className="font-mono bg-gray-800 px-2 py-1 rounded text-base text-blue-400">
                                                            {amount} ETH
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard(amount)}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">(address)</span>
                                                    <div className="flex items-center px-6">
                                                        <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2"></div>
                                                        <span className="text-base">
                                                            <span className="ml-1 text-white">{recipientAddress}</span>
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard(recipientAddress)}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">onBehalfOf (address)</span>
                                                    <div className="flex items-center px-6">
                                                        <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2"></div>
                                                        <span className="text-base">
                                                            <span className="ml-1 text-white">{chainPrefix + ":" + YOUR_WALLET}</span>
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard(YOUR_WALLET)}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">referralCode (uint16)</span>
                                                    <div className="flex items-center px-6">
                                                        <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2"></div>
                                                        <span className="text-base">
                                                            <span className="ml-1 text-white">0</span>
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard("0")}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {!wethSend && (localQuestionId === 9) && (
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">dst (address)</span>
                                                    <div className="flex items-center px-6">
                                                        <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2"></div>
                                                        <span className="text-base">
                                                            <span className="ml-1 text-white">{chainPrefix + ":" + FRIEND_WALLET}</span>
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard(FRIEND_WALLET)}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">wad (uint256)</span>
                                                    <div className="flex items-center px-6">
                                                        <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2"></div>
                                                        <span className="text-base">
                                                            <span className="ml-1 text-white">{wadValue}</span>
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard(wadValue)}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {!wethSend && (localQuestionId === 91) && (
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 w-16 text-base">hashToApprove (bytes32)</span>
                                                    <div className="px-16 flex items-center px-6">
                                                        <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-2"></div>
                                                        <span className="text-base">
                                                            <span className="ml-1 text-white">{siteDatas[questionId]["eip712Hash"]!}</span>
                                                        </span>
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                            onClick={() => copyToClipboard(siteDatas[questionId]["eip712Hash"]!)}
                                                        >
                                                            <FaCopy size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Transaction details */}
                                <div className="border border-gray-700 rounded-lg overflow-hidden mb-6">
                                    <div className="flex justify-between items-center p-3 bg-[#1a1a1a]">
                                        {wethSend && (<span>Transaction details</span>)}
                                        {!wethSend && (<span>Advanced details</span>)}
                                        <button
                                            onClick={toggleTransactionDetails}
                                            className="text-gray-400 hover:text-white cursor-pointer"
                                        >
                                            {showTransactionDetails ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    </div>

                                    {showTransactionDetails && wethSend && (
                                        <div className="p-4 bg-[#111]">
                                            <div className="text-xs text-gray-400 uppercase mb-1">TRANSFER</div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">dst(address):</span>
                                                <div className="flex items-center">
                                                    <span>{recipientAddress}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(recipientAddress)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-400">wad(uint256):</span>
                                                <div className="flex items-center">
                                                    <span>{wadValue}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(wadValue)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-xs text-gray-400 uppercase mb-1 flex items-center">
                                                ADVANCED DETAILS
                                                <FaInfoCircle className="ml-1" size={12} />
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-gray-400">safeTxGas:</span>
                                                <span>0</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-gray-400">baseGas:</span>
                                                <span>0</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-gray-400">refundReceiver:</span>
                                                <div className="flex items-center">
                                                    <span>{zeroAddress}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(zeroAddress)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Raw data:</span>
                                                <div className="flex items-center">
                                                    <span>{rawDataSize}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(rawData)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {showTransactionDetails && !wethSend && (
                                        <div className="p-4 bg-[#111]">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">to:</span>
                                                <div className="flex items-center">
                                                    <span>{recipientAddress}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(recipientAddress)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">value:</span>
                                                <div className="flex items-center">
                                                    <span>0</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard("0")}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">data:</span>
                                                <div className="flex items-center">
                                                    <span>{rawData.length > 20
                                                        ? `${rawData.substring(0, 18)}...${rawData.substring(rawData.length - 8)}`
                                                        : rawData}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(rawData)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">operation:</span>
                                                <div className="flex items-center">
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">safeTxGas:</span>
                                                <div className="flex items-center">
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">baseGas:</span>
                                                <div className="flex items-center">
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">gasPrice:</span>
                                                <div className="flex items-center">
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">gasPrice:</span>
                                                <div className="flex items-center">
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">gasToken:</span>
                                                <div className="flex items-center">
                                                    <span>0x0000000000000000000000000000000000000000</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard("0x0000000000000000000000000000000000000000")}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">refundReceiver:</span>
                                                <div className="flex items-center">
                                                    <span>0x0000000000000000000000000000000000000000</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard("0x0000000000000000000000000000000000000000")}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">nonce:</span>
                                                <div className="flex items-center">
                                                    <span>{nonce}</span>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-700 dark:border-gray-700 my-6"></div>

                                            <div className="text-white-400 font-bold mb-1">Transaction Hashes</div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">Domain Hash:</span>
                                                <div className="flex items-center">
                                                    <span>{domainHash}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(domainHash!)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">Message Hash:</span>
                                                <div className="flex items-center">
                                                    <span>{messageHash}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(messageHash!)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400">safeTxHash:</span>
                                                <div className="flex items-center">
                                                    <span>{eip712Hash}</span>
                                                    <button
                                                        className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                                                        onClick={() => copyToClipboard(eip712Hash!)}
                                                    >
                                                        <FaCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirmation */}
                                <div className="p-4 bg-[#1a1a1a] rounded-lg mb-6">
                                    <div className="flex items-center mb-2">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" />
                                                <path d="M15 11L11.25 15L9 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold">Confirm</span>
                                    </div>
                                    <div className="text-sm text-gray-300 ml-8">
                                        {localQuestionId === 10 ?
                                            <div>You are the only signer needed</div> :
                                            <div>You are the first signer on this transaction.</div>
                                        }
                                    </div>
                                </div>

                                {/* Action buttons */}
                                {localQuestionId === 9 ? <div>
                                    <div className="flex justify-between mt-8">
                                        <ChainButton
                                            onClick={() => { setLocalQuestionId(91) }}
                                            disabled={buttonDisabled}
                                            className={`px-8 py-3 rounded-lg ${buttonDisabled
                                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-500 text-black hover:bg-green-600'
                                                }`}
                                        >
                                            Sign (On nested Safe)
                                        </ChainButton>
                                    </div>

                                </div> :
                                    <div className="flex justify-between mt-8">
                                        <button
                                            onClick={() => {
                                                setLocalQuestionId(questionId)
                                            }}
                                            className="px-8 py-3 bg-[#222] hover:bg-[#333] rounded-lg cursor-pointer"
                                        >
                                            Back
                                        </button>

                                        <ChainButton
                                            onClick={onPrimaryButtonClick}
                                            disabled={buttonDisabled}
                                            className={`px-8 py-3 rounded-lg ${buttonDisabled
                                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-500 text-black hover:bg-green-600'
                                                }`}
                                        >
                                            {primaryButtonText}
                                        </ChainButton>
                                    </div>
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}