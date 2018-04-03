/* @flow */

import { BaseRouteComponent, TabContainer } from 'awry-utilities';

import HomePage from './containers/HomePage';
import StashesPage from './containers/StashesPage';
import BaseStashPage from './containers/BaseStashPage';
import StashPage from './containers/StashPage';
import SheetsPage from './containers/SheetsPage';
import SheetPage from './containers/SheetPage';
import BaseStashUsersPage from './containers/BaseStashUsersPage';
import StashUsersPage from './containers/StashUsersPage';
import StashRequestingsPage from './containers/StashRequestingsPage';
import SearchPage from './containers/SearchPage';
import AccountPage from './containers/AccountPage';
import NotFoundPage from './containers/NotFoundPage';

const notFoundRoute = {
  path: '*',
  component: NotFoundPage,
  routeProps: {
    breadcrumbName: 'Page Not Found',
  },
};

const stashesRoutes = [{
  path: '',
  exact: true,
  component: StashesPage, // Add your route here
}, {
  path: ':stashId',
  routeProps: {
    breadcrumbName: '%{stashName}',
  },
  component: BaseStashPage,
  routes: [{
    path: '',
    exact: true,
    component: StashPage,
  }, {
    path: 'sheets',
    routeProps: {
      breadcrumbName: 'Sheets',
    },
    component: SheetsPage,
    routes: [{
      path: ':sheetId',
      exact: true,
      component: SheetPage,
    }, notFoundRoute],
  }, {
    path: 'users',
    routeProps: {
      breadcrumbName: 'Members',
    },
    component: BaseStashUsersPage,
    routes: [{
      path: '',
      exact: true,
      routeProps: {
        tabKey: 'members',
      },
      component: StashUsersPage,
    }, {
      path: 'requesting',
      exact: true,
      routeProps: {
        tabKey: 'requesting',
      },
      component: StashRequestingsPage,
    }, notFoundRoute],
  }, notFoundRoute],
}, notFoundRoute];

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
      path: 'stashes',
      routeProps: {
        urlPrefix: '',
        scope: 'public',
      },
      component: BaseRouteComponent,
      routes: stashesRoutes,
    }, {
      path: 'me',
      routeProps: {
        requireUser: true,
      },
      component: BaseRouteComponent,
      routes: [{
        path: '',
        exact: true,
        routeProps: {
          breadcrumbName: 'Account',
        },
        component: AccountPage,
      }, {
        path: 'stashes',
        exact: true,
        routeProps: {
          urlPrefix: '',
          scope: 'mine',
          breadcrumbName: 'My Stashes',
          tabKey: 'my_stashes',
        },
        component: StashesPage,
      }, notFoundRoute],
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
      }, notFoundRoute],
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