import { Campaign, CampaignStatus } from '../types/campaign';
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

// TODO: bring this info directly from under the contract folder
export const CONTRACT_ABI = parseAbi([
  'function createCampaign(uint256 _goal, uint256 _duration, string _milestoneDescription)',
  'function contribute(uint256 _campaignId, uint256 _amount)',
  'function getCampaign(uint256 _campaignId) view returns (address creator, uint256 goal, uint256 deadline, uint256 raised, bool finalized, string milestoneDescription, bool milestoneApproved, uint256 totalVotes)',
  'function campaignCount() view returns (uint256)'
]);

// Contract address on Base Sepolia
export const CONTRACT_ADDRESS_TESTNET = '0xd09a5362077B352c31e6283ae63c572BC101767d';

// Contract address on Base Mainnet
export const CONTRACT_ADDRESS_MAINNET = '0xc8eba12ad97e78244274150cef163fb54e84b042';

// Create a public client for read operations
const client = createPublicClient({
  chain: base,
  transport: http()
});

// Helper function to convert campaign data from contract to our frontend format
function convertContractCampaignToFrontend(
  id: number,
  contractData: [string, bigint, bigint, bigint, boolean, string, boolean, bigint]
): Campaign {
  const [creator, goal, deadline, raised, finalized, milestoneDescription, milestoneApproved] = contractData;
  
  // Calculate status based on contract data
  let status: CampaignStatus = CampaignStatus.ACTIVE;
  if (finalized) {
    status = milestoneApproved ? CampaignStatus.FUNDED : CampaignStatus.EXPIRED;
  } else if (BigInt(Math.floor(Date.now() / 1000)) > deadline) {
    status = CampaignStatus.EXPIRED;
  }

  return {
    id: id.toString(),
    title: milestoneDescription, // Using milestone description as title for now
    description: milestoneDescription,
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7', // Default image
    goal: Number(goal) / 1e6, // Convert from USDC decimals (6)
    raised: Number(raised) / 1e6,
    creator,
    endDate: new Date(Number(deadline) * 1000),
    category: 'Technology', // Default category
    status,
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

    campaigns.push(convertContractCampaignToFrontend(i, campaignData as [string, bigint, bigint, bigint, boolean, string, boolean, bigint]));
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

    return convertContractCampaignToFrontend(Number(id), campaignData as [string, bigint, bigint, bigint, boolean, string, boolean, bigint]);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
} 