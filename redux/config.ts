import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { rootReducer } from './root';

export const configureStore = () => {
  const middlewareEnhancer = applyMiddleware(thunk);
  const composedEnhancers = composeWithDevTools(middlewareEnhancer);
  return createStore(rootReducer, undefined, composedEnhancers);
};
