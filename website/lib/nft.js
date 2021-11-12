import Web3 from 'web3';
import NFT_ABI from '../abis/NFT.json';
import TOKEN_ABI from '../abis/Token.json';
import { TOKEN_CONTRACT_ADDRESS }  from '../lib/token';
export const NFT_CONTRACT_ADDRESS = "0xC4D1dA9Aa2C1c7BEa9a2055B266108DBE01a08d3"

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

export const isApprovedForAll = async (address) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS
  );

  return nftContract.methods
    .isApprovedForAll(address, TOKEN_CONTRACT_ADDRESS)
    .call();
}

export const setApproveForAll = async (address) => {
  const web3Instance = await getWeb3();
  try {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS
    );
    const isApproved = await nftContract.methods
        .isApprovedForAll(address, TOKEN_CONTRACT_ADDRESS).call();
    if (!isApproved) {
      const result = await nftContract.methods
          .setApprovalForAll(TOKEN_CONTRACT_ADDRESS, true)
          .send({
            from: address
          });

      console.log("Approved. Transaction: " + result.transactionHash);
      return {
        transactionHash: result.transactionHash,
      }
    } else {
      return {
        transactionsHash: ""
      }
    }
  } catch (error) {
    console.log(error)
    const reason = error.message.split(":")
    return {
      error: reason.length ? reason[1] : "Approval error.",
    }
  }
};

export const mint = async (contract, address, numberOfTokens, mintPrice) => {
  const web3Instance = await getWeb3();
  try {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      contract
    );

    const result = await nftContract.methods
      .mint(numberOfTokens)
      .send({
        from: address,
        value: mintPrice * numberOfTokens
      });

    console.log("Minted NFTs. Transaction: " + result.transactionHash);
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

export const balanceOf = async (contract, address) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    contract
  );

  return nftContract.methods
    .balanceOf(address)
    .call();
}

export const totalSupply = async (contract) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    contract
  );

  return nftContract.methods
    .totalSupply()
    .call();
}

export const maxSupply = async (contract) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    contract
  );

  return nftContract.methods
    .MAX_SUPPLY()
    .call();
}

export const mintPrice = async (contract) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    contract
  );

  return nftContract.methods
    .mintPrice()
    .call();
}

export const maxToMintPerNFT = async (contract) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    contract
  );

  return nftContract.methods
    .maxToMintPerNFT()
    .call();
}

export const maxToMint = async (contract) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    contract
  );

  return nftContract.methods
    .maxToMint()
    .call();
}

export const saleIsActive = async (contract) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    contract
  );

  return nftContract.methods
    .saleIsActive()
    .call();
}