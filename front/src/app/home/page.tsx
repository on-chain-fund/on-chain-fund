'use client';
import { useEffect, useState } from 'react';
import { Campaign } from '../types/campaign';
import { getCampaigns } from '../types/api';
import CampaignCard from '../components/CampaignCard';
import { calculateCampaignStatus } from '../utils/campaignUtils';

function Explore() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setIsLoading(true);
        const campaignsData = await getCampaigns();
        setCampaigns(campaignsData);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const categories = ['All', 'Education', 'Gaming', 'DeFi', 'Art', 'Social Impact'];
  const statuses = ['All', 'Fundraising', 'Work in Progress', 'Failed', 'Finalized'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'most-funded', label: 'Most Funded' },
    { value: 'least-funded', label: 'Least Funded' },
    { value: 'ending-soon', label: 'Ending Soon' },
  ];

  // Filter campaigns based on category, status, and search term
  let filteredCampaigns = campaigns;
  
  if (activeCategory !== 'All') {
    filteredCampaigns = filteredCampaigns.filter(campaign => campaign.category === activeCategory);
  }
  
  if (activeStatus !== 'All') {
    filteredCampaigns = filteredCampaigns.filter(campaign => calculateCampaignStatus(campaign).status === activeStatus);
  }
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredCampaigns = filteredCampaigns.filter(campaign => 
      campaign.title.toLowerCase().includes(term) || 
      campaign.description.toLowerCase().includes(term) ||
      campaign.creator?.toLowerCase().includes(term)
    );
  }
  
  // Sort campaigns
  filteredCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'oldest':
        return a.id.localeCompare(b.id);
      case 'most-funded':
        return b.raisedAmount - a.raisedAmount;
      case 'least-funded':
        return a.raisedAmount - b.raisedAmount;
      case 'ending-soon':
        return a.deadline.getTime() - b.deadline.getTime();
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen bg-gray-50">     
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Explore Campaigns</h1>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex overflow-x-auto space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="flex overflow-x-auto space-x-2 ml-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    activeStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
        
        {!isLoading && filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-black">No campaigns found</h3>
            <p className="text-gray-600 mt-2">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Explore