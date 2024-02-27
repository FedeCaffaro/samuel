import api from "../config/api";
import { getQueryString } from "../utils/routes";

export const getCollection = (collectionSlug) =>
  api.get(`/collection/${collectionSlug}`);

export const getAssets = (payload) => {
  api.get(
    `/chain/ethereum/account/${payload.owner}/nfts?collection=samot-club`
  );
};
