export interface Campaign {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    goal: number;
    raised: number;
    creator: string;
    endDate: Date;
    category: string;
    status: CampaignStatus;
  }
  export interface Contribution {
    id: string;
    campaignId: string;
    contributor: string;
    amount: number;
    timestamp: Date;
  }
  export enum CampaignStatus {
    ACTIVE = "ACTIVE",
    FUNDED = "FUNDED",
    EXPIRED = "EXPIRED",
    FUNDED_NO_ACTION = "FUNDED_NO_ACTION",
    FUNDED_NEEDS_ACTION = "FUNDED_NEEDS_ACTION",
    FUNDING_IN_PROGRESS = "FUNDING_IN_PROGRESS"
  }
  export interface CampaignWithStatus extends Campaign {
    status: CampaignStatus;
    percentageFunded: number;
    daysLeft: number;
  }