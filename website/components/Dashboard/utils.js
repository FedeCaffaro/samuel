import i18next from 'i18next';

import { ETHERSCAN_URL } from './constants';

const getTransactionLink = (transactionHash) => `${ETHERSCAN_URL}/tx/${transactionHash}`;

export const claimSuccessRender = ({ transactionHash }) =>
  i18next.t('Dashboard:claimSuccess', { link: getTransactionLink(transactionHash) });

export const claimErrorRender = (error) => {
  const reason = error?.message?.split(':');
  return i18next.t('Dashboard:claimError', {
    reason: reason?.length ? reason[1] : 'Try again later.'
  });
};

export const stakingSuccessRender = ({ transactionHash }) =>
  i18next.t('Dashboard:stakingSuccess', { link: getTransactionLink(transactionHash) });

export const stakingErrorRender = (error) => {
  const reason = error?.message?.split(':');
  return i18next.t('Dashboard:stakingError', {
    reason: reason?.length ? reason[1] : 'Mint error.'
  });
};

export const unstakingSuccessRender = ({ transactionHash }) =>
  i18next.t('Dashboard:unstakingSuccess', { link: getTransactionLink(transactionHash) });

export const unstakingErrorRender = (error) => {
  const reason = error?.message?.split(':');
  return i18next.t('Dashboard:unstakingError', {
    reason: reason?.length ? reason[1] : 'Mint error.'
  });
};