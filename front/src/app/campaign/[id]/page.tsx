'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { getCampaign } from '../../types/api';
import { formatAddress, formatAmount, calculateTimeLeft, calculateProgress, formatDate } from '../../utils/format';
import { ContributionsList } from '../../components/ContributionsList';
import { FundingModal } from '../../components/FundingModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Campaign } from '../../types/campaign';
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
          router.push('/');
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
  const progress = calculateProgress(campaign.raised, campaign.goal);
  const timeLeft = calculateTimeLeft(campaign.endDate);
  const isActive = campaign.status === 'active';
  const isFunded = campaign.status === 'funded';
  const isExpired = campaign.status === 'expired';
  const isCreator = address && address.toLowerCase() === campaign.creator.toLowerCase();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 md:h-80">
          <Image 
            src={campaign.imageUrl} 
            alt={campaign.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
              <p className="text-gray-600">
                by {formatAddress(campaign.creator)}
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
              <span className="font-medium">{formatAmount(campaign.raised)} raised</span>
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
              <span className="text-sm text-gray-500">{formatAmount(campaign.goal)} goal</span>
              <span className={`text-sm font-medium ${
                isExpired ? 'text-red-500' : 'text-gray-500'
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
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(new Date(campaign.endDate.getTime() - 30 * 24 * 60 * 60 * 1000))}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">End Date</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{formatDate(campaign.endDate)}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Campaign</h2>
            <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contributions</h2>
            <ContributionsList campaignId={campaignId} />
          </div>
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