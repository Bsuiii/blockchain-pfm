// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CurrencyConverter {
    // Ether to Wei (1 ether = 1e18 wei)
    function etherEnWei(uint montantEther) public pure returns (uint) {
        return montantEther * 1 ether;
    }

    // Wei to Ether
    function weiEnEther(uint montantWei) public pure returns (uint) {
        return montantWei / 1 ether;
    }
}