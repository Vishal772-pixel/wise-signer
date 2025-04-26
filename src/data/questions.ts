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


const YOUR_WALLET = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const ZKSYNC_AAVE_WRAPPED_TOKEN_GATEWAY_V3 = "0x9F07eEBdf3675f60dCeC65a092F1821Fb99726F3"

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
        question: "Sign or Reject",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}. You want to sign into Opensea to see your NFTs. Will signing this accomplish that?`,
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
        question: `Should you execute this transaction?`,
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
        question: "Sign or reject?",
        questionContext: `Assume your wallet address is ${YOUR_WALLET}. You want to deposit 1 ETH into Aave to begin gaining interest on the ZKsync Era network. Will signing this accomplish that?`,
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
cast calldata-decode "depositEth(address,address,uint16)" 0x474cf53d000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000023618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f0000000000000000000000000000000000000000000000000000000000000000
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