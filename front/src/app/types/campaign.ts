import { GetAddressReturnType } from "@coinbase/onchainkit/identity";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  goalAmount: number;
  raisedAmount: number;
  creator: GetAddressReturnType | undefined;
  deadline: Date;
  category: string;
  isCompleted: boolean;
  hasSubmittedResults: boolean;
}
export enum CampaignStatus {
  FUNDRAISING = "Fundraising",
  WORK_IN_PROGRESS = "Work in Progress", // isCompleted = true
  FAILED_TO_FUNDRAISE = "Failed",
  FINALIZED = "Finalized"  // hasSubmittedResults = true
}
export interface CampaignWithStatus extends Campaign {
  status: CampaignStatus;
  percentageFunded: number;
  daysLeft: number;
}