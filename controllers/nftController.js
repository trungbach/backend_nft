'use strict';

const ethers = require('ethers');
const axios = require('axios');
const Web3Modal = require('web3modal');
const config = require('../config');

const NFT = require('../artifacts/contracts/NFT.sol/NFT.json');
const Market = require('../artifacts/contracts/Market.sol/NFTMarket.json');

exports.list_all_items = async function (req, res) {
    const provider = new ethers.getDefaultProvider()
    const tokenContract = new ethers.Contract(config.nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(config.nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
        }
        return item
    }))
    res.send({ message: "Success", data: items })
};

exports.create_item = async function (req, res) {
    const { address, url, price, symbol } = req.body
    const provider = new ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/")
    const signer = provider.getSigner(address) 
    let contract = new ethers.Contract(config.nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const priceToken = ethers.utils.parseUnits(price, symbol) //symbol = ether

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(config.nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(config.nftaddress, tokenId, priceToken, { value: listingPrice })
    await transaction.wait()
    res.send({ message: "Success" })
};

exports.list_item_created = async function (req, res) {
    const { address } = req.body
    const provider = new ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/")
    const signer = provider.getSigner(address) 
    const marketContract = new ethers.Contract(config.nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(config.nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            image: meta.data.image,
        }
        return item
    }))
    res.send({ message: "Success", data: items })
};

exports.list_item_bought = async function (req, res) {
    const { address } = req.body
    const provider = new ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/")
    const signer = provider.getSigner(address) 
    const marketContract = new ethers.Contract(config.nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(config.nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    res.send({ message: "Success", data: items })
};

exports.detail_item = async function (req, res) {
    var id = req.params.id
    const provider = new ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com/")
    const tokenContract = new ethers.Contract(config.nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(config.nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchDetailItem(id)

    const tokenUri = await tokenContract.tokenURI(data.tokenId)
    const meta = await axios.get(tokenUri)
    let price = ethers.utils.formatUnits(data.price.toString(), 'ether')
    let item = {
        price,
        tokenId: data.tokenId.toNumber(),
        seller: data.seller,
        owner: data.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
    }
    res.send({ message: "Success", data: item })
};