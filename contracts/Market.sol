// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuardUpgradeable {
  using SafeERC20 for IERC20;
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  address payable owner;
  uint256 public listingPrice;
  IERC20 public token;
  uint256 public fee;

  function initialize(address hsnToken) public initializer {
        owner = payable(msg.sender);
        listingPrice = 0.025 ether;
        fee = 1;
        token = IERC20(hsnToken);
    }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
    bool isEth;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
    bool isEth
  );

  /* Returns the listing price of the contract */
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }
  
  /* Places an item for sale on the marketplace */
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value > 0, "Value must be at least 1 wei");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
  
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false,
      true
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    owner.transfer(msg.value);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false,
      true
    );
  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    bool isEth = idToMarketItem[itemId].isEth;

    require(msg.value >= price, "Please submit the asking price in order to complete the purchase");
    require(isEth == true, "Symbol is't ETH");
    
    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
  }

  /* Returns all unsold market items */
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns onlyl items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchDetailItem(uint256 itemId) public view returns (MarketItem memory) {
    MarketItem storage currentItem = idToMarketItem[itemId];
    return currentItem;
  }

  function reCreateMarketItem(
    address nftContract,
    uint256 itemId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value > 0, "Value must be at least 1 wei");

    uint tokenId = idToMarketItem[itemId].tokenId;
    bool isEth = idToMarketItem[itemId].isEth;

    require(msg.sender == IERC721(nftContract).ownerOf(tokenId), "NOT OWNER");
    require(isEth == true, "Symbol is't ETH");

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    owner.transfer(msg.value);

    idToMarketItem[itemId].seller = payable(msg.sender);
    idToMarketItem[itemId].owner = payable(address(0));
    idToMarketItem[itemId].sold = false;
    idToMarketItem[itemId].price = price;
    _itemsSold.decrement();
  }

  function createMarketItemByHSN(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public  payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    console.log("createMarketItemByHSN price", price);

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
  
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false,
      false
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    token.transferFrom(msg.sender, address(this), (price * fee) / 100);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false,
      false
    );

  }

  function createMarketSaleByHSN(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    bool isEth = idToMarketItem[itemId].isEth;

    require(isEth == false, "Symbol is ETH");

    token.safeTransferFrom(msg.sender, idToMarketItem[itemId].seller, price);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _itemsSold.increment();
  }

  function reCreateMarketItemByHSN(
    address nftContract,
    uint256 itemId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");

    uint tokenId = idToMarketItem[itemId].tokenId;
    bool isEth = idToMarketItem[itemId].isEth;

    require(isEth == false, "Symbol is ETH");
    require(msg.sender == IERC721(nftContract).ownerOf(tokenId), "NOT OWNER");

    token.safeTransferFrom(msg.sender, owner, (price * fee) / 100);
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    idToMarketItem[itemId].seller = payable(msg.sender);
    idToMarketItem[itemId].owner = payable(address(0));
    idToMarketItem[itemId].sold = false;
    idToMarketItem[itemId].price = price;
    _itemsSold.decrement();
  }
}