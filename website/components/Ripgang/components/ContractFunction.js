import React from 'react';
import { ethers , utils,BigNumber} from "ethers";
import NFTAbi from "../constants/NFTAbi.json";
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { parseEther } from '@ethersproject/units';

const ETHERSCAN_URL = 'https://etherscan.io';
const contractAddress = NFTAbi.address;
const contractABI = NFTAbi.abi;

const whitelistAddresses = [
  "0xE04e771b5798709108C43F704e4f4D95867A1B69",
  "0xFb09948B08Dd241228F21f668Ca843D5Bc75B2f6",
  "0x1913895b160a37a22546b45f89cefd6e14a358f1",
  "0xF2376ca5C5334fA950C8B0c9378E417962CdA85c",
  "0x6dF71f173B77eA3903b4129e2b2BC6a72f70Dd51",
  "0x8dd1423BF7738899D6b122825044da052eC44589",
  "0xCb7BC3322ab3EaAb08d15C8A9113ae7d80513898",
  "0xD29f55bAB69996b0B200C78CCf342CD95aC058A8",
  "0xD933Ca50794c825c7aCc940d4798DfeD15c69D41",
  "0x5e17936FaF6F0cbe3a5D9965b4aCE6b54f004465",
  "0x1197Cad18515610B2ff1e0EDB8D6CFb8597D7AFE",
  "0xc64E917054073E919bD1bf2f2751CDEf61fBAcF7",
  "0xC9f24e5CD2aFa220e4f7f9bD835b148e7E574B3F",
  "0xc87be9a8d3dBF11A60163fE5c2727237f49C3db1",
  "0xF309921083CdaEB3758Bc8c24a4156eDfA64ca2F",
  "0xf5f75acB4348DAeDC243D3ef32a8340787388fE2",
  "0xAFEC6c262840753A86163655a9b8630a573e501F",
  "0x1Dc9B6aB7Cb5A55d91F9DC4a2723a96266652f6A",
  "0x5a61FF4f0A6B6cf99c756C45DaA2a15Cfdc16AD6",
  "0x8c7c44E83c54c9a296F582Ec3590cf3791E9D600",
  "0xB3C321a5b2bCfb9b9b0aB27453fdA17A9c813c50",
  "0x1ec78e9E1BAa7eec10828F05f0aC5178dDe728A8",
  "0x7504B3c18647b2f8402935AA5437ECb6b2492560",
  "0xEAa3055714B408EA96083f20328ee887615BfF74",
  "0xE929B8c0d4f3D7a3ef9e6D19d71e6db020d3F285",
  "0xD5BfefAF42C9B557c4207963d8a0C16e5c2846E1",
  "0xdBe8f2Fd0412268d4848271748B80B01A8543D2F",
  "0x0627c2aDb5c229926e0E8f8655ca6BeeFCC67171",
  "0xc5f6A4A7c49Db34862B97adB52f97Ae8d7E03474",
  "0x03E015b2b914fD6B3682cf0303A634BceB2BB778",
  "0xDfCa2f0DEBa6A140a28B0712dDc3D284E5753F21",
  "0x38FCCc4eD695dab2033F62D3dF1eD315Fe700610",
  "0x8695151adE104e7580C0f4b950A878EB17194105",
  "0x4DA57176c2C26A9Be75BBC51195E88D4EdEE933B",
  "0xf2491fF3C05145d143607C3373344C722C04171A",
  "0x7c1c66cAADB5f456Cb213c339538FeD0b08eC845",
  "0xD0e222795E778F0BA67B4D9e2c69e435Bfb43Bc9",
  "0xf5f75acB4348DAeDC243D3ef32a8340787388fE2",
  "0xaD460523289D2a00f19776e8835CC475c05D654b",
  "0x032F49DAB054381f42Ed28f7B735E73b553d7087",
  "0x6641eC3c0DF1B597B7ACA1b03148B20cfD8ae3a8",
  "0xDcdD5DDD2F9524396eB20070Df7266d5E363792D",
  "0x6e8a6cb46c0721e253fc370c4a48b43DD78E552f",
  "0x6b4CB223d613066092702598727D6DB580D7fA6c",
  "0xFADDb5518441a41159a241f0b7781F46706fFD0e",
  "0x032F49DAB054381f42Ed28f7B735E73b553d7087",
  "0xdcbe481807C2c20abCE9C2Bf19C9989a3415D8f8",
  "0xd1284cc2875f22897eba3c081a5dbe009cb12f3f",
  "0x399Db9b924bC348BfC3bD777817631eb5A79b152",
  "0x547b4BF7f39FAE562d2d0d5CFc329B05ec3694F2",
  "0xBD45F1464a89E5202D38aeeAc5979701D2e7dF20",
  "0x56BE6F37c1309842a8f4884eecC0C206B6BB4A63"
  ];


export const getMaxSupply = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const maxSupply = await contract.maxSupply();
    return parseInt(maxSupply);
}

export const getCurrentSupply = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const currentSupply = await contract.totalSupply();
    return parseInt(currentSupply);
}

export const getMaxPerTxn = async() => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  const maxPerTxn = await contract.maxMintAmountPerTx();
  return parseInt(maxPerTxn);
}

export const getMaxPerTxnPresale = async() => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  const maxPerTxnPreSale = await contract.maxMintAmountPerTxPreSale();
  return parseInt(maxPerTxnPreSale);
}

export const getPrice = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const price = await contract.price();
    return utils.formatEther(parseInt(price).toString());
}

export const getPreSalePrice = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const preSalePrice = await contract.preSalePrice();
    return utils.formatEther(parseInt(preSalePrice).toString());
}

export const isPreSaleActive = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const whitelistEnabled = await contract.onlyWhitelist();
    return whitelistEnabled;
}

export const isSaleActive = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const saleActive = await contract.paused();
    return !saleActive;
}


export const publicSale = async(quantity) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const price = await getPrice();
    const total = (price * quantity).toString();
    const parsedTotal = ethers.utils.parseEther(total)
    const publicMintTxn = await contract.publicMint(quantity,{value: parsedTotal});
    return publicMintTxn;
}

export const preSale = async(quantity, account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    const price = await getPreSalePrice();
    const total = (price * quantity).toString();
    const parsedTotal = ethers.utils.parseEther(total)
    const merkleProof = getProof(account);
    const whitelistMintTxn = await contract.whitelistMint(quantity,merkleProof,{value: parsedTotal });
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
  const reason = error?.error?.message?.split(':');
  return (reason?.length ? (reason[1]) : 'Try again later.');
};