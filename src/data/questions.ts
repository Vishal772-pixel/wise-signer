// Import shared types
import { WalletType, TransactionDetails, FeedbackContent, FakeWebsiteType, SignatureDetails } from "@/types";

// Define question types for TypeScript
export interface BaseQuestionData {
    id: number;
    question: string;
    feedbackContent: FeedbackContent;
    fakeWebsiteType?: FakeWebsiteType;
    fakeWebsiteEdition?: number;
    questionContext?: string;
}

export interface MultiChoiceQuestionData extends BaseQuestionData {
    type: "single" | "multi";
    options: { id: string; text: string }[];
    correctAnswers: string[];
}

export interface SignOrRejectQuestionData extends BaseQuestionData {
    type: "signOrReject";
    expectedAction: "sign" | "reject";
    walletType: WalletType;
    interactionButtonText: string;
    // Wallet transaction data
    transactionOrSignatureData: TransactionDetails | SignatureDetails;
    wrongAnswerPopupContent?: string;
}


export const ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3 = "0x9F07eEBdf3675f60dCeC65a092F1821Fb99726F3"
export const FRIEND_WALLET = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
export const YOUR_WALLET = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const MULTI_SIGNATURE_WALLET = "0x4087d2046A7435911fC26DCFac1c2Db26957Ab72"
const ARBITRUM_WETH = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"

export type QuestionData = MultiChoiceQuestionData | SignOrRejectQuestionData;

