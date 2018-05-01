/* @flow */
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
import platform from 'platform';
import locale from 'browser-locale';
import qs from 'qs';
import _ from 'lodash';

import '../theme/normalize.css';
import '../theme/shared.scss';
import config from '../config';
import styles from './AppPage.scss';
import { authenticated } from '../actions/auth';
import Navigator from '../components/Navigator';
import SideNavigator from '../components/SideNavigator';
import User from '../models/User';
import Activity from '../models/Activity';
import SignInForm from '../components/SignInForm';

class AppPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('track'),
        method: 'post',
        itemName: 'activity',
        ItemKlass: User,
      }),
    };
  }

  componentWillMount() {
    setupAxios(this);

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
        instance.params = this.massageParams(instance.params);
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
        instance.params = this.massageParams(instance.params);
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
        instance.params = this.massageParams(instance.params);
        instance.paramsSerializer = (params) => {
          return qs.stringify(params, {
            arrayFormat: 'brackets',
            plainObjects: true,
          });
        };
      },
    });

    addAxiosPreferences('thronetec-admin', {
      baseURL: `${apiServerURL}/admin/thronetec`,
      headersSetter: () => {
        const token = User.getToken();

        return {
          'X-Authentication-Token': token,
        };
      },
      requestInterceptors: (instance) => {
        instance.params = this.massageParams(instance.params);
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
      // window.scrollTo(0, 0);
      this.trackPage(location, action)
    });

    const { location } = this.props.router;
    this.trackPage(location, 'push');
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

  massageParams = (params) => {
    params = params || {};
    params.session = {
      locale: locale(),
      description: platform.description,
      browser: platform.name,
      os_architecture: platform.os.architecture,
      os_family: platform.os.family,
      os_version: platform.os.version,
      ua: platform.ua,
    };

    return params;
  }

  trackPage = (location, action) => {
    const token = User.getToken();

    const { actioner } = this.state;

    const params = {
      page: location.pathname,
    };

    actioner.do('/activities/track_page.json', params);
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
      appConfig.titleTemplate = 'AUTUMN';
    }

    const requireUser = matchRouteProperty(matchedRoutes, 'requireUser');
    if (typeof (window) !== 'undefined') {
      // Redirect if page requires user login
      if (requireUser && authState === 'UNAUTHENTICATED') {
        return (
          <Redirect
            push
            to={{
              pathname: '/',
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
        content = (
          <Layout>
            <Layout>
              <Layout.Sider
                className={styles.Sider}
                collapsible
                trigger={null}
                collapsed={this.state.collapsed}
              >
                <SideNavigator matchedRoutes={matchedRoutes} />
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
          </Layout>
        );
      } else {
        content = (
          <Layout.Content className={styles.Content}>
            <SignInForm className={styles.SignInForm} />
          </Layout.Content>
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