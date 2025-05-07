// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {OnChainFund} from "../src/OnChainFund.sol";

contract Deploy is Script {
    function run() external returns (OnChainFund) {
        // Base Mainnet USDC address
        address usdc = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
        
        vm.startBroadcast();
        OnChainFund fund = new OnChainFund(usdc);
        vm.stopBroadcast();
        
        return fund;
    }
} 