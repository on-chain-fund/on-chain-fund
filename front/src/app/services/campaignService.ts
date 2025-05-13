
import { setOnchainKitConfig } from '@coinbase/onchainkit';
import { Campaign, CampaignStatus } from '../types/campaign';
// Initialize OnchainKit configuration
setOnchainKitConfig({
  apiKey: 'EUK6nliWVdB5Nkt4VuNXUsAV7VwBmtwR',
});
// Mock data for development
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Decentralized Education Platform',
    description: 'Building a platform to provide free blockchain education to underserved communities.',
    creator: '0x1234567890123456789012345678901234567890',
    goal: 5.0,
    raised: 3.2,
    endDate: new Date(Date.now() + 86400 * 14 * 1000), // 14 days from now
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
    category: 'Education',
    status: CampaignStatus.ACTIVE
  },
  {
    id: '2',
    title: 'Web3 Gaming Startup',
    description: 'Creating an immersive play-to-earn game with innovative tokenomics.',
    creator: '0x2345678901234567890123456789012345678901',
    goal: 10.0,
    raised: 8.5,
    endDate: new Date(Date.now() + 86400 * 7 * 1000), // 7 days from now
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
    category: 'Gaming',
    status: CampaignStatus.ACTIVE
  },
  {
    id: '3',
    title: 'DeFi Lending Protocol',
    description: 'Developing a new lending protocol with better interest rates and lower fees.',
    creator: '0x3456789012345678901234567890123456789012',
    goal: 15.0,
    raised: 4.2,
    endDate: new Date(Date.now() + 86400 * 21 * 1000), // 21 days from now
    imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d',
    category: 'DeFi',
    status: CampaignStatus.ACTIVE
  },
  {
    id: '4',
    title: 'NFT Art Collection',
    description: 'Funding for a groundbreaking NFT art collection by emerging digital artists.',
    creator: '0x4567890123456789012345678901234567890123',
    goal: 3.0,
    raised: 2.8,
    endDate: new Date(Date.now() + 86400 * 3 * 1000), // 3 days from now
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912',
    category: 'Art',
    status: CampaignStatus.ACTIVE
  }
];
export async function getAllCampaigns(): Promise<Campaign[]> {
  // In a real implementation, this would fetch from the blockchain
  // For now, return mock data
  return mockCampaigns;
}
export async function getCampaignById(id: string): Promise<Campaign | null> {
  // In a real implementation, this would fetch from the blockchain
  // For now, return mock data
  const campaign = mockCampaigns.find(c => c.id === id);
  return campaign || null;
}
export async function createCampaign(
  // title: string,
  // description: string,
  // goalAmount: string,
  // durationInDays: number,
  // imageUrl: string,
  // category: string,
  // creatorAddress: string
): Promise<string> {
  // In a real implementation, this would interact with the blockchain
  // For now, just return a mock ID
  return "new-campaign-id";
}
export async function contributeToCampaign(
  // campaignId: string,
  // amount: string,
  // funderAddress: string
): Promise<boolean> {
  // In a real implementation, this would interact with the blockchain
  // For now, just return success
  return true;
}
export async function claimFunds(
  // campaignId: string,
  // creatorAddress: string
): Promise<boolean> {
  // In a real implementation, this would interact with the blockchain
  // For now, just return success
  return true;
}
export async function requestRefund(
  // campaignId: string,
  // funderAddress: string
): Promise<boolean> {
  // In a real implementation, this would interact with the blockchain
  // For now, just return success
  return true;
}