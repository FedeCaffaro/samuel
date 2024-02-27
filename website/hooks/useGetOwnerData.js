/* eslint-disable camelcase */
import { useEffect, useState } from "react";

import { SAMOT_DROPS } from "../constants/drops";
import { getAssets } from "../services/CollectionService";
import { mapAssetsToOwnerData } from "../utils/assets";

export const useGetOwnerData = (account) => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getAssets({ owner }) {
    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/account/${owner}/nfts?collection=samot-club`,
      {
        headers: {
          "x-api-key": "d37e7ee828334d34b23637281bc075e4", // replace with your actual API key
        },
      }
    );
    const data = await response.json();
    return data.nfts;
  }

  const refresh = () => () => {
    setLoading(true);
    if (account) {
      getAssets({
        // limit: 50,
        // offset: 0,
        collection: "samot-club",
        owner: account,
      })
        .then(( data ) => {
          setOwnerData(mapAssetsToOwnerData(data));
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
