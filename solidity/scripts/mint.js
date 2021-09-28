const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
require('dotenv').config()

// config params
const MNEMONIC = process.env.MNEMONIC
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS
const NETWORK_URL = process.env.NETWORK_URL
const NETWORK = process.env.NETWORK

// input params
const NUMBER_OF_TOKENS = 1;

if (!MNEMONIC || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "numberOfTokens",
        type: "uint256",
      }
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "payable",
    type: "function",
  },
];

async function main() {
  const provider = new HDWalletProvider(
    MNEMONIC,
    NETWORK_URL
  );
  const web3Instance = new web3(provider);

  if (NFT_CONTRACT_ADDRESS) {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      //{ gasLimit: "1000000" }
    );

    // Creatures issued directly to the owner.
    const result = await nftContract.methods
      .mint(OWNER_ADDRESS, NUMBER_OF_TOKENS)
      .send({ 
        from: OWNER_ADDRESS,
        value: web3.utils.toHex(web3.utils.toWei("0.2", "ether")),
      });
    console.log(JSON.stringify(result))
    console.log("Minted NFTs. Transaction: " + result.transactionHash);
  } else {
    console.error(
      "Add NFT_CONTRACT_ADDRESS to the environment variables"
    );
  }
}

main();
