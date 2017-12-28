/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { LocaleProvider, Layout, Card, message } from 'antd';
import type { Connector } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { setupAxios, addAxiosPreferences, BreadcrumbsNavigator, matchRoutes, matchBreadcrumbs, BaseRouteComponent, LightboxContainer } from 'awry-utilities';
import enUS from 'antd/lib/locale-provider/en_US';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import '../theme/normalize.css';
import '../theme/shared.scss';
import config from '../config';
import styles from './AppPage.scss';
import Navigator from '../components/Navigator';
import SideNavigator from '../components/SideNavigator';
import SignInForm from '../components/SignInForm';
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
    const possumInsightsApiServerUrl = __POSSUM_INSIGHTS_API_SERVER_URL__;
    /* eslint-enable no-undef */

    addAxiosPreferences('insights', {
      baseURL: `${possumInsightsApiServerUrl}`,
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
    appConfig.titleTemplate = 'POSSUM';
    if (matchedBreadcrumbs.length > 0) {
      appConfig.title = matchedBreadcrumbs[matchedBreadcrumbs.length - 1].breadcrumbName;
    }
    if (appConfig.title && appConfig.title.replace(/ /g, '').length > 0) {
      appConfig.titleTemplate = '%s - POSSUM';
    }
    appConfig.title = appConfig.title || '';

    let content = (
      <Layout.Content />
    );

    if (this.props.authState) {
      if (this.props.currentUser) {
        if (this.props.currentUser.isAdmin()) {
          content = (
            <Layout>
              <Layout.Sider className={styles.Sider}>
                <SideNavigator matchedRoutes={matchedRoutes} />
              </Layout.Sider>
              <Layout>
                <Layout.Content className={styles.Content}>
                  <BreadcrumbsNavigator
                    matchedBreadcrumbs={matchedBreadcrumbs}
                    className={styles.Breadcrumbs}
                  />
                  <BaseRouteComponent {...this.props} matchedRoutes={matchedRoutes} />
                </Layout.Content>
              </Layout>
            </Layout>
          );
        } else {
          content = (
            <Layout.Content className={styles.Content}>
              <Card>
                <div className="text-center ant-text-danger">
                  You are not authorized
                </div>
              </Card>
            </Layout.Content>
          );
        }
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
