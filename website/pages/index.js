import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useWallet } from 'use-wallet'
import {Container, Button, Row, Col, Tab, Nav, Dropdown, ButtonGroup, DropdownButton, Tabs, Modal, Accordion, Card, ToggleButton, Form} from 'react-bootstrap'
import { BiChevronDown, BiChevronRight, BiRightArrowAlt, BiDotsHorizontalRounded, BiFilter } from "react-icons/bi";
import { GoLock } from "react-icons/go";
import { NFT_CONTRACT_ADDRESS, setApproveForAll, isApprovedForAll, mint, mintPrice, maxSupply, totalSupply, maxToMint, saleIsActive } from '../lib/nft'
import { TOKEN_CONTRACT_ADDRESS, stakeNFTs, unstakeNFTs, stakeOf, rewardOf } from '../lib/token'
import Stats from '../components/stats'
import drops from '../data/drops'
import { BsArrowRight, BsChevronDown } from "react-icons/bs";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { CgDollar } from "react-icons/cg";
import { FaEthereum, FaCheckCircle, FaDiscord, FaLaptopCode, FaImages, FaStar, FaRoad, FaHandshake, FaUsers, FaBullhorn,  } from "react-icons/fa";
import { AiOutlineDoubleRight, AiFillPlusCircle } from "react-icons/ai";
import _ from 'lodash';

