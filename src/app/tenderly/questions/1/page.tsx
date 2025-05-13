"use client";

import { useNetwork } from "@/components/NetworkContext";

export default function TenderlyQuestion() {
  const { networkInfo } = useNetwork();

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Challenge Instructions</h2>
          <p className="mb-4">You are now connected to {networkInfo?.name}!</p>

          <p>
            Come back in a few weeks to see when the tenderly feature goes live!
          </p>
        </div>
      </div>
    </div>
  );
}
