import { useEffect, useState } from 'react';

import { balanceOf, calculateRewards, calculateTotalStakes, depositsOf, stakeOf } from '../utils/staking';

export const useGetAssetsData = (wallet) => {
  const [stakingRewards, setStakingRewards] = useState(0);

  const [balanceTokens, setBalanceTokens] = useState(0);
  const [percentageStaked, setPercentageStaked] = useState(0);

  const [stakedIdsV1, setStakedIdsV1] = useState([]);
  const [stakedIdsV2, setStakedIdsV2] = useState([]);

  const getters = [
    {
      getter: calculateRewards,
      setter: setStakingRewards
    },
    {
      getter: balanceOf,
      setter: setBalanceTokens
    },
    {
      getter: calculateTotalStakes,
      setter: setPercentageStaked
    },
    {
      getter: stakeOf,
      setter: setStakedIdsV1
    },
    {
      getter: depositsOf,
      setter: setStakedIdsV2
    }
  ];

  const getAll = (account) =>
    console.log('GET_ALL') ||
    getters.forEach(({ getter, setter }) => {
      getter(account)
        .then(setter)
        // eslint-disable-next-line no-console
        .catch((error) => console.error(`error in ${getter.name}`, error));
    });

  useEffect(() => {
    if (wallet?.account) {
      getAll(wallet.account);
    }
  }, [wallet?.account]);

  return {
    stakingRewards,
    stakedIdsV1,
    stakedIdsV2,
    balanceTokens,
    percentageStaked,
    getAllData: () => getAll(wallet.account)
  };
};
