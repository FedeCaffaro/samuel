import Head from "next/head";
import { useState } from 'react';
import RipNavbar from "./components/RipNavbar";
import RipcoinBody from "./components/RipcoinBody";
import RipgangMain from "./components/RipgangMain";
import CenteredModal from "./components/CenteredModal";


export default function Ripcoin() {
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
					<RipcoinBody setModalShow={setModalShow} />
				</div>
				<CenteredModal
					show={modalShow}
					onHide={() => setModalShow(false)}
				/>
			</div>
		</>
	);
}

export function Ripgang() {
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
					<title>RIPGANG COLLECTION X SAMOT CLUB</title>
				</Head>
				<div>
					<RipNavbar />
					<RipgangMain setModalShow={setModalShow} modalShow={modalShow} />
				</div>
				{/* <CenteredModal
					show={modalShow}
					onHide={() => setModalShow(false)}
				/> */}
			</div>
		</>
	);
}