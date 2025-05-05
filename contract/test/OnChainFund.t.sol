// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {OnChainFund} from "../src/OnChainFund.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract OnChainFundTest is Test {
    OnChainFund public fund;
    MockERC20 public usdc;
    
    address public creator = address(1);
    address public contributor1 = address(2);
    address public contributor2 = address(3);
    
    uint256 public constant GOAL = 1000e6; // 1000 USDC
    uint256 public constant DURATION = 7 days;
    string public constant MILESTONE = "Build MVP";

    event CampaignCreated(uint256 indexed campaignId, address creator, uint256 goal, uint256 deadline, string milestoneDescription);
    event Contributed(uint256 indexed campaignId, address contributor, uint256 amount);
    event MilestoneApproved(uint256 indexed campaignId, uint256 totalVotes);
    event FundsReleased(uint256 indexed campaignId, uint256 amount);
    event Refunded(uint256 indexed campaignId, address contributor, uint256 amount);

    function setUp() public {
        // Deploy mock USDC and OnChainFund
        usdc = new MockERC20("USDC", "USDC", 6);
        fund = new OnChainFund(address(usdc));

        // Mint USDC to contributors
        usdc.mint(contributor1, 1000e6);
        usdc.mint(contributor2, 1000e6);

        vm.label(creator, "Creator");
        vm.label(contributor1, "Contributor1");
        vm.label(contributor2, "Contributor2");
    }

    function test_CreateCampaign() public {
        vm.startPrank(creator);
        
        vm.expectEmit(true, true, true, true);
        emit CampaignCreated(0, creator, GOAL, block.timestamp + DURATION, MILESTONE);
        
        fund.createCampaign(GOAL, DURATION, MILESTONE);
        
        (
            address _creator,
            uint256 _goal,
            uint256 _deadline,
            uint256 _raised,
            bool _finalized,
            string memory _milestone,
            bool _milestoneApproved,
            uint256 _totalVotes
        ) = fund.getCampaign(0);

        assertEq(_creator, creator);
        assertEq(_goal, GOAL);
        assertEq(_deadline, block.timestamp + DURATION);
        assertEq(_raised, 0);
        assertEq(_finalized, false);
        assertEq(_milestone, MILESTONE);
        assertEq(_milestoneApproved, false);
        assertEq(_totalVotes, 0);

        vm.stopPrank();
    }

    function test_Contribute() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(GOAL, DURATION, MILESTONE);

        // Approve and contribute
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 500e6);
        
        vm.expectEmit(true, true, true, true);
        emit Contributed(0, contributor1, 500e6);
        
        fund.contribute(0, 500e6);
        vm.stopPrank();

        (,,,uint256 raised,,,,) = fund.getCampaign(0);
        assertEq(raised, 500e6);
    }

    function test_VoteAndReleaseFunds() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(GOAL, DURATION, MILESTONE);

        // Contributors contribute
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 600e6);
        fund.contribute(0, 600e6);
        vm.stopPrank();

        vm.startPrank(contributor2);
        usdc.approve(address(fund), 400e6);
        fund.contribute(0, 400e6);
        vm.stopPrank();

        // Fast forward to campaign end
        vm.warp(block.timestamp + DURATION + 1);

        // Vote for milestone
        vm.prank(contributor1);
        fund.voteForMilestone(0);

        (,,,,,,bool milestoneApproved,) = fund.getCampaign(0);
        assertTrue(milestoneApproved, "Milestone should be approved");

        // Release funds
        uint256 creatorBalanceBefore = usdc.balanceOf(creator);
        
        vm.prank(creator);
        fund.releaseFunds(0);

        uint256 creatorBalanceAfter = usdc.balanceOf(creator);
        assertEq(creatorBalanceAfter - creatorBalanceBefore, GOAL);
    }

    function test_Refund() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(GOAL, DURATION, MILESTONE);

        // Contribute less than goal
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 500e6);
        fund.contribute(0, 500e6);

        // Fast forward to campaign end
        vm.warp(block.timestamp + DURATION + 1);

        // Get refund
        uint256 balanceBefore = usdc.balanceOf(contributor1);
        
        vm.expectEmit(true, true, true, true);
        emit Refunded(0, contributor1, 500e6);
        
        fund.refund(0);
        vm.stopPrank();

        uint256 balanceAfter = usdc.balanceOf(contributor1);
        assertEq(balanceAfter - balanceBefore, 500e6);
    }

    function testFail_ContributeAfterDeadline() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(GOAL, DURATION, MILESTONE);

        // Fast forward past deadline
        vm.warp(block.timestamp + DURATION + 1);

        // Try to contribute
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 500e6);
        fund.contribute(0, 500e6); // Should revert
        vm.stopPrank();
    }

    function testFail_DoubleVote() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(GOAL, DURATION, MILESTONE);

        // Contribute
        vm.startPrank(contributor1);
        usdc.approve(address(fund), GOAL);
        fund.contribute(0, GOAL);

        // Fast forward to end
        vm.warp(block.timestamp + DURATION + 1);

        // Try to vote twice
        fund.voteForMilestone(0);
        fund.voteForMilestone(0); // Should revert
        vm.stopPrank();
    }
} 