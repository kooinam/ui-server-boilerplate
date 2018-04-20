/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { LocaleProvider, Layout, Card, message, Button } from 'antd';
import LoadingBar from 'react-redux-loading-bar';
import { setupAxios, addAxiosPreferences, BreadcrumbsNavigator, matchRoutes, matchBreadcrumbs, BaseRouteComponent, LightboxContainer, matchRouteProperty } from 'awry-utilities-2';
import enUS from 'antd/lib/locale-provider/en_US';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
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
import SignInForm from '../components/SignInForm';

type Props = any;

class AppPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  componentWillMount = () => {
    setupAxios(this);

    /* eslint-disable no-undef */
    const apiServerURL = __API_SERVER_URL__;
    /* eslint-enable no-undef */

    addAxiosPreferences('auth', {
      baseURL: `${apiServerURL}`,
      headersSetter: () => {
        const token = User.getToken();

        return {
          'X-Authentication-Token': token,
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
    const { authState, currentUser } = this.props;

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
