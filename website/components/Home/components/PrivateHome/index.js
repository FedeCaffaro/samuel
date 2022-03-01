/* eslint-disable camelcase */
import i18next from 'i18next';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import Stats from '../../../Stats';
import { ROUTES } from '../../../../constants/routes';
import { useGetAssetsData } from '../../../../hooks/UseLoadAssets';
import { getOwnerAsParams } from '../../../../utils/assets';
import { SAMOT_DROPS } from '../../../../constants/drops';
import actions from '../../../../redux/Settings/actions';

import styles from './styles.module.scss';

function PrivateHome() {
  const dispatch = useDispatch();
  const { wallet, currentAssets } = useSelector((state) => state.settings);
  const name = currentAssets?.[0]?.owner?.user || 'holder';
  const { stakedIdsV1, stakedIdsV2, balanceTokens } = useGetAssetsData(wallet);

  const owned = currentAssets?.length + [...stakedIdsV1, ...stakedIdsV2]?.length;

  useEffect(() => {
    if (wallet?.account) {
      dispatch(
        actions.getAssets({
          asset_contract_address: SAMOT_DROPS.contract,
          limit: 50,
          offset: 0,
          ...getOwnerAsParams(wallet?.account)
        })
      );
    }
  }, [wallet, stakedIdsV1, stakedIdsV2]);

  return (
    <div className={styles.container}>
      <div className={styles['first-line']}>
        <span className={styles['text-full']}>{i18next.t('Home:hi', { name })}</span>
        <div className={styles['graff-container']}>
          <span className={styles.graff}>{name}</span>
        </div>
      </div>
      <span className={styles['text-full']}>{i18next.t('Home:welcomeBack')}</span>
      <Stats
        owned={owned}
        staked={[...stakedIdsV1, ...stakedIdsV2].length}
        balance={balanceTokens}
        className={styles.stats}
      />
      <Link href={ROUTES.DASHBOARD.pagePath}>
        <button className={styles['button-dashboard']} type="button">
          {i18next.t('Home:goToDashboard')}
        </button>
      </Link>
    </div>
  );
}

export default PrivateHome;
