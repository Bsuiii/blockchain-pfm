// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    address public recipient;

    constructor(address _recipient) {
        recipient = _recipient;
    }

    receive() external payable {}

    function receivePayment() public payable {
        require(msg.value > 0, "Amount must be > 0");
    }

    function withdraw() public {
        require(msg.sender == recipient, "Only recipient can withdraw");
        payable(recipient).transfer(address(this).balance);
    }
}