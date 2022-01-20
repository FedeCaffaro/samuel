import { createTypes, completeTypes } from 'redux-recompose';

import * as SettingsService from '../../services/CollectionService';

import { TARGETS } from './constants';

export const actions = createTypes(completeTypes(['GET_SETTINGS']), '@@APP_SETTINGS');

export const actionCreators = {
  getSettings: () => ({
    type: actions.GET_SETTINGS,
    target: TARGETS.SETTINGS,
    service: SettingsService.getSamotCollection,
  }),
};

export default actionCreators;
