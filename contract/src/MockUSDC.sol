// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    constructor(address initialOwner) 
        ERC20("USD Coin", "USDC") 
        Ownable(initialOwner)
    {
        // Mint 1,000,000 USDC to the owner (with 6 decimals)
        _mint(initialOwner, 1_000_000 * 10**6);
    }

    // Override decimals to match USDC's 6 decimals
    function decimals() public pure override returns (uint8) {
        return 6;
    }
} 