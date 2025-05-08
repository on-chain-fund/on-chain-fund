'use client';

function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">How BaseFunder Works</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none text-black">
            <h2>Decentralized Crowdfunding on Base</h2>
            <p>
              BaseFunder is a decentralized crowdfunding platform built on the Base blockchain. 
              It allows creators to raise funds for their projects directly from the community, 
              with all transactions happening on-chain for maximum transparency and security.
            </p>
            
            <h3>For Creators</h3>
            <ol>
              <li>
                <strong>Create a Campaign</strong> - Set up your project with a funding goal, 
                deadline, and description. All campaigns are stored on the blockchain.
              </li>
              <li>
                <strong>Share Your Campaign</strong> - Once created, share your campaign with 
                your community and the wider BaseFunder audience.
              </li>
              <li>
                <strong>Receive Funds</strong> - If your campaign reaches its funding goal before 
                the deadline, you can claim the funds to your wallet. If not, all contributions 
                are automatically refunded to the funders.
              </li>
            </ol>
            
            <h3>For Funders</h3>
            <ol>
              <li>
                <strong>Browse Campaigns</strong> - Explore campaigns across different categories 
                and find projects you want to support.
              </li>
              <li>
                <strong>Fund Projects</strong> - Contribute ETH to campaigns you believe in. You can 
                use your existing crypto wallet or purchase ETH directly through our platform.
              </li>
              <li>
                <strong>Get Refunds Automatically</strong> - If a campaign doesn't reach its goal by 
                the deadline, your contribution is automatically refunded to your wallet.
              </li>
            </ol>
            
            <h3>Key Features</h3>
            <ul>
              <li>
                <strong>Smart Wallet Integration</strong> - Use Coinbase's Smart Wallet for a seamless 
                experience, even if you're new to crypto.
              </li>
              <li>
                <strong>Fiat Onramp</strong> - Purchase ETH directly with your credit card or bank account 
                to fund projects.
              </li>
              <li>
                <strong>Gas-Free Transactions</strong> - We cover gas fees for your transactions through 
                the Paymaster API, making it easier to participate.
              </li>
              <li>
                <strong>All-or-Nothing Funding</strong> - Creators only receive funds if they reach their 
                goal, protecting funders from partially funded projects.
              </li>
              <li>
                <strong>Transparent & Secure</strong> - All transactions are recorded on the Base blockchain, 
                providing full transparency and security.
              </li>
            </ul>
            
            <h3>Smart Contract Security</h3>
            <p>
              Our platform is built on secure, audited smart contracts that handle the escrow of funds 
              and automatic distribution based on campaign outcomes. The code is open-source and 
              verifiable on the blockchain.
            </p>
            
            <h3>Getting Started</h3>
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