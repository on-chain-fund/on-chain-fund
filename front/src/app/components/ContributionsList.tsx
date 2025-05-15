'use client';
import { useState, useEffect } from 'react';
import { Contribution } from '../types/contribution';
import { getContributions } from '../types/api';
import { formatAddress, formatAmount, formatDate } from '../utils/format';
import { LoadingSpinner } from './LoadingSpinner';
import { GetAddressReturnType } from '@coinbase/onchainkit/identity';
interface ContributionsListProps {
  campaignId: string;
}
export function ContributionsList({ campaignId }: ContributionsListProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadContributions() {
      setIsLoading(true);
      try {
        const data = await getContributions(campaignId);
        setContributions(data);
      } catch (error) {
        console.error('Failed to load contributions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadContributions();
  }, [campaignId]);
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (contributions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No contributions yet. Be the first to fund this campaign!</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Contributions</h3>
        <p className="my-2 max-w-2xl text-sm text-gray-500">
          {contributions.length} {contributions.length === 1 ? 'contribution' : 'contributions'} so far
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {contributions.map((contribution) => (
            <li key={contribution.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {formatAddress(contribution.contributor as GetAddressReturnType).substring(0, 2)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatAddress(contribution.contributor as GetAddressReturnType)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(contribution.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatAmount(contribution.amount)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
