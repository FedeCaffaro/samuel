import React from 'react'
import Head from '../components/head'
import Header from '../components/header'
import { UseWalletProvider } from 'use-wallet'
import { useRouter } from "next/router";
import '../styles/styles.scss'

function App({ Component, pageProps }) {
  const router = useRouter();
  return (
  	<div className="app-wrapper">
  		<UseWalletProvider
		    chainId={1}
		    connectors={{
		      portis: { dAppId: 'samot-club' },
		    }}
		  >
			  	<Head />
			  	<div className="main-wrapper">
			  		<Component {...pageProps} />
			  	</div>
		</UseWalletProvider>
  	</div>
  )
}

export default App
