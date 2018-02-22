/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

import styles from './SideNavigator.scss';

type Props = {
  matchedRoutes: []
};

class AdminSideNavigator extends Component {
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
          <Link to="/admin">
            <Icon type="laptop" />
            Dashboard
          </Link>
        </Menu.Item>
        <Menu.SubMenu key="orders" title={<span><Icon type="shopping-cart" />Orders</span>}>
          <Menu.Item
            key="orders"
          >
            <Link to="/orders">
              Orders
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="logs" title={<span><Icon type="hdd" />Logs</span>}>
          <Menu.Item
            key="logs"
          >
            <Link to="/logs">
              Logs
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({ }),
);
/* eslint-enable no-unused-vars */

export default connector(AdminSideNavigator);
