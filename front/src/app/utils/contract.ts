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
  'function getContribution(uint256 _campaignId, address _contributor) view returns (uint256 amount, uint256 timestamp)',
  'function getContributions(uint256 _campaignId) view returns ((address contributor, uint256 amount, uint256 timestamp)[])',
  'function campaignCount() view returns (uint256)',
  'function usdc() view returns (address)'
]);

// Contract address on Base Sepolia
export const CONTRACT_ADDRESS_TESTNET = '0xd09a5362077B352c31e6283ae63c572BC101767d';

// Contract address on Base Mainnet
export const CONTRACT_ADDRESS_MAINNET = '0x0AA77a866f3d7F61b294477c87cD41817CA5c6a0';

// Create a public client for read operations
const client = createPublicClient({
  chain: base,
  transport: http('https://sepolia.base.org')
});

// Use testnet address for development
const CONTRACT_ADDRESS = CONTRACT_ADDRESS_TESTNET;

// Helper function to convert campaign data from contract to our frontend format
function convertContractCampaignToFrontend(
  id: number,
  contractData: readonly [string, string, bigint, bigint, `0x${string}`, bigint, string, boolean, boolean]
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
  try {
    console.log('Fetching campaign count from contract:', CONTRACT_ADDRESS);
    const count = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'campaignCount',
    });
    console.log('Campaign count:', count);

    const campaigns: Campaign[] = [];
    for (let i = 0; i < Number(count); i++) {
      console.log('Fetching campaign:', i);
      const campaignData = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getCampaign',
        args: [BigInt(i)],
      });

      campaigns.push(convertContractCampaignToFrontend(i, campaignData as readonly [string, string, bigint, bigint, `0x${string}`, bigint, string, boolean, boolean]));
    }

    return campaigns;
  } catch (error) {
    console.error('Error in getContractCampaigns:', error);
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
}

// Function to get a single campaign
export async function getContractCampaign(id: string): Promise<Campaign | null> {
  try {
    console.log('Fetching campaign:', id, 'from contract:', CONTRACT_ADDRESS);
    const campaignData = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getCampaign',
      args: [BigInt(id)],
    });
    console.log('Campaign data:', campaignData);

    return convertContractCampaignToFrontend(Number(id), campaignData as readonly [string, string, bigint, bigint, `0x${string}`, bigint, string, boolean, boolean]);
  } catch (error) {
    console.error('Error in getContractCampaign:', error);
    return null;
  }
}

// Helper function to convert contribution data from contract to our frontend format
function convertContractContributionToFrontend(
  campaignId: string,
  contribution: { contributor: `0x${string}`; amount: bigint; timestamp: bigint },
  index: number
) {
  return {
    id: `${campaignId}-contrib-${index}`,
    campaignId,
    contributor: contribution.contributor,
    amount: Number(contribution.amount) / 1e6, // Convert from USDC decimals
    timestamp: new Date(Number(contribution.timestamp) * 1000)
  };
}

// Function to get contributions for a campaign
export async function getContractContributions(campaignId: string) {
  try {
    const contributions = await client.readContract({
      address: CONTRACT_ADDRESS_MAINNET,
      abi: CONTRACT_ABI,
      functionName: 'getContributions',
      args: [BigInt(campaignId)],
    });

    return (contributions as { contributor: `0x${string}`; amount: bigint; timestamp: bigint }[])
      .map((contribution, index) => convertContractContributionToFrontend(campaignId, contribution, index));
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return [];
  }
} 