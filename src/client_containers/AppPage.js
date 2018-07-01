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
import Navigator from '../client_components/Navigator';
import User from '../models/User';
import SignInForm from '../components/SignInForm';
import { track } from '../actions/track';
import { showSignUpModal } from '../actions/auth';

class AppPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    setupAxios(this);

    const rootServerUrl = __ROOT_SERVER_URL__;
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

    addAxiosPreferences('resources', {
      baseURL: `${rootServerUrl}`,
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

    addAxiosPreferences('resources-api', {
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

    addAxiosPreferences('client', {
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

  massageParams = (params) => {
    params = params || {};
    params.session = {
      locale: locale(),
    };

    return params;
  }

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

  renderBreadcrumbs = (matchedRoutes, matchedBreadcrumbs) => {
    const hideBreadcrumbs = matchRouteProperty(matchedRoutes, 'hideBreadcrumbs');

    let breadcrumbs = null;
    if (!hideBreadcrumbs) {
      breadcrumbs = (
        <BreadcrumbsNavigator
          matchedBreadcrumbs={matchedBreadcrumbs}
          className={styles.Breadcrumbs}
        />
      );
    }

    return breadcrumbs;
  }

  renderAuthenticatedContent = (matchedRoutes, matchedBreadcrumbs) => {
    const layout = matchRouteProperty(matchedRoutes, 'layout');

    let content = null;

    if (layout) {
      content = (
        <BaseRouteComponent
          {...this.props}
          matchedRoutes={matchedRoutes}
          renderBreadcrumbs={
            () => {
              return this.renderBreadcrumbs(matchedRoutes, matchedBreadcrumbs);
            }
          }
        />
      );
    } else {
      content = (
        <Layout>
          <Layout.Content className={styles.Content}>
            {this.renderBreadcrumbs(matchedRoutes, matchedBreadcrumbs)}
            <BaseRouteComponent
              {...this.props}
              matchedRoutes={matchedRoutes}
              renderBreadcrumbs={
                () => {
                  return this.renderBreadcrumbs(matchedRoutes, matchedBreadcrumbs);
                }
              }
           />
          </Layout.Content>
        </Layout>
      );
    }

    return content;
  }

  renderUnauthenticatedContent = (matchedRoutes) => {
    const content = (
      <Layout>
        <Layout.Content className={styles.Content}>
          <div className={styles.SignInForm}>
            <SignInForm />
            <div className={styles.SignUpLink}>
              DON'T HAVE AN ACCOUNT?
              <Button
                type="primary"
                className={`btn-secondary btn-block`}
                onClick={
                  () => {
                    this.props.dispatch(showSignUpModal());
                  }
                }
              >
                CREATE ACCOUNT
              </Button>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    );

    return content;
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
    const disableRedirect = matchRouteProperty(matchedRoutes, 'disableRedirect');
    if (typeof (window) !== 'undefined') {
      // Redirect if page requires user login
      if (requireUser && authState === 'UNAUTHENTICATED' && !disableRedirect) {
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

    let content = null;
    if (authState) {
      if (currentUser) {
        // unauthenticated
        content = this.renderAuthenticatedContent(matchedRoutes, matchedBreadcrumbs);
      } else {
        // authenticated
        content = this.renderUnauthenticatedContent(matchedRoutes);
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