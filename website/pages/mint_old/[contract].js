import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';
import {  Card, Button, InputGroup, FormControl, Container } from 'react-bootstrap';;
import RangeSlider from 'react-bootstrap-range-slider';
import { FaEthereum } from 'react-icons/fa';
import { BiMinus, BiPlus } from 'react-icons/bi';

import { stakeOf } from '../../lib/token'
import { useWallet } from 'use-wallet'
import _ from 'lodash'
import { isAndroid, isIOS } from "react-device-detect";
import { mint, mintPrice, mintPricePreSale, maxSupply, totalSupply, maxToMint, maxToMintPerNFT, saleIsActive, preSaleIsActive, balanceOf } from '../../lib/nft'
import drops from '../../data/drops';

export default function Home() {
  const router = useRouter();;
  const wallet = useWallet();;
  const { contract } = router.query;;
  const [collection, setCollection] = useState({});;
  const [error, setError] = useState(null);;
  const [loading, setLoading] = useState(true);;
  const [totalMinted, setTotalMinted] = useState(0);;
  const [maxMint, setMaxMint] = useState(0);;
  const [maxMintPreSale, setMaxMintPreSale] = useState(0);;
  const [saleActive, setSaleActive] = useState(false);;
  const [preSaleActive, setPreSaleActive] = useState(false);;
  const [price, setPrice] = useState(0);;
  const [pricePreSale, setPricePreSale] = useState(0);;
  const [supply, setSupply] = useState(0);;
  const [numberOfTokens, setNumberOfTokens] = useState(1);;
  const [transactionUrl, setTransactionUrl] = useState('');;
  const [message, setMessage] = useState('');;
  const [nftsOwned, setNFTsOwned] = useState(0);;
  const [isMobile, setIsMobile] = useState(false);

  const isBrowser = typeof window !== 'undefined';;
  let etherscanUrl;;
  let network;;
  let metamaskDeepLinkUrl = 'https://metamask.app.link/dapp/dev-mint.samot.club';;
  if (isBrowser) {
    etherscanUrl =
      window.location.hostname.includes('dev') || window.location.hostname.includes('localhost')
        ? 'https://rinkeby.etherscan.io'
        : 'https://etherscan.io';;
    network =
      window.location.hostname.includes('dev') || window.location.hostname.includes('localhost')
        ? 'test'
        : 'main';;
    metamaskDeepLinkUrl =
      window.location.hostname.includes('dev') ||
      window.location.hostname.includes('cloudfront') ||
      window.location.hostname.includes('localhost')
        ? 'https://metamask.app.link/dapp/dev-mint.samot.club'
        : 'https://metamask.app.link/dapp/mint.samot.club';;
  }

  const connect = () => {
    wallet.connect();;
  };;

  const disconnect = () => {
    wallet.reset();;
  };;

  useEffect(() => {
    if (isAndroid || isIOS) {
      setIsMobile(true);
    }
  }, []);

  const increment = () => {
    if (preSaleActive) {
      setNumberOfTokens(numberOfTokens + 1 <= maxMintPreSale ? numberOfTokens + 1 : maxMintPreSale);;
    } else {
      setNumberOfTokens(numberOfTokens + 1 <= maxMint ? numberOfTokens + 1 : maxMint);;
    }
  };;

  const decrement = () => {
    if (preSaleActive) {
      const lower = maxMintPreSale == 0 ? 0 : 1;;
      setNumberOfTokens(numberOfTokens - 1 > 0 ? numberOfTokens - 1 : lower);;
    } else {
      setNumberOfTokens(numberOfTokens - 1 > 0 ? numberOfTokens - 1 : 1);;
    }
  };;

  const mintNFTs = async () => {
    setError(null);;
    setLoading(true);;
    const mintPrice = preSaleActive ? pricePreSale : price;;
    const result = await mint(collection.contract, wallet.account, numberOfTokens, mintPrice);;
    if (result.error) {
      setNumberOfTokens(1);;
      setError(result.error);;
    } else {
      setNumberOfTokens(1);;
      setTransactionUrl(`${etherscanUrl}/tx/${result.transactionHash}`);;
    }
  };;

  const readContract = async () => {
    if (wallet && wallet.account) {
      totalSupply(contract).then(setTotalMinted);
      maxSupply(contract).then(setSupply);
      saleIsActive(contract).then(setSaleActive);;
      preSaleIsActive(contract).then(setPreSaleActive);;
      mintPricePreSale(contract).then(setPricePreSale);;
      maxToMintPreSale(contract).then(setMaxMintPreSale);;
      mintPrice(contract).then(setPrice);
      maxToMint(contract).then(setMaxMint);
    }
  };;

  const maxToMintPreSale = async (contract) => {
    const maxPerNFT = await maxToMintPerNFT(contract);;
    const staked = (await stakeOf(wallet.account)).length;;
    const unstaked = await balanceOf(drops[0].contract, wallet.account);;
    const minted = await balanceOf(contract, wallet.account);;
    const owned = parseInt(staked) + parseInt(unstaked);;
    setNFTsOwned(owned);;
    const max = owned * maxPerNFT - parseInt(minted);;
    if (max < 1 && preSaleActive) {
      setNumberOfTokens(0);;
    } else {
      setNumberOfTokens(1);;
    }
    return max;;
  };;

  useEffect(() => {
    setNumberOfTokens(1);;
  }, [preSaleActive, saleActive]);;

  useEffect(() => {
    if (drops && drops.length > 0 && contract) {
      const drop = _.find(drops, { contract: contract });;
      setCollection(drop);;
    }
  }, [contract, drops]);;

  useEffect(() => {
    if (wallet.account) readContract();;
  }, [wallet]);;

  useEffect(() => {
    wallet.connect();;
    setInterval(() => {
      if (wallet.account) readContract();;
    }, 3000);;
  }, []);;

  return (
    <Container fluid className="mint-wrapper pyramyd">
      {collection && collection.contract && contract && (
        <div className="form-wrapper">
          <div className="logo">
            <img src={`/${collection.imageUrl}`} width="252px" />
          </div>
          <div className="divider" />
          <h1>Mint a {collection.name}</h1>

          {saleActive ? (
            <div>
              {wallet && wallet.account ? (
                <div>
                  {preSaleActive && nftsOwned == 0 ? (
                    <p>You must own at least one Samot NFT to participate in the pre-sale.</p>
                  ) : (
                    <div>
                      <div>
                        <p>Please use Chrome/Firefox with MetaMask.</p>
  <div className="mint-price">{preSaleActive
											  		? parseFloat(pricePreSale / Math.pow(10, 18)).toFixed(2)
											  		: parseFloat(price / Math.pow(10, 18)).toFixed(2)
                          <FaEthereum /> + Gas
                        </div>
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
  <BiPlus />
                          </Button>
                        </InputGroup>
  <Button size="lg" variant="primary" onClick={() => mintNFTs()}>Mint</Button>
  <div className="supply">Total Minted: {totalMinted} / {supply}</div>
                      </div>
                      <div>
                        <p>
  <a target="_blank" href={`${etherscanUrl}/address/${collection.contract}`} rel="noreferrer">View Contract</a><br />
  {transactionUrl && <a target="_blank" href={transactionUrl} rel="noreferrer">View Transaction</a>}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
  <Button size="lg" variant="primary" onClick={() => connect()}>Connect</Button>
              )}
            </div>
          )  : (
            <div>
              {isMobile && saleActive ? (
  <Button size="lg" variant="primary" href={metamaskDeepLinkUrl}>Connect</Button>
              ) : (
                <p>Minting is not available.</p>
              )}
            </div>
          )}
        </div>
      )}
    </Container>
  );;
}
