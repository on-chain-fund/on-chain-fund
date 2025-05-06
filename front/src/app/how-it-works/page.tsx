
export default function HowItWorks() {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">How OnChainFund Works</h1>
          <p className="text-gray-600">
            Learn how our decentralized crowdfunding platform operates on the Base blockchain
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">For Project Creators</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Create Your Campaign</h3>
                    <p className="text-gray-600 mt-1">
                      Connect your wallet and fill out the campaign creation form with your project details, funding goal, and campaign duration.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Share Your Campaign</h3>
                    <p className="text-gray-600 mt-1">
                      Once your campaign is live, share it with your network to attract backers. Your campaign will also be discoverable on our platform.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Receive Funding</h3>
                    <p className="text-gray-600 mt-1">
                      If your campaign reaches its funding goal before the deadline, you'll receive the funds in USDC directly to your wallet. If not, all contributions will be automatically refunded to backers.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">For Backers</h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Discover Campaigns</h3>
                    <p className="text-gray-600 mt-1">
                      Browse through campaigns on our platform and find projects you'd like to support.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Fund Projects</h3>
                    <p className="text-gray-600 mt-1">
                      Connect your wallet and contribute USDC to campaigns you believe in. If you don't have USDC, you can easily buy it directly through our platform.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Track Progress</h3>
                    <p className="text-gray-600 mt-1">
                      Follow the campaigns you've backed and see their progress toward their funding goals.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How It Works Technically</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">All-or-Nothing Model</h3>
                  <p className="text-gray-600 mt-1">
                    OnChainFund uses an all-or-nothing funding model. This means that creators only receive funds if their campaign reaches or exceeds its funding goal by the deadline. If the goal isn't met, all contributions are automatically refunded to backers.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Smart Wallet Integration</h3>
                  <p className="text-gray-600 mt-1">
                    Our platform uses smart wallet technology to make it easy for anyone to participate, even if they're new to cryptocurrency. You can create a wallet directly through our platform.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Gasless Transactions</h3>
                  <p className="text-gray-600 mt-1">
                    We cover gas fees for transactions on our platform, making it seamless for users to create campaigns and contribute to projects without worrying about network fees.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Fiat On-ramp</h3>
                  <p className="text-gray-600 mt-1">
                    Don't have cryptocurrency? No problem. Our platform allows you to buy USDC directly with your credit card, making it easy to fund campaigns without prior crypto experience.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Base Blockchain</h3>
                  <p className="text-gray-600 mt-1">
                    OnChainFund operates on the Base blockchain, providing fast, low-cost transactions with the security of Ethereum. All campaign funds and transactions are transparent and verifiable on the blockchain.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
  