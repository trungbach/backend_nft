require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');

require("dotenv").config();
const privateKey = process.env.ACCOUNT.trim() || "01234567890123456789";

// infuraId is optional if you are using Infura RPC
const infuraId = process.env.INFURA_ID.trim() || "";
const ALCHEMY_API_KEY = 'ypetA5pcywOjDD6-dskWbc29N7z0Ettj'
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
      url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey]
    },
    matic: {
      // Infura
      url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      // url: "https://rpc-mainnet.maticvigil.com",
      accounts: [privateKey]
    },
    ropsten: {
      // Infura
      url: `https://ropsten.infura.io/v3/${infuraId}`,
      // url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey],
    },
    goerli: {
      // Infura goerli
      // url: `https://goerli.infura.io/v3/${infuraId}`,
      // https://chris-anatalio.infura-ipfs.io/ipfs
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [privateKey],
    },
    binancetest: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [privateKey]
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};