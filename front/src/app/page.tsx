'use client';
import { CampaignList } from './components/CampaignList';
import CreateCampaignButton from './components/CreateCampaignButton';
export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Campaigns</h1>
        <p className="text-gray-600">
          Fund innovative projects on the blockchain with OnChainFund
        </p>
        <CreateCampaignButton/>
      </div>
      
      <CampaignList />
    </div>
  );
}