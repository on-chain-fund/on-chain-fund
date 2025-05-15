'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { getCampaign } from '../../../types/api';
import { formatAddress, formatAmount, calculateTimeLeft, calculateProgress, formatDate } from '../../../utils/format';
import { ContributionsList } from '../../../components/ContributionsList';
import { FundingModal } from '../../../components/FundingModal';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Campaign, CampaignStatus } from '../../../types/campaign';
import { Avatar, Address, GetAddressReturnType } from '@coinbase/onchainkit/identity';
import { calculateCampaignStatus } from '@/app/utils/campaignUtils';


export default function CampaignDetail() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const { address } = useAccount();

  type MilestoneContent = {
    title: string;
    description: string;
    status: "Completed" | "In Progress" | "Not Started" | "Voting";
    details: string;
  };

  const milestoneContent: Record<1 | 2 | 3 | 4 | 5, MilestoneContent> = {
    1: {
      title: "Planning Phase",
      description: "Initial project planning and requirements gathering",
      status: "Completed",
      details: "Project scope defined, requirements documented, and initial timeline established."
    },
    2: {
      title: "Development Phase",
      description: "Core development and implementation",
      status: "Completed",
      details: "Active development of core features and functionality."
    },
    3: {
      title: "Testing Phase",
      description: "Quality assurance and testing",
      status: "Voting",
      details: "Comprehensive testing of all features and functionality."
    },
    4: {
      title: "Launch Phase",
      description: "Final deployment and launch",
      status: "Not Started",
      details: "Final preparations and public release."
    },
    5: {
      title: "Campaign Completed",
      description: "Project successfully delivered",
      status: "Not Started",
      details: "All milestones completed and project delivered."
    }
  };

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
  const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
  const timeLeft = calculateTimeLeft(campaign.deadline);
  const status = calculateCampaignStatus(campaign);
  const isActive = status.status === CampaignStatus.FUNDRAISING;
  const isFunded = status.status === CampaignStatus.FINALIZED || status.status === CampaignStatus.WORK_IN_PROGRESS;
  const isFailed = status.status === CampaignStatus.FAILED_TO_FUNDRAISE;
  const isCreator = address && address.toLowerCase() === campaign.creator?.toLowerCase();
  return (
    <div className="flex flex-col">
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
        <div className='flex flex-col bg-white rounded-lg shadow-md overflow-hidden'>
            <div className='flex gap-8 lg:gap-16 justify-between items-start max-w-[76rem] flex-col md:flex-row md:items-start md:justify-between'>
                <div className='flex flex-col gap-4 w-full'>
                    <div className='p-4'>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                        <p className="text-gray-600">
                            by {formatAddress(campaign.creator as GetAddressReturnType)}
                            {isCreator && <span className="ml-2 text-blue-600 text-sm">(You)</span>}
                        </p>
                    </div>
                    <div className='px-4'>
                        <div className='flex'>
                            <div className="bg-gray-50 p-4 border border-line rounded-lg w-fit mr-2">
                                <h3 className="text-xs font-medium text-gray-500">Category</h3>
                                <p className="mt-1 text-xs font-semibold text-gray-900">{campaign.category}</p>
                            </div>
                            <div className="bg-gray-50 p-4 border border-line rounded-lg w-fit mr-2">
                                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                                <p className="mt-1 text-xs font-semibold text-gray-900">{formatDate(new Date(campaign.deadline.getTime() - 30 * 24 * 60 * 60 * 1000))}</p>
                            </div>
                            <div className="bg-gray-50 p-4 border border-line rounded-lg w-fit mr-2">
                                <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                                <p className="mt-1 text-xs font-semibold text-gray-900">{formatDate(campaign.deadline)}</p>
                            </div>
                         </div>
                    </div>
                    <div className='flex flex-col gap-4 px-4'>
                        <div className='flex justify-between gap-4'>
                            <div className='w-3/5'>
                                <div className='border border-line rounded-lg p-4 pb-2 my-2 w-full bg-neutral'>
                                    <div className='flex justify-between w-full items-center text-xs font-semibold mb-2 cursor-pointer select-none'>
                                        <h1>Milestones</h1>
                                        <h1>Timeline</h1>
                                    </div>
                                    <div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="w-[calc(100%-30px)] h-10 flex items-center">
                                                    <div className="relative h-2 bg-gray-200 rounded-full w-full">
                                                        <div className="absolute h-2 bg-green-500 rounded-full" style={{ width: '25%' }}></div>
                                                        <div className="absolute h-2 bg-blue-500 rounded-full" style={{ width: '50%', left: '25%' }}></div>
                                                        <div className="absolute h-2 bg-gray-200 rounded-full" style={{ width: '25%', left: '50%' }}></div>
                                                        <div className="absolute h-2 bg-gray-200 rounded-full" style={{ width: '25%', left: '75%' }}></div>
                                                        
                                                        <button 
                                                            className="absolute -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-green-500 rounded-full shadow-md hover:bg-gray-50 transition-colors group" 
                                                            style={{ left: '0%', top: '50%' }}
                                                            onClick={() => setSelectedMilestone(1)}
                                                        >
                                                            <span className="text-xs">🚩</span>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity min-w-[120px] text-center z-10" style={{ marginLeft: '15px' }}>
                                                                Milestone 1:<br/>Planning
                                                            </div>
                                                        </button>
                                                        <button 
                                                            className="absolute -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-green-500 rounded-full shadow-md hover:bg-gray-50 transition-colors group" 
                                                            style={{ left: '25%', top: '50%' }}
                                                            onClick={() => setSelectedMilestone(2)}
                                                        >
                                                            <span className="text-xs">🚩</span>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity min-w-[120px] text-center z-10">
                                                                Milestone 2:<br/>Development
                                                            </div>
                                                        </button>
                                                        <button 
                                                            className="absolute -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full shadow-md hover:bg-gray-50 transition-colors group border-4 border-orange-500" 
                                                            style={{ left: '50%', top: '50%' }}
                                                            onClick={() => setSelectedMilestone(3)}
                                                        >
                                                            <span className="text-xs">🚩</span>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity min-w-[120px] text-center z-10">
                                                                Milestone 3:<br/>Testing
                                                            </div>
                                                        </button>
                                                        <button 
                                                            className="absolute -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors group" 
                                                            style={{ left: '75%', top: '50%' }}
                                                            onClick={() => setSelectedMilestone(4)}
                                                        >
                                                            <span className="text-xs">🚩</span>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity min-w-[120px] text-center z-10">
                                                                Milestone 4:<br/>Launch
                                                            </div>
                                                        </button>
                                                        <button 
                                                            className="absolute -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors group" 
                                                            style={{ left: '100%', top: '50%' }}
                                                            onClick={() => setSelectedMilestone(5)}
                                                        >
                                                            <span className="text-s">⛳</span>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity min-w-[120px] text-center z-10">
                                                                Campaign<br/>Completed
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border border-line rounded-lg'>
                                        <div className="p-4">
                                            {selectedMilestone ? (
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{milestoneContent[selectedMilestone].title}</h3>
                                                            <p className="text-sm text-gray-600 mt-1">{milestoneContent[selectedMilestone].description}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            milestoneContent[selectedMilestone].status === "Completed" ? "bg-green-100 text-green-800" :
                                                            milestoneContent[selectedMilestone].status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                                            milestoneContent[selectedMilestone].status === "Voting" ? "bg-orange-100 text-orange-800" :
                                                            "bg-gray-100 text-gray-800"
                                                        }`}>
                                                            {milestoneContent[selectedMilestone].status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{milestoneContent[selectedMilestone].details}</p>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    Select a milestone to view details
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                    <div className='border border-line rounded-t-lg p-4 pb-2 bg-neutral'>
                                        <div className='flex justify-between w-full items-center text-xs font-semibold mb-2'>
                                            <div className='flex items-center gap-2'>
                                                <h1>Updates</h1>
                                                <a href="" className='text-primary hover:text-primary/80 transition-colors'>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd"></path><path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd"></path></svg>
                                                </a>

                                            </div>
                                        </div>
                                            <div className='flex justify-between items-center mb-2'>
                                               <h1 className='text-base font-semibold text-primary'>Update #1</h1>
                                               <a className="text-xs text-tertiary hover:text-primary transition-colors flex items-center" href="" target="_blank" rel="noreferrer noopener">View Update<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" className="w-3 h-3 ml-1"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd"></path><path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd"></path></svg></a> 
                                            </div>
                                            <div className="flex flex-col gap-y-10 rounded-lg p-4 bg-wash border-line border"><div className="flex flex-col gap-y-2 font-semibold text-primary text-base"><div>Farcaster Update?</div><div className="text-xs"><a className="hover:underline" href="" target="_blank" rel="noreferrer noopener" data-state="closed">0x00...0000</a></div></div></div>
                                        <div>

                                        </div>
                                    </div>
                                    <div className="border border-t-0 border-line rounded-b-lg p-4 cursor-pointer text-sm text-tertiary font-medium hover:bg-neutral/10 transition-colors flex justify-center">Expand all updates</div>
                            </div>
                            <div className='border border-line rounded-lg p-4 pb-2 w-2/5 bg-neutral'>
                                <div className='flex flex-col gap-4'>
                                    <div>
                                        <h1 className='font-semibold text-primary'>Voting Activity</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Campaign</h2>
                        <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
                    </div>
                </div>
            </div>
        </div>    
    </div>
  );
}