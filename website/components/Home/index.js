import React from 'react';
import i18next from 'i18next';
import { useWallet } from 'use-wallet';

import styles from './styles.module.scss';
import { useLoadAssets } from './hooks/UseLoadAssets';

function Home() {
  const wallet = useWallet();

  const onConnectWallet = () => {
    wallet.connect();
  };

  const { stakedAssets } = useLoadAssets(wallet);

  return (
    <div className={styles.center}>
      <span className={styles.text}>{i18next.t('Home:helloWorld')}</span>
      {wallet && wallet.account ? (
        <span className={styles.text}>{JSON.stringify(stakedAssets)}</span>
      ) : (
        <button type="button" className={styles.connect} onClick={onConnectWallet}>
          {i18next.t('Home:connectWallet')}
        </button>
      )}
    </div>
  );
}

export default Home;
