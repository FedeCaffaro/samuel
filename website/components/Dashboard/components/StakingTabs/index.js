/* eslint-disable camelcase */
import i18next from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import actions from '../../../../redux/Settings/actions';
import { SAMOT_DROPS } from '../../../../constants/drops';

import styles from './styles.module.scss';

function StakingTabs({ renderAndGetData, stakedIdsV1, stakedIdsV2, unstakedCount }) {
  const dispatch = useDispatch();
  const { currentAssets, currentAssetsLoading, wallet } = useSelector((state) => state.settings);
  const [selecteds, setSelecteds] = useState([]);
  const [tabSelected, setTabSelected] = useState(TABS.STAKED);

  // TODO: Add max 20 limit
  const onSelectAsset = (asset) => () =>
    selecteds.includes(asset.tokenId)
      ? setSelecteds(selecteds.filter((id) => id !== asset.tokenId))
      : setSelecteds([...selecteds, asset.tokenId]);
  const isSelected = (asset) => selecteds.includes(asset.tokenId);

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
    setSelecteds([]);
  }, [tabSelected]);

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

      <LoadingWrapper loading={currentAssetsLoading} className={styles.loading} withInitialLoading>
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
