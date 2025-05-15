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

        address usdcAddress;
        // Check if MOCK_USDC_ADDRESS env var is set
        string memory usdcEnv = vm.envOr("MOCK_USDC_ADDRESS", string("") );
        if (bytes(usdcEnv).length > 0) {
            usdcAddress = vm.parseAddress(usdcEnv);
            console.log("Using existing MockUSDC at:", usdcAddress);
        } else {
            MockUSDC mockUSDC = new MockUSDC(owner);
            usdcAddress = address(mockUSDC);
            console.log("Deployed new MockUSDC to:", usdcAddress);
        }
        
        // Deploy OnChainFund with the USDC address
        OnChainFund onChainFund = new OnChainFund(usdcAddress);

        vm.stopBroadcast();

        console.log("OnChainFund deployed to:", address(onChainFund));
    }
} 