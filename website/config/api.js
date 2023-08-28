import { create } from 'apisauce';
import { CamelcaseSerializer } from 'cerealizr';

import LocalStorage from '../services/LocalStorageService';

const NON_SERIALIZABLE_URLS = ['/files/signed_url'];
const camelSerializer = new CamelcaseSerializer();

const notSerializableUrl = (url) => NON_SERIALIZABLE_URLS.includes(url);

export const createApiWithURL = (baseURL) =>
  create({
    baseURL,
    timeout: 15000
  });

const api = create({
  baseURL: process.env.NEXT_PUBLIC_OPEN_SEA_API,
  headers: {
    'X-API-KEY': `${process.env.NEXT_PUBLIC_OPEN_SEA_KEY}`,
  },
  timeout: 15000
});

export const headers = {
  AUTHORIZATION: 'Authorization'
};

export const setAuthHeader = () => {
  api.setHeader(headers.AUTHORIZATION, `Bearer ${token}`);
};

export const removeAuthHeader = () => api.deleteHeader(headers.AUTHORIZATION);

api.addResponseTransform((response) => {
  if (response.data && !notSerializableUrl(response.config.url)) {
    response.data = camelSerializer.serialize(response.data);
  }
  if (response.status === 401 && !!LocalStorage.getTokenManager()) {
    LocalStorage.removeTokenManager();
    window.location.replace('/');
  }
});

export default api;
