import { useState, useEffect } from "react";
import {ethers} from "ethers";
import NFTAbi from "../constants/NFTAbi.json";
import { useWeb3React } from "@web3-react/core";
import { Input, Button } from '@chakra-ui/react';
import {maxPerTransaction } from "../constants/contractConfig"

const contractAddress = NFTAbi.address;
const contractABI = NFTAbi.abi;

const Mint = () => {
  const [mintAmount,setMintAmount] = useState(1);
  const [id, setId] = useState(0);
	const [loading, setLoading] = useState(true)
	const [totalMinted, setTotalMinted] = useState(0)
	const [saleActive, setSaleActive] = useState(false)
	const [price, setPrice] = useState(0)
	const [transactionUrl, setTransactionUrl] = useState("")
	const [pending, setPending] = useState(false)
	const [contractUrl, setContractUrl] = useState("")

    const {
        active,
        activate,
        chainId,
        account,
        library: provider,
      } = useWeb3React();

    async function handleMint(){
        if (active) {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            try {
              await contract.claimItem(BigNumber.from(id),BigNumber.from(mintAmount));
            } catch (error) {
              console.log(error);
            }
          } else {
            console.log("Please install MetaMask");
          }
        }

    const handleMintDecrement = () => {
        if (mintAmount <= 1) return;
        setMintAmount(mintAmount-1);
    };

    const handleMintIncrement = () => {
        if (mintAmount >= maxPerTransaction) return;
        setMintAmount(mintAmount + 1);
    };

    return(
        <div className="flex flex-col items-center justify-center text-center">
            {active ?
			
			
			(<div>
				{chainId ==1 ? (
				<div>
          <div>
				  <Button onClick={handleMintDecrement} borderRadius="5px" color="black" cursor="pointer" fontFamily="inherit" padding="10px" marginTop="10px" marginBottom="10px" backgroundColor="#699879" boxShadow="0px 2px 2px 1px #0F0F0F"> - </Button>
					<Input textAlign="center" readOnly type="number" value={mintAmount} height="40px" width="100px" fontFamily="inherit" paddingLeft="19px" marginTop="10px"/>
					<Button onClick={handleMintIncrement} borderRadius="5px" color="black" cursor="pointer" fontFamily="inherit" padding="10px" marginTop="10px" marginBottom="10px" backgroundColor="#699879" boxShadow="0px 2px 2px 1px #0F0F0F"> + </Button>
					</div>
					<Button onClick={handleMint} borderRadius="5px" color="black" cursor="pointer" fontFamily="inherit" padding="10px" marginTop="10px" marginBottom="10px" backgroundColor="#699879" boxShadow="0px 2px 2px 1px #0F0F0F"> MINT NOW!</Button>
				</div>
				) :
				(<p className="font-bold"> You must be connected to the ethereum mainnet. Check Metamask network. </p>)
				}
            </div>
			):
			
			(<div>
			<p className="font-bold"> You must me connected to MetaMask to mint. </p>
			</div>
			)
			}
			
			
        </div>
    );
};

export default Mint;
