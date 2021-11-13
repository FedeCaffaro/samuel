import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {Card, Button, InputGroup, FormControl, Container, Row, Col} from 'react-bootstrap'
import RangeSlider from 'react-bootstrap-range-slider';
import { FaInstagram } from "react-icons/fa";
import { AiOutlineDoubleLeft } from "react-icons/ai";
import Gallery from "react-photo-gallery";
import drops from '../../data/drops'
import _ from 'lodash'

export default function Pyramyd() {
	const [ collection, setCollection ] = useState({})
	const router = useRouter()
    const { symbol } = router.query
	useEffect(() => {
		if (drops && drops.length && symbol) {
			setCollection(_.find(drops, { symbol: symbol }))
		}
	}, [symbol])
	return (
	  	<Container fluid className="collection-wrapper pyramyd">
	  		{collection && symbol && collection.smallGallery && collection.smallGallery.length > 0 && (
		  		<div>
				 <Link href="/">
				 	<div className="back-btn">
				 		<AiOutlineDoubleLeft /> Back
				 	</div>
				 </Link>
				 <div className="collection-header">
				 	<div className="logo">
				 		<img src={`/${collection.imageUrl}`} width="200px" />
				 	</div>
				 	<div className="social-links">
				 		<a href={collection.instagram} target="_blank">
				 			<FaInstagram />
				 		</a>
				 	</div>
				 </div>
				 <Row className="vertical-center collection-overview">
				 	<Col className="collection-summary" sm={12} md={6} lg={6} xl={6}>
				 		<h1>{collection.name}</h1>
						<div dangerouslySetInnerHTML={{ __html: collection.html }} />
						<h3>LAUNCH: {collection.datetime}</h3>

						<ul>
						    <li>{collection.supply} pieces</li>
						    <li>{collection.preSale}</li>
						    <li>{collection.publicSale}</li>
						</ul>

						{/*<Button onClick={() => Router.push(`/mint/${collection.contract}`)} variant="outline-light" className="btn-xl">Mint</Button>*/}

				 	</Col>
				 	<Col sm={12} md={6} lg={6} xl={6}>
				 		<div className="small-gallery">
				 			{collection && collection.smallGallery && collection.smallGallery.length > 0 && collection.smallGallery.map(image => (
				 				<img src={image.src} />
				 			))}
				 		</div>
				 	</Col>

				 </Row>
				 <div className="pyramyd_bg">
					<Row className="vertical-center">
					 	<Col sm={6}>
					 		<img src={collection.whoisImage} width="100%" />
					 	</Col>
					 	<Col sm={6} className="collection-summary">
							<h2>Who is {collection.name}?</h2>
							<p>{collection.whoisDescription}</p>
					 	</Col>
					 </Row>
					 {<div className="main-gallery">
					 	<Gallery photos={collection.largeGallery} direction="column" margin="10" columns="4" />
					 </div>}
				</div>
			</div>
			)}
		</Container>
	)
}
