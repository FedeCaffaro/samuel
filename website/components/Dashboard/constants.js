/* eslint-disable camelcase */
import i18next from 'i18next';

import { getOwnerAsParams, getTokenIdsAsParams } from '../../utils/assets';

export const ETHERSCAN_URL = process.env.NEXT_PUBLIC_ETHERSCAN_URL;

export const TABS = {
  STAKED: {
    key: 'STAKED',
    label: (count) => i18next.t('Dashboard:staked', { count }),
    getQueryParams: getTokenIdsAsParams
  },
  UNSTAKED: {
    key: 'UNSTAKED',
    label: (count) => i18next.t('Dashboard:unstaked', { count }),
    getQueryParams: getOwnerAsParams
  }
};
