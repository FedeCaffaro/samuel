import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import {Card, Button} from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { FaEthereum } from "react-icons/fa";
import { NFT_CONTRACT_ADDRESS, mint, mintPrice, totalSupply, maxSupply, maxToMint, saleIsActive } from '../lib/mint'
import { useWallet } from 'use-wallet'

export default function Home() {
	const wallet = useWallet()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)
	const [totalMinted, setTotalMinted] = useState(0)
	const [maxPerTransaction, setMaxPerTransaction] = useState(0)
	const [saleActive, setSaleActive] = useState(false)
	const [price, setPrice] = useState(0.2)
	const [supply, setSupply] = useState(0)
	const [numberOfTokens, setNumberOfTokens] = useState(1)
	const [transactionUrl, setTransactionUrl] = useState("")
	const [pending, setPending] = useState(false)
	const [contractUrl, setContractUrl] = useState("")
	const isBrowser = typeof window !== "undefined"
	let etherscanUrl = 'https://rinkeby.etherscan.io'
	let network
	if (isBrowser) {
	  etherscanUrl = window.location.hostname.includes('test') || window.location.hostname.includes('localhost') ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io'
	}


	const connect = () => {
	  wallet.connect()
	}

	const disconnect = () => {
	  wallet.reset()
	  //Router.push("/")
	}

	const mintNFTs = async () => {
      setError(null)
      setLoading(true)
      setPending(true)
      const result = await mint(wallet.account, numberOfTokens, price)
      if (result.error) {
        setError(result.error)
      } else {
        setTransactionUrl(`${etherscanUrl}/tx/${result.transactionHash}`)
      }
  	}

	useEffect(() => {
		if (wallet && wallet.account) {
	    	setContractUrl(`${etherscanUrl}/address/${NFT_CONTRACT_ADDRESS}`)
	       	totalSupply().then(setTotalMinted);
		    mintPrice().then(setPrice);
		    maxToMint().then(setMaxPerTransaction);
		    maxSupply().then(setSupply);
		    saleIsActive().then(setSaleActive);
	    }
	}, [wallet])

	return (
		<div className="body-wrapper">
		  <Card className="mint-form">
		  	<div className="logo-wrapper">
		  		<img src="/samot-logo.jpg" width="150px" />
		  	</div>
		  	<h1>Mint Samot NFTs</h1>
		  	{wallet && wallet.account ? (
			  	<div>
				  	<div className="mint-price">{parseFloat(price/Math.pow(10, 18))} <FaEthereum/> + Gas</div>

				  	<RangeSlider
				      value={numberOfTokens}
				      size="lg"
				      min={1}
				      max={parseInt(maxPerTransaction)}
				      tooltip="on"
				      variant='warning'
				      onChange={event => setNumberOfTokens(event.target.value)}
				    />
				    <Button size="lg" variant="primary" className="btn-round" onClick={() => mintNFTs()}>Mint</Button>
				</div>
		    ) : (
		    	<Button size="lg" variant="primary" className="btn-round" onClick={() => connect()}>Connect</Button>
		    )}
		    {wallet && wallet.account && <p>{totalMinted} / {supply}</p>}
		  </Card>
		</div>
	)
}
