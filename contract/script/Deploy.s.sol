// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/OnChainFund.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = 0x4CF9C3CB8b1cDA01e69E55dfE1c69c2b84Aa0bd1;

        vm.startBroadcast(deployerPrivateKey);

        // Deploy MockUSDC first
        MockUSDC mockUSDC = new MockUSDC(owner);
        
        // Deploy OnChainFund with the MockUSDC address
        OnChainFund onChainFund = new OnChainFund(address(mockUSDC));

        vm.stopBroadcast();

        // Log the deployed addresses
        console.log("MockUSDC deployed to:", address(mockUSDC));
        console.log("OnChainFund deployed to:", address(onChainFund));
    }
} 