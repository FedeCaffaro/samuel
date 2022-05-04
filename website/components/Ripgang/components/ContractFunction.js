import React from 'react';
import { ethers,utils} from "ethers";
import NFTAbi from "../constants/NFTAbi.json";
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const ETHERSCAN_URL = 'https://rinkeby.etherscan.io';
const contractAddress = NFTAbi.address;
const contractABI = NFTAbi.abi;

const whitelistAddresses = [
    "0xa4FC2997ef316f82Ba5396f22AdbAE62aba991c2",
    "0x399Db9b924bC348BfC3bD777817631eb5A79b152",
    "0xBD45F1464a89E5202D38aeeAc5979701D2e7dF20"
];


export const getMaxSupply = async(id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const struct = await contract.idStats(id);
    const maxSupply = parseInt(struct[0]);
    return maxSupply;
}

export const getCurrentSupply = async(id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const currentSupply = await contract.totalSupply(id);
    return parseInt(currentSupply);
}


export const isPreSaleActive = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const whitelistActive = await contract.whitelistSaleIsActive();
    return whitelistActive;
}

export const isSaleActive = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const saleActive = await contract.publicSaleIsActive();
    return saleActive;
}

export const getPrice = async(id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const struct = await contract.idStats(id)
    const price = struct[3];
    return utils.formatEther(parseInt(price).toString());
}

export const publicSale = async(quantity,id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const price = await getPrice(id);
    const total = (price * quantity).toString();
    const parsedTotal = ethers.utils.parseEther(total)
    const publicMintTxn = await contract.publicSale(quantity,id,{value: parsedTotal});
    return publicMintTxn;
}

export const getPreSalePrice = async(id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const struct = await contract.idStats(id)
    const preSalePrice = struct[4];
    return utils.formatEther(parseInt(preSalePrice).toString());
}

export const preSale = async(quantity,id, account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const preSalePrice = await getPreSalePrice(id);
    const total = (preSalePrice * quantity).toString();
    const parsedTotal = ethers.utils.parseEther(total)
    const merkleProof = getProof(account);
    const whitelistMintTxn = await contract.whitelistSale(quantity,id,merkleProof,{value: parsedTotal });
    return whitelistMintTxn;
}

const getProof = (account) => {
  const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleProof = merkleTree.getHexProof(keccak256(account));
  return merkleProof;
}

export const verifyWhitelist = async(account)=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const merkleProof = merkleTree.getHexProof(keccak256(account));
    const whitelisted = await contract.verify(merkleProof,account);
    return whitelisted;
}

const getTransactionLink = (hash) => `${ETHERSCAN_URL}/tx/${hash}`;

const successMessageWithLink = (text, hash) => (
    <>
      <span>{text}</span>
      <a style={{ 'text-decoration': 'underline' }} href={getTransactionLink(hash) } target="_blank" rel="noopener noreferrer">
      See transaction
      </a>
    </>
  );

export const buySuccessRender = ({ hash }) =>
  successMessageWithLink("Purchase successful: " ,hash);

export const buyErrorRender = (error) => {
    console.log(error);
  const reason = error?.error?.message?.split(':');
  return (reason?.length ? (reason[1]) : 'Try again later.');
};