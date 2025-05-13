'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Campaign } from '../types/campaign';
import { useCreateCampaign } from '../types/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
const CATEGORIES = [
  'Art',
  'Comics',
  'Crafts',
  'Dance',
  'Design',
  'Education',
  'Fashion',
  'Film & Video',
  'Food',
  'Games',
  'Journalism',
  'Music',
  'Photography',
  'Publishing',
  'Technology',
  'Theater',
  'DeFi',
  'NFT',
  'DAO',
  'Environment',
  'Social Impact',
  'Other',
];
export default function CreateCampaign() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createCampaign, isPending, isSuccess } = useCreateCampaign();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Campaign, 'id' | 'status' | 'raised'>>({
    title: '',
    description: '',
    goal: 1000,
    endDate: new Date(),
    category: 'Technology',
    imageUrl: '',
    creator: '',
  });
  // Set minimum end date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData(prev => ({
      ...prev,
      endDate: tomorrow,
    }));
  }, []);
  useEffect(() => {
    // Redirect to home if not connected
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);
  useEffect(() => {
    // Redirect to home when campaign is successfully created
    if (isSuccess) {
      router.push('/');
    }
  }, [isSuccess, router]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'goal' ? Number(value) : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      if (!isConnected || !address) {
        throw new Error('You must connect your wallet to create a campaign');
      }
      
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      
      if (formData.goal <= 0) {
        throw new Error('Funding goal must be greater than 0');
      }
      
      if (!formData.endDate) {
        throw new Error('End date is required');
      }
      
      const endDate = new Date(formData.endDate);
      const now = new Date();
      
      if (endDate <= now) {
        throw new Error('End date must be in the future');
      }
      
      // Create the campaign
      await createCampaign({
        ...formData,
        creator: address,
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating campaign:', err);
    }
  };
  if (!isConnected) {
    return (
      <div>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900">Create a Campaign</h1>
            <p className="mt-1 text-sm text-gray-500">
              Launch your project and start raising funds on Base.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Give your campaign a clear, specific title"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Campaign Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your project, what you&apos;re raising funds for, and how you&apos;ll use the funds"
                  required
                />
              </div>
              
              {/* Funding Goal */}
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                  Funding Goal (USDC) *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="goal"
                    id="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    min="1"
                    step="1"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USDC</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Set a realistic goal. You&apos;ll only receive funds if your goal is met.
                </p>
              </div>
              
              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  Campaign End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate.toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Your campaign will end at 11:59 PM on this date.
                </p>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Campaign Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add an image URL to make your campaign more appealing.
                </p>
              </div>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isPending ? (
                  <div className="flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">Creating...</span>
                  </div>
                ) : (
                  'Create Campaign'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
