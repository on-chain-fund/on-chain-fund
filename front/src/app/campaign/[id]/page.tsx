'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { getCampaign } from '../../types/api';
import { formatAddress, formatAmount, calculateTimeLeft, calculateProgress, formatDate } from '../../utils/format';
import { ContributionsList } from '../../components/ContributionsList';
import { FundingModal } from '../../components/FundingModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Campaign, CampaignStatus } from '../../types/campaign';
import { Avatar, Address, GetAddressReturnType } from '@coinbase/onchainkit/identity';
import { calculateCampaignStatus } from '@/app/utils/campaignUtils';


export default function CampaignDetail() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const { address } = useAccount();
  useEffect(() => {
    async function loadCampaign() {
      setIsLoading(true);
      try {
        const data = await getCampaign(campaignId);
        if (!data) {
          router.push('/home');
          return;
        }
        setCampaign(data);
      } catch (error) {
        console.error('Failed to load campaign:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaign();
  }, [campaignId, router]);
  const handleFundSuccess = async () => {
    setShowFundingModal(false);
    // Reload campaign data to show updated funding
    try {
      const data = await getCampaign(campaignId);
      if (data) {
        setCampaign(data);
      }
    } catch (error) {
      console.error('Failed to refresh campaign:', error);
    }
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!campaign) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Campaign not found</p>
      </div>
    );
  }
  const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
  const timeLeft = calculateTimeLeft(campaign.deadline);
  const status = calculateCampaignStatus(campaign);
  const isActive = status.status === CampaignStatus.FUNDRAISING;
  const isFunded = status.status === CampaignStatus.FINALIZED || status.status === CampaignStatus.WORK_IN_PROGRESS;
  const isFailed = status.status === CampaignStatus.FAILED_TO_FUNDRAISE;
  const isCreator = address && address.toLowerCase() === campaign.creator?.toLowerCase();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className='flex justify-between items-center mb-6'>
          <button
            onClick={() => router.push('/portfolio')}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Campaigns
          </button>
        </div>    
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className='md:flex'>
            <div className="md:w-1/2">
              <img 
                src={campaign.imageUrl} 
                alt={campaign.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:w-1/2 p-6">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                  <p className="text-gray-600">
                    by {formatAddress(campaign.creator as GetAddressReturnType)}
                    {isCreator && <span className="ml-2 text-blue-600 text-sm">(You)</span>}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    isActive ? 'bg-green-100 text-green-800' : 
                    isFunded ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {isActive ? 'Active' : isFunded ? 'Funded' : 'Expired'}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{formatAmount(campaign.raisedAmount)} raised</span>
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      isFunded ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">{formatAmount(campaign.goalAmount)} goal</span>
                  <span className={`text-sm font-medium ${
                    isFailed ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {timeLeft}
                  </span>
                </div>
            </div>
            
            <div className="mb-6">
              <button
                onClick={() => setShowFundingModal(true)}
                disabled={!isActive || isCreator}
                className={`w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                  !isActive || isCreator
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isCreator 
                  ? "You can't fund your own campaign" 
                  : isActive 
                    ? 'Fund This Campaign' 
                    : isFunded 
                      ? 'Campaign Successfully Funded' 
                      : 'Campaign Ended'}
              </button>
              {!address && isActive && (
                <p className="text-sm text-center text-gray-500 mt-2">
                  Connect your wallet to fund this campaign
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{campaign.category}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(new Date(campaign.deadline.getTime() - 30 * 24 * 60 * 60 * 1000))}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(campaign.deadline)}</p>
              </div>
            </div>
            </div>
        </div>
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Campaign</h2>
          <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
        </div>
        <div>
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-black mb-4">Creator</h2>
            <div className="flex items-center">
              <Avatar address={campaign.creator} className="h-10 w-10 mr-3" />
              <div>
              <p className="text-black font-medium">{campaign.creator || 'Anonymous Creator'}</p>
              <Address address={campaign.creator} className="text-sm text-gray-500" />
            </div>
            </div>
            </div>
        </div>    
        <div>
          <h2 className="text-xl font-semibold text-gray-900 px-6">Contributions</h2>
          <ContributionsList campaignId={campaignId} />
        </div>
        
      </div>
      
      {showFundingModal && (
        <FundingModal
          campaignId={campaignId}
          campaignTitle={campaign.title}
          onClose={() => setShowFundingModal(false)}
          onSuccess={handleFundSuccess}
        />
      )}
    </div>
  );
}