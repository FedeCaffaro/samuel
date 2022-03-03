/* eslint-disable react/forbid-dom-props */
import i18next from 'i18next';
import React from 'react';

import { ETHERSCAN_URL } from './constants';

const getTransactionLink = (transactionHash) => `${ETHERSCAN_URL}/tx/${transactionHash}`;

const successMessageWithLink = (text, transactionHash) => (
  <>
    <span>{text}</span>
    <a style={{ 'text-decoration': 'underline' }} href={getTransactionLink(transactionHash)}>
      {i18next.t('Dashboard:seeTransaction')}
    </a>
  </>
);

export const claimSuccessRender = ({ transactionHash }) =>
  successMessageWithLink(i18next.t('Dashboard:claimSuccess'), transactionHash);

export const claimErrorRender = (error) => {
  const reason = error?.message?.split(':');
  return i18next.t('Dashboard:claimError', {
    reason: reason?.length ? reason[1] : 'Try again later.'
  });
};

export const stakingSuccessRender = ({ transactionHash }) =>
  successMessageWithLink(i18next.t('Dashboard:stakingSuccess'), transactionHash);

export const stakingErrorRender = (error) => {
  const reason = error?.message?.split(':');
  return i18next.t('Dashboard:stakingError', {
    reason: reason?.length ? reason[1] : 'Mint error.'
  });
};

export const unstakingSuccessRender = ({ transactionHash }) =>
  successMessageWithLink(i18next.t('Dashboard:unstakingSuccess'), transactionHash);

export const unstakingErrorRender = (error) => {
  const reason = error?.message?.split(':');
  return i18next.t('Dashboard:unstakingError', {
    reason: reason?.length ? reason[1] : 'Mint error.'
  });
};
