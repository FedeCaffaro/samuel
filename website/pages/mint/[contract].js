import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import Image from 'next/image'
import {Card, Button, InputGroup, FormControl, Container} from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { FaEthereum } from "react-icons/fa";
import { BiMinus, BiPlus } from "react-icons/bi";
import { mint, mintPrice, maxSupply, totalSupply, maxToMint, maxToMintPresale, saleIsActive, preSaleIsActive } from '../../lib/nft'
import { useWallet } from 'use-wallet'
import _ from 'lodash'
import drops from '../../data/drops'

export default function Home() {
	const router = useRouter()
	const wallet = useWallet()
	const { contract } = router.query
	const [ collection, setCollection ] = useState({})
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)
	const [totalMinted, setTotalMinted] = useState(0)
	const [maxPerWallet, setMaxPerWallet] = useState(0)
	const [maxPerTransaction, setMaxPerTransaction] = useState(0)
	const [saleActive, setSaleActive] = useState(false)
	const [presaleActive, setPreSaleActive] = useState(false)
	const [whitelisted, setWhitelisted] = useState(false)
	const [price, setPrice] = useState(0)
	const [supply, setSupply] = useState(0)
	const [numberOfTokens, setNumberOfTokens] = useState(1)
	const [transactionUrl, setTransactionUrl] = useState("")
	const [pending, setPending] = useState(false)
	const [nftsOwned, setNFTsOwned] = useState(0)

	const isBrowser = typeof window !== "undefined"
	let etherscanUrl = 'https://rinkeby.etherscan.io'
	let network
	if (isBrowser) {
	  etherscanUrl = window.location.hostname.includes('test') ||
	  	window.location.hostname.includes('cloudfront') ||
	  	window.location.hostname.includes('localhost') ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io'
	  network = window.location.hostname.includes('test') ||
	  	window.location.hostname.includes('cloudfront') ||
	  	window.location.hostname.includes('localhost') ? 'test' : 'main'
	}


	const connect = () => {
	  wallet.connect()
	}

	const disconnect = () => {
	  wallet.reset()
	}

	const increment = () => {
		if (presaleActive && saleActive) {
			setNumberOfTokens(numberOfTokens + 1 <= maxPerWallet ? numberOfTokens + 1 : maxPerWallet)
		} else if (saleActive) {
			setNumberOfTokens(numberOfTokens + 1 <= maxPerTransaction ? numberOfTokens + 1 : maxPerTransaction)
		}
	}

  	const decrement = () => {
    	setNumberOfTokens(numberOfTokens - 1 > 0 ? numberOfTokens - 1 : 1)
  	}

	const mintNFTs = async () => {
      setError(null)
      setLoading(true)
      setPending(true)
      const result = await mint(collection.contract, wallet.account, numberOfTokens, price)
      if (result.error) {
        setError(result.error)
      } else {
        setTransactionUrl(`${etherscanUrl}/tx/${result.transactionHash}`)
      }
  	}

	useEffect(() => {
		if (wallet && wallet.account && drops) {
			setCollection(_.find(drops, {contract: contract}))
	       	totalSupply(contract).then(setTotalMinted);
		    mintPrice(contract).then(setPrice);
		    maxToMint(contract).then(setMaxPerTransaction);
		    maxSupply(contract).then(setSupply);
		    saleIsActive(contract).then(setSaleActive);
		    //balanceOfDragons(wallet.account).then(setDragonsOwned)
	    }
	}, [wallet])

	useEffect(() => {
		wallet.connect()
	}, [])

	return (
	  	<Container fluid className="mint-wrapper pyramyd">
			<div className="form-wrapper">
				<div className="logo">
					<img src={`/${collection.imageUrl}`} width="252px" />
				</div>
				<div className="divider"></div>
  				<h1>Mint a {collection.name}</h1>
  				
  				{saleActive ? (
  				<div>
					{wallet && wallet.account ? (
					  	<div>
							<div>
								<p>Please use Chrome/Firefox with metamask extension for PC or metamask app for mobile.</p>
							  	<div className="mint-price">{parseFloat(price/Math.pow(10, 18)).toFixed(2)} <FaEthereum/> + Gas</div>
							  	<InputGroup className="mint-input">
								    <Button variant="primary" className="btn-left" onClick={() => decrement()}>
								      <BiMinus />
								    </Button>
								    <FormControl
								      type="number"
								      placeholder="1"
								      aria-label="Example text with button addon"
								      aria-describedby="basic-addon1"
								      value={numberOfTokens}
								    />
								    <Button variant="primary" className="btn-right" onClick={() => increment()}>
								      <BiPlus  />
								    </Button>
								</InputGroup>
							    <Button size="lg" variant="primary" onClick={() => mintNFTs()}>Mint</Button>
							    <div className="supply">Total Minted: {totalMinted} / {supply}</div>
							</div>
							{<div>
						    	<p>
						    		<a target="_blank" href={`${etherscanUrl}/address/${collection.contract}`}>View Contract</a><br />
						    		{transactionUrl && <a target="_blank" href={transactionUrl}>View Transaction</a>}
						    	</p>
					    	</div>}
						</div>
				    ) : (
				    	<Button size="lg" variant="primary" onClick={() => connect()}>Connect</Button>
				    )}
				</div>
				): (
					<p>Minting is not available.</p>
				)}
			</div>
			 
		</Container>
	)
}
