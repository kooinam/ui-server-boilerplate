/* @flow */

import { BaseRouteComponent, TabContainer } from 'awry-utilities-2';

import NotFoundPage from './containers/NotFoundPage';
import HomePage from './admin_containers/HomePage';
import UsersPage from './admin_containers/UsersPage';
import UserPage from './admin_containers/UserPage';
import SessionsPage from './admin_containers/SessionsPage';
import SessionPage from './admin_containers/SessionPage';
import ActivitiesPage from './admin_containers/ActivitiesPage';
import ActivityPage from './admin_containers/ActivityPage';
import SettingsPage from './admin_containers/SettingsPage';

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

const sessionsRoute = {
  path: 'sessions',
  component: BaseRouteComponent,
  routeProps: {
    breadcrumbName: 'Sessions',
    siderKey: 'sessions',
    openKey: 'insights',
  },
  routes: [{
    path: '',
    exact: true,
    component: SessionsPage,
  }, {
    path: ':sessionId',
    component: SessionPage,
    routeProps: {
      breadcrumbName: '%{sessionId}',
    },
    routes: [{
      path: '',
      exact: true,
      routeProps: {
        tabKey: '',
      },
      component: TabContainer,
    }, {
      path: 'activities',
      exact: true,
      routeProps: {
        tabKey: 'activities',
      },
      component: TabContainer,
    }, notFoundRoute],
  }, notFoundRoute],
};

const activitiesRoutes = {
  path: 'activities',
  component: BaseRouteComponent,
  routeProps: {
    breadcrumbName: 'Activities',
    siderKey: 'activities',
    openKey: 'insights',
  },
  routes: [{
    path: '',
    exact: true,
    component: ActivitiesPage,
  }, {
    path: ':activityId',
    component: ActivityPage,
    routeProps: {
      breadcrumbName: '%{activityId}',
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

const settingsRoutes = {
  path: 'settings',
  routeProps: {
    breadcrumbName: 'Settings',
    siderKey: 'settings',
    openKey: 'settings',
  },
  component: SettingsPage,
  routes: [{
    path: '',
    exact: true,
    component: TabContainer,
    routeProps: {
      tabKey: '',
    },
  }, notFoundRoute],
};

export default [
  {
    path: '/admin',
    component: BaseRouteComponent,
    routes: [{
      path: '',
      exact: true,
      routeProps: {
        breadcrumbName: 'Home',
        siderKey: 'dashboard',
      },
      component: HomePage,
    }, usersRoute, sessionsRoute, activitiesRoutes, settingsRoutes, notFoundRoute],
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