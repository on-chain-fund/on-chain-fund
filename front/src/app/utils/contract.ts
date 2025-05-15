import { GetAddressReturnType } from '@coinbase/onchainkit/identity';
import { Campaign } from '../types/campaign';
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

// TODO: bring this info directly from under the contract folder
export const CONTRACT_ABI = parseAbi([
  'function createCampaign(string _title, string _description, uint256 _goalAmount, uint256 _duration, string _category)',
  'function contribute(uint256 _campaignId, uint256 _amount)',
  'function submitResults(uint256 _campaignId)',
  'function releaseFunds(uint256 _campaignId)',
  'function refund(uint256 _campaignId)',
  'function getCampaign(uint256 _campaignId) view returns (string title, string description, uint256 goalAmount, uint256 raisedAmount, address creator, uint256 deadline, string category, bool isCompleted, bool hasSubmittedResults)',
  'function campaignCount() view returns (uint256)',
  'function usdc() view returns (address)'
]);

// Contract address on Base Sepolia
export const CONTRACT_ADDRESS_TESTNET = '0xd09a5362077B352c31e6283ae63c572BC101767d';

// Contract address on Base Mainnet
export const CONTRACT_ADDRESS_MAINNET = '0x0aD3d9F0Dc177d79834D22031246B2f3C00C611c';

// Create a public client for read operations
const client = createPublicClient({
  chain: base,
  transport: http()
});

// Helper function to convert campaign data from contract to our frontend format
function convertContractCampaignToFrontend(
  id: number,
  contractData: [string, string, bigint, bigint, string, bigint, string]
): Campaign {
  const [title, description, goalAmount, raisedAmount, creator, deadline, category] = contractData;
  
  return {
    id: id.toString(),
    title: title, 
    description: description,
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7', // Default image
    goalAmount: Number(goalAmount) / 1e6, // Convert from USDC decimals (6)
    raisedAmount: Number(raisedAmount) / 1e6,
    creator: creator as GetAddressReturnType,
    deadline: new Date(Number(deadline) * 1000),
    category: category,
    isCompleted: false,
    hasSubmittedResults: false,
  };
}

// Function to get all campaigns
export async function getContractCampaigns(): Promise<Campaign[]> {
  const count = await client.readContract({
    address: CONTRACT_ADDRESS_MAINNET,
    abi: CONTRACT_ABI,
    functionName: 'campaignCount',
  });

  const campaigns: Campaign[] = [];
  for (let i = 0; i < Number(count); i++) {
    const campaignData = await client.readContract({
      address: CONTRACT_ADDRESS_MAINNET,
      abi: CONTRACT_ABI,
      functionName: 'getCampaign',
      args: [BigInt(i)],
    });

    campaigns.push(convertContractCampaignToFrontend(i, campaignData as [string, string, bigint, bigint, string, bigint, string]));
  }

  return campaigns;
}

// Function to get a single campaign
export async function getContractCampaign(id: string): Promise<Campaign | null> {
  try {
    const campaignData = await client.readContract({
      address: CONTRACT_ADDRESS_MAINNET,
      abi: CONTRACT_ABI,
      functionName: 'getCampaign',
      args: [BigInt(id)],
    });

    return convertContractCampaignToFrontend(Number(id), campaignData as [string, string, bigint, bigint, string, bigint, string]);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
} 