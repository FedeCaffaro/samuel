import Head from "next/head";
import RipNavbar from "./components/RipNavbar";  
import NFTs from "./components/NFTs";

export default function Ripgang() {
	return (
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
				<NFTs />
			</div>
		</div>
	);
}