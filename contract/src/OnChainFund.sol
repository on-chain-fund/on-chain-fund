// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OnChainFund {
    // Stablecoin 
    IERC20 public usdc;
    
    // Contribution details
    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }
    
    // Campaign details
    struct Campaign {
        string title;
        string description;
        uint256 goalAmount;
        uint256 raisedAmount;
        address creator;
        uint256 deadline;
        string category;
        bool isCompleted;
        bool hasSubmittedResults;
        Contribution[] contributions;
        mapping(address => uint256) contributorIndex; // Track contributor's index in contributions array
    }
    
    // Campaign ID to Campaign
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    // Events for transparency
    event CampaignCreated(uint256 indexed campaignId, address creator, uint256 goal, uint256 deadline, string description);
    event Contributed(uint256 indexed campaignId, address contributor, uint256 amount, uint256 timestamp);
    event ResultsSubmitted(uint256 indexed campaignId, address creator);
    event FundsReleased(uint256 indexed campaignId, uint256 amount);
    event Refunded(uint256 indexed campaignId, address contributor, uint256 amount);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    // Create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _duration,
        string memory _category
    ) external {
        require(_goalAmount > 0, "Goal must be positive");
        require(_duration > 0, "Duration must be positive");

        uint256 campaignId = campaignCount++;
        Campaign storage campaign = campaigns[campaignId];
        
        campaign.title = _title;
        campaign.description = _description;
        campaign.goalAmount = _goalAmount;
        campaign.raisedAmount = 0;
        campaign.creator = msg.sender;
        campaign.deadline = block.timestamp + _duration;
        campaign.category = _category;
        campaign.isCompleted = false;
        campaign.hasSubmittedResults = false;

        emit CampaignCreated(campaignId, msg.sender, _goalAmount, campaign.deadline, _description);
    }

    // Contribute USDC to a campaign
    function contribute(uint256 _campaignId, uint256 _amount) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(!campaign.isCompleted, "Campaign completed");
        require(_amount > 0, "Amount must be positive");

        require(usdc.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");
        
        // Check if contributor already exists
        uint256 contributorIndex = campaign.contributorIndex[msg.sender];
        if (contributorIndex == 0) {
            // New contributor
            campaign.contributions.push(Contribution({
                contributor: msg.sender,
                amount: _amount,
                timestamp: block.timestamp
            }));
            campaign.contributorIndex[msg.sender] = campaign.contributions.length;
        } else {
            // Existing contributor
            campaign.contributions[contributorIndex - 1].amount += _amount;
            campaign.contributions[contributorIndex - 1].timestamp = block.timestamp;
        }
        
        campaign.raisedAmount += _amount;

        emit Contributed(_campaignId, msg.sender, _amount, block.timestamp);
    }

    // Submit campaign results
    function submitResults(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator");
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(!campaign.isCompleted, "Campaign already completed");
        require(campaign.raisedAmount >= campaign.goalAmount, "Goal not met");
        require(!campaign.hasSubmittedResults, "Results already submitted");

        campaign.hasSubmittedResults = true;
        emit ResultsSubmitted(_campaignId, msg.sender);
    }

    // Release funds to creator if goal met and results submitted
    function releaseFunds(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator");
        require(campaign.hasSubmittedResults, "Results not submitted");
        require(!campaign.isCompleted, "Campaign already completed");
        require(campaign.raisedAmount >= campaign.goalAmount, "Goal not met");

        campaign.isCompleted = true;
        require(usdc.transfer(campaign.creator, campaign.raisedAmount), "USDC transfer failed");

        emit FundsReleased(_campaignId, campaign.raisedAmount);
    }

    // Refund contributors if goal not met
    function refund(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign ongoing");
        require(!campaign.isCompleted, "Campaign already completed");
        require(campaign.raisedAmount < campaign.goalAmount, "Goal met");

        uint256 contributorIndex = campaign.contributorIndex[msg.sender];
        require(contributorIndex > 0, "No contribution");

        Contribution storage contribution = campaign.contributions[contributorIndex - 1];
        uint256 amount = contribution.amount;
        require(amount > 0, "No contribution");

        contribution.amount = 0;
        require(usdc.transfer(msg.sender, amount), "USDC refund failed");

        campaign.raisedAmount -= amount;

        // Only mark as completed if this was the last contribution
        if (campaign.raisedAmount == 0) {
            campaign.isCompleted = true;
        }

        emit Refunded(_campaignId, msg.sender, amount);
    }

    // Get campaign details
    function getCampaign(uint256 _campaignId) external view returns (
        string memory title,
        string memory description,
        uint256 goalAmount,
        uint256 raisedAmount,
        address creator,
        uint256 deadline,
        string memory category,
        bool isCompleted,
        bool hasSubmittedResults
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.title,
            campaign.description,
            campaign.goalAmount,
            campaign.raisedAmount,
            campaign.creator,
            campaign.deadline,
            campaign.category,
            campaign.isCompleted,
            campaign.hasSubmittedResults
        );
    }

    // Get contribution details for a specific address in a campaign
    function getContribution(uint256 _campaignId, address _contributor) external view returns (uint256 amount, uint256 timestamp) {
        uint256 contributorIndex = campaigns[_campaignId].contributorIndex[_contributor];
        require(contributorIndex > 0, "No contribution");
        Contribution storage contribution = campaigns[_campaignId].contributions[contributorIndex - 1];
        return (contribution.amount, contribution.timestamp);
    }

    // Get all contributions for a campaign
    function getContributions(uint256 _campaignId) external view returns (Contribution[] memory) {
        return campaigns[_campaignId].contributions;
    }
}