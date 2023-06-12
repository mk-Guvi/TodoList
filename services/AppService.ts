import { configureStore, RootActions } from '../redux';

const store = configureStore();
const dispatch = store.dispatch;

class AppService {
  store = store;
  dispatch = dispatch;

  /** Used to clear local data for example on sign out or session expired */
  async clear() {
    dispatch(RootActions.reset());
  }

  async storeCredentials() {}

  async initialize() {}
}

export const appService = new AppService();
