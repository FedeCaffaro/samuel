import Immutable from 'seamless-immutable';
import { createReducer, completeState, completeReducer } from 'redux-recompose';

import { actions } from './actions';
import { TARGETS } from './constants';

const initialState = {
  [TARGETS.SETTINGS]: {},
};

const completedState = completeState(initialState);

const reducerDescription = {
  primaryActions: [actions.GET_SETTINGS],
};

const reducer = createReducer(new Immutable(completedState), completeReducer(reducerDescription));

export default reducer;
