import { Campaign, CampaignStatus, CampaignWithStatus } from '../types/api';
export function calculateCampaignStatus(campaign: Campaign): CampaignWithStatus {
  const now = Date.now();
  const deadline = campaign.deadline * 1000; // Convert to milliseconds
  const goalAmount = parseFloat(campaign.goalAmount);
  const currentAmount = parseFloat(campaign.currentAmount);
  
  let status: CampaignStatus;
  
  if (now > deadline) {
    status = currentAmount >= goalAmount ? CampaignStatus.SUCCESSFUL : CampaignStatus.FAILED;
  } else {
    status = CampaignStatus.ACTIVE;
  }
  
  const percentageFunded = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
  const daysLeft = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));
  
  return {
    ...campaign,
    status,
    percentageFunded,
    daysLeft
  };
}
export function formatAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
}
export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
export function getTimeLeft(deadline: number): string {
  const now = Date.now();
  const timeLeft = deadline * 1000 - now;
  
  if (timeLeft <= 0) {
    return 'Ended';
  }
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} left`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  }
}
