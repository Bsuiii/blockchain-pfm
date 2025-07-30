// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PositiveCheck {
    function estPositif(int256 _nombre) public pure returns (bool) {
        return _nombre >= 0;
    }
}