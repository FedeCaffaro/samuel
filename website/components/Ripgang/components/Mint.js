import { useEffect, useState } from "react";
import { BigNumber} from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Button } from "@chakra-ui/react";
import {getMaxSupply,getCurrentSupply,isSaleActive,isPreSaleActive,publicSale,preSale,verifyWhitelist} from "./ContractFunction";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buySuccessRender, buyErrorRender } from './ContractFunction';

const Mint = () => {
  const {
    active,
    chainId,
    account,
  } = useWeb3React();
  
  
  const [mintAmount, setMintAmount] = useState(1);
  const [whitelistMintAmount, setWhitelistMintAmount] = useState(1);

  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  const [maxPerTxn,setMaxPerTxn] = useState(1);
  const [maxPerTxnPreSale, setMaxPerTxnPresale] = useState(1);
  
  const [saleActive, setSaleActive] = useState(false);
  const [presaleIsActive, setPresaleIsActive] = useState(false);

  const [transactionUrl, setTransactionUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [contractUrl, setContractUrl] = useState("");

  const [isWhitelisted, setIsWhitelisted] = useState(false);

  async function handleInactiveStats() {
    getCurrentSupply(1).then(setTotalMinted);
    getMaxSupply(1).then(setMaxSupply);
  }
  
  async function handleStats(){
    getCurrentSupply(1).then(setTotalMinted);
    getMaxSupply(1).then(setMaxSupply);
    isPreSaleActive().then(setPresaleIsActive);
    verifyWhitelist(account).then(setIsWhitelisted);
    isSaleActive().then(setSaleActive);
  }


  useEffect(() => {
    handleInactiveStats();

    if (active) {
      handleStats();
    }
    
  }, [active]); 
  
  async function handleWhitelistMint() {
    if (active) {
      try {
        toast.promise(preSale(1,1,account), {
          pending: 'Buying...',
          success: {render: renderAndGetData(buySuccessRender)},
          error: {render: renderAndGetError(buyErrorRender)},
          });
        } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  async function handlePublicMint() {
    if (active) {
      try {
        toast.promise(publicSale(1,1), {
          pending: 'Buying...',
          success: {render: renderAndGetData(buySuccessRender)},
          error: {render: renderAndGetError(buyErrorRender)},
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }
    
  const renderAndGetData =
  (aFunction, callBefore = () => {}) =>
  (result) => {
    callBefore();

    return aFunction(result?.data);
  };
  
  const renderAndGetError =
  (aFunction, callBefore = () => {}) =>
  (result) => {
    callBefore();
    return aFunction(result?.data);
  };

  return (
    <div className="flex flex-col justify-center text-center">
          {active ? (
            <div>
              {presaleIsActive ? (
                <div>
                  {1 == chainId ? (
                    <div>
                      {isWhitelisted ? (
                        <div>
                                    <Button
                                      onClick={handleWhitelistMint}
                                      className="button-connect"
                                    >
                                      MINT
                                    </Button>
                        </div>
                        ) : (
                        <div>
                          <p> You are not eligible for the whitelist. Come back for public minting. </p>
                        </div>
                        )
                      }
                    </div>) : (
                      <div>
                        <p className="font-bold">
                          {" "}
                          You must be connected to the ethereum mainnet. Check Metamask
                          network.{" "}
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div>
                {saleActive? (
                  <div>
                    {1 == chainId ? (
                      <div>
                        <Button
                          onClick={handlePublicMint}
                          className="button-connect"
                        >
                          MINT
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold">
                          {" "}
                          You must be connected to the ethereum mainnet. Check Metamask
                          network.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                  ) : (
                    <div> 
                      <p>Mint not active yet! </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            ) : (
            <div>
              <p> You must be connected <br></br> to MetaMask to mint!</p>
            </div>
            )
            }

            <br/>
            <p> MINTED : { totalMinted } / { maxSupply }</p>
    </div>
  );
};

export default Mint;