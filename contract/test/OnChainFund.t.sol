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
    string public constant TITLE = "Test Campaign";
    string public constant DESCRIPTION = "Test Description";
    string public constant CATEGORY = "Technology";

    event CampaignCreated(uint256 indexed campaignId, address creator, uint256 goal, uint256 deadline, string description);
    event Contributed(uint256 indexed campaignId, address contributor, uint256 amount);
    event ResultsSubmitted(uint256 indexed campaignId, address creator);
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
        emit CampaignCreated(0, creator, GOAL, block.timestamp + DURATION, DESCRIPTION);
        
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);
        
        (
            string memory title,
            string memory description,
            uint256 goalAmount,
            uint256 raisedAmount,
            address _creator,
            uint256 deadline,
            string memory category,
            bool isCompleted,
            bool hasSubmittedResults
        ) = fund.getCampaign(0);

        assertEq(title, TITLE);
        assertEq(description, DESCRIPTION);
        assertEq(goalAmount, GOAL);
        assertEq(raisedAmount, 0);
        assertEq(_creator, creator);
        assertEq(deadline, block.timestamp + DURATION);
        assertEq(category, CATEGORY);
        assertEq(isCompleted, false);
        assertEq(hasSubmittedResults, false);

        vm.stopPrank();
    }

    function test_Contribute() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);

        // Approve and contribute
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 500e6);
        
        vm.expectEmit(true, true, true, true);
        emit Contributed(0, contributor1, 500e6);
        
        fund.contribute(0, 500e6);
        vm.stopPrank();

        (,,,uint256 raisedAmount,,,,,) = fund.getCampaign(0);
        assertEq(raisedAmount, 500e6);
    }

    function test_SubmitResultsAndReleaseFunds() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);

        // Contributors contribute
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 600e6);
        fund.contribute(0, 600e6);
        vm.stopPrank();

        vm.startPrank(contributor2);
        usdc.approve(address(fund), 400e6);
        fund.contribute(0, 400e6);
        vm.stopPrank();

        // Submit results
        vm.startPrank(creator);
        vm.expectEmit(true, true, true, true);
        emit ResultsSubmitted(0, creator);
        fund.submitResults(0);

        // Release funds
        uint256 creatorBalanceBefore = usdc.balanceOf(creator);
        
        vm.expectEmit(true, true, true, true);
        emit FundsReleased(0, GOAL);
        fund.releaseFunds(0);

        uint256 creatorBalanceAfter = usdc.balanceOf(creator);
        assertEq(creatorBalanceAfter - creatorBalanceBefore, GOAL);
        vm.stopPrank();

        (,,,,,,,,bool isCompleted) = fund.getCampaign(0);
        assertTrue(isCompleted, "Campaign should be completed");
    }

    function test_Refund() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);

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

        // Campaign should be completed after all contributions are refunded
        (,,,,,,,bool isCompleted,) = fund.getCampaign(0);
        assertTrue(isCompleted, "Campaign should be completed");
    }

    function test_MultipleContributorsRefund() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);

        // First contributor contributes
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 600e6);
        fund.contribute(0, 600e6);
        vm.stopPrank();

        // Second contributor contributes
        vm.startPrank(contributor2);
        usdc.approve(address(fund), 300e6);
        fund.contribute(0, 300e6);
        vm.stopPrank();

        // Fast forward to campaign end
        vm.warp(block.timestamp + DURATION + 1);

        // First contributor gets refund
        vm.startPrank(contributor1);
        uint256 balanceBefore1 = usdc.balanceOf(contributor1);
        fund.refund(0);
        uint256 balanceAfter1 = usdc.balanceOf(contributor1);
        assertEq(balanceAfter1 - balanceBefore1, 600e6);
        vm.stopPrank();

        // Check campaign is not completed yet
        (,,,,,,,bool isCompleted1,) = fund.getCampaign(0);
        assertFalse(isCompleted1, "Campaign should not be completed after first refund");

        // Second contributor gets refund
        vm.startPrank(contributor2);
        uint256 balanceBefore2 = usdc.balanceOf(contributor2);
        fund.refund(0);
        uint256 balanceAfter2 = usdc.balanceOf(contributor2);
        assertEq(balanceAfter2 - balanceBefore2, 300e6);
        vm.stopPrank();

        // Check campaign is now completed
        (,,,,,,,bool isCompleted2,) = fund.getCampaign(0);
        assertTrue(isCompleted2, "Campaign should be completed after all refunds");
    }
    
    function testFail_ContributeAfterDeadline() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);

        // Fast forward past deadline
        vm.warp(block.timestamp + DURATION + 1);

        // Try to contribute
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 500e6);
        fund.contribute(0, 500e6); // Should revert
        vm.stopPrank();
    }

    function testFail_SubmitResultsBeforeGoal() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);

        // Contribute less than goal
        vm.startPrank(contributor1);
        usdc.approve(address(fund), 500e6);
        fund.contribute(0, 500e6);
        vm.stopPrank();

        // Try to submit results
        vm.prank(creator);
        fund.submitResults(0); // Should revert
    }

    function testFail_SubmitResultsAfterDeadline() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);

        // Contribute full amount
        vm.startPrank(contributor1);
        usdc.approve(address(fund), GOAL);
        fund.contribute(0, GOAL);
        vm.stopPrank();

        // Fast forward past deadline
        vm.warp(block.timestamp + DURATION + 1);

        // Try to submit results
        vm.prank(creator);
        fund.submitResults(0); // Should revert
    }

    function testFail_ReleaseFundsWithoutResults() public {
        // Create campaign
        vm.prank(creator);
        fund.createCampaign(TITLE, DESCRIPTION, GOAL, DURATION, CATEGORY);

        // Contribute full amount
        vm.startPrank(contributor1);
        usdc.approve(address(fund), GOAL);
        fund.contribute(0, GOAL);
        vm.stopPrank();

        // Try to release funds without submitting results
        vm.prank(creator);
        fund.releaseFunds(0); // Should revert
    }
} 