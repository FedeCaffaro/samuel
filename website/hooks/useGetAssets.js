import { useEffect, useMemo, useState } from "react";

import { getAssets } from "../services/CollectionService";
import { mapAssetsFromService } from "../utils/assets";

export const useGetAssets = (payload) => {
  const fullPayload = useMemo(
    () => ({
      // limit: 50,
      // offset: 0,
      ...payload,
    }),
    [payload]
  );

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getAssets(fullPayload) {
    const { token_ids, owner } = fullPayload;
    let assets = [];
    if (token_ids) {
      const promises = token_ids.map(async (token_id) => {
        const response = await fetch(
          `https://api.opensea.io/api/v2/chain/ethereum/contract/0x49fDbfa1126638CE7eF2CA1A0f7759109f12595d/nfts/${token_id}`,
          {
            headers: {
              "x-api-key": "d37e7ee828334d34b23637281bc075e4", // replace with your actual API key
            },
          }
        );
        const data = await response.json();
        return data.nft; // extract the 'nft' property
      });

      assets = await Promise.all(promises);
    }
    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/account/${owner}/nfts?collection=samot-club`,
      {
        headers: {
          "x-api-key": "d37e7ee828334d34b23637281bc075e4",
        },
      }
    );
    const data = await response.json();
    assets = assets.concat(data.nfts); // append the data to the 'assets' array
    console.log(assets, "assets");
    return assets;
  }

  useEffect(() => {
    setLoading(true);
    if (!!fullPayload.owner || !!fullPayload.token_ids) {
      getAssets(fullPayload)
        .then((data) => {
          setAssets(data);
          setLoading(false);
        })
        .catch(() => {
          setAssets([]);
          setLoading(false);
        });
    }
  }, [fullPayload]);
  return [assets, loading];
};

export default useGetAssets;
