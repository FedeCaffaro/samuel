import i18next from 'i18next';
import React from 'react';
import { useSelector } from 'react-redux';

import { useGetAssetsData } from '../../hooks/UseLoadAssets';

import styles from './styles.module.scss';

function MyNfts() {
  const wallet = useSelector((state) => state.settings.wallet);

  const { stakingRewards, stakedIdsV1, stakedIdsV2, balanceTokens, percentageStaked } =
    useGetAssetsData(wallet);

  return (
    <div className={styles.center}>
      <span className={styles.text}>{i18next.t('MyNfts:title')}</span>

      <div className={styles['data-container']}>
        <span className={styles['small-text']}>
          {i18next.t('MyNfts:stakingRewards')}
          {stakingRewards}
        </span>
        <span className={styles['small-text']}>
          {i18next.t('MyNfts:stakedTokens')}
          {[...stakedIdsV1, ...stakedIdsV2].length}
        </span>
        <span className={styles['small-text']}>
          {i18next.t('MyNfts:balanceTokens')}
          {balanceTokens}
        </span>
        <span className={styles['small-text']}>
          {i18next.t('MyNfts:percentageStaked')}
          {percentageStaked}
        </span>
      </div>
    </div>
  );
}

export default MyNfts;
