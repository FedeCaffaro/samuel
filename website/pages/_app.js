import React, { useEffect, useState } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import '../scss/application.scss';
import '../config/i18n';

import store from '../redux/store';
import Head from '../components/head';
import styles from '../styles/styles.module.scss';
import GeneralHooks from '../components/GeneralHooks';
import LoadingWrapper from '../components/LoadingWrapper';

// TODO: remove this line
// import '../styles/styles-old.scss';

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    console.log('NODE_ENV', process.env.NODE_ENV);
    console.log('NEXT_PUBLIC_NFT_CONTRACT_ADDRESS', process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS);
    console.log('NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS', process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS);
    console.log('NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS', process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS);
    console.log('NEXT_PUBLIC_TOKENV2_CONTRACT_ADDRESS', process.env.NEXT_PUBLIC_TOKENV2_CONTRACT_ADDRESS);
    console.log('NEXT_PUBLIC_NFT2_CONTRACT_ADDRESS', process.env.NEXT_PUBLIC_NFT2_CONTRACT_ADDRESS);
    console.log('NEXT_PUBLIC_SAMOT_CONTRACT_ADDRESS', process.env.NEXT_PUBLIC_SAMOT_CONTRACT_ADDRESS);
    console.log('NEXT_PUBLIC_ETHERSCAN_URL', process.env.NEXT_PUBLIC_ETHERSCAN_URL);
    console.log('NEXT_PUBLIC_OS_API_ENDPOINT', process.env.NEXT_PUBLIC_OS_API_ENDPOINT);
    console.log('NEXT_PUBLIC_OPEN_SEA_API', process.env.NEXT_PUBLIC_OPEN_SEA_API);
  }, []);

  const [loading, setLoading] = useState(false);

  const handleStart = () => setLoading(true);
  const handleComplete = () => setLoading(false);

  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return (
    <div className={styles.container}>
      <Provider store={store}>
        <UseWalletProvider
          chainId={1}
          connectors={{
            portis: { dAppId: 'samot-club' }
          }}
        >
          <ToastContainer position="bottom-center" />
          <GeneralHooks />
          <Head />
          <LoadingWrapper loading={loading} className={styles['loading-container']}>
            <div className="main-wrapper">
              <Component {...pageProps} />
            </div>
          </LoadingWrapper>
        </UseWalletProvider>
      </Provider>
    </div>
  );
}

export default App;
