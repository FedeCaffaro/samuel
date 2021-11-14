const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const _ = require('lodash')
const s3 = require('./lib/s3')

const MNEMONIC = process.env.MNEMONIC
const NETWORK_URL=process.env.NETWORK_URL

// add new projects here
const CONTRACT_ADDRESSES = [
  {name: 'samotclub', contract: '0x49fDbfa1126638CE7eF2CA1A0f7759109f12595d'},
  {name: 'pyramyd', contract: '0x7467e6e48AF4C3D71978A6af34ca2116384DceC2'},
]

const CONTRACT_ABI = [
  {
    inputs: [{
      internalType: "uint256",
      name: "index",
      type: "uint256",
    }],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  }
];

exports.token = async (event) => {
  const tokenId = event.pathParameters.tokenId
  const collection = _.find(CONTRACT_ADDRESSES, {
    name: event.pathParameters.collection
  })
  const assetsBucket = `samotclub-assets-${process.env.ENV}`
  if (process.env.REVEAL) {
    const body = await getMetadata(collection, tokenId)
    if (body && body.image && body.name && body.description && body.attributes) {
      return {
        statusCode: 200,
        body: JSON.stringify(body)
      }
    } else {
      let metadata = await s3.getObject(`${collection}/metadata/default`, assetsBucket)
      return {
        statusCode: 200,
        body: metadata.Body.toString()
      }
    }
  } else {
    let metadata = await s3.getObject(`${collection}/metadata/default`, assetsBucket)
    let body = JSON.parse(metadata.Body.toString())
    body.name = `#${tokenId}`
    return {
      statusCode: 200,
      body: JSON.stringify(body)
    }
  }
}

exports.contract = async (event) => {
  const collection = _.find(CONTRACT_ADDRESSES, {
    name: event.pathParameters.collection
  })
  const assetsBucket = `samotclub-assets-${process.env.ENV}`
  let metadata = await s3.getObject(`${collection.name}/collection/contract`, assetsBucket)
  return {
    statusCode: 200,
    body: metadata.Body.toString()
  }
}

const getMetadata = async (collection, tokenId) => {
  const index = parseInt(tokenId) - 1
  try {
      const assetsBucket = `samotclub-assets-${process.env.ENV}`
      const sourceBucket = `samotclub-source-${process.env.ENV}`
      try {
        let metadata = await s3.getObject(`${collection.name}/metadata/${tokenId}`, assetsBucket)
        return JSON.parse(metadata.Body)
      } catch (e) {
        const provider = new HDWalletProvider(
          MNEMONIC,
          NETWORK_URL
        );
        const web3Instance = new web3(provider);
        const contract = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          collection.contract,
        );
        const response = await contract.methods
          .tokenByIndex(index)
          .call();
        if (typeof parseInt(response) === 'number' && parseInt(response) == parseInt(tokenId)) {
          let metadata = await s3.getObject(`${collection.name}/metadata/${tokenId}`, sourceBucket)
          await s3.putObject(`${collection.name}/metadata/${tokenId}`, assetsBucket, metadata.Body)
          let image = await s3.getObject(`${collection.name}/images/${tokenId}.png`, sourceBucket)
          await s3.putObject(`${collection.name}/images/${tokenId}.png`, assetsBucket, image.Body)
          return JSON.parse(metadata.Body)
        } else {
          return false
        }
      }
    
  } catch (e) {
    console.log(e)
    return false
  }
}
