/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { BreadcrumbsReducer, LightboxReducer, SSRReducer, HelmetReducer } from 'awry-utilities-2';

import AuthReducer from './auth';

export default combineReducers({
  loadingBar: loadingBarReducer,
  BreadcrumbsReducer,
  LightboxReducer,
  SSRReducer,
  router,
  HelmetReducer,
  AuthReducer,
});
