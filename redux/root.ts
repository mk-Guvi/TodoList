import { combineReducers } from 'redux';

import { ROOT_ACTIONS } from './action-types';
import { rootContainerReducer, RootReducerT } from './reducers/roots';

export interface rootReducersI {
  root: RootReducerT;
}

export const reducers = {
  root: rootContainerReducer,
};

export const CombinedReducers = combineReducers(reducers);
export type RootReducerType = typeof CombinedReducers;
export const rootReducer: RootReducerType = (state, action) => {
  const newState = action.type === ROOT_ACTIONS.RESET ? undefined : state;
  return CombinedReducers(newState, action);
};
