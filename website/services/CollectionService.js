import api from '../config/api';
import { getQueryString } from '../utils/routes';

export const getCollection = (collectionSlug) => api.get(`/collections/${collectionSlug}`);

export const getAssets = (payload) => api.get(`/chain/ethereum/account/${payload.address}${getQueryString(payload)}`);
