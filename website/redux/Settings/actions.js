import { createTypes, completeTypes } from 'redux-recompose';

import * as CollectionService from '../../services/CollectionService';
import { mapCollectionFromService } from '../../utils/collections';

import { TARGETS } from './constants';

export const actions = createTypes(completeTypes(['SET_WALLET', 'GET_COLLECTION']), '@@SETTINGS');

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
    service: CollectionService.getCollection,
    successSelector: ({ data }) => mapCollectionFromService(data.collection)
  })
};

export default actionCreators;
