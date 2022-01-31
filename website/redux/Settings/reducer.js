import Immutable from 'seamless-immutable';
import { createReducer, completeState, completeReducer, onSuccess } from 'redux-recompose';

import { actions } from './actions';
import { TARGETS } from './constants';

const initialState = {
  [TARGETS.SETTINGS]: {},
  [TARGETS.WALLET]: null
};

const completedState = completeState(initialState);

const reducerDescription = {
  primaryActions: [actions.SET_WALLET, actions.GET_COLLECTION],
  override: {
    [actions.SET_WALLET]: (state, action) => ({ ...state, [action.target]: action.payload })
  }
};

const reducer = createReducer(new Immutable(completedState), completeReducer(reducerDescription));

export default reducer;
