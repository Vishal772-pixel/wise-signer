"use client";

import { FaArrowLeft, FaArrowRight, FaLock } from "react-icons/fa";
import { FakeWebsiteComponentProps } from "@/types";
import BrowserNavBar from "@/components/fakeWebsites/BrowserNavBar";

const TITLE = "OpenSea";
const URL = "https://opensea.io";

export default function Opensea({
    fakeWebsiteEdition,
    primaryButtonText = "Connect Wallet",
    onPrimaryButtonClick,
    buttonDisabled = false,
}: FakeWebsiteComponentProps) {
    return (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-8 relative">
            <BrowserNavBar url={URL} />

            {/* Website Content */}
            <div className="relative">
                {/* Header Image */}
                <div className="w-full h-40 bg-gradient-to-r from-purple-400 via-blue-300 to-purple-300 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-4xl font-bold opacity-80">
                            {/* Header content can go here */}
                        </div>
                    </div>
                </div>

                {/* Website Content */}
                <div className="p-8">
                    {TITLE && <h2 className="text-3xl font-bold mb-6 text-gray-900">{TITLE}</h2>}

                    {/* Now content can be a React component from fakeWebsites folder */}
                    <div className="fake-website-content">
                        <p className="mb-4 text-gray-700">
                            You do not need an account to view the event, or submit feedback, or receive schedule updates. You'll only need an account if you participate in the event as speaker or as an organiser.
                        </p>

                        <p className="mb-8 text-gray-700">
                            If you already created a proposal for a different event on this server, you can re-use your account to log in for this event.
                        </p>

                        {fakeWebsiteEdition > 1 && (
                            <p className="text-sm text-red-500 mb-4">
                                Edition {fakeWebsiteEdition}.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onPrimaryButtonClick}
                        disabled={buttonDisabled}
                        className={`px-6 py-2 ${buttonDisabled ? 'bg-purple-300' : 'bg-purple-500 hover:bg-purple-600'} text-white rounded-md transition`}
                    >
                        {primaryButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}