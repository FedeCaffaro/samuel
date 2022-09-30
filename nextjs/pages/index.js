import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Card, Button } from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { FaEthereum } from "react-icons/fa";
import { NFT_CONTRACT_ADDRESS, mint, mintPrice, totalSupply, maxToMint, saleIsActive } from '../lib/mint'
import { useWallet } from 'use-wallet'
import MintNavbar from './components/MintNavbar';
import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui';

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
	const [mintWithEth, setMintWithEth] = useState(false);
	const [mintWithCC, setMintWithCC] = useState(false);

	const isBrowser = typeof window !== "undefined"
	let etherscanUrl = 'https://rinkeby.etherscan.io'
	let network
	if (isBrowser) {
		etherscanUrl = window.location.hostname.includes('test') ||
			window.location.hostname.includes('cloudfront') ||
			window.location.hostname.includes('localhost') ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io'
		network = window.location.hostname.includes('test') ||
			window.location.hostname.includes('dev') ||
			window.location.hostname.includes('cloudfront') ||
			window.location.hostname.includes('localhost') ? 'test' : 'main'
	}

	console.log(NFT_CONTRACT_ADDRESS);
	console.log(mintWithCC);

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
		<>
			<MintNavbar mintWithEth={mintWithEth} setMintWithEth={setMintWithEth} />
			<div className="body-wrapper">
				{true ? (
					<Card className="mint-form">
						<div className="logo-wrapper">
							<img src="/samot-logo.jpg" width="150px" />
						</div>
						<h1>Mint Samot Club NFTs</h1>
						{!mintWithCC && mintWithEth && wallet && wallet.account &&
							((wallet.networkName == 'rinkeby' && network == 'test') ||
								(wallet.networkName == 'main' && network == 'main')) ? (
							<div>
								<div className="mint-price">{parseFloat(price / Math.pow(10, 18))} <FaEthereum /> + Gas</div>

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
								{wallet && wallet.account && !showNetworkWarning && (
									<div>
										<p>{totalMinted} / 8888</p>
										<p>
											<a rel="noreferrer" target="_blank" href={`${etherscanUrl}/address/${NFT_CONTRACT_ADDRESS}`}>View Contract</a><br />
											{transactionUrl && <a rel="noreferrer" target="_blank" href={transactionUrl}>View Transaction</a>}
										</p>
									</div>
								)}
								<p>{error}</p>
							</div>
						) : (
							<div>
								{showNetworkWarning ? (
									<div>{showNetworkWarning}</div>
								) : (
									!mintWithCC ? (
										<div className="button-container">
											{wallet.status === 'connected' ?
												(
													<Button size="lg" variant="primary" className="btn-round" onClick={() => setMintWithEth(true)}>Mint with ETH</Button>
												) : (
													<Button size="lg" variant="primary" className="btn-round" disabled onClick={() => connect()}>Connect Wallet to Mint with ETH</Button>
												)
											}
											<Button size="lg" variant="primary" className="btn-round" onClick={() => setMintWithCC(true)}>Mint with Credit Card</Button>
										</div>
									) : ""
								)}
							</div>
						)}
						{mintWithCC && !mintWithEth ? (
							<div>
								<div className="mint-price">0.4 <FaEthereum /> + Gas</div>

								<RangeSlider
									value={numberOfTokens}
									size="lg"
									min={1}
									max={8}
									tooltip="on"
									variant='warning'
									onChange={event => setNumberOfTokens(event.target.value)}
								/>
								<div className="button-container">
									<CrossmintPayButton
										clientId="08110dd1-b7e0-4972-a360-090f226ae77b"
										mintConfig={{ "type": "erc-721", "totalPrice": `${0.4*numberOfTokens}`, "numberOfTokens": {numberOfTokens} }}
										mintTo="<YOUR_USER_WALLET_ADDRESS>" //Quede acá, hay que poner un "wallet or null, me estoy cagando"
										className="btn-round btn-min-width"
									/>
								</div>
								{wallet && wallet.account && !showNetworkWarning && (
									<div>
										<p>{totalMinted} / 8888</p>
										<p>
											<a rel="noreferrer" target="_blank" href={`${etherscanUrl}/address/${NFT_CONTRACT_ADDRESS}`}>View Contract</a><br />
											{transactionUrl && <a rel="noreferrer" target="_blank" href={transactionUrl}>View Transaction</a>}
										</p>
									</div>
								)}
								<p>{error}</p>
							</div>
						) : ""}
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
		</>
	)
}
