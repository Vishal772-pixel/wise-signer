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
        question: `This transaction requires your Trezor hardware wallet. You're attempting to send your friend \`0x70997970C51812dc3A010C7d01b50e0d17dc79C8\` \`0.5 ETH\`. Assume your wallet is \`${YOUR_WALLET}\`. Should you execute it?`,
        type: "signOrReject",
        expectedAction: "reject",
        walletType: "trezor",
        interactionButtonText: "Transfer",
        fakeWebsiteType: "SendEth",
        fakeWebsiteEdition: 1,
        feedbackContent: {
            pages: [

            ]
        },
        transactionOrSignatureData: {
            fromAccount: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            toAccount: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
            amount: "5 ETH",
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
        question: "You need to approve a multi-signature treasury transaction. Should you sign it?",
        type: "signOrReject",
        expectedAction: "sign",
        walletType: "safeWallet",
        interactionButtonText: "Review Safe Transaction",
        fakeWebsiteType: "Uniswap",
        fakeWebsiteEdition: 1,
        feedbackContent: {
            pages: [
                "You should sign this transaction. This is a legitimate transaction from your DAO's Safe wallet to fund a project that was approved by governance.",
                "Notice how Safe wallets provide additional security through their multi-signature requirement. This transaction needs 3 out of 5 signatures to execute.",
                "Safe wallets are commonly used by DAOs and organizations to manage treasury funds, as they prevent any single person from controlling the funds. Always verify the destination and amount before signing."
            ]
        },
        transactionOrSignatureData: {
            fromAccount: "0xDAOTreas...F3a4",
            toAccount: "0xProject...c532",
            amount: "5 ETH",
            estimatedFee: {
                usd: "$4.87",
                eth: "0.00234ETH"
            },
            functionName: "transfer(address,uint256)",
            data: "0xa9059cbb000000000000000000000000bac40c08f8a42071dcd3cc52569eb7b58f04b31a0000000000000000000000000000000000000000000000004563918244f40000",
            safeThreshold: 3,
            safeConfirmations: 2,
            safeRequiresAdditionalConfirmation: true,
            safeAdditionalWalletType: "metamask"
        }
    },
    // The phishing question from the original code
    {
        id: 7,
        question: "If this is a phishing site, then what's the phishing transaction attempting to do?",
        type: "multi",
        options: [
            { id: "A", text: "Interact with the DAI smart contract" },
            { id: "B", text: "Instantly transfer all my funds to an attacker" },
            { id: "C", text: "Approve an attacker to spend all my DAI" },
            { id: "D", text: "Approve an attacker to spend all my ETH" },
        ],
        correctAnswers: ["A", "C"],
        feedbackContent: {
            pages: [
                "We have to analyze the transaction's target and details to understand what it's doing. While experts could do this, most users don't check — or don't understand — the data field of transactions.",
                "So what can you do?\n• Double-check websites before connecting your wallet.\n• Avoid signing transactions on suspicious websites.\n• Be aware of the risks of signing transactions you don't fully understand.\n• Only use wallets that provide risk alerts and user-friendly messages when sending transactions.",
                "Always verify the website and transaction before signing. If something looks suspicious, it probably is!"
            ]
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