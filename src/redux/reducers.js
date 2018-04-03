/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { BreadcrumbsReducer, LightboxReducer, SSRReducer, HelmetReducer } from 'awry-utilities';

import AuthReducer from '../reducers/auth';
import SheetsReducer from '../reducers/sheet';

export default combineReducers({
  loadingBar: loadingBarReducer,
  AuthReducer,
  BreadcrumbsReducer,
  LightboxReducer,
  SSRReducer,
  router,
  HelmetReducer,
  SheetsReducer,
});
