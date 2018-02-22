/* @flow */

import { BaseRouteComponent, TabContainer } from 'awry-utilities';

import HomePage from './containers/NotFoundPage';
import LogsPage from './containers/LogsPage';
import NotFoundPage from './containers/NotFoundPage';

export default [
  {
    path: '/',
    component: BaseRouteComponent,
    routes: [{
      path: '',
      exact: true,
      routeProps: {
        breadcrumbName: 'Dashboard',
        siderKey: 'dashboard',
      },
      component: HomePage, // Add your route here
    }, {
      path: 'logs',
      exact: true,
      routeProps: {
        breadcrumbName: 'Logs',
        openKey: 'logs',
        siderKey: 'logs'
      },
      component: LogsPage,
    }, {
      path: '*',
      component: NotFoundPage,
    }],
  },
];
