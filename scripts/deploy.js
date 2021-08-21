const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const HSNToken = await hre.ethers.getContractFactory("HSNToken");
  const hsn = await HSNToken.deploy();
  await hsn.deployed();
  console.log("hsn deployed to:", hsn.address);

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy(hsn.address);
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
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
