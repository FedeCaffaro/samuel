import api from '../config/api';
import { getQueryString } from '../utils/routes';

export const getCollection = (collectionSlug) => api.get(`/collection/${collectionSlug}`);

export const getAssets = (payload) => api.get(`/assets${getQueryString(payload)}`);
