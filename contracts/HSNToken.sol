// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

/**
 * @title HSNToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */

contract HSNToken is ERC20Upgradeable {
    address payable owner;

    function initialize() public initializer {
        __ERC20_init("BVT", "BVT");
        owner = payable(msg.sender);
        _mint(msg.sender, 1000000000 * (10 ** uint256(decimals())));
    }

    function mintMinerReward() public {
        require(msg.sender == owner, "You aren't an admin");
        _mint(block.coinbase, 1000);
    }
}