export const questions: QuestionData[] = [
    {
        "id": 1,
        "question": "What's the security trade off between using a browser wallet (ie. Metamask, Rabby, Phantom) and a hardware wallet (ie. Trezor, Ledger, Grid+)?",
        "type": "single",
        "options": [
            { "id": "A", "text": "Browser wallets offer stronger security because they're directly connected to blockchain networks, while hardware wallets rely on physical devices that can break or be lost." },
            { "id": "B", "text": "Hardware wallets offer stronger security because they're physically separated from your computer and can operate offline most of the time, making them more resistant to malware attacks." },
            { "id": "C", "text": "Browser and hardware wallets offer identical security; the only difference is convenience and cost." },
            { "id": "D", "text": "Hardware wallets are less secure because they require trust in the manufacturer, while browser wallets are open-source and can be verified by the community." }
        ],
        "correctAnswers": ["B"],
        "feedbackContent": {
            "pages": [
                "The key security difference between browser wallets and hardware wallets is their physical separation from your computer and connection to the internet.",
                "Browser wallets (like MetaMask, Rabby, Phantom) operate directly within your internet-connected browser or computer environment. This makes them inherently vulnerable to malware, phishing attacks, and browser vulnerabilities that could compromise your private keys.",
                "Hardware wallets (like Trezor, Ledger, Grid+) offer stronger security because they're physically separated from your computer on a hardware level. While some hardware wallets can connect to the internet, they remain disconnected most of the time, significantly reducing the attack surface. This ability to operate offline makes them much more resistant to malware attacks compared to browser wallets.",
                "Option A is incorrect because browser wallets' constant connection to the internet is actually a security weakness, not a strength. While hardware devices can be lost or damaged, they typically come with recovery phrases that can restore your wallet.\n\nOption C is incorrect because there is a significant security difference between the two types of wallets - hardware wallets' physical separation and ability to remain offline provides substantially better protection against malware.\n\nOption D is incorrect because while manufacturer trust is a consideration, the security benefit of having a physically separate device that can operate offline far outweighs potential trust issues with manufacturers. Additionally, many hardware wallets are also open-source."
            ]
        }
    },
    {
        "id": 2,
        "question": "What are the benefits, and trade-offs of a multi-signature wallet (ie. Safe{Wallet}) over a hardware or a software wallet?",
        "type": "multi",
        "options": [
            { "id": "A", "text": "Multi-signature wallets enhance security by requiring multiple approvals for transactions, preventing a single compromised key from causing loss of funds." },
            { "id": "B", "text": "Multi-signature wallets only work on a single blockchain, whereas hardware and software wallets often have a private key that works across multiple chains." },
            { "id": "C", "text": "Multi-signature wallets eliminate the need for key backup procedures as the distributed nature of keys means individual key loss doesn't compromise the wallet." },
            { "id": "D", "text": "Multi-signature wallets can introduce delays in transaction processing due to the requirement for multiple parties to approve transactions." }
        ],
        "correctAnswers": ["A", "B", "D"],
        "feedbackContent": {
            "pages": [
                "Multi-signature wallets provide enhanced security through distributed control. By requiring multiple parties to approve transactions (e.g., 2-of-3 or 3-of-5 signatures), they prevent a single compromised key or malicious actor from transferring funds. This distributed security model is particularly valuable for high-value assets or organizational funds.",

                "A significant limitation of multi-signature wallets is their chain-specific implementation. Unlike hardware or software wallets where a single private key can be used across multiple blockchains, multi-sig wallets like Safe{Wallet} typically only work on a specific blockchain or ecosystem. Separate multi-sig setups would be needed for different chains.",

                "Option C is incorrect. Multi-signature wallets do NOT eliminate the need for key backup procedures. While they provide redundancy through the m-of-n signature scheme (meaning you can lose some keys and still access funds), each key holder must still properly back up their keys. If too many keys are lost and the signature threshold can no longer be met, funds could become permanently inaccessible.",

                "Multi-signature wallets introduce coordination overhead and potential delays in transaction processing. Since multiple parties need to review and approve transactions, this can slow down operational efficiency, especially when signers are in different time zones or have varying availability. This is a trade-off between security and transaction speed."
            ]
        }
    },
    {
        id: 3,
        question: "Sign or reject this signature.",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}. You want to sign into Opensea to see your NFTs. Will signing this accomplish that? If so, please sign, otherwise reject.`,
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "metamask",
        interactionButtonText: "Sign in with Ethereum",
        fakeWebsiteType: "OpenSea",
        fakeWebsiteEdition: 1,
        wrongAnswerPopupContent: "Oops! You allowed this site to impersonate you on Gnosis Pay!",
        feedbackContent: {
            pages: [
                "You should reject this signature! Even though you're on what appears to be OpenSea, the signature is requesting you to authenticate with app.gnosispay.com, not opensea.io.\nThis is a common phishing technique called 'domain spoofing' where the attacker presents a message that looks legitimate but actually authorizes login to a completely different website.",
                "Notice the mismatch: The website appears to be opensea.io (as shown in requestFrom), but the signature message is requesting authentication for app.gnosispay.com. This is a major red flag.\n\nIf you had signed this message, you would have authenticated to Gnosis Pay with your wallet, potentially giving attackers access to your funds or allowing them to impersonate you on that platform.\n\nAlways carefully check the actual domain in the message content before signing. The domain in the message should match the site you're actually trying to use.",
            ]
        },
        transactionOrSignatureData: {
            requestFrom: "opensea.io",
            message: `app.gnosispay.com/ wants you to sign in with your account:
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

URI: https://app.gnosispay.com
Version: 1
Chain ID: 100
Nonce: 8dc58hp767of54o1uptoe76v2r
Issued At: ${new Date().toISOString()}`
        }
    },
    {
        id: 4,
        question: `Execute or reject this transaction.`,
        questionContext: `This transaction requires your Trezor hardware wallet. You're attempting to send your friend \`0x70997970C51812dc3A010C7d01b50e0d17dc79C8\` \`0.5 ETH\` on the Ethereum chain. Assume your wallet is \`${YOUR_WALLET}.\``,
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "trezor",
        interactionButtonText: "Transfer",
        fakeWebsiteType: "SendEth",
        fakeWebsiteEdition: 1,
        feedbackContent: {
            pages: [
                "It's good to sign this transaction! This appears to be a legitimate ETH transfer to your friend's address.\nEven though the website gave the wrong information, the information on the actual wallet is correct.",
                "When evaluating a transaction, consider these key factors which were all aligned here:\n\n1. Expected action: You intended to send ETH to your friend\n2. Correct recipient: The address matches your friend's known address\n3. Reasonable amount: The amount (0.5 ETH) matches what you intended to send\n4. Appropriate network fee: The gas fees look reasonable for an ETH transfer\n5. Transaction origin: You initiated this transaction yourself from a trusted interface\n6. Hardware wallet verification: Your Trezor showed the same transaction details as the website",
                "Using a hardware wallet like Trezor provides an additional security layer, as it lets you verify transaction details on a separate secure device. Always verify that the recipient address and amount match what you expect before confirming any transaction.\n\n\nAdditionally, `m/44'/60'/0'/0/0` is the standard derivation path for Ethereum accounts.This means that the transaction is being sent from your first Ethereum account, which is what you expect.",
            ]
        },
        transactionOrSignatureData: {
            fromAccount: `${YOUR_WALLET}`,
            toAccount: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            amount: "0.5 ETH",
            estimatedFee: {
                usd: "$4.52",
                eth: "0.00198ETH"
            },
            functionName: "",
            data: ""
        }
    },
    {
        id: 5,
        question: "Execute or reject this transaction.",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}. You want to deposit 1 ETH into Aave to begin gaining interest on the ZKsync Era network. Will signing this accomplish that? If so, please sign, otherwise reject.`,
        type: "signOrReject",
        expectedAction: "reject",
        wrongAnswerPopupContent: "Oh no!\n\nYou just deposited ETH in Aave for someone else!",
        walletType: "metamask",
        interactionButtonText: "Deposit ETH",
        fakeWebsiteType: "Aave",
        fakeWebsiteEdition: 1,
        feedbackContent: {
            pages: [
                `The following were correct on this transaction:
                
                1. Address: It is the correct ZKsync Era Aave contract.
                2. Correct amount: The amoount of ETH is the amount you want to deposit.
                3. Website: You initiated this transaction yourself from a trusted website URL.
