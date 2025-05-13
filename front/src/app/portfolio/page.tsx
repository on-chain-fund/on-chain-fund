'use client';
import { CampaignList } from '../components/CampaignList';
import CreateCampaignButton from '../components/CreateCampaignButton';
export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="flex justify-between py-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Campaigns</h1>
          <p className="text-gray-600">
            Fund innovative projects on the blockchain with OnChainFund
          </p>
        </div>
        <CreateCampaignButton/>
      </div>
      
      <CampaignList />
    </main>
  );
}