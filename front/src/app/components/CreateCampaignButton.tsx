'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
export default function CreateCampaignButton() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const handleClick = () => {
    if (isConnected) {
      router.push('/create-campaign');
    } else {
      setShowConnectPrompt(true);
    }
  };
  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Create Campaign
      </button>
      {showConnectPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-black mb-4">Connect Wallet</h3>
            <p className="text-gray-600 mb-4">
              You need to connect your wallet to create a campaign.
            </p>
            <div className="flex justify-center mb-4">
              <ConnectWallet />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConnectPrompt(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
