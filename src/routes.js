/* @flow */

import { BaseRouteComponent, TabContainer } from 'awry-utilities';

import HomePage from './containers/HomePage';
import StashesPage from './containers/StashesPage';
import StashPage from './containers/StashPage';
import SheetsPage from './containers/SheetsPage';
import SearchPage from './containers/SearchPage';
import NotFoundPage from './containers/NotFoundPage';

export default [
  {
    path: '/',
    component: BaseRouteComponent,
    routeProps: {
      breadcrumbName: 'Home',
    },
    routes: [{
      path: '',
      exact: true,
      component: HomePage, // Add your route here
    }, {
      path: 'me/stashes',
      routeProps: {
        urlPrefix: '/me',
        breadcrumbName: 'My Stashes',
        requireUser: true,
      },
      component: BaseRouteComponent,
      routes: [{
        path: '',
        exact: true,
        component: StashesPage, // Add your route here
      }, {
        path: ':stashId',
        routeProps: {
          breadcrumbName: '%{stashName}',
        },
        component: BaseRouteComponent,
        routes: [{
          path: '',
          exact: true,
          component: StashPage,
        }, {
          path: 'sheets',
          routeProps: {
            breadcrumbName: 'Sheets',
          },
          component: BaseRouteComponent,
          routes: [{
            path: '',
            exact: true,
            component: SheetsPage,
          }],
        }],
      }],
    }, {
      path: 'search/:term',
      routeProps: {
        breadcrumbName: 'Search %{term}',
      },
      component: BaseRouteComponent,
      routes: [{
        path: '',
        exact: true,
        component: SearchPage,
      }]
    }, {
      path: '*',
      component: NotFoundPage,
      routeProps: {
        breadcrumbName: 'Page Not Found',
      },
    }],
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