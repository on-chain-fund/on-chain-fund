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
    status: 'active' | 'funded' | 'expired' | 'funded (no action)' | 'funded (needs action)' | 'funding in progress';
  }
  export interface Contribution {
    id: string;
    campaignId: string;
    contributor: string;
    amount: number;
    timestamp: Date;
  }
  