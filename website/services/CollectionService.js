import api from '../config/api';

export const getCollection = (collectionSlug) => api.get(`/collection/${collectionSlug}`);

export const getAssets = (payload) => api.get(`/assets?${new URLSearchParams(payload).toString()}`);
