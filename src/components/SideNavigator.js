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
            <Link to="/admin/orders">
              Orders
            </Link>
          </Menu.Item>
          <Menu.Item
            key="warranties"
          >
            <Link to="/admin/warranties">
              Warranties
            </Link>
          </Menu.Item>
          <Menu.Item
            key="return_requests"
          >
            <Link to="/admin/return_requests">
              Return Requests
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="products" title={<span><Icon type="database" />Products</span>}>
          <Menu.Item key="products">
            <Link to="/admin/products">
              Products
            </Link>
          </Menu.Item>
          <Menu.Item key="taxonomies">
            <Link to="/admin/taxonomies">
              Taxonomies
            </Link>
          </Menu.Item>
          <Menu.Item key="option_types">
            <Link to="/admin/option_types">
              Option Types
            </Link>
          </Menu.Item>
          <Menu.Item key="properties">
            <Link to="/admin/properties">
              Properties
            </Link>
          </Menu.Item>
          <Menu.Item key="brands">
            <Link to="/admin/brands">
              Brands
            </Link>
          </Menu.Item>
          <Menu.Item key="warranty_types">
            <Link to="/admin/warranty_types">
              Warranty Types
            </Link>
          </Menu.Item>
          <Menu.Item key="product_display_lists">
            <Link to="/admin/display_lists">
              Display Lists
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="users" title={<span><Icon type="user" />Users</span>}>
          <Menu.Item
            key="users"
          >
            <Link to="/admin/users">
              Users
            </Link>
          </Menu.Item>
          <Menu.Item
            key="newsletters"
          >
            <Link to="/admin/newsletters">
              Newsletters
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key="promotions"
        >
          <Link to="/admin/promotions">
            <Icon type="gift" />
            Promotions
          </Link>
        </Menu.Item>
        <Menu.SubMenu key="settings" title={<span><Icon type="setting" />Settings</span>}>
          <Menu.Item key="settings">
            <Link to="/admin/settings">
              Site Settings
            </Link>
          </Menu.Item>
          <Menu.Item key="stock_locations">
            <Link to="/admin/stock_locations">
              Stock Locations
            </Link>
          </Menu.Item>
          <Menu.Item key="zones">
            <Link to="/admin/zones">
              Zones
            </Link>
          </Menu.Item>
          <Menu.Item key="shipping_methods">
            <Link to="/admin/shipping_methods">
              Shipping Methods
            </Link>
          </Menu.Item>
          <Menu.Item key="payment_methods">
            <Link to="/admin/payment_methods">
              Payment Methods
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="miscellaneous" title={<span><Icon type="ellipsis" />Miscellaneous</span>}>
          <Menu.Item key="sliders">
            <Link to="/admin/sliders">
              Sliders
            </Link>
          </Menu.Item>
          <Menu.Item key="blog_categories">
            <Link to="/admin/blog_categories">
              Blog Categories
            </Link>
          </Menu.Item>
          <Menu.Item key="blogs">
            <Link to="/admin/blogs">
              Blogs
            </Link>
          </Menu.Item>
          <Menu.Item key="static_pages">
            <Link to="/admin/static_pages">
              Static Pages
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
