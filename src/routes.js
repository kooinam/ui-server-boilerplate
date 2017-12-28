/* @flow */

import { BaseRouteComponent, TabContainer } from 'awry-utilities';

import HomePage from './containers/NotFoundPage';
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
      path: '*',
      component: NotFoundPage,
    }],
  },
];
