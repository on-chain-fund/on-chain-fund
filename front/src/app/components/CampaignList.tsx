'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Campaign, CampaignStatus } from '../types/campaign';
import { getCampaigns, getUserCampaigns } from '../types/api';
import CampaignCard  from './CampaignCard';
import { LoadingSpinner } from './LoadingSpinner';
import { calculateCampaignStatus } from '../utils/campaignUtils';

export type FilterType = 'all' | 'fundraising' | 'work-in-progress' | 'failed' | 'finalized' | 'my-campaigns';

export function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const { address } = useAccount();

  useEffect(() => {
    async function loadCampaigns() {
      setIsLoading(true);
      try {
        const allCampaigns = await getCampaigns();
        setCampaigns(allCampaigns);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  useEffect(() => {
    async function filterCampaigns() {
      setIsLoading(true);
      try {
        if (filter === 'my-campaigns' && address) {
          const userCampaigns = await getUserCampaigns(address);
          setFilteredCampaigns(userCampaigns);
        } else {
          let filtered = [...campaigns];
          
          if (filter === 'fundraising') {
            filtered = filtered.filter(c => calculateCampaignStatus(c).status === CampaignStatus.FUNDRAISING);
          } else if (filter === 'work-in-progress') {
            filtered = filtered.filter(c => calculateCampaignStatus(c).status === CampaignStatus.WORK_IN_PROGRESS);
          } else if (filter === 'failed') {
            filtered = filtered.filter(c => calculateCampaignStatus(c).status === CampaignStatus.FAILED_TO_FUNDRAISE);
          } else if (filter === 'finalized') {
            filtered = filtered.filter(c => calculateCampaignStatus(c).status === CampaignStatus.FINALIZED);
          }
          
          setFilteredCampaigns(filtered);
        }
      } catch (error) {
        console.error('Failed to filter campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    }
    filterCampaigns();
  }, [filter, campaigns, address]);

  return (
    <div>
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-4 rounded-md text-sm font-medium ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`
        }
        >
          All Campaigns
        </button>
        <button
          onClick={() => setFilter('fundraising')}
          className={`px-6 py-4 rounded-md text-sm font-medium ${
            filter === 'fundraising' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Fundraising
        </button>
        <button
          onClick={() => setFilter('work-in-progress')}
          className={`px-6 py-4 rounded-md text-sm font-medium ${
            filter === 'work-in-progress' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Work in Progress
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-6 py-4 rounded-md text-sm font-medium ${
            filter === 'failed' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Failed
        </button>
        <button
          onClick={() => setFilter('finalized')}
          className={`px-6 py-4 rounded-md text-sm font-medium ${
            filter === 'finalized' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('my-campaigns')}
          disabled={!address}
          className={`px-6 py-4 rounded-md text-sm font-medium ${
            filter === 'my-campaigns' 
              ? 'bg-blue-600 text-white' 
              : address 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          My Campaigns
        </button>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No campaigns found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
