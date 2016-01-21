import React from 'react';
import { Provider } from 'react-redux';
import routes from '../../universal/components/routes';
import createStoreWithInitState from '../../universal/store';

export default (
  <Provider store={createStoreWithInitState(window.__data__)}>
    {routes}
  </Provider>
);
