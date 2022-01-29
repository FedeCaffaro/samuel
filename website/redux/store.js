import { applyMiddleware, combineReducers as CR, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { fetchMiddleware, configureMergeState, wrapCombineReducers } from 'redux-recompose';

import settings from './Settings/reducer';

configureMergeState((state, diff) => ({ ...state, ...diff }));

const combineReducers = wrapCombineReducers(CR);

// Add reducers here
const reducers = combineReducers({
  settings
});

const middlewares = [thunk, fetchMiddleware];
const enhancers = [];

/* ------------- Assemble Middleware ------------- */
enhancers.push(applyMiddleware(...middlewares));

const composeEnhancers =
  // eslint-disable-next-line no-empty-function
  process.env.NODE_ENV === 'development' ? compose : () => {};

const rootReducer = (state, action) => reducers(state, action);

const store = createStore(rootReducer, composeEnhancers(...enhancers));

export default store;
