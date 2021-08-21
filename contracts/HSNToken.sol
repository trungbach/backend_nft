// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title HSNToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */

contract HSNToken is ERC20 {
    constructor() ERC20("HSNToken", "HSN") {
        _mint(msg.sender, 1000000000 * (10 ** uint256(decimals())));
    }

    function mintMinerReward() public {
        _mint(block.coinbase, 1000);
    }
}