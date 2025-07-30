// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calculations {
    uint public num1;
    uint public num2;

    constructor(uint _num1, uint _num2) {
        num1 = _num1;
        num2 = _num2;
    }

    // View function (reads state)
    function addition1() public view returns (uint) {
        return num1 + num2;
    }

    // Pure function (no state access)
    function addition2(uint a, uint b) public pure returns (uint) {
        return a + b;
    }
}