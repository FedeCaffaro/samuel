/* eslint-disable prefer-const */
import Web3 from 'web3';

import { NFT_ABI } from '../constants/nfts';
import { NFT2_ABI } from '../constants/nfts2';
import { STAKING_ABI } from '../constants/staking';
import { TOKEN_ABI } from '../constants/token';
import { TOKEN_V2_ABI } from '../constants/tokenV2';

export const STAKING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
export const TOKEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
export const TOKENV2_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKENV2_CONTRACT_ADDRESS;
export const NFT2_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT2_CONTRACT_ADDRESS;

const getWeb3Instance = () =>
  new Promise((resolve) => {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const currentWeb3 = new Web3(window?.ethereum || window?.web3?.currentProvider);
      if (currentWeb3) {
        resolve(currentWeb3);
      }
    }
  });

export const calculateRewards = async (address) => {
  const web3Instance = await getWeb3Instance();
  const nftContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);

  const v1Rewards = await nftContract.methods.calculateV1Rewards(address).call();

  const tokenIds = await nftContract.methods.depositsOf(address).call();
  const v2RewardsArray = await nftContract.methods.calculateRewards(address, tokenIds).call();

  const v2Rewards = v2RewardsArray.reduce((acc, curr) => acc + parseInt(curr) / Math.pow(10, 18), 0);

  return (parseFloat(v1Rewards) / Math.pow(10, 18) + parseFloat(v2Rewards)).toFixed(2);
};

export const stakeOf = async (address) => {
  const web3Instance = await getWeb3Instance();
  const nftContract = new web3Instance.eth.Contract(TOKEN_ABI, TOKEN_CONTRACT_ADDRESS);

  return nftContract.methods.stakeOf(address).call();
};

export const depositsOf = async (address) => {
  const web3Instance = await getWeb3Instance();

  const v2Contract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);

  const v2Deposits = await v2Contract.methods.depositsOf(address).call();

  return v2Deposits;
};

export const balanceOf = async (address) => {
  const web3Instance = await getWeb3Instance();

  const tokenContract = new web3Instance.eth.Contract(TOKEN_V2_ABI, TOKENV2_CONTRACT_ADDRESS);

  const tokenBalance = await tokenContract.methods.balanceOf(address).call();

  return (parseFloat(tokenBalance) / Math.pow(10, 18)).toFixed(2);
};

export const calculateTotalStakes = async () => {
  const web3Instance = await getWeb3Instance();

  const v1Contract = new web3Instance.eth.Contract(TOKEN_ABI, TOKEN_CONTRACT_ADDRESS);
  const v2Contract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);
  const NFTContract = new web3Instance.eth.Contract(NFT2_ABI, NFT2_CONTRACT_ADDRESS);

  const totalMinted = await NFTContract.methods.totalSupply().call();
  const totalStakesV2 = await v2Contract.methods.totalStakes().call();
  const totalStakesV1 = await v1Contract.methods.totalStakes().call();

  return (((parseInt(totalStakesV1) + parseInt(totalStakesV2)) / totalMinted) * 100).toFixed(0);
};

export const claimRewards = async (address) => {
  const web3Instance = await getWeb3Instance();
  const nftContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);
  return nftContract.methods.claimTotalRewards().send({
    from: address
  });
};

export const stakeNFTs = async (address, tokenIds) => {
  const web3Instance = await getWeb3Instance();
  const nftContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);
  return nftContract.methods.stake(tokenIds).send({
    from: address
  });
};

export const unstakeNFTs = async (address, tokenIds) => {
  const web3Instance = await getWeb3Instance();
  const nftContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);
  return nftContract.methods.unstake(tokenIds).send({
    from: address
  });
};

export const unstakeNFTsV1 = async (address, tokenIds) => {
  const web3Instance = await getWeb3Instance();

  const nftContract = new web3Instance.eth.Contract(TOKEN_ABI, TOKEN_CONTRACT_ADDRESS);
  return nftContract.methods.unstakeNFTs(tokenIds).send({
    from: address
  });
};

export const isApprovedForAll = async (contract, address) => {
  const web3Instance = await getWeb3Instance();
  const nftContract = new web3Instance.eth.Contract(NFT_ABI, contract);

  return nftContract.methods.isApprovedForAll(address, STAKING_CONTRACT_ADDRESS).call();
};

export const setApproveForAll = async (contract, address) => {
  const web3Instance = await getWeb3Instance();

  return isApprovedForAll(contract, address).then((isApproved) => {
    if (!isApproved) {
      const nftContract = new web3Instance.eth.Contract(NFT_ABI, contract);
      return nftContract.methods.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true).send({
        from: address
      });
    }

    return Promise.reject(new Error('Error: The contract is already approved.'));
  });
};
