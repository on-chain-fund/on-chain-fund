'use client';
import { CampaignList } from '../components/CampaignList';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="flex justify-between py-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Portfolio</h1>
          <p className="text-gray-600">
            Projects you have supported on OnChainFund
          </p>
        </div>
      </div>
      
      <CampaignList />
    </main>
  );
}