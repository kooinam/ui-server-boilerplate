/* @flow */

import { BaseRouteComponent, TabContainer } from 'awry-utilities-2';

import NotFoundPage from './containers/NotFoundPage';
import HomePage from './client_containers/HomePage';

const notFoundRoute = {
  path: '*',
  component: NotFoundPage,
  routeProps: {
    breadcrumbName: 'Page Not Found',
  },
};

export default [
  {
    path: '/',
    component: BaseRouteComponent,
    routeProps: {
      hideBreadcrumbs: true,
      requireUser: true,
    },
    routes: [{
      path: '',
      exact: true,
      routeProps: {
        breadcrumbName: 'Stores',
        disableRedirect: true,
      },
      component: HomePage,
    }, notFoundRoute],
  },
];

// loadData: (dispatch, params, query) => Promise.all([
//   new Promise((resolve, reject) => {
//     const tableParams = SearchProductsPage.tableParams(null, params, query);
//     tableParams.loadItems().then((items) => {
//       dispatch(setupSSRItems({
//         products: {
//           value: items,
//           pagination: tableParams.pagination,
//         },
//       }));
//       resolve();
//     }).catch((error) => {
//       reject(error);
//     });
//   }),
// ]),
