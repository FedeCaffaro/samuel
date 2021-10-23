import { UseWalletProvider } from 'use-wallet'
import '../styles/styles.scss'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

function App({ Component, pageProps }) {
	const isBrowser = typeof window !== "undefined"
	let chainId = 1
	if (isBrowser) {
	  chainId = window.location.hostname.includes('dev') || window.location.hostname.includes('localhost') ? 4 : 1
	}
  return (
  	<UseWalletProvider
        chainId={1}
        connectors={{
          portis: { dAppId: 'samot-nft' },
        }}
    >
  		<Component {...pageProps} />
  	</UseWalletProvider>
  )
}

export default App