However, the transaction calldata is not correct!
This could happen if the Aave UI is compromised. Website interfaces compromises unfourtunately are all too common.`,
                `For this transaction, the calldata was: 

\`\`\`bash
0x474cf53d000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f0000000000000000000000000000000000000000000000000000000000000000
\`\`\` 

and if we decode this with [foundry's cast tool](https://book.getfoundry.sh/):

\`\`\`bash
cast calldata-decode "depositETH(address,address,uint16)" 0x474cf53d000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f0000000000000000000000000000000000000000000000000000000000000000
\`\`\`

We get: 

\`\`\`bash
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f # Wrong!!
0
\`\`\`

The second parameter stands for \`onbehalfOf\`, meaning we are depositing ETH for someone else. It should match our wallet address, and it does not!`,
            ]
        },
        transactionOrSignatureData: {
            networkName: "ZKsync Era",
            fromAccount: YOUR_WALLET,
            toAccount: ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3,
            amount: "1 ETH",
            estimatedFee: {
                usd: "$0.02",
                eth: "0.00004ETH"
            },
            functionName: "function depositETH(address,address,uint16)",
            data: "0x474cf53d000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f0000000000000000000000000000000000000000000000000000000000000000",
        }
    },
    {
        id: 6,
        question: "Sign or reject this signature.",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}, and you are a signer on a valid mutlisig wallet at address ${MULTI_SIGNATURE_WALLET}. You are attempting to send 1 WETH to address: ${FRIEND_WALLET}. On the Arbitrum network. Please sign or reject this transaction, if doing so will bring you closer to executing.`,
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "metamask",
        interactionButtonText: "Sign",
        fakeWebsiteType: "SafeWallet",
        fakeWebsiteEdition: 1,
        feedbackContent: {
            pages: [
                `It's correct to sign this transaction. This is a valid EIP-712 structured message for a multisig transaction with Safe{Wallet} (formerly Gnosis Safe) that matches your intention to send 1 WETH to your friend's address.
