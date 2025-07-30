// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Shape.sol";

contract Rectangle is Forme {
    uint public lo; // Length
    uint public la; // Width

    constructor(uint _x, uint _y, uint _length, uint _width) Forme(_x, _y) {
        lo = _length;
        la = _width;
    }

    // Calculates surface area (length * width)
    function surface() public view override returns (uint) {
        return lo * la;
    }

    // Returns rectangle-specific info
    function afficheInfos() public pure override returns (string memory) {
        return "Je suis un Rectangle";
    }

    // Returns dimensions (length and width)
    function afficheDimensions() public view returns (uint, uint) {
        return (lo, la);
    }

    // Alternative name for dimensions (compatibility)
    function afficheLoLa() public view returns (uint, uint) {
        return afficheDimensions();
    }
}