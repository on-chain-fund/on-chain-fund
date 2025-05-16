'use client';

function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">How OnChainFund Works</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none text-black">
            <h1 className="text-2xl font-bold">Decentralized Crowdfunding on Base</h1>
            <p>
            OnChainFund is a decentralized crowdfunding platform built on the Base blockchain. 
              It allows creators to raise funds for their projects directly from the community, 
              with all transactions happening on-chain for maximum transparency and security.
            </p>
            <br/>
            <h1 className="text-2xl font-bold">For Creators</h1>
            <ol>
              <li>
                <strong>Create a Campaign</strong> - Set up your project with a funding goal, 
                milestones, deadlines, and description. All campaigns are stored on the blockchain.
              </li>
              <li>
                <strong>Share Your Campaign</strong> - Once created, share your campaign with 
                your community and the wider OnChainFund audience.
              </li>
            </ol>
            <br/>
            <h1 className="text-2xl font-bold">For Funders</h1>
            <ol>
              <li>
                <strong>Browse Campaigns</strong> - Explore campaigns across different categories 
                and find projects you want to support.
              </li>
              <li>
                <strong>Fund Projects</strong> - Contribute USDC to campaigns you believe in. You can 
                use your existing crypto wallet or purchase USDC directly through our platform.
              </li>
              <li>
                <strong>Get Refunds Automatically</strong> - If a campaign doesn&apos;t reach its goal by 
                the deadline, your contribution is automatically refunded to your wallet.
              </li>
            </ol>
            <br/>
            <h2 className="text-xl font-bold">Key Features</h2>
            <ul>
              <li>
                <strong>Funding</strong> - If your campaign successfully meets its funding goal before the deadline, the raised capital will be held in a wallet. To access these funds, you&apos;ll need to complete the milestones outlined when you created the campaign. Each time you submit a milestone update, funders will vote to approve or reject it based on whether it aligns with your original proposal. If the vote receives at least 70% approval, that stage of funding is unlocked. This process repeats for each milestone until the campaign is complete.
                  <br/>
                  <br/>
                If a milestone vote receives between 30%-50% disapproval, you&apos;ll have the opportunity to revise your submission and present a second update that better reflects funder expectations. However, if the revised submission still doesn&apos;t reach 70% approval, the campaign will end, and remaining funds will be refunded to funders.
                  <br/>
                  <br/>
                If a milestone vote receives more than 50% disapproval on the first attempt, the campaign is automatically terminated and all remaining funds are returned to funders.
                  <br/>
                  <br/>
                If your campaign does not reach its funding goal by the deadline, all contributions will be automatically refunded to the funders.
                  <br/>
              </li>
              <li>
                <strong>Smart Wallet Integration</strong> - Use Coinbase&apos;s Smart Wallet for a seamless 
                experience, even if you&apos;re new to crypto.
              </li>
              <li>
                <strong>Fiat Onramp</strong> - Purchase USDC directly with your credit card or bank account 
                to fund projects.
              </li>
              <li>
                <strong>Gas-Free Transactions</strong> - We cover gas fees for your transactions through 
                the Paymaster API, making it easier to participate.
              </li>
              <li>
                <strong>Transparent & Secure</strong> - All transactions are recorded on the Base blockchain, 
                providing full transparency and security.
              </li>
            </ul>
            <br/>
            <h1 className="text-2xl font-bold">Smart Contract Security</h1>
            <p>
              Our platform is built on secure, audited smart contracts that handle the escrow of funds 
              and automatic distribution based on campaign outcomes. The code is open-source and 
              verifiable on the blockchain.
            </p>
            
            <h2 className="text-xl font-bold">Getting Started</h2>
            <p>
              Ready to start? Connect your wallet using the button in the top right corner, or create 
              a new Smart Wallet directly through our platform. Once connected, you can create a campaign 
              or browse existing ones to fund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default HowItWorks