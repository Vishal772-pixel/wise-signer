"use client";

import Link from "next/link";
import React, { ReactNode, ElementType } from "react";
import {
  FaShieldAlt,
  FaExchangeAlt,
  FaFileSignature,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaExternalLinkAlt,
  FaListAlt,
  FaInfoCircle,
  FaEye,
  FaFileCode,
  FaNetworkWired,
} from "react-icons/fa";

interface SectionCardProps {
  id: string;
  title: string;
  icon: ElementType;
  children: ReactNode;
  titleColor?: string;
}

// Helper component for consistent section styling
const SectionCard = ({
  id,
  title,
  icon: Icon,
  children,
  titleColor = "text-green-400",
}: SectionCardProps) => (
  <section
    id={id}
    className="bg-zinc-900/60 backdrop-blur-md border border-zinc-700/50 p-6 sm:p-8 rounded-xl shadow-2xl"
  >
    <div className="flex items-center gap-3 sm:gap-4 mb-6">
      <Icon size={32} className={titleColor} />
      <h2
        className={`text-2xl sm:text-3xl font-bold ${titleColor === "text-green-400" ? "text-zinc-100" : titleColor
          }`}
      >
        {title}
      </h2>
    </div>
    <div className="space-y-6 text-zinc-300 leading-relaxed text-sm sm:text-base">
      {children}
    </div>
  </section>
);

interface SubSectionProps {
  title: string;
  children: ReactNode;
  icon?: ElementType;
}

// Helper component for sub-sections
const SubSection = ({ title, children, icon: Icon }: SubSectionProps) => (
  <div>
    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-green-300 flex items-center gap-2">
      {Icon && <Icon size={20} className="text-green-300" />}
      {title}
    </h3>
    <div className="space-y-3 pl-4 border-l-2 border-zinc-700 text-zinc-400">
      {children}
    </div>
  </div>
);

interface DetailListItemProps {
  children: ReactNode;
  strongPrefix?: string;
}

// Helper for general list items
const DetailListItem = ({ children, strongPrefix }: DetailListItemProps) => (
  <li className="flex items-start gap-2">
    <FaInfoCircle size={18} className="text-sky-400 mt-1 shrink-0 opacity-70" />
    <span>
      {strongPrefix && <strong className="text-sky-300">{strongPrefix}</strong>}
      {children}
    </span>
  </li>
);

interface CheckListItemProps {
  children: ReactNode;
}

// Helper for checklist items
const CheckListItem = ({ children }: CheckListItemProps) => (
  <li className="flex items-start gap-2">
    <FaCheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);

interface RedFlagListItemProps {
  children: ReactNode;
}

// Helper for red flag list items
const RedFlagListItem = ({ children }: RedFlagListItemProps) => (
  <li className="flex items-start gap-2">
    <FaExclamationTriangle size={18} className="text-red-500 mt-1 shrink-0" />
    <span>{children}</span>
  </li>
);

const VerifyInteractionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIgLz4KICA8cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDAgNTYgMCAyOCAyOCAwIDEgMC01NiAwIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC4yIiBmaWxsPSJub25lIiAvPgo8L3N2Zz4=')] opacity-5"></div>

      <div className="relative px-4 sm:px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-16 sm:space-y-20">
          <header className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaShieldAlt size={72} className="text-green-400" />
                <div className="absolute inset-0 text-green-400 blur-xl opacity-50">
                  <FaShieldAlt size={72} />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Verify All Wallet Interactions
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Understanding and meticulously verifying every transaction and
              signature request is paramount in the Web3 world. This guide will
              help you navigate these interactions safely, protecting your
              assets from scams, phishing attempts, and malicious decentralized
              applications (dApps). Before signing anything, pause—inspect the
              interaction. This guide covers everything from routine
              transactions to EIP-7702 delegation.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href="#transactions"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 transition-all text-sm sm:text-base"
              >
                <FaExchangeAlt size={16} />
                <span>Transactions</span>
              </a>
              <a
                href="#signatures"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 transition-all text-sm sm:text-base"
              >
                <FaFileSignature size={16} />
                <span>Signatures</span>
              </a>
              <a
                href="#checklist"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 transition-all text-sm sm:text-base"
              >
                <FaListAlt size={16} />
                <span>Security Checklist</span>
              </a>
            </div>
          </header>

          {/* Section 1: Verifying Transactions */}
          <SectionCard
            id="transactions"
            title="Verifying Transactions (On-Chain)"
            icon={FaExchangeAlt}
          >
            <p className="mb-6">
              Transactions are actions that get recorded on the blockchain. They
              involve sending assets or interacting with smart contracts.
            </p>
            <SubSection title="Key Components to Check" icon={FaEye}>
              <ul className="space-y-2">
                <DetailListItem strongPrefix="Recipient Address (`to`): ">
                  Is this the intended contract or person? Verify on block
                  explorers (Etherscan, Polygonscan, etc.). Look for verified
                  contracts, official labels, official documentation, and transaction history.
                </DetailListItem>
                <DetailListItem strongPrefix="Value (`value`): ">
                  Is this the correct amount of native currency (ETH, MATIC)
                  you're sending? Often zero for contract interactions like
                  approvals or swaps (where tokens are moved by the contract,
                  not sent as `value`).
                </DetailListItem>
                <DetailListItem strongPrefix="Function Call / Method Name: ">
                  What action is being performed (e.g., `transfer`, `approve`,
                  `swapExactTokensForTokens`, `safeMint`)? Does it match your
                  intent?
                </DetailListItem>
                <DetailListItem strongPrefix="Data / Calldata: ">
                  Encoded instructions for the smart contract.
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-zinc-400">
                    <li>
                      Use calldata decoders to understand the parameters. (See
                      our{" "}
                      <Link
                        href="/tools"
                        className="text-sky-400 hover:text-sky-300 underline"
                      >
                        Tools page
                      </Link>{" "}
                      for decoders).
                    </li>
                    <li>
                      Do the decoded parameters (token addresses, amounts,
                      recipient addresses within the calldata) match your
                      expectations?
                    </li>
                  </ul>
                </DetailListItem>
              </ul>
            </SubSection>

            <SubSection
              title="EIP-7702 Transactions (Set Code)"
              icon={FaFileCode}
            >
              <p className="mb-3 text-zinc-300">
                EIP-7702 allows an Externally Owned Account (EOA) to temporarily
                act like a smart contract for a single transaction by setting
                its `code`. This is a powerful feature that requires careful
                verification:
              </p>
              <ul className="space-y-2">
                <DetailListItem strongPrefix="The `code` being set: ">
                  This is the MOST CRITICAL part. What smart contract logic will
                  your EOA execute?
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-zinc-400">
                    <li>
                      This code should ideally be from a trusted, audited
                      source.
                    </li>
                    <li>
                      Understand its functionality. Does it perform actions you
                      expect and consent to (e.g., batching transactions,
                      specific contract calls)?
                    </li>
                  </ul>
                </DetailListItem>
                <DetailListItem strongPrefix="The subsequent call: ">
                  After the `code` is set, your EOA will make a call using this
                  new code. Verify this call as you would any other smart
                  contract interaction (recipient, value, calldata).
                </DetailListItem>
                <DetailListItem strongPrefix="Wallet UI: ">
                  Your wallet should clearly indicate this is an EIP-7702
                  transaction and ideally provide a way to inspect or understand
                  the `code` being set (e.g., by showing its hash, linking to a
                  known source, or decoding its intended actions).
                </DetailListItem>
                <DetailListItem strongPrefix="Security Implication: ">
                  Your EOA gains smart contract capabilities for one
                  transaction. Ensure the `code` is safe and does exactly what
                  you intend, as it operates with your EOA's full authority and
                  assets. Malicious `code` could drain your wallet.
                </DetailListItem>
              </ul>
              <p className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-sm text-yellow-300">
                <FaInfoCircle size={16} className="inline mr-2 mb-0.5" />
                Think of it as temporarily lending your account's "keys" to a
                piece of code for one specific job. Make absolutely sure that
                code is trustworthy and will only do that job.
              </p>
            </SubSection>

            <SubSection
              title="Common Transaction Types & Specific Checks"
              icon={FaNetworkWired}
            >
              <ul className="space-y-3">
                <li>
                  <strong className="text-sky-300">
                    Token Approvals (`approve`, `setApprovalForAll`):
                  </strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-zinc-400">
                    <li>
                      <strong className="text-sky-300">Spender:</strong>{" "}
                      CRITICAL! Who are you giving permission to spend your
                      tokens? Ensure it's a trusted dApp/protocol.
                    </li>
                    <li>
                      <strong className="text-sky-300">
                        Amount (for `approve`):
                      </strong>{" "}
                      Be wary of unlimited approvals (`MAX_UINT256`). Consider
                      specific amounts or use tools like Revoke.cash to manage
                      approvals.
                    </li>
                    <li>
                      <strong className="text-sky-300">
                        `setApprovalForAll` (NFTs):
                      </strong>{" "}
                      Grants full control over ALL NFTs in a collection to the
                      spender. Extremely risky if the spender is malicious.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-sky-300">
                    Swaps (e.g., Uniswap):
                  </strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-zinc-400">
                    <li>
                      <strong className="text-sky-300">Router Contract:</strong>{" "}
                      Is it the official DEX router?
                    </li>
                    <li>
                      <strong className="text-sky-300">
                        Tokens & Amounts:
                      </strong>{" "}
                      Are the input/output tokens and expected amounts (or
                      `amountOutMin`) correct?
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-sky-300">NFT Mints:</strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-zinc-400">
                    <li>
                      <strong className="text-sky-300">
                        Contract Address:
                      </strong>{" "}
                      Is it the official NFT project contract?
                    </li>
                    <li>
                      <strong className="text-sky-300">Price:</strong> Does the
                      `value` field match the mint price?
                    </li>
                  </ul>
                </li>
              </ul>
            </SubSection>

            <SubSection title="Transaction Red Flags" icon={FaExclamationTriangle}>
              <ul className="space-y-2">
                <RedFlagListItem>
                  Interacting with unverified contracts or addresses with
                  suspicious activity.
                </RedFlagListItem>
                <RedFlagListItem>
                  Unexpected function names or parameters in the decoded
                  calldata.
                </RedFlagListItem>
                <RedFlagListItem>
                  Approving token spends to unknown or suspicious addresses.
                </RedFlagListItem>
                <RedFlagListItem>
                  High transaction `value` for an unfamiliar interaction.
                </RedFlagListItem>
                <RedFlagListItem>
                  Requests to send ETH/native currency to a contract for
                  "verification" or "unlocking funds" (common scam).
                </RedFlagListItem>
                <RedFlagListItem>
                  For EIP-7702, if the `code` is obfuscated, unknown, or its
                  effects are unclear.
                </RedFlagListItem>
              </ul>
            </SubSection>
          </SectionCard>

          {/* Section 2: Verifying Signatures */}
          <SectionCard
            id="signatures"
            title="Verifying Signatures (Off-Chain Messages)"
            icon={FaFileSignature}
          >
            <p className="mb-6">
              Signatures are off-chain confirmations. They don't immediately
              cause a blockchain transaction but can authorize actions, prove
              ownership, or log you into dApps.
              <strong className="text-red-400">
                NEVER sign a message you don't fully understand or from an
                untrusted source.
              </strong>
            </p>

            <SubSection
              title="Common Signature Types & What to Check"
              icon={FaEye}
            >
              <ul className="space-y-3">
                <li>
                  <strong className="text-sky-300">`personal_sign`:</strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-zinc-400">
                    <li>
                      <strong className="text-sky-300">Message Content:</strong>{" "}
                      Usually human-readable (e.g., "Sign in to ExampleApp").
                      Read it carefully.
                    </li>
                    <li>
                      <strong className="text-sky-300">Caution:</strong> Be
                      extremely wary if the message is a long hexadecimal
                      string. It could be a trick to sign a transaction hash or
                      other sensitive data.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-sky-300">
                    `eth_signTypedData` (EIP-712):
                  </strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-zinc-400">
                    <li>
                      <strong className="text-sky-300">Structured Data:</strong>{" "}
                      Presents data in a more readable, itemized format.
                    </li>
                    <li>
                      <strong className="text-sky-300">Wallet Display:</strong>{" "}
                      Your wallet should clearly show:
                      <ul className="list-disc list-inside space-y-1 pl-8 mt-1">
                        <li>
                          <strong className="text-sky-300">
                            Domain Separator:
                          </strong>{" "}
                          Info about the dApp (name, version, chain ID,
                          verifying contract). Verify this matches the dApp
                          you're using.
                        </li>
                        <li>
                          <strong className="text-sky-300">
                            Message Data:
                          </strong>{" "}
                          The actual values being signed. Read every field.
                        </li>
                        <li>
                          <strong className="text-sky-300">
                            EIP-712 Raw Data:
                          </strong>{" "}
                          The combination of the domain and message hash, this is exactly what is being signed.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong className="text-sky-300">Common Uses:</strong>{" "}
                      Gasless token approvals (`Permit` for ERC20), off-chain
                      orders, voting.
                    </li>
                    <li>
                      <strong className="text-sky-300">
                        Example - ERC20 `Permit`:
                      </strong>{" "}
                      Verify `owner` (your address), `spender` (who gets
                      approval), `value` (amount), and `deadline`. This is as
                      critical as an on-chain `approve`.
                    </li>
                  </ul>
                </li>
              </ul>
            </SubSection>

            <SubSection
              title="Verifying the Requesting dApp/Origin"
              icon={FaCheckCircle}
            >
              <ul className="space-y-2">
                <DetailListItem>
                  Ensure the signature request originates from the legitimate
                  website/dApp. Check the URL carefully.
                </DetailListItem>
                <DetailListItem>
                  For EIP-712, the `domain` data in the signature request should
                  match the dApp you believe you are interacting with.
                </DetailListItem>
              </ul>
            </SubSection>

            <SubSection title="Signature Red Flags" icon={FaExclamationTriangle}>
              <ul className="space-y-2">
                <RedFlagListItem>
                  Vague, unclear, or obfuscated messages.
                </RedFlagListItem>
                <RedFlagListItem>
                  `personal_sign` requests with long, unintelligible hexadecimal
                  strings.
                </RedFlagListItem>
                <RedFlagListItem>
                  EIP-712 messages where the `domain` doesn't match the dApp, or
                  message data is unexpected (e.g., approving large amounts to
                  an unknown `spender` via `Permit`).
                </RedFlagListItem>
                <RedFlagListItem>
                  High-pressure tactics urging you to sign quickly.
                </RedFlagListItem>
                <RedFlagListItem>
                  Unexpected signature requests when you haven't initiated an
                  action.
                </RedFlagListItem>
              </ul>
            </SubSection>
          </SectionCard>

          {/* Section 3: Security Checklist (General Best Practices) */}
          <SectionCard
            id="checklist"
            title="Wallet Security Checklist"
            icon={FaListAlt}
          >
            <ul className="space-y-3">
              <CheckListItem>
                <strong className="text-sky-300">
                  Slow Down & Be Skeptical:
                </strong>{" "}
                Don't rush. Scammers often create a false sense of urgency. If
                something feels off, it probably is.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-sky-300">Use a Hardware Wallet:</strong>{" "}
                For significant assets, a hardware wallet adds a critical layer
                of security by keeping private keys offline. Always verify
                transaction details on the hardware wallet's trusted display.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-sky-300">
                  Trusted Wallet Software & dApps:
                </strong>{" "}
                Use well-known, reputable wallet software and dApps. Keep them
                updated.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-sky-300">
                  Transaction Simulators:
                </strong>{" "}
                Tools like WalletGuard, PocketUniverse, Fire, or Tenderly Forks
                can simulate transactions to show potential outcomes *before*
                you sign. Many wallets are integrating these features.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-sky-300">
                  Verify Contract Addresses & dApp URLs:
                </strong>{" "}
                Always double-check you're interacting with the correct contract
                or official website. Bookmark trusted sites.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-sky-300">
                  Understand What You're Approving/Signing:
                </strong>{" "}
                If you don't understand it, don't approve it. Ask for
                clarification from trusted community sources if needed.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-sky-300">
                  Manage Token Approvals:
                </strong>{" "}
                Regularly review and revoke unnecessary token approvals using
                tools like Revoke.cash or Etherscan's token approval checker.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-sky-300">Beware of Phishing:</strong>{" "}
                Scammers create fake websites, send DMs, or emails impersonating
                projects or support. Never share your seed phrase or private
                keys.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-sky-300">
                  Educate Yourself Continuously:
                </strong>{" "}
                The Web3 space evolves rapidly. Stay informed about new types of
                scams and security best practices.
              </CheckListItem>
            </ul>
          </SectionCard>

          {/* Key Takeaway Section */}
          <SectionCard
            id="key-takeaway"
            title="Key Takeaway: Your Vigilance is Key"
            icon={FaLock}
            titleColor="text-sky-400"
          >
            <p className="text-lg text-zinc-200">
              Diligent verification is your best defense in the Web3 world.
              Every click, every signature, every transaction confirmation
              matters. By understanding the mechanics and potential risks, you
              can significantly enhance your wallet security and navigate the
              decentralized web with greater confidence.
            </p>
            <p className="mt-6">
              For specific tools that can aid in verification, such as calldata
              decoders, please visit our{" "}
              <Link
                href="/tools"
                className="text-sky-400 hover:text-sky-300 underline font-semibold inline-flex items-center gap-1"
              >
                Tools & Resources page <FaExternalLinkAlt size={16} />
              </Link>
              .
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default VerifyInteractionsPage;