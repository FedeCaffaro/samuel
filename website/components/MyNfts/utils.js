import i18next from 'i18next';

import { ETHERSCAN_URL } from './constants';

const getTransactionLink = (transactionHash) => `${ETHERSCAN_URL}/tx/${transactionHash}`;

export const mapResultSuccess = ({ transactionHash }) =>
  i18next.t('MyNfts:claimSuccess', { link: getTransactionLink(transactionHash) });

export const mapResultError = (error) => {
  const reason = error?.message?.split(':');
  return i18next.t('MyNfts:claimError', {
    reason: reason?.length ? reason[1] : 'Try again later.'
  });
};
