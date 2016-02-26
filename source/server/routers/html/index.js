import React, { PropTypes, Component } from 'react';
import { renderToString } from 'react/dist/react.min';
import { Provider, connect } from 'react-redux';
import { path, fromPairs } from 'ramda';
import { noop } from 'lodash/fp';
import routes from '../../../universal/routes';
import createStore from '../../../universal/store/createStore';
import { creators } from '../../../universal/actions';
import routilityRouterFactory from './routilityRouterFactory';
import Login from '../../../universal/components/Login';

class Path extends Component {
  render() {
    return (
      path(this.props.path, this.props.routes) ? React.createElement(this.props.component) : null
    );
  }
}

class Router extends Component {
  render() {
    return (
      <Path path={['root', 'login']} component={Login} routes={this.props} />
    );
  }
}

const ConnectedRouter = connect(({ routes }) => routes)(Router);

const actionCreatorContextMap = {
  ...(fromPairs(Object.keys(creators).map((key) => [key, PropTypes.func.isRequired]))),
  syncRepos: PropTypes.func.isRequired,
};

class App extends Component {
  static childContextTypes = actionCreatorContextMap;
  getChildContext() {
    return fromPairs(Object.keys(actionCreatorContextMap).map((key) => [key, noop]));
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter/>
      </Provider>
    );
  }
}

export default routilityRouterFactory(routes, function *(next, routes) {

  const state = yield {
    routes,
  };

  yield this.render('index', {
    content: renderToString(<App store={createStore(state)} />),
    data: state,
  });
});
