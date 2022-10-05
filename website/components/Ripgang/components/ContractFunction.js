import React from 'react';
import { ethers,utils} from "ethers";
import NFTAbi from "../constants/NFTAbi.json";
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const ETHERSCAN_URL = 'https://goerli.etherscan.io';
const contractAddress = NFTAbi.address;
const contractABI = NFTAbi.abi;

const whitelistAddresses = [
  "0x015B1E9B2be08D93A6F53886eB730ad25816F33A",
  "0x632DC55130ae2053a7199EFCc9d151324799914D",
  "0x72D4C15eB45e06bC81023e24c5aabfb397aF7b48",
  "0xa4FC2997ef316f82Ba5396f22AdbAE62aba991c2",
  "0x706B532f5451d2A03fE01afC145D81D663eFFc56",
  "0x547b4BF7f39FAE562d2d0d5CFc329B05ec3694F2",
  "0x904b4c184d17FCe204E78fcCb78b0d6435dBbaE3",
  "0x153d99Ecab23F41aa5f13cAC1e1aD976a3DE6FFc",
  "0x01A460621dD7518c278f44a2c74741a2d42ec16e",
  "0xf0Ae13FB9385ffd155DA81DD6719F3fb8E0EB4EF",
  "0xE5193D2be4D4819f717092aFC95E806f09A79964",
  "0x2cD33FC0d7D6510a6D23aB476807b3fd66D25aDF",
  "0x12a23E4Ade2880EfDFb0B7E3722Baad76B46Fa75",
  "0x1eD0c18FB9DDC312540Da5e17d1EEFc700b206e6",
  "0x8d6F42F347C1207a4817bAF7A51993A9a5816696",
  "0xE6fA1267Ae25BF6D83312B6342216c27116D0B01",
  "0xB9174c00AadBe30E2a18e2a967Dc7c23b75726A7",
  "0x1cF580A93F8cC49299f54889422ecf1BaF1178c9",
  "0xd422e83EFAaC0211B3837b95E256a986ac035808",
  "0xe731CEC7F89768C37aDAE9ffD69E7442131Fec1B",
  "0x05fafd36048E41B052244b6C419F040F3DD496a5",
  "0x14EA47a7D5a323866dF527055c3B9A5E758dB9e4",
  "0x4aED2a0caF6074D79675165ae170bD639994Cdcd",
  "0x8f2EA7613598bf3d0B926826F8DdfAf01a0e29dA",
  "0xfec7533A8B7A501618dd6BD320c416CC62a2FaEc",
  "0x793089C3170C6968a7ea0cA42b3E58a12C3F7c22",
  "0xA817bA3f9901b45bbcD6fce3188B74D9297f93A9",
  "0x945fAEEA7297a8a5992A9Ce33166a234C1f8BC81",
  "0x25ccCf315fAE1c0277A8d05Ed16BE5648D7d9D36",
  "0x5Cf7C02af87A6E55cf931F873752A7e6356701C5",
  "0xE86ff7C871d6f8002645FFD17E6407c75Ec79E6C",
  "0xCb7BC3322ab3EaAb08d15C8A9113ae7d80513898",
  "0x8aF0B9A9B751E086122bC340188Bd9d99b8C7ec1",
  "0x002a5920E786596381dc318544ED77047f54D56A",
  "0x042a19271d4fdb81cc543090536c6a28cdb7c924",
  "0x51e6EDD9Dd7692870cA9AeC5b16873480d6e1b15",
  "0x9C012ea65c825e4334aE0A5249c84A457218d87a",
  "0x8AFa6594092a92EAD5D9a64653B0F2a84544A4EA",
  "0x1D9E8eFf62c895B7aD591B1154dE3F495799b266",
  "0x567f7277F29f09cA1e8023F8610795535c1790da",
  "0x2a8A3A3133197494D2D48F8490e5449720AdAAb7",
  "0xb3f0933fe8B4E2BF0BE921790073619F88569478",
  "0xe15aa32fC7E970483f2A2bf847b8566a63828f11",
  "0x00FfdaB4452a72bf9C40424b0eDfA27f383b46e4",
  "0x715C2174e6A7876fdE25eec4b12fE6F80f17Cc79",
  "0x6eA6984069F72D56b7175B4856f2901DB44A390B",
  "0x4e67FFeFbE7Ee24050B69d2916819324BF913d7E",
  "0xa4F8eBd91ecbd9C2e1E03ecD7D56d71C6bDbA849",
  "0xa4F8eBd91ecbd9C2e1E03ecD7D56d71C6bDbA849",
  "0x8b760BFC13335b443A720836fed5BAD603F6C3a2",
  "0x78657B7d906EA05E166877F9522D66a4Fe6d3243",
  "0x4211Ff60b7C53c4703ab70ff654138aC3c5f8448",
  "0xB2fc88E66b8875f0ABa69C00A95a08A3C01c881c",
  "0x1De5AaDDfb1901Af5980d469b10d4AE1E8430301",
  "0x1De5AaDDfb1901Af5980d469b10d4AE1E8430301",
  "0x80038953cE1CdFCe7561Abb73216dE83F8baAEf0",
  "0x6D503F2a55A06812781c3C68878547A74fc5a696",
  "0x5a57B33Be9B5d2a97a2633148Da3B265b94aa561",
  "0x9598Ab090aa97991A4032EbC4e8527252eAc3C42",
  "0xa931B2FBC5639a17BE6C4Af02597A48E1a15C367",
  "0x773F32cE913dE949385dE273E9A9C2d343a9c9e4",
  "0x21b24C4A20A0726ee212F17b227C2c546E1122A1",
  "0x7eBea3e95f2c3c0138B605230CBa5845959870E4",
  "0x6C39B0c5205E6120b2c81c2D32B39aF378c7a926",
  "0xFD328A9aF8ee715D1E3563C0383c0306A1Cb22cb",
  "0xBFD3592A6446b9863444c80f1e257afA4f88fAff",
  "0x241cAB326be5314C264417ef1B229cA84E7D0c81",
  "0x02e6e2D228d0a1738bc9330536fCC72Df9666f11",
  "0x4623C013F1dCD90844b0F82Ec044Fff8a5Bd73c1",
  "0x7FEF7e194b5939D25B9523034438d341d61d85A0",
  "0x18D9b1e9459D1d7E53d102393e3B27bAd5011B26",
  "0xEe14B862884C88CaA1e88aF2C105268f68105505",
  "0xbCC951C95371C503D655af06F5902aC1e8F76308",
  "0x80748c3f94edc11B2Adc0d8651ECD8CF3C3c1831",
  "0x70bD6339a06d2F8a3A76666c47979c6b3264a578",
  "0x280E7D851B8d6bD46B7ed4f98670a08f08ad1A5D",
  "0xA14B01B000E1A657cb7022e6Fc18d271f7586333",
  "0xB5bFD118D806443161Ad8a41d1E3BE1A3A76BcFa",
  "0x9C4918660F70cf7Fe6836c9dD5b8bAA363ab33aE",
  "0x51C42dD097305eea7EFF02B271B56A66D855bE1d",
  "0x1ca02FF74Bd9E3969ad6c3147a830817A3620a82",
  "0x0aab5f8f7fc8251f8c0fadf4e4b1a1ca47ca1ae0",
  "0x4bfdc58f349a51e532a9477Fe7687cB9fe3724AC",
  "0xe1A9C452b46de9F80E74d8B9578c8C5734be4Dbc",
  "0xB9DAd6D4dBC48D30381d99C9A81724D14F1f50F1",
  "0xa2a48a03430B9D27997Bb4373952fced61FB3FE8",
  "0xd74c23F4f7a7c390074bD583c444fBf60EAE1F33",
  "0x2505E66a0cDc1Bf543b9952397eCB327577427A5",
  "0x6010FF50261fb6f0Cd21b97216eEdb3572CE3bd3",
  "0x521F1B2a89AECE57c16c3078D85E00238969703c",
  "0xbD338E1DD7289899500eE6E3Dea999CEe75f1301",
  "0x2B1592eb165074476bF2470471ac97489d1695A1",
  "0xFFFD43f048255a0d6741c72246965770c4c02b89",
  "0x7A38c27FC3E3480DA5cAc9F5a55f2da8C48794Ff",
  "0x1E5F501971A22365c8c08e4C46eC901806e69661",
  "0xA5c1bD3E1ebC8A182B191704571995935ba6Bd85",
  "0xA836510231CC2844De5b40C1580f17153607b58F",
  "0x6Bc959a9F125FF443F4108aE1dbd36f19e9F53a3",
  "0x1EB5093e5d072212f68cbf77571A7fa393A0dF32",
  "0x36c99ADe0b70B5537E87dc20DA6f8196f7E41306",
  "0xAf49555Af33f8531Fe154cd02Edc46a5D3bC26b1",
  "0xAf49555Af33f8531Fe154cd02Edc46a5D3bC26b1",
  "0x660529156e03efd616f1197304d86b9ca919D221",
  "0x2BDB5Fc5Ae4293Eb4BFA284394612f2a84e5a4Cd",
  "0x5B837CF4A996D878cfD332183aF0E2Ccd0826611",
  "0x1aee380E0C402e8a7A6F8647D42C8CA50BDf2bB0",
  "0x1a24eeD1EA3F60Ed14c6553B53923D7EB7ff4e39",
  "0x6730AcF75C073f63A75a724091f6B4e244E86cEC",
  "0x3AF4686DDf1B077a07440338f1b6BC5eB6B9281c",
  "0x94b8De7675F6e068A66C4846424A6d4Ca024E78D",
  "0x5C644663a14535fEc8706f2B55dae69C80Ba91Fe",
  "0x16333710CC8E17e77da3434670656c1eDb8Df11C",
  "0x4871112479Cf10BFAE319Efe8b19FEFB4B9B3789",
  "0x2a8A3A3133197494D2D48F8490e5449720AdAAb7",
  "0x9128e113156fe557f693e8984e6b39fef03726ac",
  "0xbbe02cf28f8e01738e029118f8ef8693816b5b1b",
  "0xbfb21BDA3593973Dab68F265Ce77Ef2dcF79Ec2b",
  "0x1ab9E782f2Eb6D31369424Ec91c93E9206dFD03F",
  "0xE9f506581e98F9247AFFC679C6CD39D314eAc5bD",
  "0xf576725C4a2E15585F063fA7943d86d28d2B6FE7",
  "0xC40a4b72CB59304f6E298e94704C1799b4634B6D",
  "0x878Bf3C9670696892269E5DA26187F5f7433fB9f",
  "0x9B129Fd3cE1727F4238110E7bf5461F9561C96EF",
  "0xfD891055bD62Dba923e98B7c91aC1fe492C7bf99",
  "0x1B9Aa37c50C86Ff7C603D7bdf40e2C35CE1415a5",
  "0x1554C6b7BAd42FF0fc6336E6ADB08ddEeBfd9811",
  "0xB865d5C2Ce332A370238444a15ab20e607c0B710",
  "0x0C648899A4eC620C85dD372F0DBD636B950536fA",
  "0xe7d9Ff73Cd9E320Ca714E0DE66ea00911ec4d79E",
  "0x0E71A0516455835ee197826084Ea300a4835F4a4",
  "0x86995cb4BbCe55ae4e2544b552058149189894b2",
  "0x51e6EDD9Dd7692870cA9AeC5b16873480d6e1b15",
  "0x053900bF0E5b02f5B8E779b17742C9C61557F6E6",
  "0xa453Ef5137f03d9Cc1306221003371102661bBaD",
  "0x4331d0dd5204222456292388dd6b6e0f6643e04c",
  "0x0f9f68408BC554484D418638fFCd4FCE2693D855",
  "0x81711308Ce4f081Be98E90dFb0008CAB361e5887",
  "0x393456442BFCefF142f7DaeE2a3BB0eF6725CF85",
  "0x29B9354DCEA4E937BbF5B65b6CB6C8ABb4Af4F4e",
  "0xeEB0387A60118cf6977bf9b96AE906E9AA32699b",
  "0xDFde1C37cC690733e3f25DAe67E2d40E528e7E1C",
  "0x2ec0E7a583D40b5baD5E71EE9BefC6Cd0966085f",
  "0x26E1D9d03CcC069571135deEdc1CAa7F25689C80",
  "0x1793CdcD6F9B3A224560c33a8D6C046c0C933379",
  "0xCDF58E8B96C4CA3ff2496a1c9473670fFFB675d7",
  "0x259371c38Fe8FA0F789cee13d6805F794b17A0E5",
  "0xf09DB47C2245b1d5EDD441c1b761fc594D1084a8",
  "0x548E6D2e192b731EEfAcE1e4fE4C6259Db55BA77",
  "0x6f8c34550D89bE2b638b59bF7CCb39b863acD7A5",
  "0x87A94fe9bcF87ADB3ddD1F306130a3e6e4716532",
  "0x7c21560Cb171e27B2DA5cE0D8876Ae76a1284c16",
  "0xE83cB8f9309F7E51Cce0c847D94D96a59ACaC2D0",
  "0xabF9115158E0fCE278283D5ef6f7b67Bcbd788f2",
  "0xbfb21BDA3593973Dab68F265Ce77Ef2dcF79Ec2b",
  "0xD7844FAF1d56715A22A0e18b0026a35bBFd0fafa",
  "0xBc76e420842209040f570f0583944990426C98aC",
  "0x0C3E6db8D8c5B7487BeEbA031b181E9d6F7d74db",
  "0xAb7E1cd28508BaA6fC2d35f5BE3E91E4Be11D356",
  "0x1C019aA9e470e2AC6b6535aF07C81c7078633CAe",
  "0x27688d53d3B7989e13A7Ad33778fd0D910543D94",
  "0xe2D9866D807067195a512De3078C19a49f75b8F0",
  "0xaC2d1E60347051D910D0a478C68580776612Faab",
  "0x8B7Ee6FB5ac39dC676d60443b0f283785eCC6fc3",
  "0x0d20831558CC92d955dB5b09f65B2226d855A7f7",
  "0xf0a2424Cb282b9C8d879DEaE5982B4f7aB0707aa",
  "0xCF6dc21AaD2c347baCe808D7e5Ce0fd7679E8100",
  "0xD7735293971e18bA0a008711a2770E69a147B942",
  "0xe762c56D15652647a24325F0D8d2C1099d687Af4",
  "0xf8914f4bF6388aA98965514f230E835F11ef7b71",
  "0xa3cdd8dc1d0973db547e427e6ef5e82efaa5b63c",
  "0xcD4866CB0f02076018c956817eCa772d005F3be7",
  "0x042c1054aa83017BB45bE508154F0F209B297a2a",
  "0xe4d91aeA2677B67d04d6d7623A80aF0f89466DD3",
  "0x3a6dc87d1F165F3061bBe5E918d8fEf5F35791FE"
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
      Ver transacción
      </a>
    </>
  );

export const buySuccessRender = ({ hash }) =>
  successMessageWithLink("Compra exitosa: " ,hash);

export const buyErrorRender = (error) => {
    console.log(error);
  const reason = error?.error?.message?.split(':');
  return (reason?.length ? (reason[1]) : 'Intenta de nuevo mas tarde');
};