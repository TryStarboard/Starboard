import React from 'react';
import { Provider } from 'react-redux';
import routes from '../../universal/routes';
import createStoreWithInitState from '../../universal/store';

export default (
  <Provider store={createStoreWithInitState(window.__data__)}>
    {routes}
  </Provider>
);