When reviewing multisig transactions, you should check the EIP-712 data generated in your wallet (in this case, metamask) which all aligned in this case:

\`\`\`
1. The transaction originates from a legitimate source (app.safe.global)
2. The verifyingContract matches your multisig wallet address
3. The correct network (Arbitrum) is specified in the chainId
4. The transaction data matches your intent (sending 1 WETH)
5. There are no suspicious parameters like operation, gasToken, or refundReceiver
\`\`\``,


                `The transaction data field contains encoded information that can be decoded with tools like Foundry's cast:

\`\`\`bash
cast calldata-decode "transfer(address,uint256)" 0xa9059cbb000000000000000000000000908b2413893ed4f1518ffb9847d69f49f59aa359000000000000000000000000000000000000000000000000002386f26fc10000
\`\`\`

This decodes to:
- Function: transfer(address,uint256)
- Address: ${FRIEND_WALLET} (your friend's address)
- Amount: 0xde0b6b3a7640000 (1000000000000000000 in decimal, which equals 1 WETH)`,

                "What's important here, is that we reviewed the safeMessage that was populated in our metamask."
            ]
        },
        transactionOrSignatureData: {
            networkName: "Arbitrum",
            requestFrom: "https://app.safe.global/",
            message: `{"types":{"SafeTx":[{"type":"address","name":"to"},{"type":"uint256","name":"value"},{"type":"bytes","name":"data"},{"type":"uint8","name":"operation"},{"type":"uint256","name":"safeTxGas"},{"type":"uint256","name":"baseGas"},{"type":"uint256","name":"gasPrice"},{"type":"address","name":"gasToken"},{"type":"address","name":"refundReceiver"},{"type":"uint256","name":"nonce"}],"EIP712Domain":[{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}]},"domain":{"chainId":"42161","verifyingContract":"${MULTI_SIGNATURE_WALLET}"},"primaryType":"SafeTx","message":{"to":"${ARBITRUM_WETH}","value":"0","data":"0xa9059cbb000000000000000000000000908b2413893ed4f1518ffb9847d69f49f59aa359000000000000000000000000000000000000000000000000002386f26fc10000","operation":"0","safeTxGas":"0","baseGas":"0","gasPrice":"0","gasToken":"0x0000000000000000000000000000000000000000","refundReceiver":"0x0000000000000000000000000000000000000000","nonce":"29"}}`
        }
    },
    {
        id: 7,
        question: "Sign or reject this signature.",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}, and you are a signer on a valid mutlisig wallet at address ${MULTI_SIGNATURE_WALLET}. You are attempting to deposit 0.1 ETH to the ZKsync Aave token pool. Please sign this transaction if doing so will bring you closer to executing, otherwise reject it.`,
        wrongAnswerPopupContent: "Oh no!\n\nYou were just hit with a similar attack to what happened to Bybit ($1.4B loss!)",
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "trezor",
        interactionButtonText: "Sign",
        fakeWebsiteType: "SafeWallet",
        fakeWebsiteEdition: 2,
        feedbackContent: {
            pages: [`This is an example of what could happen if the user interface is compromised. The Message and Domain hash on the website matches what is in your Trezor, but it's a malicious message and domain hash! We can actually calculate the domain and message hash ourselves a few different ways:

