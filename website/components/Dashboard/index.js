/* eslint-disable camelcase */
import React, { useEffect, useMemo, useState } from 'react';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import cn from 'classnames';

import { useGetAssetsData } from '../../hooks/UseLoadAssets';
import { claimRewards, stakeNFTs, unstakeNFTs, unstakeNFTsV1 } from '../../utils/staking';
import actions from '../../redux/Settings/actions';
import { SAMOT_DROPS } from '../../constants/drops';
import Asset from '../Assets';
import Stats from '../Stats';
import { ARROW_IMG } from '../../constants/images-paths';

import styles from './styles.module.scss';
import {
  claimErrorRender,
  claimSuccessRender,
  stakingErrorRender,
  stakingSuccessRender,
  unstakingErrorRender,
  unstakingSuccessRender
} from './utils';
import { TABS } from './constants';

function Dashboard() {
  const { currentAssets, currentOwner, wallet } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const [selecteds, setSelecteds] = useState([]);
  const [tabSelected, setTabSelected] = useState(TABS.STAKED);

  // TODO: Add max 20 limit
  const onSelectAsset = (asset) => () =>
    selecteds.includes(asset.tokenId)
      ? setSelecteds(selecteds.filter((id) => id !== asset.tokenId))
      : setSelecteds([...selecteds, asset.tokenId]);
  const isSelected = (asset) => selecteds.includes(asset.tokenId);

  const { stakingRewards, stakedIdsV1, stakedIdsV2, balanceTokens, getAllData } = useGetAssetsData(wallet);
  const owned = currentOwner?.countAssets + [...stakedIdsV1, ...stakedIdsV2]?.length;

  const renderAndGetData = (aFunction) => (result) => {
    getAllData();
    return aFunction(result);
  };

  const claimTotalRewards = () =>
    toast.promise(claimRewards(wallet?.account), {
      pending: i18next.t('Dashboard:claimingRewards'),
      success: {
        render: renderAndGetData(claimSuccessRender)
      },
      error: { render: claimErrorRender }
    });

  const stake = () =>
    toast.promise(stakeNFTs(wallet.account, selecteds), {
      pending: i18next.t('Dashboard:stakingNfts'),
      success: { render: renderAndGetData(stakingSuccessRender) },
      error: { render: stakingErrorRender }
    });

  const unstake = () => {
    const selectedsV1 = selecteds?.filter((id) => stakedIdsV1?.includes(id));
    const selectedsV2 = selecteds?.filter((id) => stakedIdsV2?.includes(id));

    if (selectedsV1 && selectedsV1.length) {
      toast.promise(unstakeNFTsV1(wallet.account, selectedsV1), {
        pending: i18next.t('Dashboard:unstakingNfts'),
        success: { render: renderAndGetData(unstakingSuccessRender) },
        error: { render: unstakingErrorRender }
      });
    }
    if (selectedsV2 && selectedsV2.length) {
      toast.promise(unstakeNFTs(wallet.account, selectedsV2), {
        pending: i18next.t('Dashboard:unstakingNfts'),
        success: { render: renderAndGetData(unstakingSuccessRender) },
        error: { render: unstakingErrorRender }
      });
    }
  };

  const buttonProps = {
    [TABS.STAKED.key]: {
      onClick: unstake,
      label: i18next.t('Dashboard:unstake', { count: selecteds.length })
    },
    [TABS.UNSTAKED.key]: {
      onClick: stake,
      label: i18next.t('Dashboard:stake', { count: selecteds.length })
    }
  };

  const { label: buttonLabel, onClick: buttonOnClick } = useMemo(
    () => buttonProps[tabSelected.key],
    [tabSelected, selecteds, stakedIdsV1, stakedIdsV2]
  );

  useEffect(() => {
    if (wallet?.account) {
      dispatch(
        actions.getAssets({
          asset_contract_address: SAMOT_DROPS.contract,
          limit: 50,
          offset: 0,
          ...tabSelected.getQueryParams(wallet?.account, [...stakedIdsV1, ...stakedIdsV2])
        })
      );
    }
  }, [wallet, tabSelected, stakedIdsV1, stakedIdsV2]);

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

  useEffect(() => {
    setSelecteds([]);
  }, [tabSelected]);

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

      <div className={styles.divider} />

      <div className={styles.tabs}>
        {Object.values(TABS).map(({ label, key }) => (
          <button
            type="button"
            key={key}
            className={cn(styles.tab, {
              [styles.selected]: tabSelected.key === key
            })}
            onClick={() => setTabSelected(TABS[key])}
          >
            {label}
          </button>
        ))}
      </div>

      {!!selecteds.length && (
        <button type="button" className={styles.claim} onClick={buttonOnClick}>
          {buttonLabel}
        </button>
      )}

      <div className={styles.assets}>
        {currentAssets?.map((asset) => (
          <Asset
            {...asset}
            key={asset?.tokenId}
            selected={isSelected(asset)}
            onClick={onSelectAsset(asset)}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
