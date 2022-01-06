import React from 'react';
import { UseWalletProvider } from 'use-wallet';

import Head from '../components/head';
import '../styles/styles.scss';

function App({ Component, pageProps }) {
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
  );
}

export default App;
