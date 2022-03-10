/* eslint-disable camelcase */
import { useEffect, useState } from 'react';

import { SAMOT_DROPS } from '../constants/drops';
import { getAssets } from '../services/CollectionService';
import { mapAssetsToOwnerData } from '../utils/assets';

export const useGetOwnerData = (account) => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => () => {
    setLoading(true);
    if (account) {
      getAssets({
        limit: 50,
        // offset: 0,
        asset_contract_address: SAMOT_DROPS.contract,
        owner: account
      })
        .then(({ data }) => {
          setOwnerData(mapAssetsToOwnerData(data.assets));
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  useEffect(refresh(), [account]);

  return [ownerData, loading, refresh];
};
