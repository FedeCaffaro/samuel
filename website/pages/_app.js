import React, { useEffect } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { Provider } from 'react-redux';

import '../scss/application.scss';
import '../config/i18n';
import '../styles/styles.scss';

import store from '../redux/store';
import Head from '../components/head';

function App({ Component, pageProps }) {
  return (
    <div className="app-wrapper">
      <Provider store={store}>
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
      </Provider>
    </div>
  );
}

export default App;
