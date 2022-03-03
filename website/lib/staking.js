import Web3 from 'web3';
import _ from 'lodash';

import STAKING_ABI from '../abis/Staking.json';
import TOKEN_ABI from '../abis/Token.json';
import NFT2_ABI from '../abis/NFT.json';

export const STAKING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
export const TOKEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
export const TOKENV2_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKENV2_CONTRACT_ADDRESS;
export const NFT2_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT2_CONTRACT_ADDRESS;

const getWeb3Instance = () =>
  new Promise((resolve) => {
    const isBrowser = typeof window !== 'undefined';
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
      }
    }
  });

const getWeb3 = async () => {
  const web3 = await getWeb3Instance();
  return web3;
};

export const stakeNFTs = async (address, tokenIds) => {
  const web3Instance = await getWeb3();
  try {
    const nftContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);
    const result = await nftContract.methods.stake(tokenIds).send({
      from: address
    });

    return {
      transactionHash: result.transactionHash
    };
  } catch (error) {
    const reason = error.message.split(':');
    return {
      error: reason.length ? reason[1] : 'Minting error.'
    };
  }
};

export const unstakeNFTs = async (address, tokenIds) => {
  const web3Instance = await getWeb3();
  try {
    const nftContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);
    const result = await nftContract.methods.unstake(tokenIds).send({
      from: address
    });

    return {
      transactionHash: result.transactionHash
    };
  } catch (error) {
    const reason = error.message.split(':');
    return {
      error: reason.length ? reason[1] : 'Minting error.'
    };
  }
};

export const depositsOf = async (address) => {
  const web3Instance = await getWeb3();

  // const v1Contract = new web3Instance.eth.Contract(
  //   TOKEN_ABI,
  //   TOKEN_CONTRACT_ADDRESS
  // );

  // const v1Deposits = await v1Contract.methods
  //   .stakeOf(address)
  //   .call();

  const v2Contract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);

  const v2Deposits = await v2Contract.methods.depositsOf(address).call();

  // return v1Deposits.concat(v2Deposits);
  return v2Deposits;
};

export const calculateRewards = async (address) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);

  const v1Rewards = await nftContract.methods.calculateV1Rewards(address).call();

  const tokenIds = await nftContract.methods.depositsOf(address).call();
  const v2RewardsArray = await nftContract.methods.calculateRewards(address, tokenIds).call();

  let v2Rewards = 0;
  for (const reward of v2RewardsArray) {
    v2Rewards += parseInt(reward) / Math.pow(10, 18);
  }

  return (parseFloat(v1Rewards) / Math.pow(10, 18) + parseFloat(v2Rewards)).toFixed(2);
};

export const claimRewards = async (address) => {
  const web3Instance = await getWeb3();
  try {
    const nftContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);
    const result = await nftContract.methods.claimTotalRewards().send({
      from: address
    });

    return {
      transactionHash: result.transactionHash
    };
  } catch (error) {
    const reason = error.message.split(':');
    return {
      error: reason.length ? reason[1] : 'Error.'
    };
  }
};
export const calculateTotalStakes = async () => {
  const web3Instance = await getWeb3();

  const v1Contract = new web3Instance.eth.Contract(TOKEN_ABI, TOKEN_CONTRACT_ADDRESS);

  const v2Contract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);

  const NFTContract = new web3Instance.eth.Contract(NFT2_ABI, NFT2_CONTRACT_ADDRESS);

  const totalMinted = await NFTContract.methods.totalSupply().call();

  const totalStakesV2 = await v2Contract.methods.totalStakes().call();

  const totalStakesV1 = await v1Contract.methods.totalStakes().call();

  return (((parseInt(totalStakesV1) + parseInt(totalStakesV2)) / totalMinted) * 100).toFixed(0);
};
