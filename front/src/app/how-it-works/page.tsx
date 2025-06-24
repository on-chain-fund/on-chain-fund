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
                milestones, deadlines, and description. All campaign data is stored on the blockchain.
              </li>
              <li>
                <strong>Share Your Campaign</strong> - Once created, share your campaign with 
                your community and the wider OnChainFund audience.
              </li>
              <li>
                <strong>Raise Funds</strong> - Tap into the Web3 global network and acquire starter capital 
                to validate your idea.
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
                <strong>Fund Projects</strong> - Contribute stablecoins to campaigns you believe in. 
                Which stablecoin? TBD. 
              </li>
              <li>
                <strong>Get Refunds</strong> - If a campaign doesn&apos;t reach its goal by the deadline, 
                your contribution will be refunded. 
              </li>
            </ol>
            <br/>
            <h1 className="text-2xl font-bold">Key Features</h1>
            <ul>
              <li>
                <strong>Transparent & Secure</strong> - All transactions are recorded on the Base blockchain, 
                providing full transparency and security. 
                - TODO: Elaborate more why this is important. 
              </li>
              <li>
                <strong>Funding</strong> - If your campaign successfully meets its funding goal before the deadline, the raised capital will be held in a wallet. 
                To access these funds, you&apos;ll need to complete the milestones outlined when you created the campaign. Each time you submit a milestone update, 
                funders will vote to approve or reject it based on whether it aligns with your original proposal. If the vote receives at least 70% approval, 
                that stage of funding is unlocked. This process repeats for each milestone until the campaign is complete.
                  <br/>
                  <br/>
                If a milestone vote receives between 30%-50% disapproval, you&apos;ll have the opportunity to revise your submission and present a second update 
                that better reflects funder expectations. However, if the revised submission still doesn&apos;t reach 70% approval, the campaign will end, 
                and remaining funds will be refunded to funders.
                  <br/>
                  <br/>
                If a milestone vote receives more than 50% disapproval on the first attempt, the campaign is automatically terminated and all remaining funds are returned to funders.
                  <br/>
                  <br/>
                If your campaign does not reach its funding goal by the deadline, all contributions will be refunded to the funders.
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
                <strong>WIP: Gas-Free Transactions</strong> - We cover gas fees for your transactions through 
                the Paymaster API, making it easier to participate.
              </li>
            </ul>
            <br/>
            <h1 className="text-2xl font-bold">Smart Contract Security</h1>
            <p>
              Our platform is built on secure, audited smart contracts that handle the escrow of funds 
              and automatic distribution based on campaign outcomes. The code is open-source and contract
              verifiable on Base.
            </p>
            <br/>
            {/* <h1 className="text-2xl font-bold">Getting Started</h1>
            <p>
              Ready to start? Connect your wallet using the button in the top right corner, or create 
              a new Smart Wallet directly through our platform. Once connected, you can create a campaign 
              or browse existing ones to fund.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}


export default HowItWorks