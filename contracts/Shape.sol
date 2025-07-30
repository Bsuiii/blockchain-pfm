// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Forme {
    uint public x;
    uint public y;

    constructor(uint _x, uint _y) {
        x = _x;
        y = _y;
    }

    // Virtual function to be overridden - calculates surface area
    function surface() public virtual view returns (uint);

    // Moves the shape by dx/dy units
    function deplacerForme(uint dx, uint dy) public {
        x += dx;
        y += dy;
    }

    // Returns current coordinates
    function afficheXY() public view returns (uint, uint) {
        return (x, y);
    }

    // Virtual function for shape info - pure as it returns constant
    function afficheInfos() public virtual pure returns (string memory) {
        return "Je suis une forme";
    }
}