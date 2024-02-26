/* eslint-disable no-empty-function */
/* eslint-disable camelcase */
import i18next from 'i18next';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { toast } from 'react-toastify';

import { TABS } from '../../constants';
import {
  approveErrorRender,
  approveSuccessRender,
  stakingErrorRender,
  stakingSuccessRender,
  unstakingErrorRender,
  unstakingSuccessRender
} from '../../utils';
import {
  isApprovedForAll,
  setApproveForAll,
  stakeNFTs,
  unstakeNFTs,
  unstakeNFTsV1
} from '../../../../utils/staking';
import Asset from '../../../Assets';
import LoadingWrapper from '../../../LoadingWrapper';
import { SAMOT_DROPS } from '../../../../constants/drops';
import useGetAssets from '../../../../hooks/useGetAssets';
import BottomPopupWithButton from '../../../BottomPopupWithButton';

import styles from './styles.module.scss';

function StakingTabs({
  renderAndGetData,
  stakedIdsV1,
  stakedIdsV2,
  unstakedCount,
  tabsLoading,
  startTabsLoading,
  stopTabsLoading,
  getAllData,
  refreshCurrentOwner
}) {
  const { wallet } = useSelector((state) => state.settings);

  const [selecteds, setSelecteds] = useState([]);
  const [tabSelected, setTabSelected] = useState(TABS.UNSTAKED);
  const [isApproved, setIsApproved] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const getDataInSomeSeconds = () => {
    startTabsLoading();
    setTimeout(() => {
      getAllData();
      refreshCurrentOwner();
      stopTabsLoading();
    }, 2000);
  };

  const checkApprove = () => {
    setLoadingApprove(true);
    return isApprovedForAll(SAMOT_DROPS.contract, wallet?.account)
      .then((result) => {
        setIsApproved(result);
        setLoadingApprove(false);
        stopTabsLoading();
      })
      .catch(() => {
        setLoadingApprove(false);
        stopTabsLoading();
      });
  };

  useEffect(() => {
    if (wallet?.account) {
      checkApprove();
    }
  }, [wallet]);

  const [currentAssetsPayload, setCurrentAssetsPayload] = useState({
    asset_contract_address: SAMOT_DROPS.contract,
    ...tabSelected.getQueryParams(wallet?.account, [...stakedIdsV1, ...stakedIdsV2])
  });

  const [currentAssets, currentAssetsLoading] = useGetAssets(currentAssetsPayload);

  // TODO: Add max 20 limit
  const onSelectAsset = (asset) => () =>
    isApproved
      ? selecteds.includes(asset.tokenId)
        ? setSelecteds(selecteds.filter((id) => id !== asset.tokenId))
        : setSelecteds([...selecteds, asset.tokenId])
      : toast.error(i18next.t('Dashboard:notAproved'));
  const isSelected = (asset) => selecteds.includes(asset.tokenId);

  const stake = () => {
    startTabsLoading();
    const selectedsToUse = selecteds;
    setSelecteds([]);
    toast.promise(stakeNFTs(wallet.account, selectedsToUse), {
      pending: i18next.t('Dashboard:stakingNfts'),
      success: {
        render: renderAndGetData(stakingSuccessRender, getDataInSomeSeconds)
      },
      error: {
        render: renderAndGetData(stakingErrorRender, getDataInSomeSeconds)
      }
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
        success: {
          render: renderAndGetData(unstakingSuccessRender, getDataInSomeSeconds)
        },
        error: {
          render: renderAndGetData(unstakingErrorRender, getDataInSomeSeconds)
        }
      });
    }
    if (selectedsV2 && selectedsV2.length) {
      toast.promise(unstakeNFTs(wallet.account, selectedsV2), {
        pending: i18next.t('Dashboard:unstakingNfts'),
        success: { render: renderAndGetData(unstakingSuccessRender, getDataInSomeSeconds) },
        error: { render: renderAndGetData(unstakingErrorRender, getDataInSomeSeconds) }
      });
    }
  };

  const approve = () => {
    toast.promise(setApproveForAll(SAMOT_DROPS.contract, wallet.account), {
      pending: i18next.t('Dashboard:aproving'),
      success: { render: renderAndGetData(approveSuccessRender, checkApprove) },
      error: { render: renderAndGetData(approveErrorRender, checkApprove) }
    });
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

  const filter = useCallback(
    (asset) => {
      const selectedsIds = [...stakedIdsV1, ...stakedIdsV2];
      return tabSelected.key === TABS.STAKED.key
        ? selectedsIds.includes(asset.tokenId)
        : !selectedsIds.includes(asset.tokenId);
    },
    [tabSelected, stakedIdsV1, stakedIdsV2]
  );

  return (
    <>
      <LoadingWrapper loading={loadingApprove}>
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
                {label(
                  key === TABS.STAKED.key
                    ? [...stakedIdsV1, ...stakedIdsV2].length
                    : unstakedCount
                    ? unstakedCount > 50
                      ? '50+'
                      : unstakedCount
                    : 0
                )}
              </button>
            ))}
          </div>

          {isApproved && !!selecteds.length && (
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
ASD
        <LoadingWrapper loading={currentAssetsLoading || tabsLoading} className={styles.loading}>
          <div className={styles.assets}>
            {currentAssets?.filter(filter).map((asset) => (
              <Asset
                {...asset}
                key={asset?.tokenId}
                selected={isSelected(asset)}
                onClick={onSelectAsset(asset)}
              />
            ))}
          </div>
        </LoadingWrapper>
        <BottomPopupWithButton
          text={i18next.t('Dashboard:approveNeeded')}
          buttonLabel={i18next.t('Dashboard:approve')}
          onClick={approve}
          buttonClassname={styles['approve-button']}
          show={!isApproved}
          notClose
        />
      </LoadingWrapper>
    </>
  );
}

export default StakingTabs;
