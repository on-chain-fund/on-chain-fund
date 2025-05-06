'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

function CreateCampaignButton() {
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
        className="bg-black py-4 px-3 rounded-md text-white"
      >
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

export default CreateCampaignButton