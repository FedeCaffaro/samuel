import React, { useMemo } from 'react';
import i18next from 'i18next';
import { useWallet } from 'use-wallet';

import { useGetAssetsData } from '../../hooks/UseLoadAssets';

import styles from './styles.module.scss';

function Home() {
  const wallet = useWallet();

  const onConnectWallet = () => {
    wallet.connect();
  };

  const { stakingRewards, stakedIdsV1, stakedIdsV2, balanceTokens, percentageStaked } =
    useGetAssetsData(wallet);

  return (
    <div className={styles.center}>
      <span className={styles.text}>{i18next.t('Home:helloWorld')}</span>
      {wallet && wallet.account ? (
        <>
          <span className={styles.text}>stakingRewards: {stakingRewards}</span>
          <span className={styles.text}>stakedTokens: {[...stakedIdsV1, ...stakedIdsV2].length}</span>
          <span className={styles.text}>balanceTokens: {balanceTokens}</span>
          <span className={styles.text}>percentageStaked: {percentageStaked}</span>
        </>
      ) : (
        <button type="button" className={styles.connect} onClick={onConnectWallet}>
          {i18next.t('Home:connectWallet')}
        </button>
      )}
    </div>
  );
}

export default Home;
