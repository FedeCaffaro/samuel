import { createTypes, completeTypes } from 'redux-recompose';

import * as SettingsService from '../../services/CollectionService';

import { TARGETS } from './constants';

export const actions = createTypes(completeTypes(['GET_SETTINGS', 'SET_WALLET']), '@@SETTINGS');

export const actionCreators = {
  getSettings: () => ({
    type: actions.GET_SETTINGS,
    target: TARGETS.SETTINGS,
    service: SettingsService.getSamotCollection
  }),
  setWallet: (wallet) => ({
    type: actions.SET_WALLET,
    target: TARGETS.WALLET,
    payload: wallet
  })
};

export default actionCreators;
