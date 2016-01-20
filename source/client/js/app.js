import React from 'react';
import { Provider } from 'react-redux';
import routes from '../../universal/routes';
import store from '../../universal/store';

export default (
  <Provider store={store}>
    {routes}
  </Provider>
);
