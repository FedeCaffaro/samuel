const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const _ = require('lodash')
const s3 = require('./lib/s3')

const MNEMONIC = process.env.MNEMONIC
const CONTRACT_ADDRESS=process.env.CONTRACT_ADDRESS
const NETWORK_URL=process.env.NETWORK_URL

const CONTRACT_ABI = [,
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
  const assetsBucket = `samotclub-assets-${process.env.ENV}`
  const tokenId = event.pathParameters.tokenId
  if (process.env.REVEAL) {
    const body = await getMetadata(tokenId)
    if (body && body.image && body.name && body.description && body.attributes) {
      return {
        statusCode: 200,
        body: JSON.stringify(body)
      }
    } else {
      let metadata = await s3.getObject(`metadata/default`, assetsBucket)
      return {
        statusCode: 200,
        body: metadata.Body.toString()
      }
    }
  } else {
    let metadata = await s3.getObject(`metadata/default`, assetsBucket)
    const body = {
      ...metadata.Body,
      name: `#${tokenId}`
    }
    return {
      statusCode: 200,
      body: JSON.stringify(body)
    }
  }
}

exports.contract = async (event) => {
  const assetsBucket = `samotclub-assets-${process.env.ENV}`
  let metadata = await s3.getObject(`collection/contract`, assetsBucket)
  return {
    statusCode: 200,
    body: metadata.Body.toString()
  }
}

const getMetadata = async (tokenId) => {
  const index = parseInt(tokenId) - 1
  try {
      const assetsBucket = `samotclub-assets-${process.env.ENV}`
      const sourceBucket = `samotclub-source-${process.env.ENV}`
      try {
        let metadata = await s3.getObject(`metadata/${tokenId}`, assetsBucket)
        return JSON.parse(metadata.Body)
      } catch (e) {
        const provider = new HDWalletProvider(
          MNEMONIC,
          NETWORK_URL
        );
        const web3Instance = new web3(provider);
        const contract = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS,
        );
        const response = await contract.methods
          .tokenByIndex(index)
          .call();
        if (typeof parseInt(response) === 'number' && parseInt(response) == parseInt(tokenId)) {
          let metadata = await s3.getObject(`metadata/${tokenId}`, sourceBucket)
          await s3.putObject(`metadata/${tokenId}`, assetsBucket, metadata.Body)
          let image = await s3.getObject(`images/${tokenId}.${process.env.IMAGE_TYPE}`, sourceBucket)
          await s3.putObject(`images/${tokenId}.${process.env.IMAGE_TYPE}`, assetsBucket, image.Body)
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
