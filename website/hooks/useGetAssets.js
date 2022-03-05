import { useEffect, useMemo, useState } from 'react';

import { getAssets } from '../services/CollectionService';
import { mapAssetsFromService } from '../utils/assets';

export const useGetAssets = (payload) => {
  const fullPayload = useMemo(
    () => ({
      limit: 50,
      offset: 0,
      ...payload
    }),
    [payload]
  );

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAssets(fullPayload)
      .then(({ data }) => {
        setAssets(mapAssetsFromService(data.assets));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [fullPayload]);

  return [assets, loading];
};

export default useGetAssets;
