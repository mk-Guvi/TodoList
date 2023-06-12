import { cloneDeep } from 'lodash';
import { ROOT_ACTIONS } from '../action-types';

export type RootI = {};

export type RootReducerT = {
  root: RootI;
};

const rootReducerContainer: RootReducerT = {
  root: {},
};

export const rootContainerReducer = (
  state: RootReducerT = rootReducerContainer,
  action: { payload: Partial<RootReducerT>; type: string },
) => {
  switch (action.type) {
    case ROOT_ACTIONS.RESET:
      return {};
    default:
      return cloneDeep(state);
  }
};
