import Web3 from 'web3';
const TOKEN_ABI = require('../abis/Token.json');
export const TOKEN_CONTRACT_ADDRESS = "0x1C6Ca3545D7eC2Ff211eb570f5753196E18E8528"

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

export const stakeNFTs = async (address, tokenIds) => {
  const web3Instance = await getWeb3();
  try {
    const nftContract = new web3Instance.eth.Contract(
      TOKEN_ABI,
      TOKEN_CONTRACT_ADDRESS
    );
    const result = await nftContract.methods
      .stakeNFTs(tokenIds)
      .send({
        from: address
      });

    console.log(`Staked ${tokenIds.length} NFTs. Transaction: `);
    console.log(result.transactionHash)
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

export const unstakeNFTs = async (address, tokenIds) => {
  const web3Instance = await getWeb3();
  try {
    const nftContract = new web3Instance.eth.Contract(
      TOKEN_ABI,
      TOKEN_CONTRACT_ADDRESS
    );
    const result = await nftContract.methods
      .unstakeNFTs(tokenIds)
      .send({
        from: address
      });

    console.log(`Unstaked ${tokenIds.length} NFTs. Transaction: `);
    console.log(result.transactionHash)
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

export const stakeOf = async (address) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    TOKEN_ABI,
    TOKEN_CONTRACT_ADDRESS
  );

  return nftContract.methods
    .stakeOf(address)
    .call();
}

export const rewardOf = async (address) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    TOKEN_ABI,
    TOKEN_CONTRACT_ADDRESS
  );

  return nftContract.methods
    .rewardOf(address)
    .call();
}
