/* eslint-disable camelcase */
import i18next from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { toast } from 'react-toastify';

import { TABS } from '../../constants';
import {
  stakingErrorRender,
  stakingSuccessRender,
  unstakingErrorRender,
  unstakingSuccessRender
} from '../../utils';
import { stakeNFTs, unstakeNFTs, unstakeNFTsV1 } from '../../../../utils/staking';
import Asset from '../../../Assets';
import LoadingWrapper from '../../../LoadingWrapper';
import { SAMOT_DROPS } from '../../../../constants/drops';
import useGetAssets from '../../../../hooks/useGetAssets';

import styles from './styles.module.scss';

function StakingTabs({
  renderAndGetData,
  stakedIdsV1,
  stakedIdsV2,
  unstakedCount,
  tabsLoading,
  startTabsLoading,
  stopTabsLoading
}) {
  const { wallet } = useSelector((state) => state.settings);

  const [selecteds, setSelecteds] = useState([]);
  const [tabSelected, setTabSelected] = useState(TABS.STAKED);

  const [currentAssetsPayload, setCurrentAssetsPayload] = useState({
    asset_contract_address: SAMOT_DROPS.contract,
    ...tabSelected.getQueryParams(wallet?.account, [...stakedIdsV1, ...stakedIdsV2])
  });

  const [currentAssets, currentAssetsLoading] = useGetAssets(currentAssetsPayload);

  // TODO: Add max 20 limit
  const onSelectAsset = (asset) => () =>
    selecteds.includes(asset.tokenId)
      ? setSelecteds(selecteds.filter((id) => id !== asset.tokenId))
      : setSelecteds([...selecteds, asset.tokenId]);
  const isSelected = (asset) => selecteds.includes(asset.tokenId);

  const stake = () => {
    startTabsLoading();
    const selectedsToUse = selecteds;
    setSelecteds([]);
    toast.promise(stakeNFTs(wallet.account, selectedsToUse), {
      pending: i18next.t('Dashboard:stakingNfts'),
      success: { render: renderAndGetData(stakingSuccessRender, stopTabsLoading) },
      error: { render: renderAndGetData(stakingErrorRender, stopTabsLoading) }
    });
  };

  const unstake = () => {
    startTabsLoading();
    const selectedsV1 = selecteds?.filter((id) => stakedIdsV1?.includes(id));
    const selectedsV2 = selecteds?.filter((id) => stakedIdsV2?.includes(id));
    setSelecteds([]);

    if (selectedsV1 && selectedsV1.length) {
      toast.promise(unstakeNFTsV1(wallet.account, selectedsV1), {
        pending: i18next.t('Dashboard:unstakingNfts'),
        success: { render: renderAndGetData(unstakingSuccessRender, stopTabsLoading) },
        error: { render: renderAndGetData(unstakingErrorRender, stopTabsLoading) }
      });
    }
    if (selectedsV2 && selectedsV2.length) {
      toast.promise(unstakeNFTs(wallet.account, selectedsV2), {
        pending: i18next.t('Dashboard:unstakingNfts'),
        success: { render: renderAndGetData(unstakingSuccessRender, stopTabsLoading) },
        error: { render: renderAndGetData(unstakingErrorRender, stopTabsLoading) }
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
    setSelecteds([]);
  }, [tabSelected]);

  useEffect(() => {
    if (wallet?.account) {
      setCurrentAssetsPayload({
        asset_contract_address: SAMOT_DROPS.contract,
        ...tabSelected.getQueryParams(wallet?.account, [...stakedIdsV1, ...stakedIdsV2])
      });
    }
  }, [wallet, tabSelected, stakedIdsV1, stakedIdsV2]);

  return (
    <>
      <div className={styles['top-row']}>
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
              {label(key === TABS.STAKED.key ? [...stakedIdsV1, ...stakedIdsV2].length : unstakedCount)}
            </button>
          ))}
        </div>

        {!!selecteds.length && (
          <button
            type="button"
            className={styles['tab-button']}
            onClick={buttonOnClick}
            disabled={currentAssetsLoading}
          >
            {buttonLabel}
          </button>
        )}
      </div>

      <LoadingWrapper
        loading={currentAssetsLoading || tabsLoading}
        className={styles.loading}
        withInitialLoading
      >
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
      </LoadingWrapper>
    </>
  );
}

export default StakingTabs;
