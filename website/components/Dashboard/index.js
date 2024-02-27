/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
/* eslint-disable camelcase */
import React, { useState, useMemo } from 'react';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useGetAssetsData } from '../../hooks/UseLoadAssets';
import { claimRewards } from '../../utils/staking';
import Stats from '../Stats';
import { ARROW_IMG } from '../../constants/images-paths';
import { useGetOwnerData } from '../../hooks/useGetOwnerData';
import WalletBottom from '../WalletBottom';

import styles from './styles.module.scss';
import { claimErrorRender, claimSuccessRender } from './utils';
import StakingTabs from './components/StakingTabs';

function Dashboard() {
  const { wallet } = useSelector((state) => state.settings);
  const [tabsLoading, setTabsLoading] = useState(false);

  const { stakingRewards, stakedIdsV1, stakedIdsV2, balanceTokens, getAllData } = useGetAssetsData(wallet);

  const [currentOwner, _, refreshCurrentOwner] = useGetOwnerData(wallet?.account);

  const unstakedCount = useMemo(() => {
    const stakedIds = [...stakedIdsV1, ...stakedIdsV2];
    const isNotAlreadyStaked = (asset) => !stakedIds.includes(asset.identifier);
    return currentOwner?.assets?.filter(isNotAlreadyStaked).length;
  }, [currentOwner, stakedIdsV1, stakedIdsV2]);

  const owned = useMemo(
    () => unstakedCount + [...stakedIdsV1, ...stakedIdsV2]?.length,
    [currentOwner, stakedIdsV1, stakedIdsV2]
  );

  const renderAndGetData =
    (aFunction, callBefore = () => {}) =>
    (result) => {
      callBefore();
      getAllData();
      return aFunction(result?.data);
    };

  const claimTotalRewards = () =>
    toast.promise(claimRewards(wallet?.account), {
      pending: i18next.t('Dashboard:claimingRewards'),
      success: {
        render: renderAndGetData(claimSuccessRender)
      },
      error: { render: claimErrorRender }
    });

  return (
    <>
      <div className={styles['center-content']}>
        <div className={styles['title-line']}>
          <span className={styles['title-blue']}>{i18next.t('Dashboard:title')}</span>
          <div className={styles['graff-container-start']}>
            <span className={styles['graff-top']}>{i18next.t('Dashboard:owners')}</span>
          </div>
          <div className={styles['graff-container-end']}>
            <span className={styles['graff-bottom']}>{i18next.t('Dashboard:dashboard')}</span>
          </div>
        </div>

        <div className={styles['stats-container']}>
          <Stats
            owned={owned}
            staked={[...stakedIdsV1, ...stakedIdsV2].length}
            balance={balanceTokens}
            className={styles.stats}
            big
          />
        </div>

        <div className={styles.divider} />

        <div className={styles['button-container']}>
          <img src={ARROW_IMG} className={styles['arrows-left']} />
          <button type="button" className={styles.claim} onClick={claimTotalRewards}>
            {i18next.t('Dashboard:claimRewards', { rewards: stakingRewards })}
          </button>
          <img src={ARROW_IMG} className={styles['arrows-right']} />
        </div>

        <div className={styles.divider2} />

        <StakingTabs
          tabsLoading={tabsLoading}
          startTabsLoading={() => setTabsLoading(true)}
          stopTabsLoading={() => setTabsLoading(false)}
          renderAndGetData={renderAndGetData}
          stakedIdsV1={stakedIdsV1}
          stakedIdsV2={stakedIdsV2}
          unstakedCount={unstakedCount}
          getAllData={getAllData}
          refreshCurrentOwner={refreshCurrentOwner}
        />
      </div>
      <WalletBottom />
    </>
  );
}

export default Dashboard;
