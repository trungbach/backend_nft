
const tokenUri =  'https://ipfs.infura.io/ipfs/QmQTiE8EnV2pGm9csZRDLHrbASWhPjnpbcX1uQfEdGcA76'
const arr = tokenUri.split('/');
const token = arr[arr.length - 1]
console.log(token)