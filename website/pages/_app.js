import React from 'react';
import { UseWalletProvider } from 'use-wallet';
import { Provider } from 'react-redux';

import '../scss/application.scss';
import '../config/i18n';

import store from '../redux/store';
import Head from '../components/head';
import styles from '../styles/styles.module.scss';
// TODO: remove this line
// import '../styles/styles-old.scss';

function App({ Component, pageProps }) {
  return (
    <div className={styles.container}>
      <Provider store={store}>
        <UseWalletProvider
          chainId={1}
          connectors={{
            portis: { dAppId: 'samot-club' }
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
