import Head from "next/head";
import { useState } from 'react';
import RipNavbar from "./components/RipNavbar";
import NFTs from "./components/NFTs";
import CenteredModal from "./components/CenteredModal";

export default function Ripgang() {
	const [modalShow, setModalShow] = useState(false);

	return (
		<>
			<div>
				<Head>
					<link
						rel="preload"
						href="ripgang/fonts/TanPearl/TAN-PEARL.ttf"
						as="font"
						crossOrigin=""
					/>
					<title>RIPGANG X SAMOT CLUB</title>
				</Head>
				<div>
					<RipNavbar />
					<NFTs setModalShow={setModalShow} />
				</div>
				<CenteredModal
					show={modalShow}
					onHide={() => setModalShow(false)}
				/>
			</div>
		</>
	);
}