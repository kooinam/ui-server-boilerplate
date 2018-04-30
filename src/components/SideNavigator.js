/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

import styles from './SideNavigator.scss';

type Props = {
  matchedRoutes: []
};

class SideNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = { };
  }

  props: Props;

  render() {
    const { matchedRoutes } = this.props;

    const selectedSiderKeys = [];
    const selectedRoute = matchedRoutes.find(route =>
      route.routeProps && route.routeProps.siderKey,
    );
    if (selectedRoute) {
      selectedSiderKeys.push(selectedRoute.routeProps.siderKey);
    }

    const defaultOpenKeys = [];
    const defaultOpenRoute = matchedRoutes.find(route =>
      route.routeProps && route.routeProps.openKey,
    );
    if (defaultOpenRoute) {
      defaultOpenKeys.push(defaultOpenRoute.routeProps.openKey);
    }

    return (
      <Menu
        mode="inline"
        className={styles.Component}
        selectedKeys={selectedSiderKeys}
        defaultOpenKeys={defaultOpenKeys}
      >
        <Menu.Item
          key="dashboard"
        >
          <Link to="/">
            <Icon type="laptop" />
            <span>
              Dashboard
            </span>
          </Link>
        </Menu.Item>
        <Menu.SubMenu key="users" title={<span><Icon type="team" /><span>Users</span></span>}>
          <Menu.Item
            key="users"
          >
            <Link to="/users">
              Users
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key="round_transactions"
        >
          <Link to="/round_transactions">
            <Icon type="play-circle" />
            <span>
              Round Transactions
            </span>
          </Link>
        </Menu.Item>
        <Menu.SubMenu key="insights" title={<span><Icon type="hdd" /><span>Insights</span></span>}>
          <Menu.Item
            key="sessions"
          >
            <Link to="/sessions">
              Sessions
            </Link>
          </Menu.Item>
          <Menu.Item
            key="activities"
          >
            <Link to="/activities">
              Activities
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector = connect(
  (reducer: Reducer) => ({ }),
);
/* eslint-enable no-unused-vars */

export default connector(SideNavigator);
