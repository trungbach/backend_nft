const { ethers, upgrades } = require("hardhat");
const fs = require('fs');
require('@openzeppelin/hardhat-upgrades');
async function main() {
  const HSNToken = await ethers.getContractFactory("HSNToken");
  const hsn = await upgrades.deployProxy(HSNToken, [], { initializer: 'initialize' });
  await hsn.deployed();
  console.log("hsn deployed to:", hsn.address);


  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await upgrades.deployProxy(NFTMarket, [hsn.address], { initializer: 'initialize' });
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  let config = `
  exports.nftmarketaddress = "${nftMarket.address}"
  exports.nftaddress = "${nft.address}"
  exports.hsnaddress = "${hsn.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
