import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import {Card, Button} from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { FaEthereum } from "react-icons/fa";
import { NFT_CONTRACT_ADDRESS, mint, mintPrice, totalSupply, maxToMint, saleIsActive } from '../lib/mint'
import { useWallet } from 'use-wallet'

export default function Home() {
	const wallet = useWallet()
	const [error, setError] = useState(null)
	const [showNetworkWarning, setShowNetworkWarning] = useState("")
	const [loading, setLoading] = useState(true)
	const [totalMinted, setTotalMinted] = useState(0)
	const [maxPerTransaction, setMaxPerTransaction] = useState(0)
	const [saleActive, setSaleActive] = useState(false)
	const [price, setPrice] = useState(0)
	const [numberOfTokens, setNumberOfTokens] = useState(1)
	const [transactionUrl, setTransactionUrl] = useState("")
	const [pending, setPending] = useState(false)
	const [contractUrl, setContractUrl] = useState("")

	const isBrowser = typeof window !== "undefined"
	let etherscanUrl = 'https://rinkeby.etherscan.io'
	let network
	if (isBrowser) {
	  etherscanUrl = window.location.hostname.includes('test') ||
	  	window.location.hostname.includes('cloudfront') ||
	  	window.location.hostname.includes('localhost') ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io'
	  network = window.location.hostname.includes('test') ||
	  	window.location.hostname.includes('dev') ||
	  	window.location.hostname.includes('cloudfront') ? 'test' : 'main'
	}

	useEffect(() => {
	if (wallet && wallet.networkName && wallet.networkName == 'main' && network == 'test') {
	  setShowNetworkWarning("You're connected to the wrong network. Please connect to Rinkeby.")
	} else if (wallet.networkName == 'rinkeby' && network == 'main') {
	  setShowNetworkWarning("You're connected to the wrong network. Please connect to Mainnet.")
	} else {
	  setShowNetworkWarning("")
	}
	}, [wallet])


	const connect = () => {
	  wallet.connect()
	}

	const disconnect = () => {
	  wallet.reset()
	  //Router.push("/")
	}

	const mintNFTs = async () => {
	  if (wallet && wallet.account && numberOfTokens && price) {
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
  	}

	useEffect(() => {
		if (wallet && wallet.account && 
			((wallet.networkName == 'rinkeby' && network == 'test') ||
		  	(wallet.networkName == 'main' && network == 'main'))) {
	    	setContractUrl(`${etherscanUrl}/address/${NFT_CONTRACT_ADDRESS}`)
	       	totalSupply().then(setTotalMinted);
		    mintPrice().then(setPrice);
		    maxToMint().then(setMaxPerTransaction);
		    saleIsActive().then(setSaleActive);
	    }
	}, [wallet])

	useEffect(() => {
	    setInterval(() => {
		    if (wallet && wallet.account && 
				((wallet.networkName == 'rinkeby' && network == 'test') ||
			  	(wallet.networkName == 'main' && network == 'main'))) {
		    	setContractUrl(`${etherscanUrl}/address/${NFT_CONTRACT_ADDRESS}`)
		       	totalSupply().then(setTotalMinted);
			    mintPrice().then(setPrice);
			    maxToMint().then(setMaxPerTransaction);
			    saleIsActive().then(setSaleActive);
		    }
	    }, 3000)
	}, [])

	return (
		<div className="body-wrapper">
		  {true ? (
		  	<Card className="mint-form">
			  	<div className="logo-wrapper">
			  		<img src="/samot-logo.jpg" width="150px" />
			  	</div>
			  	<h1>Mint Samot NFTs</h1>
			  	{wallet && wallet.account && 
			  		((wallet.networkName == 'rinkeby' && network == 'test') ||
			  		 (wallet.networkName == 'main' && network == 'main')) ? (
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
					    <p>{error}</p>
					</div>
			    ) : (
			    	<div>
			    		{showNetworkWarning ? (
			    			<div>{showNetworkWarning}</div>
			    		) : (
			    			<Button size="lg" variant="primary" className="btn-round" onClick={() => connect()}>Connect</Button>
			    		)}
			    	</div>
			    )}
			    {wallet && wallet.account && !showNetworkWarning && (
			    	<div>
				    	<p>{totalMinted} / 8888</p>
				    	<p>
				    		<a rel="noreferrer" target="_blank" href={`${etherscanUrl}/address/${NFT_CONTRACT_ADDRESS}`}>View Contract</a><br />
				    		{transactionUrl && <a rel="noreferrer" target="_blank" href={transactionUrl}>View Transaction</a>}
				    	</p>
			    	</div>
			    )}
			  </Card>
		  ) : (
		  	<Card className="mint-form">
		  		<div className="logo-wrapper">
			  		<img src="/samot-logo.jpg" width="150px" />
			  	</div>
			  	<h1>Mint Samot NFTs</h1>
			  	<p>Sale is not active.</p>
		  	</Card>
		  )}
		</div>
	)
}
