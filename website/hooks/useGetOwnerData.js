import { useEffect, useMemo, useState } from 'react';

import { getAssets } from '../services/CollectionService';
import { mapAssetsToOwnerData } from '../utils/assets';

export const useGetOwnerData = (payload) => {
  const fullPayload = useMemo(
    () => ({
      limit: 50,
      offset: 0,
      ...payload
    }),
    [payload]
  );

  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAssets(fullPayload)
      .then(({ data }) => {
        setOwnerData(mapAssetsToOwnerData(data.assets));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [fullPayload]);

  return [ownerData, loading];
};

export default useGetOwnerData;