export default function Home() {
  const OS_API_ENDPOINT = "https://api.opensea.io/api/v1"
  //const OS_API_ENDPOINT = "https://rinkeby-api.opensea.io/api/v1"
  const wallet = useWallet()
  const [ unstakedAssets, setUnstakedAssets ] = useState([])
  const [ stakingRewards, setStakingRewards ] = useState(0)
  const [ stakedAssets, setStakedAssets ] = useState([])
  const [ stakes, setStakes ] = useState([])
  const [ collection, setCollection ] = useState({})
  const [ checked, setChecked] = useState(false);
  const [ stakelist, setStakelist ] = useState([])
  const [ staking, setStaking] = useState(false);
  const [ selected, setSelected ] = useState(null)
  const [ show, setShow ] = useState(false);
  const [ showError, setErrorShow ] = useState(false);
  const [ error, setError ] = useState("")
  const [ didLoadAssets, setDidLoadAssets ] = useState(false);
  const [ transactionUrl, setTransactionUrl ] = useState("")
  const [ tab, setTab ] = useState('unstaked');
  const [ isApproved, setIsApproved ] = useState(false)
  const [ showMenu, setShowMenu ] = useState(false)
  const [ days, setDays ] = useState(0)
  const [ hours, setMinutes ] = useState(0)
  const [ minutes, setHours ] = useState(0)
  const [ seconds, setSeconds ] = useState(0)

  const isBrowser = typeof window !== "undefined"
  let etherscanUrl = 'https://etherscan.io'
  let network
  // if (isBrowser) {
  //   etherscanUrl = window.location.hostname.includes('localhost') ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io'
  // }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleErrorClose = () => setErrorShow(false);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const stake = async () => {
    let result = await setApproveForAll(wallet.account)
    if (result.error) {
      setErrorShow(true)
      setError(result.error)
    } else {
      result = await stakeNFTs(wallet.account, _.map(stakes, 'token_id'))
      if (result.error) {
        setError(result.error)
      } else {
        setTransactionUrl(`${etherscanUrl}/tx/${result.transactionHash}`)
        loadAssets(drops[0])
      }
    }
  }

  const approve = async () => {
    let result = await setApproveForAll(wallet.account)
    if (result.error) {
      setErrorShow(true)
      setError(result.error)
    } else {
      isApprovedForAll(wallet.account).then(setIsApproved)
    }
  }

  const unstake = async () => {
    const result = await unstakeNFTs(wallet.account, _.map(stakes, 'token_id'))
    if (result.error) {
      setError(result.error)
    } else {
      setTransactionUrl(`${etherscanUrl}/tx/${result.transactionHash}`)
      loadAssets(drops[0])
    }
  }

  const selectStake = (asset) => {
    if (stakes.length >= 20) {
      setErrorShow(true)
      setError("You can stake no more than 20 NFTs at a time.")
    }
    setStaking(true)
    if (!_.find(stakes, {token_id: asset.token_id}) && stakes.length < 20) {
      setStakes([...stakes, asset])
    } else {
      setStakes(_.filter(stakes, staked => {
        return staked.token_id != asset.token_id
      }))
    }
  }

  const startCountdown = () => {
    let countDownDate = new Date("Nov 20, 2021 19:00:00").getTime();
    setInterval(function() {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)))
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
    }, 1000)
  }

  const unselectStake = (asset) => {
    setStaking(false)
    setStakes([])
  }

  const select = (asset) => {
    if (staking) {
      selectStake(asset)
    } else {
      setSelected(asset)
      handleShow()
    }
  }

  const loadAssets = async (drop) => {
    let fetchedAssets = [];
    const stakedIds = await stakeOf(wallet.account)
    const getStakedAssets = async (tokenIds, offset, limit) => {
      if (tokenIds.length > 0) {
        let ids = []
        let tokenString = ""
        if (tokenIds.length <= limit) {
          ids = tokenIds
        } else if (tokenIds.length > offset + limit) {
          ids = tokenIds.slice(offset, offset + limit)
        } else {
          ids = tokenIds.slice(offset)
        }
        _.map(ids, id => {
          tokenString += `&token_ids=${id}`
        })
        const response = await fetch(`${OS_API_ENDPOINT}/assets?order_direction=asc&asset_contract_address=${NFT_CONTRACT_ADDRESS}${tokenString}`)
        const data = await response.json()
        if (data && data.assets && data.assets.length > 0) {
          _.map(data.assets, asset => {
            fetchedAssets.push({
              ...asset,
              token_id: parseInt(asset.token_id),
            })
          })
          if(offset + limit < tokenIds.length) {
            await sleep(500)
            await getStakedAssets(tokenIds, offset + limit, limit);
          }
        }
      }
      return fetchedAssets
    }

    const stakedData = await getStakedAssets(stakedIds, 0, 20);
    setStakedAssets(stakedData)

    fetchedAssets = [];
    const getUnstakedAssets = async (owner, contractAddress) => {
      const fetchAssets = async (offset, limit) => {
        const response = await fetch(`${OS_API_ENDPOINT}/assets?order_direction=asc&offset=${offset}&limit=${limit}&owner=${owner}&asset_contract_address=${contractAddress}`)
        const data = await response.json()
        if (data && data.assets && data.assets.length > 0) {
          for (let asset of data.assets) {
              fetchedAssets.push({
                ...asset,
                token_id: parseInt(asset.token_id),
              })
          }
          if(data.assets.length === limit) {
            await sleep(500)
            await fetchAssets(offset + limit, limit);
          }
        }
      }
      await fetchAssets(0, 50);
      return fetchedAssets;
    }
    updateCollection(drop)
    let unstakedData = await getUnstakedAssets(wallet.account, drop.contract)
    const assets = []
    for (let asset of unstakedData) {
      if (!_.find(stakedData, {token_id: asset.token_id})) {
        assets.push(asset)
      }
    }
    setUnstakedAssets(assets)
    rewardOf(wallet.account).then(setStakingRewards)

  }

  useEffect(() => {
    if (wallet && wallet.account && didLoadAssets === false) {
        loadAssets(drops[0])
        isApprovedForAll(wallet.account).then(setIsApproved)
        setDidLoadAssets(true);
    }
  }, [wallet])

  const updateCollection = (drop) => {
    setStaking(false)
    setStakes([])
    setCollection(drop)
    if (drop && drop.name == "SAMOT") {
      setTab("unstaked")
    } else {
      setTab("assets")
    }
  }

  const showCollection = (drop) => {
    if (drop.infoUrl) {
      window.location.href = drop.infoUrl
    } else {
      Router.push(`/collection/${drop.symbol}`)
    }
  }
  
  useEffect(() => {
    startCountdown()
  }, []) 

  return (
    <div className="den-wrapper">
    <Container fluid>
      <div className="home-wrapper">
        <Link href="/">
          <div className="logo">
            <img src="/logo.png" height="100" alt="" loading="lazy" />
          </div>
        </Link>
        <Tab.Container defaultActiveKey="home">
          <Row>
            <Col sm={12} md={12}  lg={1} xl={1} className="side-nav">
              <div className="mobile-menu-btn hidden-desktop" onClick={() => setShowMenu(!showMenu)} >
                <AiOutlineMenu />
              </div>
              <div className={showMenu ? "mobile-menu show-menu" : "mobile-menu"}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="home">Home</Nav.Link>
                  </Nav.Item>
                  {wallet && wallet.account && (
                    <Nav.Item>
                      <Nav.Link eventKey="portfolio">Portfolio</Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link eventKey="drops">Drops</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="token">Token</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="launchpad">Launch</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <div className="wallet-wrapper">
                  {wallet && wallet.account ? (
                    <div className="wallet-address">
                      <Button variant="outline-light" size="sm" onClick={() => wallet.reset()}>
                        <img src="/metamask.png" width="25px" />
                        {`${wallet.account.substr(0, 6)}...${wallet.account.substr(wallet.account.length - 4)}`}
                      </Button>
                    </div>
                      
                  ) : (
                    <Button variant="outline-light" size="sm" onClick={() => wallet.connect()}>Connect Wallet</Button>
                  )}
                </div>
              </div>
            </Col>
            <Col sm={12} md={12}  lg={11} xl={11}>
              <Tab.Content className="outter-tab-content">
                <Tab.Pane eventKey="home">
                  <Tabs defaultActiveKey="home-inner" className="inner-tabs">
                    <Tab eventKey="home-inner" title="Home" className="inner-tab-content home-content">
                      <div className="home-video">
                        <video className='videoTag' autoPlay loop muted>
                            <source src="/samot.mp4" type='video/mp4' />
                        </video>
                        <div className="connect-wrapper">
                          <h1>Welcome to Samot Life</h1>
                          <h2>Where Latin American art, music and culture meet NFTs.</h2>
                          {!wallet || !wallet.account && <Button className="btn-xl" onClick={() => wallet.connect()}>CONNECT WALLET</Button>}
                          <div className="connect-links">
                            <Button target="_blank" href="https://discord.com/invite/Xwx3ey5XT9" variant="link"><FaDiscord /> Discord Chat <AiOutlineDoubleRight /></Button>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="overview" title="Overview" className="inner-tab-content overview">
                      <div className="overview-banner">
                        <img src="/samot-banner.jpg"/>
                      </div>
                      <div className="overview-header">
                        <h1>Samot Club</h1>
                        <p>An NFT Club that introduces the amazing Latin American artistic style. From diverse artists, the first collection comes from the creator himself. Welcome to Samot´s World and enjoy the ride.</p>
                      </div>
                      <Row>
                        <Col sm={12} md={4} lg={4} xl={4} className="overview-feature">
                          <img src="art.png"/>
                          <h2>Art</h2>
                          <p>Discover new artists and art styles from around the world.</p>
                        </Col>
                        <Col sm={12} md={4} lg={4} xl={4} className="overview-feature">
                          <img src="music.png"/>
                          <h2>Music</h2>
                          <p>Explore the music of Latin America and many other countries.</p>
                        </Col>
                        <Col sm={12} md={4} lg={4} xl={4} className="overview-feature">
                          <img src="community.png" />
                          <h2>Community</h2>
                          <p>Party with people from different cultures at Samot events.</p>
                        </Col>
                      </Row>

                    </Tab>
                  </Tabs>
                </Tab.Pane>
                <Tab.Pane eventKey="portfolio">
                  <DropdownButton
                    as={ButtonGroup}
                    key="down"
                    id={`dropdown-button-drop-down`}
                    drop="down"
                    variant="light"
                    title={collection && collection.name ? collection.name : 'Collection'}
                    className="inner-dropdown"
                  >
                    {drops && drops.length > 0 && _.filter(drops, drop => {
                      return drop.type == 'active' || drop.type == 'previous'
                    }).map(drop => (
                      <Dropdown.Item key={drop.symbol} onClick={() => loadAssets(drop)} eventKey={drop.contract}>{drop.name}</Dropdown.Item>
                    ))}
                  </DropdownButton>
                  {collection && collection.name == "SAMOT" ? (
                    <div className="token-count">
                      <span>{unstakedAssets && unstakedAssets.length ? unstakedAssets.length : 0}</span> unstaked | <span>{stakedAssets && stakedAssets.length ? stakedAssets.length : 0}</span> staked
                    </div>
                  ) : (
                    <div className="token-count">
                      <span>{unstakedAssets && unstakedAssets.length ? unstakedAssets.length : 0}</span> asset(s)
                    </div>
                  )}
                  {collection && collection.name == "SAMOT" ? (
                    <div>
                      <Tabs defaultActiveKey="unstaked" className="inner-tabs portfolio" onSelect={(k) => setTab(k)} activeKey={tab}>
                        <Tab eventKey="unstaked" title="Unstaked" className="inner-tab-content">
                          <Stats stakingRewards={stakingRewards} stakesCount={stakedAssets.length} />
                          <div className="nft-list">
                            {unstakedAssets && unstakedAssets.length < 1 && (
                              <div className="no-nfts">
                                <span>No unstaked found in your wallet.<br />Make sure you are connected to mainnet.</span>
                              </div>
                            )}
                            {unstakedAssets && unstakedAssets.length > 0 && unstakedAssets.map(asset => (
                              <div className={_.find(stakes, {token_id: asset.token_id}) ? "nft-card selected" : "nft-card"} key={`unstaked-${asset.token_id}`}>
                                  <Dropdown align="right" className="nft-menu" >
                                    <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                      <span><BiDotsHorizontalRounded/></span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="right">
                                        <Dropdown.Item onClick={() => selectStake(asset)}>Stake NFT</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                <div className="nft-img">
                                  <img onClick={() => select(asset)} src={asset.image_url} width="300px" />
                                </div>
                                <div className="nft-details">
                                  <div className="nft-number">
                                    <span className="label">token</span>
                                    {asset.token_id}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {staking && stakes && stakes.length > 0 && !transactionUrl && (
                            <div className="nfts-selected-wrapper">
                              <div className="selected-nfts">
                                {stakes.map(item => (
                                  <div className="nft" key={`selected-${item.token_id}`}>
                                    <img src={item.image_url} width="50px" />
                                  </div>
                                ))}
                              </div>
                              <div className="selected-actions">
                                {isApproved ? (
                                  <Button variant="primary" onClick={() => stake()}>Stake</Button>
                                ) : (
                                  <Button variant="outline-light" onClick={() => approve()}>Approve</Button>
                                )}
                                <Button variant="outline-light" onClick={() => unselectStake()}>Cancel</Button>
                              </div>
                            </div>
                          )}

                          {transactionUrl && (
                            <div className="transaction">
                              <Button target="_blank" size="lg" href={transactionUrl}>View Transaction</Button>
                            </div>
                          )}
                        </Tab>
                        <Tab eventKey="staked" title="Staked" className="inner-tab-content" onSelect={(k) => setTab(k)} activeKey={tab}>
                          <Stats stakingRewards={stakingRewards} stakesCount={stakedAssets.length} />
                          <div className="nft-list">
                            {stakedAssets && stakedAssets.length < 1 && (
                              <div className="no-nfts">
                                <span>No staked found in your wallet.<br />Make sure you are connected to mainnet.</span>
                              </div>
                            )}
                            {stakedAssets && stakedAssets.length > 0 && stakedAssets.map(asset => (
                              <div className={_.find(stakes, {token_id: asset.token_id}) ? "nft-card locked selected" : "nft-card locked"} key={`staked-${asset.token_id}`}>
                                  <Dropdown align="right" className="nft-menu" >
                                    <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                                      <span><BiDotsHorizontalRounded/></span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="right">
                                        <Dropdown.Item onClick={() => selectStake(asset)}>Unstake NFT</Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                <div className="lockedup"><img onClick={() => select(asset)} src="lock.png" width="120px" /></div>
                                <div onClick={() => select(asset)} className="nft-img">
                                  <img  src={asset.image_url} width="300px" />
                                </div>
                                <div className="nft-details">
                                  <div className="nft-number">
                                    <span className="label">token</span>
                                    {asset.token_id}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {staking && stakes && stakes.length > 0 && !transactionUrl && (
                            <div className="nfts-selected-wrapper">
                              <div className="selected-nfts">
                                {stakes.map(item => (
                                  <div className="nft" key={`selected-${item.token_id}`}>
                                    <img src={item.image_url} width="50px" />
                                  </div>
                                ))}
                              </div>
                              <div className="selected-actions">
                                <Button variant="primary" onClick={() => unstake()}>Unstake</Button>
                                <Button variant="outline-light" onClick={() => unselectStake()}>Cancel</Button>
                              </div>
                            </div>
                          )}
                          {transactionUrl && (
                            <div className="transaction">
                              <Button target="_blank" variant="primary" size="lg" href={transactionUrl}>View Transaction</Button>
                            </div>
                          )}
                        </Tab>
                      </Tabs>
                    </div>
                  ) : (
                    <div>
                      <Tabs defaultActiveKey="assets" className="inner-tabs portfolio" onSelect={(k) => setTab(k)} activeKey={tab}>
                        <Tab eventKey="assets" title="Assets" className="inner-tab-content" activeKey={tab}>
                          <div className="nft-list">
                            {unstakedAssets && unstakedAssets.length < 1 && (
                              <div className="no-nfts">
                                <span>No unstaked found in your wallet.<br />Make sure you are connected to mainnet.</span>
                              </div>
                            )}
                            {unstakedAssets && unstakedAssets.length > 0 && unstakedAssets.map(asset => (
                              <div className={_.find(stakes, {token_id: asset.token_id}) ? "nft-card selected" : "nft-card"} key={`assets-${asset.token_id}`}>
                                <div className="nft-img">
                                  <img onClick={() => select(asset)} src={asset.image_url} width="300px" />
                                </div>
                                <div className="nft-details">
                                  <div className="nft-number">
                                    <span className="label">token</span>
                                    {asset.token_id}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Tab>
                      </Tabs>
                    </div>
                )}
                </Tab.Pane>
                <Tab.Pane eventKey="drops">
                  <Tabs defaultActiveKey="active-drops" className="inner-tabs">
                    <Tab eventKey="active-drops" title="Active" className="inner-tab-content launches">
                      <Container>
                        {drops && _.filter(drops, {type: "active"}).map(drop => (
                          <Row className="vertical-center drop-row">
                            <Col sm={12} md={2} lg={2} xl={2} >
                              <img src={drop.imageUrl} width="150px"/>
                            </Col>
                            <Col sm={12} md={6} lg={6} xl={6} >
                              <h3>{drop.name}</h3>
                              <p>{drop.description}</p>
                            </Col>
                            <Col sm={12} md={2} lg={2} xl={2} >
                              <div className="launch-date">{drop.datetime}</div>
                            </Col>
                            <Col sm={12} md={2} lg={2} xl={2} >
                              <Button size="lg" onClick={() => showCollection(drop)}>View Collection</Button>
                            </Col>
                          </Row>
                        ))}
                      </Container>
                    </Tab>
                    <Tab eventKey="upcoming-drops" title="Upcoming" className="inner-tab-content launches">
                      <Container>
                        {drops && _.filter(drops, {type: "upcoming"}).map(drop => (
                          <Row className="vertical-center drop-row">
                            <Col sm={12} md={2} lg={2} xl={2} >
                              <img src={drop.imageUrl} width="150px"/>
                            </Col>
                            <Col sm={12} md={6} lg={6} xl={6}>
                              <h3>{drop.name}</h3>
                              <p>{drop.description}</p>
                            </Col>
                            <Col sm={12} md={2} lg={2} xl={2}>
                              <div className="launch-date">{drop.datetime}</div>
                            </Col>
                            {drop.ready ? (
                              <Col sm={12} md={2} lg={2} xl={2} >
                                <Button size="lg" onClick={() => showCollection(drop)}>View Collection</Button>
                              </Col>
                            ) : (
                              <Col sm={12} md={2} lg={2} xl={2}>
                                Coming Soon...
                              </Col>
                            )}
                          </Row>
                        ))}
                      </Container>
                    </Tab>
                    {drops && drops.length > 0 && _.find(drops, {type: "previous"}) && (
                      <Tab eventKey="previou-drops" title="Previous" className="inner-tab-content launches">
                        <Container>
                          {drops && _.filter(drops, {type: "previous"}).map(drop => (
                            <Row className="vertical-center drop-row">
                              <Col sm={12} md={2} lg={2} xl={2}>
                                <img src={drop.imageUrl} width="150px"/>
                              </Col>
                              <Col sm={12} md={6} lg={6} xl={6}>
                                <h3>{drop.name}</h3>
                                <p>{drop.description}</p>
                              </Col>
                              <Col sm={12} md={2} lg={2} xl={2}>
                                <div className="launch-date">{drop.datetime}</div>
                              </Col>
                              <Col sm={12} md={2} lg={2} xl={2}>
                                <Button size="lg" onClick={() => showCollection(drop)}>View Collection</Button>
                              </Col>
                            </Row>
                          ))}
                        </Container>
                      </Tab>
                    )}
                  </Tabs>
                </Tab.Pane>
                <Tab.Pane eventKey="token">
                  <Tabs defaultActiveKey="token-inner" className="inner-tabs">
                    <Tab eventKey="token-inner" title="Overview" className="inner-tab-content">
                      <div className="token-banner">
                        <img src="/samot-token.png" width="250px"/>
                      </div>
                      <div className="overview-header">
                        <h1>$AMOT Token</h1>
                        <p>$AMOT is a mintable ERC20 token that can be burned to mint NFTs in Samot Club drops, acquire merch, physical art, music and more. Details and tokenomics will be released on this page soon.</p>
                      </div>
                      <Row>
                        <Col>
                          <div className="countdown-wrapper">
                            <div className="counter">
                              <div className="number">{days}</div>
                              <div className="label">days</div>
                            </div>
                            <div className="counter">
                              <div className="number">{minutes}</div>
                              <div className="label">hours</div>
                            </div>
                            <div className="counter">
                              <div className="number">{hours}</div>
                              <div className="label">minutes</div>
                            </div>
                            <div className="counter">
                              <div className="number">{seconds}</div>
                              <div className="label">seconds</div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12}>
                          <div className="utility-item">
                            <div>
                              <h4>NFTs</h4>
                              <p>If you're a Samot NFT staker, you will earn $AMOT tokens and you will have pre-sale access to Samot Club NFT drops. If you choose to participate in a drop, you can burn $AMOT tokens to mint NFTs in the pre-sale.</p>
                            </div>
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="utility-item">
                            
                            <div>
                              <h4>Merch</h4>
                              <p>$AMOT tokens can be used to purchase merchandise from our upcoming store, which will feature a clothing line designed by Samot himself and digital merch that can be used in the metaverse.</p>
                            </div>
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="utility-item">
                            <div>
                              <h4>Gallery</h4>
                              <p>$SAMOT tokens can be used to purchase physical and digital art pieces from our upcoming online gallery, which will include art from some of the most well known artists in Latin America and around the world.</p>
                            </div>
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="utility-item">
                            <div>
                              <h4>Music</h4>
                              <p>If you're a Samot NFT staker, you will earn $AMOT tokens and you will have pre-sale access to Samot Club music NFT drops. If you choose to participate in a drop, you can burn $AMOT tokens to mint music NFTs in the pre-sale.</p>
                            </div>
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="utility-item">
                            <div>
                              <h4>Liquidity</h4>
                              <p>Samot Club members will be able to provide liquidity to the Samot Club community (similar to NFT20.io) and to the DEXs (e.g., Uniswap) from within the Samot Club website and earn a yield on their $AMOT tokens by doing so.</p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Tab>
                  </Tabs>
                </Tab.Pane>
                <Tab.Pane eventKey="launchpad">
                  <Tabs defaultActiveKey="launchpad-inner" className="inner-tabs">
                    <Tab eventKey="launchpad-inner" title="Launchpad" className="inner-tab-content">
                      <Row>
                        <Col className="launchpad-header">
                          <h1>What is the Samot LaunchPad?</h1>
                          <div className="divider"></div>
                          <p>We’re on a mission to introduce the most amazing artists and musicians in Latin America to the NFT space. In partnership with WenMint, a US-based NFT accelerator, and numerous top NFT communities, we can help transform your artwork into non-fungible tokens (NFTs) that can be openly traded by millions of collectors around the world. If you aren’t familiar with NFTs, don’t worry! We’ll mentor you. Below is a list of the many services we provide as part of our launchpad. If you’re interested with talking to someone on our team, click the Apply button below and tell us about your work. We look forward to hearing from you!</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={4} className="launchpad-service">
                          <FaLaptopCode />
                          <h3>Website Development</h3>
                          <p>All projects accepted into the Samot LaunchPad will have a dedicated collection page from which collectors can learn about the artist, artwork, and mint NFTs.</p>
                        </Col>
                        <Col sm={4} className="launchpad-service">
                          <FaImages />
                          <h3>Art Curation</h3>
                          <p>We will help convert your artwork into digital form that can be used to launch your collection. This includes working through rarity and other features.</p>
                        </Col>
                        <Col sm={4} className="launchpad-service">
                          <FaStar />
                          <h3>Blockchain Engineering</h3>
                          <p>We will create and deploy the smart contract, minting form, and metadata API required to make your collection available on OpenSea and other marketplaces.</p>
                        </Col>
                        <Col sm={4} className="launchpad-service">
                          <FaDiscord />
                          <h3>Discord Setup</h3>
                          <p>We will help create a Discord server for your collection that can be used to communicate with your community and keep them informed.</p>
                        </Col>
                        <Col sm={4} className="launchpad-service">
                          <FaRoad />
                          <h3>Roadmap Development</h3>
                          <p>We’ll help you create and document a vision for your collection and artwork that will appeal to NFT collectors and help shape the future of your project.</p>
                        </Col>
                        <Col sm={4} className="launchpad-service">
                          <FaHandshake />
                          <h3>Team Formation</h3>
                          <p>Launching an NFT collection requires some manpower, including marketing people, community managers, and other who can keep your community engaged.</p>
                        </Col>
                        <Col sm={4} className="launchpad-service">
                          <FaUsers />
                          <h3>Community Growth</h3>
                          <p>We’ll show you how to jumpstart your community through the use of giveaways, invite contests, influencer marketing, and collabs with other artists and communities.</p>
                        </Col>
                        <Col sm={4} className="launchpad-service">
                          <FaBullhorn />
                          <h3>Marketing Strategy</h3>
                          <p>We’ll help you develop a longer-term marketing strategy that leverages social media, video, and numerous other channels to keep your community engaged. </p>
                        </Col>
                        <Col sm={4} className="launchpad-service">
                          <FaEthereum />
                          <h3>Sale Promotion</h3>
                          <p>We will help create awareness of your art throughout the NFT space by promoting your project within our community, to our partners, and on social media.</p>
                        </Col>
                      </Row>
                      <div className="samot_bg">
                        <div className="apply-now">
                          <h1>Are You Ready?</h1>
                          <p>Existing Samot NFT holders will have exclusive, pre-sale access to your collection, after which the general public will be able to mint your artwork. We charge a small % of the ETH you raise during your sale for providing launch support. The remainder of the ETH raised goes directly to you and you also receive ongoing royalty fees for secondary sales. Click Apply below to tell us about your work and someone from our team will be in touch.</p>
                          <Button target="_blank" href="https://samot.club/apply" variant="outline-light" className="btn-xl">Apply Now</Button>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </Tab.Pane>
              </Tab.Content>

            </Col>
          </Row>
        </Tab.Container>
        
      </div>
    </Container>
    {selected && (
        <Modal show={show} onHide={handleClose} centered size="lg" className="details-modal">
          <Modal.Header >
            <Modal.Title className="nft-number"><span className="label">token</span> {selected.token_id}</Modal.Title>
            <div className="closeBtn" onClick={handleClose}><AiOutlineClose/></div>
          </Modal.Header>
          <Modal.Body>
            <div className="nft-img">
              <img src={selected.image_url} width="100%" />
              <Button variant="outline-light" size="lg" href={`https://opensea.io/assets/${selected.asset_contract.address}/${selected.token_id}`} target="new">
                View On OpenSea
              </Button>
            </div>
            <div className="nft-traits">
              {selected && selected.traits && selected.traits.map(trait => (
              <div className="trait-details" key={`trait-${selected.token_id}-${trait.trait_type}`}>
                <div className="trait-name">{trait.trait_type}</div>
                <div className="trait-value">{trait.value}</div>
              </div>
              ))}
            </div>
          </Modal.Body>
        </Modal>
      )}
      {error && (
        <Modal show={showError} onHide={handleErrorClose} centered className="dark-modal">
          <Modal.Header >
            <Modal.Title className="nft-number">Max Reached</Modal.Title>
            <div className="closeBtn" onClick={handleErrorClose}><AiOutlineClose/></div>
          </Modal.Header>
          <Modal.Body>
            <p>{error}</p>
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}