- [safe-hash-rs](https://github.com/Cyfrin/safe-hash-rs)
- [safe-tx-hashes-utils](https://github.com/pcaversaccio/safe-tx-hashes-util)
- [safeutils.openzeppelin.com](https://safeutils.openzeppelin.com/)

Something else to note, is that on wallets with small screens, it can be really difficult to verify pages and pages of data. The data that we are signing is much bigger here than just sending tokens, so it's often just easier to just compare the hashes of the data we are signing instead of inspecting the entire data on our wallet.`, `No matter what tool we use, the first thing we need to do is inspect/create the JSON object that is being signed. In this case, we were signing:

\`\`\`json
{
    "types": {
        "SafeTx": [
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "bytes"
            },
            {
                "name": "operation",
                "type": "uint8"
            },
            {
                "name": "safeTxGas",
                "type": "uint256"
            },
            {
                "name": "baseGas",
                "type": "uint256"
            },
            {
                "name": "gasPrice",
                "type": "uint256"
            },
            {
                "name": "gasToken",
                "type": "address"
            },
            {
                "name": "refundReceiver",
                "type": "address"
            },
            {
                "name": "nonce",
                "type": "uint256"
            }
        ],
        "EIP712Domain": [
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ]
    },
    "domain": {
        "chainId": "0x144",
        "verifyingContract": "0x4087d2046A7435911fC26DCFac1c2Db26957Ab72"
    },
    "primaryType": "SafeTx",
    "message": {
        "to": "0x9F07eEBdf3675f60dCeC65a092F1821Fb99726F3",
        "value": "100000000000000000",
        "data": "0x474cf53d0000000000000000000000006ae43d3271ff6888e7fc43fd7321a503ff7389510000000000000000000000005031f5e2ed384978dca63306dc28a68a6fc33e810000000000000000000000000000000000000000000000000000000000000000",
        "operation": "0",
        "safeTxGas": "0",
        "baseGas": "0",
        "gasPrice": "0",
        "gasToken": "0x0000000000000000000000000000000000000000",
        "refundReceiver": "0x0000000000000000000000000000000000000000",
        "nonce": "1"
    }
}
\`\`\`

And this looks great! So we should be signing the hash associated with this data. But what happens if we calculate it? 
`, `If we save this to a file (\`file.json\`), and using the safe-hash-rs tool we run:

\`\`\`bash
safe-hash typed --file file.json
\`\`\`

We get an output of:

\`\`\`
+--------------+--------------------------------------------------------------------+
| EIP 712 Hash | 0xe1706b155a9dbe1301f3d65a63fbba3902f34b058654de304536b25e8ad43762 |
+--------------+--------------------------------------------------------------------+
| Domain Hash  | 0xe0392d263ff13e09757bfce9b182ead6ceabd9d1b404aa7df77e65b304969130 |
+--------------+--------------------------------------------------------------------+
| Message Hash | 0xbd65862028842ae4f194e32898061b00c051313f004287c45cadaa2769ca5bd9 |
+--------------+--------------------------------------------------------------------+
\`\`\`

This is different that what we saw in our Trezor wallet!!`, `It turned out, in this case, the Safe UI was compromised, and it showed us an evil hash, and sent our wallet the evil hash. They had turned the \`operation\` from a \`0\` to a \`1\`, which changed our transaction from a \`call\` to a \`delegateCall\`.

If you update your \`file.json\` to have the \`operation\` as a \`1\`, and run the same command, you will get the same hash as our Trezor wallet.`
            ]
        },
        transactionOrSignatureData: {
            networkName: "ZKsync Era",
            requestFrom: "https://app.safe.global/",
            message: `Domain Hash: 0xe0392d263ff13e09757bfce9b182ead6ceabd9d1b404aa7df77e65b304969130

Message Hash: 0x0db6e416d2b06ac70029e49612906eed8573295a11af6a69bb42413557c32632`
        }
    }
];

// Helper function to get a specific question by ID
export function getQuestionById(id: number): QuestionData | undefined {
    return questions.find(q => q.id === id);
}

// Helper function to get next question ID
export function getNextQuestionId(currentId: number): number | null {
    const currentIndex = questions.findIndex(q => q.id === currentId);
    if (currentIndex === -1 || currentIndex === questions.length - 1) {
        return null;
    }
    return questions[currentIndex + 1].id;
}

// Helper function to get previous question ID
export function getPrevQuestionId(currentId: number): number | null {
    const currentIndex = questions.findIndex(q => q.id === currentId);
    if (currentIndex <= 0) {
        return null;
    }
    return questions[currentIndex - 1].id;
}