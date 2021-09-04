const { ethers, upgrades } = require("hardhat");

async function main() {

  const NFTMarketV2 = await ethers.getContractFactory("NFTMarketV2");
  const nftMarket = await upgrades.upgradeProxy("0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f", NFTMarketV2);
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
