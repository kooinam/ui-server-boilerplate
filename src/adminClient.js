/* @flow */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

import configureStore from './redux/store';
import routes from './adminRoutes';
import AppPage from './admin_containers/AppPage';

// Get initial state from server-side rendering
const initialState = window.__INITIAL_STATE__;
const history = createHistory();
const store = configureStore(history, initialState);
const mountNode = document.getElementById('react-view');

const renderApp = () => {
  render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppPage routes={routes} history={history} />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    mountNode,
  );
};

// Enable hot reload by react-hot-loader
if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp();
    } catch (error) {
      const RedBox = require('redbox-react').default;

      render(<RedBox error={error} />, mountNode);
    }
  };

  module.hot.accept('./admin_containers/AppPage', () => {
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      unmountComponentAtNode(mountNode);
      reRenderApp();
    });
  });
}

renderApp();
