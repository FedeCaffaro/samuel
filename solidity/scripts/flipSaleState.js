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
const NUMBER_OF_TOKENS = 5;

if (!MNEMONIC || !OWNER_ADDRESS || !NETWORK) {
    console.error(
        "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
    );
    return;
}

const NFT_ABI = [
    {
        constant: false,
        inputs: [],
        name: "flipSaleState",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
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
            .flipSaleState()
            .send({
                from: OWNER_ADDRESS
            });
        console.log(JSON.stringify(result))
        console.log("Sale is now active. Transaction: " + result.transactionHash);
    } else {
        console.error(
            "Add NFT_CONTRACT_ADDRESS to the environment variables"
        );
    }
}

main();