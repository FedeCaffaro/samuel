import api from '../config/api';

export const getCollection = (collectionSlug) => api.get(`/collection/${collectionSlug}`);
