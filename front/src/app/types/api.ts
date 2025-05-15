import { Campaign } from './campaign';
import { Contribution } from './contribution';
import { getContractCampaigns, getContractCampaign, CONTRACT_ADDRESS_MAINNET, CONTRACT_ABI } from '../utils/contract';
import { useWriteContract } from 'wagmi';

// Get all campaigns
export async function getCampaigns(): Promise<Campaign[]> {
  return getContractCampaigns();
}

// Get a single campaign
export async function getCampaign(id: string): Promise<Campaign | null> {
  return getContractCampaign(id);
}

// Get contributions for a campaign
export async function getContributions(campaignId: string): Promise<Contribution[]> {
  // TODO: In the future, this should fetch real contributions from the contract
  // For now, we'll return mock data
  return getMockContributions(campaignId);
}

// Helper function to generate mock contributions
function getMockContributions(campaignId: string): Contribution[] {
  const numContributions = Math.floor(Math.random() * 5) + 1;
  const contributions: Contribution[] = [];
  
  for (let i = 0; i < numContributions; i++) {
    const amount = Math.floor(Math.random() * 1000) + 10;
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    contributions.push({
      id: `${campaignId}-contrib-${i}`,
      campaignId,
      contributor: `0x${Math.random().toString(16).substring(2, 12)}`,
      amount,
      timestamp: date
    });
  }
  
  return contributions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Create a new campaign
export function useCreateCampaign() {
  const { writeContract, isPending, isSuccess, isError, reset } = useWriteContract();
  
  const createCampaign = async (campaign: Omit<Campaign, 'status' | 'id' | 'raisedAmount'>) => {
    // Calculate duration in seconds from now until end date
    const duration = Math.floor((campaign.deadline.getTime() - Date.now()) / 1000);

    // Convert goal amount to USDC decimals (6)
    const goalAmount = BigInt(Math.floor(campaign.goalAmount * 10**6));

    writeContract({
      address: CONTRACT_ADDRESS_MAINNET,
      abi: CONTRACT_ABI,
      functionName: 'createCampaign',
      args: [
        campaign.title,
        campaign.description,
        goalAmount,
        BigInt(duration),
        campaign.category
      ]
    });
  };

  return {
    createCampaign,
    isPending,
    isSuccess,
    isError,
    reset
  };
}

// Fund a campaign
export function useFundCampaign() {
  const { writeContract, isPending, isSuccess, isError, reset } = useWriteContract();
  
  const fundCampaign = async (campaignId: string, amount: number) => {
    writeContract({
      address: CONTRACT_ADDRESS_MAINNET,
      abi: CONTRACT_ABI,
      functionName: 'contribute',
      args: [
        BigInt(campaignId),
        BigInt(amount * 1e6) // Convert to USDC decimals
      ]
    });
  };

  return {
    fundCampaign,
    isPending,
    isSuccess,
    isError,
    reset
  };
}

// Get campaigns created by a user
export async function getUserCampaigns(userAddress: string): Promise<Campaign[]> {
  const campaigns = await getContractCampaigns();
  return campaigns.filter(campaign => campaign.creator?.toLowerCase() === userAddress.toLowerCase());
}

// Get contributions made by a user
export async function getUserContributions(): Promise<Contribution[]> {
  // TODO: Implement when contract has a way to get user contributions
  return [];
}

export type APIError = {
  code: string;
  error: string;
  message: string;
};
export function isApiError(response: unknown): response is APIError {
  return (
    response !== null && 
    typeof response === 'object' && 
    'error' in response
  );
}
