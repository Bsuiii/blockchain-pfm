// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol"; // For string operations


contract GestionChaines {
    string public message;

    function setMessage(string memory _message) public {
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function concatener(string memory a, string memory b) public pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }

    function concatenerAvec(string memory _texte) public view returns (string memory) {
        return string.concat(message, _texte);
    }

    function longueur(string memory s) public pure returns (uint) {
        return bytes(s).length;
    }

    function comparer(string memory a, string memory b) public pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}