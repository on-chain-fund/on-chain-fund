// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OnChainFund {
    // Stablecoin 
    IERC20 public usdc;
    // Campaign details
    struct Campaign {
        address creator;
        uint256 goal;
        uint256 deadline;
        uint256 raised;
        bool finalized;
        string milestoneDescription; // Single milestone for MVP
        bool milestoneApproved;
        uint256 totalVotes;
        mapping(address => uint256) contributions;
        mapping(address => bool) voted;
    }
    // Campaign ID to Campaign
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    // Events for transparency
    event CampaignCreated(uint256 indexed campaignId, address creator, uint256 goal, uint256 deadline, string milestoneDescription);
    event Contributed(uint256 indexed campaignId, address contributor, uint256 amount);
    event MilestoneApproved(uint256 indexed campaignId, uint256 totalVotes);
    event FundsReleased(uint256 indexed campaignId, uint256 amount);
    event Refunded(uint256 indexed campaignId, address contributor, uint256 amount);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    // Create a new campaign with a milestone
    function createCampaign(uint256 _goal, uint256 _duration, string memory _milestoneDescription) external {
        require(_goal > 0, "Goal must be positive");
        require(_duration > 0, "Duration must be positive");

        uint256 campaignId = campaignCount++;
        Campaign storage campaign = campaigns[campaignId];
        campaign.creator = msg.sender;
        campaign.goal = _goal;
        campaign.deadline = block.timestamp + _duration;
        campaign.raised = 0;
        campaign.finalized = false;
        campaign.milestoneDescription = _milestoneDescription;
        campaign.milestoneApproved = false;
        campaign.totalVotes = 0;

        emit CampaignCreated(campaignId, msg.sender, _goal, campaign.deadline, _milestoneDescription);
    }

    // Contribute USDC to a campaign
    function contribute(uint256 _campaignId, uint256 _amount) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(!campaign.finalized, "Campaign finalized");
        require(_amount > 0, "Amount must be positive");

        require(usdc.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");
        campaign.contributions[msg.sender] += _amount;
        campaign.raised += _amount;

        emit Contributed(_campaignId, msg.sender, _amount);
    }

    // Vote to approve milestone (voting power = contribution)
    function voteForMilestone(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign ongoing");
        require(!campaign.finalized, "Campaign finalized");
        require(!campaign.milestoneApproved, "Milestone already approved");
        require(campaign.contributions[msg.sender] > 0, "Not a contributor");
        require(!campaign.voted[msg.sender], "Already voted");

        campaign.voted[msg.sender] = true;
        campaign.totalVotes += campaign.contributions[msg.sender];

        // Approve milestone if majority (50%+ of raised amount) votes
        if (campaign.totalVotes * 2 > campaign.raised) {
            campaign.milestoneApproved = true;
            emit MilestoneApproved(_campaignId, campaign.totalVotes);
        }
    }

    // Release funds to creator if milestone approved
    function releaseFunds(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator");
        require(campaign.milestoneApproved, "Milestone not approved");
        require(!campaign.finalized, "Campaign finalized");
        require(campaign.raised >= campaign.goal, "Goal not met");

        campaign.finalized = true;
        require(usdc.transfer(campaign.creator, campaign.raised), "USDC transfer failed");

        emit FundsReleased(_campaignId, campaign.raised);
    }

    // Refund contributors if goal not met or milestone not approved
    function refund(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign ongoing");
        require(!campaign.finalized, "Campaign finalized");
        require(campaign.raised < campaign.goal || !campaign.milestoneApproved, "Funds releasable");

        campaign.finalized = true;
        uint256 contribution = campaign.contributions[msg.sender];
        require(contribution > 0, "No contribution");

        campaign.contributions[msg.sender] = 0;
        require(usdc.transfer(msg.sender, contribution), "USDC refund failed");

        emit Refunded(_campaignId, msg.sender, contribution);
    }

    // Get campaign details for transparency
    function getCampaign(uint256 _campaignId) external view returns (
        address creator,
        uint256 goal,
        uint256 deadline,
        uint256 raised,
        bool finalized,
        string memory milestoneDescription,
        bool milestoneApproved,
        uint256 totalVotes
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.goal,
            campaign.deadline,
            campaign.raised,
            campaign.finalized,
            campaign.milestoneDescription,
            campaign.milestoneApproved,
            campaign.totalVotes
        );
    }
}