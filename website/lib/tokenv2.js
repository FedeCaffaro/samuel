import Web3 from 'web3';
import _ from "lodash";

const TOKENV2_ABI = require('../abis/TokenV2.json');
// export const TOKEN_CONTRACT_ADDRESS = "" // prod
export const TOKENV2_CONTRACT_ADDRESS = "0xd878E8365AA9a6e6aB82675B760A877C695865B9" // dev

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

export const balanceOf = async (address) => {
    console.log(address)
    const web3Instance = await getWeb3();
  
    const tokenContract = new web3Instance.eth.Contract(
      TOKENV2_ABI,
      TOKENV2_CONTRACT_ADDRESS
    );
  
    const tokenBalance = await tokenContract.methods
      .balanceOf(address)
      .call();
  
  
      return (parseFloat(tokenBalance)/Math.pow(10,18)).toFixed(2);
  }