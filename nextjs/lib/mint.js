import Web3 from 'web3';

const isBrowser = typeof window !== "undefined"
let CONTRACT_ADDRESS = "0x49fDbfa1126638CE7eF2CA1A0f7759109f12595d" // mainnet
if (isBrowser && (window.location.hostname.includes('dev') || window.location.hostname.includes('localhost'))) {
  CONTRACT_ADDRESS = "0xD26C84db8652f68B9ea24996a53566A7FFBA9DdD" // rinkeby
}

export const NFT_CONTRACT_ADDRESS = CONTRACT_ADDRESS

const NFT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "numberOfTokens",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [],
    name: "totalSupply",
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
  },
  {
    inputs: [],
    name: "maxToMint",
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
  },
  {
    inputs: [],
    name: "getNFTPrice",
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
  },
  {
    inputs: [],
    name: "saleIsActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  }
];

const getWeb3Instance = () => new Promise((resolve) => {
  const isBrowser = typeof window !== "undefined"
  if (isBrowser) {
    let currentWeb3;
    if (window.ethereum) {
      currentWeb3 = new Web3(window.ethereum);

      // Acccounts now exposed
      resolve(currentWeb3);
      try {
      } catch (error) {
        // User denied account access...
        alert('Please allow access for the app to work');
      }
    } else if (window.web3) {
      currentWeb3 = new Web3(window.web3.currentProvider);
      // Acccounts always exposed
      resolve(currentWeb3);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
})

const getWeb3 = async (options = {}) => {
  const web3 = await getWeb3Instance()
  return web3
}

export const mint = async (address, numberOfTokens, mintPrice) => {
  const web3Instance = await getWeb3();
  try {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS
    );

    const result = await nftContract.methods
      .mint(address, numberOfTokens)
      .send({
        from: address,
        value: mintPrice * numberOfTokens
      });

    console.log("Minted Samot NFTs. Transaction: " + result.transactionHash);
    return {
      transactionHash: result.transactionHash,
    }
  } catch (error) {
    console.log(error)
    const reason = error.message.split(":")
    return {
      error: reason.length ? reason[1] : "Minting error.",
    }
  }
};

export const totalSupply = async () => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS
  );

  return nftContract.methods
    .totalSupply()
    .call();
}

export const mintPrice = async () => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS
  );

  return nftContract.methods
    .getNFTPrice()
    .call();
}

export const maxToMint = async () => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS
  );

  return nftContract.methods
    .maxToMint()
    .call();
}

export const saleIsActive = async () => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS
  );

  return nftContract.methods
    .saleIsActive()
    .call();
}
