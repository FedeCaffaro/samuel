/* eslint-disable no-unused-vars */
/* eslint-disable max-statements */
import { useState } from 'react';

import { balanceOf } from '../../../lib/tokenv2';
import { calculateRewards, calculateTotalStakes, depositsOf } from '../../../lib/staking';
import { stakeOf } from '../../../lib/token';
import { SAMOT_DROP } from '../constants';
import { OS_API_ENDPOINT, sleep } from '../utils';

export const useLoadAssets = async (wallet) => {
  const [unstakedAssets, setUnstakedAssets] = useState([]);
  const [stakingRewards, setStakingRewards] = useState(0);
  const [balanceTokens, setBalanceTokens] = useState(0);
  const [percentageStaked, setPercentageStaked] = useState(0);

  const [stakedAssets, setStakedAssets] = useState([]);
  const [stakedAssetsV1, setStakedAssetsV1] = useState([]);
  const [stakedAssetsV2, setStakedAssetsV2] = useState([]);
  const [stakes, setStakes] = useState([]);
  const [collection, setCollection] = useState({});
  const [staking, setStaking] = useState(false);
  const [tab, setTab] = useState('unstaked');

  let fetchedAssets = [];
  let fetchedAssetsV1 = [];
  let fetchedAssetsV2 = [];

  const getStakedAssets = async (tokenIds, offset, limit) => {
    if (tokenIds.length > 0) {
      let ids = [];
      let tokenString = '';
      if (tokenIds.length <= limit) {
        ids = tokenIds;
      } else if (tokenIds.length > offset + limit) {
        ids = tokenIds.slice(offset, offset + limit);
      } else {
        ids = tokenIds.slice(offset);
      }
      _.map(ids, (id) => {
        tokenString += `&token_ids=${id}`;
      });
      const response = await fetch(
        `${OS_API_ENDPOINT}/assets?order_direction=asc&asset_contract_address=${SAMOT_DROP.contract}${tokenString}`
      );
      const data = await response.json();
      if (data && data.assets && data.assets.length > 0) {
        _.map(data.assets, (asset) => {
          fetchedAssets.push({
            ...asset,
            // eslint-disable-next-line camelcase
            token_id: parseInt(asset.token_id)
          });
        });
        if (offset + limit < tokenIds.length) {
          await sleep(500);
          await getStakedAssets(tokenIds, offset + limit, limit);
        }
      }
    }
    return fetchedAssets;
  };

  const getStakedAssetsV1 = async (tokenIds, offset, limit) => {
    if (tokenIds.length > 0) {
      let ids = [];
      let tokenString = '';
      if (tokenIds.length <= limit) {
        ids = tokenIds;
      } else if (tokenIds.length > offset + limit) {
        ids = tokenIds.slice(offset, offset + limit);
      } else {
        ids = tokenIds.slice(offset);
      }
      _.map(ids, (id) => {
        tokenString += `&token_ids=${id}`;
      });
      const response = await fetch(
        `${OS_API_ENDPOINT}/assets?order_direction=asc&asset_contract_address=${SAMOT_DROP.contract}${tokenString}`
      );
      const data = await response.json();
      if (data && data.assets && data.assets.length > 0) {
        _.map(data.assets, (asset) => {
          fetchedAssetsV1.push({
            ...asset,
            // eslint-disable-next-line camelcase
            token_id: parseInt(asset.token_id)
          });
        });
        if (offset + limit < tokenIds.length) {
          await sleep(500);
          await getStakedAssetsV1(tokenIds, offset + limit, limit);
        }
      }
    }
    return fetchedAssetsV1;
  };

  const getStakedAssetsV2 = async (tokenIds, offset, limit) => {
    if (tokenIds.length > 0) {
      let ids = [];
      let tokenString = '';
      if (tokenIds.length <= limit) {
        ids = tokenIds;
      } else if (tokenIds.length > offset + limit) {
        ids = tokenIds.slice(offset, offset + limit);
      } else {
        ids = tokenIds.slice(offset);
      }
      _.map(ids, (id) => {
        tokenString += `&token_ids=${id}`;
      });
      const response = await fetch(
        `${OS_API_ENDPOINT}/assets?order_direction=asc&asset_contract_address=${SAMOT_DROP.contract}${tokenString}`
      );
      const data = await response.json();
      if (data && data.assets && data.assets.length > 0) {
        _.map(data.assets, (asset) => {
          fetchedAssetsV2.push({
            ...asset,
            // eslint-disable-next-line camelcase
            token_id: parseInt(asset.token_id)
          });
        });
        if (offset + limit < tokenIds.length) {
          await sleep(500);
          await getStakedAssetsV2(tokenIds, offset + limit, limit);
        }
      }
    }
    return fetchedAssetsV2;
  };

  const stakedIdsV1 = await stakeOf(wallet?.account);
  //   const stakedIdsV2 = await depositsOf(wallet.account);
  //   const stakedData = await getStakedAssets(stakedIdsV1.concat(stakedIdsV2), 0, 20);
  //   setStakedAssets(stakedData);

  //   const stakedDataV1 = await getStakedAssetsV1(stakedIdsV1, 0, 20);
  //   const stakedDataV2 = await getStakedAssetsV2(stakedIdsV2, 0, 20);
  //   setStakedAssetsV1(stakedDataV1);
  //   setStakedAssetsV2(stakedDataV2);

  fetchedAssets = [];
  fetchedAssetsV1 = [];
  fetchedAssetsV2 = [];

  const getUnstakedAssets = async (owner) => {
    const fetchAssets = async (offset, limit) => {
      const response = await fetch(
        `${OS_API_ENDPOINT}/assets?order_direction=asc&offset=${offset}&limit=${limit}&owner=${owner}&asset_contract_address=${SAMOT_DROP.contract}`
      );
      const data = await response.json();
      if (data && data.assets && data.assets.length > 0) {
        for (const asset of data.assets) {
          fetchedAssets.push({
            ...asset,
            // eslint-disable-next-line camelcase
            token_id: parseInt(asset.token_id)
          });
        }
        if (data.assets.length === limit) {
          await sleep(500);
          await fetchAssets(offset + limit, limit);
        }
      }
    };
    await fetchAssets(0, 50);
    return fetchedAssets;
  };

  const updateCollection = (drop) => {
    setStaking(false);
    setStakes([]);
    setCollection(drop);
    if (drop && drop.name === 'SAMOT') {
      setTab('unstaked');
    } else {
      setTab('assets');
    }
  };

  //   updateCollection(SAMOT_DROP);
  const unstakedData = await getUnstakedAssets(wallet.account, SAMOT_DROP.contract);
  const assets = [];
  for (const asset of unstakedData) {
    // eslint-disable-next-line camelcase
    if (!_.find(stakedData, { token_id: asset.token_id })) {
      assets.push(asset);
    }
  }
  //   setUnstakedAssets(assets);
  //   calculateRewards(wallet.account).then(setStakingRewards);
  //   balanceOf(wallet.account).then(setBalanceTokens);
  //   calculateTotalStakes().then(setPercentageStaked);

  return {
    unstakedAssets,
    stakingRewards,
    balanceTokens,
    percentageStaked,
    stakedAssets,
    stakedAssetsV1,
    stakedAssetsV2,
    stakes,
    collection,
    staking,
    tab
  };
};
