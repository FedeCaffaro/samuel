import { UseWalletProvider } from 'use-wallet'
import '../styles/styles.scss'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { WagmiConfig } from 'wagmi'
import { chain, configureChains,  createClient,
} from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'



const { chains, provider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [infuraProvider({ apiKey: process.env.INFURA_ID })],
)


const client = createClient({
	provider 
})

function App({ Component, pageProps }) {
	const isBrowser = typeof window !== "undefined"
	let chainId = 1
	if (isBrowser) {
	  chainId = window.location.hostname.includes('dev') || window.location.hostname.includes('localhost') ? 4 : 1
	}
  return (
	<WagmiConfig client={client}>
  	<UseWalletProvider
        chainId={chainId}
        connectors={{
          portis: { dAppId: 'samot-nft' },
        }}
    >
  		<Component {...pageProps} />
  	</UseWalletProvider>
	</WagmiConfig>
  )
}

export default App
