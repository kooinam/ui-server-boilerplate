/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Row, Col, Layout, Popover, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';

import styles from './Navigator.scss';
import AuthNavigator from './AuthNavigator';

type Props = any;

class Navigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverVisible: false,
    };
  }

  props: Props;

  render() {
    const menu = (
      <Menu
        className={styles.Menu}
        mode="inline"
        selectedKeys={[]}
        onSelect={
          () => {
            this.setState({
              popoverVisible: false,
            });
          }
        }
      >
        <AuthNavigator
          inline
          onSelect={
            () => {
              this.setState({
                popoverVisible: false,
              });
            }
          }
          className={styles.NavItem}
        />
      </Menu>
    );

    return (
      <Layout.Header className={styles.Component}>
        <Row>
          <Col md={3} xs={4}>
            <a href="/">
              <img className={styles.Logo} src={require('../assets/logo.png')} alt="Logo" />
            </a>
          </Col>
          <Col md={15} xs={0} />
          <Col md={6} xs={0} className="pull-right">
            <ul className={styles.Actions}>
              <li className={styles.ActionItem}>
                <AuthNavigator
                  className={styles.AuthItem}
                />
              </li>
            </ul>
          </Col>
          <Col md={0} xs={4} className={styles.Popover}>
            <Popover
              placement="bottom"
              trigger="click"
              content={menu}
              overlayClassName={styles.PopoverMenu}
              visible={this.state.popoverVisible}
              onVisibleChange={
                (popoverVisible) => {
                  this.setState({
                    popoverVisible,
                  });
                }
              }
            >
              <Icon
                type="bars"
              />
            </Popover>
          </Col>
        </Row>
      </Layout.Header>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({
    currentUser: reducer.AuthReducer.currentUser,
  }),
);
/* eslint-enable no-unused-vars */

export default connector(Navigator);
