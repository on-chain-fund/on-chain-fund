# OnChainFund

## Overview

OnChainFund is a decentralized crowdfunding platform built on Base, designed to empower Web3 creators and supporters with transparency and trust. Creators can launch campaigns, set milestones, and raise funds in USDC, while backers vote to release funds upon milestone completion. Our team leveraged AI tools to create a functional prototype despite limited contract development experience.

### Key Features
- **Milestone-Based Funding**: Funds are released only after backers approve milestones (70% approval threshold).
- **Onchain Transparency**: All transactions and updates are recorded on Base mainnet.
- **User-Friendly**: Smart Wallet and OnchainKit integration for seamless onboarding.
- **Mock USDC**: Used for testing funding flows without real mainnet costs.

## Project Structure
- **/contract**: Contains the Solidity smart contract (`OnChainFund.sol`, `MockUSDC.sol`), test code and deployment scripts.
- **/front**: Frontend code built with React, featuring pages for campaign creation, funding, and voting (mockup).

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- Yarn
- Foundry (for contract deployment)
- Base mainnet RPC URL (or Base Sepolia testnet for testing)
- OnchainKit API key

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/on-chain-fund/on-chain-fund.git
   cd on-chain-fund
   ```

2. **Install Dependencies**:
     ```bash
     yarn install
     ```
   - For the contract (requires Foundry):
     ```bash
     cd contract
     forge install
     ```

3. **Environment Setup**:
   - Create a `.env` file in the `/front` directory with your Base mainnet RPC URL and OnchainKit API config values:
     ```env
     NEXT_PUBLIC_ONCHAINKIT_API_KEY=
     NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID=
     NEXT_PUBLIC_BASE_RPC_URL=
     ```
   - Create a `.env` file in the `/contract` directory and fill in following values:
     ```env
     PRIVATE_KEY=
     ETHERSCAN_API_KEY=
     MOCK_USDC_ADDRESS=(optional; needed when you want to deploy only the OnChainFund contract)
     ```

4. **Run the Frontend**:
   ```bash
   yarn dev
   ```
   Open `http://localhost:3001` to view the app.

5. **Deploy the Contract**:
   - Compile and deploy using Foundry:
     ```bash
     cd contract
     forge build
     forge script script/Deploy.s.sol:DeployScript --rpc-url https://mainnet.base.org --broadcast --verify -vvvv
     ```
   - Note the deployed contract address and update the frontend code.

## Usage
- **Create a Campaign**: Navigate to the app, connect your wallet via Smart Wallet, create a campaign with goals and timelines.
- **Fund a Campaign**: Use mock USDC to contribute to active campaigns.
- **Vote on Milestones**: View the voting mockup to see how supporters will approve milestones (UI only, contract logic TBD).

## Current Status
- **Implemented**: Basic campaign creation, funding flows, and frontend UI.
- **Pending**: Milestone and voting logic in the smart contract (UI mockup available).
- **Future Plans**: Integrate Farcaster Mini App, Paymaster for gasless UX, and Basename for user-friendly addresses.

## Team
- **Yejin Joo**: @yjkellyjoo
- **Hanson Wong**: @HappyHanSolo

## Acknowledgments
- Built with AI tools: Ohara (initial MVP), Cursor (contract refinement), Grok, and ChatGPT.
