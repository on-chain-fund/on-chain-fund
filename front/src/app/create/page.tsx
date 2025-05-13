'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useCreateCampaign } from '../types/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
const categories = [
  'Technology',
  'Art',
  'Music',
  'Film',
  'Games',
  'Publishing',
  'Food',
  'Fashion',
  'Design',
  'Education',
  'Community',
  'Other',
];
export default function CreateCampaign() {
  const router = useRouter();
  const { address } = useAccount();
  const { createCampaign, isPending, isSuccess, isError } = useCreateCampaign();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [duration, setDuration] = useState('30');
  const [error, setError] = useState('');

  // Redirect to home page when campaign is successfully created
  useEffect(() => {
    if (isSuccess) {
      router.push('/');
    }
  }, [isSuccess, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError('Please connect your wallet to create a campaign');
      return;
    }
    if (!title || !description || !imageUrl || !goal || !category || !duration) {
      setError('Please fill in all fields');
      return;
    }
    const goalAmount = parseFloat(goal);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      setError('Please enter a valid goal amount');
      return;
    }
    const durationDays = parseInt(duration);
    if (isNaN(durationDays) || durationDays <= 0) {
      setError('Please enter a valid duration');
      return;
    }
    setError('');
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);
      
      // Call the contract to create a new campaign
      await createCampaign({
        title,
        description,
        imageUrl,
        goal: goalAmount,
        creator: address,
        endDate,
        category,
      });
      
      // Wait for the transaction to be confirmed
      // The redirect happens in the useEffect when isSuccess becomes true
    } catch (error) {
      console.error('Failed to create campaign:', error);
      setError('Failed to create campaign. Please try again.');
    }
  };
  
  if (!address) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">Please connect your wallet to create a campaign</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Campaign</h1>
        <p className="text-gray-600">
          Launch your project and start raising funds on the blockchain
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {isError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Transaction failed. Please try again.</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Give your campaign a clear, specific title"
                required
                disabled={isPending}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your project, what you're raising funds for, and how you'll use the funds"
                required
                disabled={isPending}
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Image URL *
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
                required
                disabled={isPending}
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide a URL to an image that represents your campaign
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Goal (USDC) *
                </label>
                <input
                  type="number"
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  min="1"
                  step="1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5000"
                  required
                  disabled={isPending}
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                  max="365"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30"
                  required
                  disabled={isPending}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isPending}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              disabled={isPending}
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
  );
}
