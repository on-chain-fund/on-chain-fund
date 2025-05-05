// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {OnChainFund} from "../src/OnChainFund.sol";

contract Deploy is Script {
    function run() external returns (OnChainFund) {
        // Base Sepolia USDC address
        address usdc = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
        
        vm.startBroadcast();
        OnChainFund fund = new OnChainFund(usdc);
        vm.stopBroadcast();
        
        return fund;
    }
} 