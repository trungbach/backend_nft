// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;


import "./Market.sol";

import "hardhat/console.sol";

contract NFTMarketV2 is NFTMarket{

  function setFee(uint256 newFee) public {
    require(msg.sender == owner, "You aren't an admin");
    fee = newFee;
  }

  function getFee() public view returns(uint) {
    return fee;
  }

  function version() public pure returns (string memory) {
    // require(msg.sender == owner, "You aren't an admin");
    return "2.0.0";
  }
}