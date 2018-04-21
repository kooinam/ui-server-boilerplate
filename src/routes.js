/* @flow */

import { BaseRouteComponent, TabContainer } from 'awry-utilities-2';

import HomePage from './containers/HomePage';
import NotFoundPage from './containers/NotFoundPage';
import UsersPage from './containers/UsersPage';
import UserPage from './containers/UserPage';

const notFoundRoute = {
  path: '*',
  component: NotFoundPage,
  routeProps: {
    breadcrumbName: 'Page Not Found',
  },
};

const usersRoute = {
  path: 'users',
  component: BaseRouteComponent,
  routeProps: {
    breadcrumbName: 'Users',
    siderKey: 'users',
    openKey: 'users',
  },
  routes: [{
    path: '',
    exact: true,
    component: UsersPage,
  }, {
    path: ':userId',
    component: UserPage,
    routeProps: {
      breadcrumbName: '%{userEmail}',
    },
    routes: [{
      path: '',
      exact: true,
      routeProps: {
        tabKey: '',
      },
      component: TabContainer,
    }, notFoundRoute],
  }, notFoundRoute],
};

// const usersPage = {
//   path: 'users',
//   component: BaseRouteComponent,
//   routeProps: {
//     breadcrumbName: 'Users',
//     siderKey: 'users',
//     openKey: 'users',
//   },
// };

export default [
  {
    path: '/',
    component: BaseRouteComponent,
    routes: [{
      path: '',
      exact: true,
      routeProps: {
        breadcrumbName: 'Home',
        siderKey: 'dashboard',
      },
      component: HomePage, // Add your route here
    }, usersRoute, notFoundRoute],
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