/* eslint-disable no-unused-vars */
import { useState } from 'react';

import {
  balanceOf,
  calculateRewards,
  calculateTotalStakes,
  depositsOf,
  getStakedAssets,
  stakeOf
} from '../utils/staking';

// TODO: REMOVE COMMENT
// NEEDED VALUES
/*
  stakingRewards
  stakedAssets
  stakedAssetsV1
  stakedAssetsV2
  balanceTokens
  percentageStaked

  unstakedAssets
  stakes
*/

export const useGetAssetsData = (wallet) => {
  const [stakingRewards, setStakingRewards] = useState(0);

  const [balanceTokens, setBalanceTokens] = useState(0);
  const [percentageStaked, setPercentageStaked] = useState(0);

  const [stakedIdsV1, setStakedIdsV1] = useState([]);
  const [stakedIdsV2, setStakedIdsV2] = useState([]);

  if (wallet) {
    // stakingRewards
    calculateRewards(wallet.account)
      .then((value) => setStakingRewards(value))
      .catch((error) => console.error('error in calculateRewards', error));

    stakeOf(wallet.account)
      .then(setStakedIdsV1)
      .catch((error) => console.error('error in stakeOf', error));

    depositsOf(wallet.account)
      .then(setStakedIdsV2)
      .catch((error) => console.error('error in depositsOf', error));

    balanceOf(wallet.account)
      .then(setBalanceTokens)
      .catch((error) => console.error('error in balanceOf', error));

    calculateTotalStakes()
      .then(setPercentageStaked)
      .catch((error) => console.error('error in calculateTotalStakes', error));
  }

  return {
    stakingRewards,
    stakedIdsV1,
    stakedIdsV2,
    balanceTokens,
    percentageStaked
  };
};
