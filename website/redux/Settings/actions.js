import { createTypes, completeTypes } from 'redux-recompose';

import * as CollectionService from '../../services/CollectionService';
import { mapAssetsFromService, mapAssetsToOwnerData } from '../../utils/assets';
import { mapCollectionFromService } from '../../utils/collections';

import { TARGETS } from './constants';

export const actions = createTypes(
  completeTypes(['SET_WALLET', 'GET_COLLECTION', 'GET_ASSETS', 'GET_OWNER_DATA']),
  '@@SETTINGS'
);

export const actionCreators = {
  setWallet: (wallet) => ({
    type: actions.SET_WALLET,
    target: TARGETS.WALLET,
    payload: wallet
  }),
  getCollection: (collectionSlug) => ({
    type: actions.GET_COLLECTION,
    target: TARGETS.CURRENT_COLLECTION,
    payload: collectionSlug,
    // service: CollectionService.getCollection,
    successSelector: ({ data }) => mapCollectionFromService(data.collection)
  }),
  getAssets: (payload) => ({
    type: actions.GET_ASSETS,
    target: TARGETS.CURRENT_ASSETS,
    payload,
    // service: CollectionService.getAssets,
    successSelector: ({ data }) => mapAssetsFromService(data.assets)
  }),
  getOwnerData: (payload) => ({
    type: actions.GET_OWNER_DATA,
    target: TARGETS.CURRENT_OWNER,
    payload: { limit: 50, offset: 0, ...payload },
    // service: CollectionService.getAssets,
    successSelector: ({ data }) => mapAssetsToOwnerData(data.assets)
  })
};

export default actionCreators;
