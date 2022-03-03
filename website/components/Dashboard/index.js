/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useGetAssetsData } from '../../hooks/UseLoadAssets';
import { claimRewards } from '../../utils/staking';
import actions from '../../redux/Settings/actions';
import { SAMOT_DROPS } from '../../constants/drops';
import Stats from '../Stats';
import { ARROW_IMG } from '../../constants/images-paths';

import styles from './styles.module.scss';
import { claimErrorRender, claimSuccessRender } from './utils';
import StakingTabs from './components/StakingTabs';

function Dashboard() {
  const { currentOwner, wallet } = useSelector((state) => state.settings);
  const [tabsLoading, setTabsLoading] = useState(false);
  const dispatch = useDispatch();

  const { stakingRewards, stakedIdsV1, stakedIdsV2, balanceTokens, getAllData } = useGetAssetsData(wallet);
  const owned = currentOwner?.countAssets + [...stakedIdsV1, ...stakedIdsV2]?.length;

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

  useEffect(() => {
    if (wallet?.account) {
      dispatch(
        actions.getOwnerData({
          asset_contract_address: SAMOT_DROPS.contract,
          owner: wallet?.account
        })
      );
    }
  }, [wallet, stakedIdsV1, stakedIdsV2]);

  return (
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
        unstakedCount={currentOwner?.countAssets}
      />
    </div>
  );
}

export default Dashboard;
