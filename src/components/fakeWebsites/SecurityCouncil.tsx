import React, { useState } from "react";
import ChainButton from "@/components/ChainButton";
import { FakeWebsiteComponentProps } from "@/types";
import BrowserNavBar from "@/components/fakeWebsites/BrowserNavBar";

const URL = "https://security.zknation.io";

export default function ZKsyncGovernance({
  questionId,
  primaryButtonText = "Supply ETH",
  onPrimaryButtonClick,
  buttonDisabled = false,
}: FakeWebsiteComponentProps) {
  const [expanded, setExpanded] = useState({
    legalVeto: false,
    securityCouncil: true,
    guardian: false,
  });

  // Define the section types
  type SectionType = "legalVeto" | "securityCouncil" | "guardian";

  // Toggle section expansion with proper typing
  const toggleSection = (section: SectionType) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white">
      <BrowserNavBar url={URL} />
      {/* Header */}
      <header className="px-4 py-3 flex justify-between items-center bg-blue-950 bg-opacity-80">
        <div className="flex items-center">
          <div className="text-xl font-bold">ZKsync</div>
          <div className="mx-2 text-gray-400">|</div>
          <div className="text-lg">Governance Authentication</div>
        </div>

        <div className="flex items-center">
          <button className="bg-gray-700 text-white rounded-full px-6 py-2 mr-3">
            Security Council Member
          </button>
          <button className="bg-blue-600 text-white rounded-full px-5 py-2 flex items-center">
            <div className="mr-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <circle cx="12" cy="10" r="4" fill="white" />
                <path d="M5 19.5C7 14.5 17 14.5 19 19.5" fill="white" />
              </svg>
            </div>
            <span>0xc1...AD2C</span>
            <svg
              className="ml-2"
              width="12"
              height="6"
              viewBox="0 0 12 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 5L11 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-8 pb-16">
        <h1 className="text-4xl font-bold text-center mb-12">
          Protocol Upgrade Proposals
        </h1>

        {/* Back Button */}
        <div className="mb-6">
          <button className="flex items-center text-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2">Upgrade 0x3774f8d2...c53b4765b8</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upgrade Details Card */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Upgrade Details</h2>

            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-gray-400 mb-1">Upgrade ID:</span>
                <span className="font-mono break-all">
                  0x3774f8d203c4b4a7cf46c7867b c726a1350d77345c4fd8d2f92f64
                  c53b4765b8
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tally ID:</span>
                <a href="#" className="text-blue-400 flex items-center">
                  324778...554510
                  <svg
                    className="ml-1"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 5H5V19H19V14M14 5H19V10M19 5L9 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Proposed On:</span>
                <span>Feb 28, 2025, 12:16:23 PM UTC</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Executor:</span>
                <span>Anyone</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction hash:</span>
                <a href="#" className="text-blue-400 flex items-center">
                  0xa183346b...1c131a82f1
                  <svg
                    className="ml-1"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 5H5V19H19V14M14 5H19V10M19 5L9 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
              <div className="flex justify-end items-center">
                <div className="bg-gray-700 text-sm px-3 py-1 rounded-full flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading
                </div>
              </div>
            </div>
          </div>

          {/* Approval Status Card */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Approval Status</h2>
              <span className="text-red-500 font-bold">NONE</span>
            </div>

            {/* Approvals Sections */}
            <div className="space-y-4">
              {/* Legal Veto Section */}
              <div className="border-b border-gray-800 pb-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection("legalVeto")}
                >
                  <span className="text-lg">Extend Legal Veto Approvals</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-400">0/2</span>
                    <svg
                      className={`transform ${expanded.legalVeto ? "rotate-180" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {expanded.legalVeto && (
                  <div className="mt-4">
                    <div className="bg-gray-800 h-4 rounded-full overflow-hidden">
                      <div className="bg-gray-700 h-full w-0"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Council Section */}
              <div className="border-b border-gray-800 pb-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection("securityCouncil")}
                >
                  <span className="text-lg">Security Council Approvals</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-green-500">5/6</span>
                    <svg
                      className={`transform ${expanded.securityCouncil ? "rotate-180" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {expanded.securityCouncil && (
                  <div className="mt-4">
                    <div className="bg-gray-800 h-4 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-5/6"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guardian Approvals Section */}
              <div className="pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection("guardian")}
                >
                  <span className="text-lg">Guardian Approvals</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-400">0/5</span>
                    <svg
                      className={`transform ${expanded.guardian ? "rotate-180" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {expanded.guardian && (
                  <div className="mt-4">
                    <div className="bg-gray-800 h-4 rounded-full overflow-hidden">
                      <div className="bg-gray-700 h-full w-0"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Visitor Actions Card */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              Security Council Actions
            </h2>
            <ChainButton
              onClick={onPrimaryButtonClick}
              disabled={buttonDisabled}
              className={`w-full mt-6 py-4 rounded-lg font-semibold text-center ${
                buttonDisabled
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {primaryButtonText}
            </ChainButton>
          </div>

          {/* Execute Actions Card */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Execute Actions</h2>
            <div className="space-y-4">
              <div className="h-40 flex items-center justify-center text-gray-500">
                No actions available for this role.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
