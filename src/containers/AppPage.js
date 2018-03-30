/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { LocaleProvider, Layout, Card, message } from 'antd';
import type { Connector } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { setupAxios, addAxiosPreferences, BreadcrumbsNavigator, matchRoutes, matchBreadcrumbs, BaseRouteComponent, LightboxContainer, matchRouteProperty } from 'awry-utilities';
import enUS from 'antd/lib/locale-provider/en_US';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { Redirect } from 'react-router-dom';

import '../theme/normalize.css';
import '../theme/shared.scss';
import config from '../config';
import styles from './AppPage.scss';
import { authenticated } from '../actions/auth';
import Navigator from '../components/Navigator';
import SideNavigator from '../components/SideNavigator';
import User from '../models/User';

type Props = any;

class AppPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount = () => {
    setupAxios(this);

    /* eslint-disable no-undef */
    const apiServerURL = __API_SERVER_URL__;
    /* eslint-enable no-undef */

    addAxiosPreferences('toro-client', {
      baseURL: `${apiServerURL}`,
      headersSetter: () => {
        const token = User.getToken();

        return {
          'X-Authentication-Token': token,
        };
      },
    });

    message.config({
      top: 48,
    });
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.router.location !== prevProps.router.location && this.props.router.location && this.props.router.location.redirectMessage) {
      setTimeout(() => {
        message.warning(this.props.router.location.redirectMessage);
      }, 100);
    }
  }

  props: Props;

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
    let matchedRoutes = [];
    if (this.props.router.location) {
      matchedRoutes = matchRoutes(this.props.routes, this.props.router.location.pathname);
    }
    const matchedBreadcrumbs = matchBreadcrumbs(matchedRoutes, this.props.breadcrumbIdentifiers);

    const appConfig = config.app;
    if (matchedBreadcrumbs.length > 0) {
      appConfig.title = matchedBreadcrumbs[matchedBreadcrumbs.length - 1].breadcrumbName;
    }
    appConfig.title = appConfig.title || '';

    const requireUser = matchRouteProperty(matchedRoutes, 'requireUser');
    if (typeof (window) !== 'undefined') {
      // Redirect if page requires user login
      if (requireUser && this.props.authState === 'UNAUTHENTICATED') {
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

    const content = (
      <Layout>
        <Layout>
          <Layout.Content className={styles.Content}>
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
const connector: Connector<{}, Props> = connect(
  ({ AuthReducer, router, BreadcrumbsReducer }: Reducer) => ({
    currentUser: AuthReducer.currentUser,
    authState: AuthReducer.state,
    router,
    breadcrumbIdentifiers: BreadcrumbsReducer.breadcrumbIdentifiers,
  }),
);
/* eslint-enable no-unused-vars */

export default connector(AppPage);
