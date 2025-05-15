// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OnChainFund.sol";

contract MigrateScript is Script {
    // Old contract address
    address constant OLD_CONTRACT = 0xDF2B33031Fc00C46c77d823cA6C287B0b79c5BcA;
    // New contract address
    address constant NEW_CONTRACT = 0x0AA77a866f3d7F61b294477c87cD41817CA5c6a0;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Create instances of both contracts
        OnChainFund oldFund = OnChainFund(OLD_CONTRACT);
        OnChainFund newFund = OnChainFund(NEW_CONTRACT);

        // Get total number of campaigns
        uint256 campaignCount = oldFund.campaignCount();
        console.log("Total campaigns to migrate:", campaignCount);

        // Migrate each campaign
        for (uint256 i = 0; i < campaignCount; i++) {
            (
                string memory title,
                string memory description,
                uint256 goalAmount,
                uint256 raisedAmount,
                address creator,
                uint256 deadline,
                string memory category,
                bool isCompleted,
                bool hasSubmittedResults
            ) = oldFund.getCampaign(i);

            // Calculate remaining duration
            uint256 remainingDuration = deadline > block.timestamp ? deadline - block.timestamp : 0;

            // Create campaign in new contract
            newFund.createCampaign(
                title,
                description,
                goalAmount,
                remainingDuration,
                category
            );

            // If campaign is completed or has submitted results, update the state
            if (isCompleted || hasSubmittedResults) {
                if (hasSubmittedResults) {
                    newFund.submitResults(i);
                }
                if (isCompleted) {
                    newFund.releaseFunds(i);
                }
            }

            console.log("Migrated campaign:", i);
        }

        vm.stopBroadcast();
    }
} 