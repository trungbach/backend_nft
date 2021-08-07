require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const fs = require('fs');
const privateKey = process.env.ACCOUNT.trim() || "01234567890123456789";

// infuraId is optional if you are using Infura RPC
const infuraId = process.env.INFURA_ID.trim() || "";

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
      accounts: [privateKey]
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