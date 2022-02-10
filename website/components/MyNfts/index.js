import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useGetAssetsData } from '../../hooks/UseLoadAssets';
import { claimRewards } from '../../utils/staking';

import { ETHERSCAN_URL } from './constants';
import styles from './styles.module.scss';

function MyNfts() {
  const wallet = useSelector((state) => state.settings.wallet);

  const claimTotalRewards = () =>
    claimRewards(wallet.account)
      .then((result) => {
        toast.success(`${ETHERSCAN_URL}/tx/${result.transactionHash}`);
      })
      .catch((error) => {
        const reason = error.message.split(':');
        toast.error(reason.length ? reason[1] : 'Error.');
      });

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

      <button type="button" className={styles.claim} onClick={claimTotalRewards}>
        {i18next.t('MyNfts:claimRewards')}
      </button>
    </div>
  );
}

export default MyNfts;
