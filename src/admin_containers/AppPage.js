import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { LocaleProvider, Layout, Card, message, Button } from 'antd';
import LoadingBar from 'react-redux-loading-bar';
import { setupAxios, addAxiosPreferences, BreadcrumbsNavigator, matchRoutes, matchBreadcrumbs, BaseRouteComponent, LightboxContainer, matchRouteProperty, Actioner, getAxios } from 'awry-utilities-2';
import enUS from 'antd/lib/locale-provider/en_US';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { Redirect } from 'react-router-dom';
import qs from 'qs';
import _ from 'lodash';

import '../theme/normalize.css';
import '../theme/shared.scss';
import config from '../config';
import styles from './AppPage.scss';
import { authenticated } from '../actions/auth';
import Navigator from '../admin_components/Navigator';
import SideNavigator from '../admin_components/SideNavigator';
import User from '../models/User';
import SignInForm from '../components/SignInForm';
import { track } from '../actions/track';

class AppPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  componentWillMount() {
    setupAxios(this);

    const rootServerURL = __ROOT_SERVER_URL__;
    const apiServerURL = __API_SERVER_URL__;

    addAxiosPreferences('auth', {
      baseURL: `${apiServerURL}`,
      headersSetter: () => {
        const token = User.getToken();

        return {
          'X-Authentication-Token': token,
        };
      },
      requestInterceptors: (instance) => {
        instance.paramsSerializer = (params) => {
          return qs.stringify(params, {
            arrayFormat: 'brackets',
            plainObjects: true,
          });
        };
      },
    });

    addAxiosPreferences('admin', {
      baseURL: `${apiServerURL}/admin`,
      headersSetter: () => {
        const token = User.getToken();

        return {
          'X-Authentication-Token': token,
        };
      },
      requestInterceptors: (instance) => {
        instance.paramsSerializer = (params) => {
          return qs.stringify(params, {
            arrayFormat: 'brackets',
            plainObjects: true,
          });
        };
      },
    });

    addAxiosPreferences('track', {
      baseURL: `${apiServerURL}`,
      headersSetter: () => {
        const token = User.getToken();

        return {
          'X-Authentication-Token': token,
        };
      },
      requestInterceptors: (instance) => {
        instance.paramsSerializer = (params) => {
          return qs.stringify(params, {
            arrayFormat: 'brackets',
            plainObjects: true,
          });
        };
      },
    });

    message.config({
      top: 48,
    });
  }

  componentDidMount() {
    const { history, router } = this.props;

    history.listen((location, action) => {
      window.scrollTo(0, 0);
      this.trackPage(action, location)
    });

    const { location } = this.props.router;
    this.trackPage('push');
  }

  componentDidUpdate(prevProps) {
    const location = this.props.router.location;
    const prevLocation = prevProps.router.location;
    if (location !== prevLocation && location && location.redirectMessage) {
      setTimeout(() => {
        message.warning(this.props.router.location.redirectMessage);
      }, 100);
    }
  }

  props: any;

  trackPage = (action, location) => {
    const params = {
      page: (location) ? location.pathname : this.props.router.location.pathname,
    };

    this.props.dispatch(track(params));
  }

  showLoading = () => {
    this.props.dispatch(showLoading());
  }

  hideLoading = () => {
    this.props.dispatch(hideLoading());
  }

  unauthorized = () => {
    this.props.dispatch(authenticated(null));
  }

  render() {
    const { authState, currentUser } = this.props;

    let matchedRoutes = [];
    if (this.props.router.location) {
      matchedRoutes = matchRoutes(this.props.routes, this.props.router.location.pathname);
    }
    const matchedBreadcrumbs = matchBreadcrumbs(matchedRoutes, this.props.breadcrumbIdentifiers);

    const appConfig = _.assign({}, config.app);
    if (matchedBreadcrumbs.length > 0) {
      appConfig.title = matchedBreadcrumbs[matchedBreadcrumbs.length - 1].breadcrumbName;
    }

    if (!appConfig.title || appConfig.title.length <= 1) {
      appConfig.titleTemplate = 'Possum';
    }

    const requireUser = matchRouteProperty(matchedRoutes, 'requireUser');
    if (typeof (window) !== 'undefined') {
      // Redirect if page requires user login
      if (requireUser && authState === 'UNAUTHENTICATED') {
        return (
          <Redirect
            push
            to={{
              pathname: '/admin',
              redirectMessage: 'You need to be logged in to view that page.',
            }}
          />
        );
      }
    }

    const hideBreadcrumbs = matchRouteProperty(matchedRoutes, 'hideBreadcrumbs');

    let content = null;

    if (authState) {
      if (currentUser) {
        if (currentUser.isAdmin()) {
          content = (
            <Layout>
              <div id="sider-vertical-container" />
              <Layout.Sider
                className={`${styles.Sider} ${styles.LgSider}`}
                collapsible
                trigger={null}
                collapsed={this.state.collapsed}
              >
                <SideNavigator matchedRoutes={matchedRoutes} containerId="sider-vertical-container" />
              </Layout.Sider>
              <Layout.Sider
                className={`${styles.Sider} ${styles.SmSider}`}
                collapsible
                trigger={null}
                collapsed={!this.state.collapsed}
              >
                <SideNavigator matchedRoutes={matchedRoutes} containerId="sider-vertical-container" />
              </Layout.Sider>
              <Layout.Content className={styles.Content}>
                <Button
                  className={styles.Trigger}
                  icon={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={
                    () => {
                      this.setState({
                        collapsed: !this.state.collapsed,
                      });
                    }
                  }
                />
                {
                  !hideBreadcrumbs && (
                    <BreadcrumbsNavigator
                      matchedBreadcrumbs={matchedBreadcrumbs}
                      className={styles.Breadcrumbs}
                    />
                  )
                }
                <BaseRouteComponent {...this.props} matchedRoutes={matchedRoutes} />
              </Layout.Content>
            </Layout>
          );
        } else {
          content = (
            <Layout>
              <Layout.Content className={styles.Content}>
                <div className="ant-error help-text text-center">
                  You are not authorized
                </div>
              </Layout.Content>
            </Layout>
          );
        }
      } else {
        content = (
          <Layout>
            <Layout.Content className={styles.Content}>
              <SignInForm className={styles.SignInForm} />
            </Layout.Content>
          </Layout>
        );
      }
    }

    return (
      <LocaleProvider locale={enUS}>
        <Layout className={styles.Container}>
          <LoadingBar className={styles.LoadingBar} />
          <Helmet {...appConfig} />
          <Navigator />
          <LightboxContainer />
          {content}
        </Layout>
      </LocaleProvider>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector = connect(
  ({ AuthReducer, router, BreadcrumbsReducer }: Reducer) => ({
    currentUser: AuthReducer.currentUser,
    authState: AuthReducer.state,
    router,
    breadcrumbIdentifiers: BreadcrumbsReducer.breadcrumbIdentifiers,
  }),
);
/* eslint-enable no-unused-vars */

export default connector(AppPage);
export {
  __NOTIFICATION_SERVER_URL__,
}