import { ROOT_ACTIONS } from '../action-types';

const reset = () => ({
  type: ROOT_ACTIONS.RESET,
  payload: {},
});

export const RootActions = {
  reset,
};
