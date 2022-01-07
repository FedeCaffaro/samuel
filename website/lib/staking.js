import Web3 from 'web3';
import _ from "lodash";
const STAKING_ABI = require('../abis/Staking.json');
export const STAKING_CONTRACT_ADDRESS = "0x7d2C407611A1154342be2534bbe439cFc8682d99" // prod
// export const STAKING_CONTRACT_ADDRESS = "0x2D7F45DA91D31D40D71e5057128E88D4d9750D58" // dev

const TOKEN_ABI = require('../abis/Token.json');
export const TOKEN_CONTRACT_ADDRESS = "0x7cca1e4879a62A4B6173FAF0B865217722a47751" // prod
// export const TOKEN_CONTRACT_ADDRESS = "0x8040Eaf450e42b1784809cE9344FB17A7674cFEC" // dev

const TOKENV2_ABI = require('../abis/TokenV2.json');
export const TOKENV2_CONTRACT_ADDRESS = "0x87532582F7eBD6d653872324836a8b5ce4A0623c" // prod
// export const TOKENV2_CONTRACT_ADDRESS = "0xd878E8365AA9a6e6aB82675B760A877C695865B9" // dev

const NFT2_ABI = require('../abis/NFT.json');
export const NFT2_CONTRACT_ADDRESS = "0x49fDbfa1126638CE7eF2CA1A0f7759109f12595d" // prod
// export const NFT2_CONTRACT_ADDRESS = "0x83C26562cE37959b870240B9c06b3e7fd72Edd8c" // dev

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
      STAKING_ABI,
      STAKING_CONTRACT_ADDRESS
    );
    const result = await nftContract.methods
      .stake(tokenIds)
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
      STAKING_ABI,
      STAKING_CONTRACT_ADDRESS
    );
    const result = await nftContract.methods
      .unstake(tokenIds)
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

export const depositsOf = async (address) => {
  console.log(address)
  const web3Instance = await getWeb3();

  // const v1Contract = new web3Instance.eth.Contract(
  //   TOKEN_ABI,
  //   TOKEN_CONTRACT_ADDRESS
  // );

  // const v1Deposits = await v1Contract.methods
  //   .stakeOf(address)
  //   .call();

  const v2Contract = new web3Instance.eth.Contract(
    STAKING_ABI,
    STAKING_CONTRACT_ADDRESS
  );


  const v2Deposits = await v2Contract.methods
    .depositsOf(address)
    .call();

    // console.log(v1Deposits.concat(v2Deposits));


    // return v1Deposits.concat(v2Deposits);
    return v2Deposits;
}



export const calculateRewards = async (address) => {
  const web3Instance = await getWeb3();
  const nftContract = new web3Instance.eth.Contract(
    STAKING_ABI,
    STAKING_CONTRACT_ADDRESS
  );

  const v1Rewards = await nftContract.methods
    .calculateV1Rewards(address)
    .call();

    const tokenIds = await nftContract.methods
    .depositsOf(address)
    .call();

    // console.log(tokenIds);

    const v2RewardsArray = await nftContract.methods
    .calculateRewards(address, tokenIds)
    .call();

    let v2Rewards = 0;
    for (let reward of v2RewardsArray) {
        v2Rewards += parseInt(reward)/Math.pow(10, 18)
    }
    // console.log(v2Rewards);

    return (parseFloat(v1Rewards)/Math.pow(10,18) + parseFloat(v2Rewards)).toFixed(2);

  }



    export const claimRewards = async (address) => {
      const web3Instance = await getWeb3();
      try {
        const nftContract = new web3Instance.eth.Contract(
          STAKING_ABI,
          STAKING_CONTRACT_ADDRESS
        );
        const result = await nftContract.methods
          .claimTotalRewards()
          .send({
            from: address
          });
    
        console.log(`Rewards claimed `);
        console.log(result.transactionHash)
        return {
          transactionHash: result.transactionHash,
        }
      } catch (error) {
        console.log(error)
        const reason = error.message.split(":")
        return {
          error: reason.length ? reason[1] : "Error.",
        }
      }
    }
      export const calculateTotalStakes = async (address) => {
        console.log(address)
        const web3Instance = await getWeb3();

        const v1Contract = new web3Instance.eth.Contract(
          TOKEN_ABI,
          TOKEN_CONTRACT_ADDRESS
        );
      
        const v2Contract = new web3Instance.eth.Contract(
          STAKING_ABI,
          STAKING_CONTRACT_ADDRESS
        );

      const NFTContract = new web3Instance.eth.Contract(
      NFT2_ABI,
      NFT2_CONTRACT_ADDRESS
    );
  
    const totalMinted = await NFTContract.methods
      .totalSupply()
      .call();

        const totalStakesV2 = await v2Contract.methods
          .totalStakes()
          .call();
      
        const totalStakesV1 = await v1Contract.methods
          .totalStakes()
          .call();

          return (((parseInt(totalStakesV1)+parseInt(totalStakesV2))/totalMinted)*100).toFixed(0);
      };
