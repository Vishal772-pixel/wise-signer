"use client";

import { TransactionDetails, SignatureDetails } from "@/types";
import { useState, useEffect } from "react";
export const CHUNK_SIZE = 200;

// Trezor wallet screens component props interface
export interface TrezorScreensProps {
  transactionDetails?: TransactionDetails;
  signatureDetails?: SignatureDetails;
  currentScreen: number;
  onNavigate: (direction: "next" | "prev") => void;
  onSignTransaction?: () => void;
  onRejectTransaction?: () => void;
  onSignMessage?: () => void;
  onRejectMessage?: () => void;
  mode: "transaction" | "signature";
  totalScreens: number;
}

const TrezorScreens = ({
  transactionDetails,
  signatureDetails,
  currentScreen,
  onNavigate,
  onSignTransaction,
  onRejectTransaction,
  onSignMessage,
  onRejectMessage,
  mode = "transaction",
  totalScreens,
}: TrezorScreensProps) => {
  const messageChunks = (() => {
    if (mode === "signature" && signatureDetails) {
      // Split the message into chunks of approximately 50 characters
      // preserving word boundaries where possible
      const message = signatureDetails.message;
      const chunks: string[] = [];

      let startIndex = 0;
      while (startIndex < message.length) {
        // Try to find a space near the chunk size limit
        let endIndex = Math.min(startIndex + CHUNK_SIZE, message.length);

        // If we're not at the end and the next char isn't a space, look for the last space
        if (endIndex < message.length && message[endIndex] !== " ") {
          const lastSpace = message.lastIndexOf(" ", endIndex);
          if (lastSpace > startIndex) {
            endIndex = lastSpace;
          }
        }

        chunks.push(message.substring(startIndex, endIndex));
        startIndex = endIndex + (message[endIndex] === " " ? 1 : 0);
      }

      return chunks;
    }
    return [];
  })();

  // Render the appropriate screen content based on current screen index
  const renderScreenContent = () => {
    // Handle signature mode
    if (mode === "signature") {
      if (!signatureDetails)
        return (
          <div className="text-white text-center">No signature details</div>
        );

      // First screen: Show requesting application
      if (currentScreen === 0) {
        return (
          <div className="text-center">
            <div className="text-white text-xl font-medium mb-1">
              Sign Message
            </div>
            <div className="text-gray-400 text-lg mb-4">Request from</div>
            <div className="text-white text-base break-all px-2">
              {signatureDetails.requestFrom}
            </div>
            <div className="mt-4 text-gray-400 text-sm">Swipe up</div>
          </div>
        );
      }

      // Last screen: Show confirmation screen
      if (currentScreen === totalScreens - 1) {
        return (
          <div className="text-center">
            <div className="text-white text-xl font-medium mb-3">
              Sign message
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-green-400 rounded-full flex items-center justify-center mb-3">
                <div className="w-12 h-12 border-2 border-green-300 rounded-full flex items-center justify-center">
                  <div className="text-xl text-white">⚙️</div>
                </div>
              </div>
              <div className="text-white text-lg">Hold to sign</div>
            </div>
          </div>
        );
      }

      // Message chunk screens
      const messageIndex = currentScreen - 1;
      if (messageIndex >= 0 && messageIndex < messageChunks.length) {
        return (
          <div className="text-center">
            <div className="text-white text-xl font-medium mb-1">Message</div>
            <div className="text-gray-400 text-sm mb-2">
              Part {messageIndex + 1}/{messageChunks.length}
            </div>
            <div className="text-white text-base break-all whitespace-pre-wrap">
              {messageChunks[messageIndex]}
            </div>
          </div>
        );
      }

      return <div className="text-white text-center">Unknown screen</div>;
    }

    // Handle transaction mode
    if (!transactionDetails)
      return (
        <div className="text-white text-center">No transaction details</div>
      );

    switch (currentScreen) {
      // Screen 1: Address/Recipient
      case 0:
        return (
          <div className="text-center">
            <div className="text-white text-xl font-medium mb-1">Address</div>
            <div className="text-gray-400 text-lg mb-4">Recipient</div>
            <div className="text-white text-base font-mono break-all px-2">
              {transactionDetails.toAccount}
            </div>
            <div className="mt-4 text-gray-400 text-sm">Swipe up</div>
          </div>
        );

      // Screen 2: Send From
      case 1:
        return (
          <div className="text-center">
            <div className="text-white text-xl font-medium mb-3">Send from</div>
            <div className="mb-3">
              <div className="text-gray-400 text-sm">Account</div>
              <div className="text-white text-lg">ETH #1</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Derivation path</div>
              <div className="text-white text-base font-mono">
                m/44'/60'/0'/0/0
              </div>
            </div>
          </div>
        );

      // Screen 3: Summary
      case 2:
        return (
          <div className="text-center">
            <div className="text-white text-xl font-medium mb-3">Summary</div>
            <div className="mb-3">
              <div className="text-gray-400 text-sm">Amount</div>
              <div className="text-white text-lg">
                {transactionDetails.amount}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Maximum fee</div>
              <div className="text-white text-base font-mono">
                {transactionDetails.estimatedFee.eth}
              </div>
            </div>
          </div>
        );

      // Screen 4: Sign Transaction
      case 3:
        return (
          <div className="text-center">
            <div className="text-white text-xl font-medium mb-3">
              Sign transaction
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-green-400 rounded-full flex items-center justify-center mb-3">
                <div className="w-12 h-12 border-2 border-green-300 rounded-full flex items-center justify-center">
                  <div className="text-xl text-white">⚙️</div>
                </div>
              </div>
              <div className="text-white text-lg">Hold to sign</div>
            </div>
          </div>
        );

      default:
        return <div className="text-white text-center">Unknown screen</div>;
    }
  };

  // Determine which action buttons to show based on mode and current screen
  const renderActionButtons = () => {
    const isLastScreen = currentScreen === totalScreens - 1;

    return (
      <div className="mt-4 flex justify-center gap-4">
        {currentScreen > 0 && (
          <button
            onClick={() => onNavigate("prev")}
            className="cursor-pointer text-black px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-lg"
          >
            Swipe Down
          </button>
        )}

        {!isLastScreen ? (
          <button
            onClick={() => onNavigate("next")}
            className="cursor-pointer text-black px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-lg"
          >
            Swipe Up
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={
                mode === "transaction" ? onRejectTransaction : onRejectMessage
              }
              className="cursor-pointer text-black px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 text-lg"
            >
              Reject
            </button>
            <button
              onClick={
                mode === "transaction" ? onSignTransaction : onSignMessage
              }
              className="cursor-pointer text-black px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-lg"
            >
              Sign
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        {/* Trezor device screen container */}
        <div className="mb-8 w-full max-w-xs mx-auto">
          {/* Black screen with content */}
          <div className="bg-black border border-white p-6 min-h-[200px] flex items-center justify-center rounded-sm">
            {renderScreenContent()}
          </div>
        </div>

        {/* Navigation buttons */}
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default TrezorScreens;
