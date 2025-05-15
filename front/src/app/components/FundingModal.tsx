'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Buy } from '@coinbase/onchainkit/buy';
import { useFundCampaign } from '../types/api';
import { formatAmount } from '../utils/format';

interface FundingModalProps {
  campaignId: string;
  campaignTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function FundingModal({ campaignId, campaignTitle, onClose, onSuccess }: FundingModalProps) {
  const [amount, setAmount] = useState<number>(10);
  const [showBuyUSDC, setShowBuyUSDC] = useState(false);
  const { address } = useAccount();
  const { fundCampaign, isPending, isSuccess, isError } = useFundCampaign();
  
  // Trigger onSuccess when the transaction is successful
  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || amount <= 0) return;
    
    try {
      // Call the smart contract to fund the campaign
      await fundCampaign(campaignId, amount);
      // onSuccess will be called when isSuccess becomes true in the useEffect
    } catch (error) {
      console.error('Failed to fund campaign:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Fund This Campaign</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isPending}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            You&apos;re about to fund <span className="font-medium">{campaignTitle}</span>. 
            Your contribution will only be transferred if the campaign reaches its goal.
          </p>
          
          {isError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              There was an error processing your transaction. Please try again.
            </div>
          )}
          
          {showBuyUSDC ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Buy USDC</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You&apos;ll need USDC to fund this campaign. You can buy USDC directly with your credit card.
                </p>
                <Buy 
                  toToken={{
                    name: 'USD Coin',
                    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
                    symbol: 'USDC',
                    decimals: 6,
                    image: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
                    chainId: 8453,
                  }}
                />
              </div>
              <button
                onClick={() => setShowBuyUSDC(false)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isPending}
              >
                Back to Funding
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Contribution Amount (USDC)
                </label>
                <input
                  type="number"
                  id="amount"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isPending}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Note: Your contribution will be made using MockUSDC for testing purposes.
                </p>
              </div>
              
              <div className="flex space-x-2 mb-4">
                {[10, 50, 100, 500].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(value)}
                    className={`py-1 px-3 rounded-full text-sm ${
                      amount === value 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                    disabled={isPending}
                  >
                    {formatAmount(value)}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={!address || isPending || amount <= 0}
                  className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                    !address || isPending || amount <= 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isPending ? 'Processing...' : `Fund ${formatAmount(amount)}`}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowBuyUSDC(true)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isPending}
                >
                  Need USDC? Buy Now
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
