'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Campaign } from '../types/campaign';
import { formatAddress, formatAmount, calculateTimeLeft, calculateProgress } from '../utils/format';
interface CampaignCardProps {
  campaign: Campaign;
}
function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = calculateProgress(campaign.raised, campaign.goal);
  const timeLeft = calculateTimeLeft(campaign.endDate);
  
  return (
    <Link href={`/campaign/${campaign.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image 
            src={campaign.imageUrl} 
            alt={campaign.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${
              campaign.status === 'active' ? 'bg-green-500' : 
              campaign.status === 'funded' ? 'bg-blue-500' : 'bg-gray-500'
            }`}>
              {campaign.status === 'active' ? 'Active' : 
               campaign.status === 'funded' ? 'Funded' : 'Expired'}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.title}</h3>
          <p className="text-sm text-gray-500 mb-3">by {formatAddress(campaign.creator)}</p>
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{campaign.description}</p>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{formatAmount(campaign.raised)} raised</span>
              <span className="text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  campaign.status === 'funded' ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{formatAmount(campaign.goal)} goal</span>
            <span className={`font-medium ${
              campaign.status === 'expired' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {timeLeft}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CampaignCard