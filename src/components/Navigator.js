/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Layout, Popover, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';

import styles from './Navigator.scss';
import AuthNavigator from './AuthNavigator';
import SearchNavigator from './SearchNavigator';
import NotificationsNavigator from './NotificationsNavigator';

class Navigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverVisible: false,
    };
  }

  render() {
    const { currentUser } = this.props;

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
        {
          currentUser && (
            <NotificationsNavigator
              inline
            />
          )
        }
        <AuthNavigator
          hideAccount
          inline
          onSelect={
            () => {
              this.setState({
                popoverVisible: false,
              });
            }
          }
          className="link"
          hideLogin
        />
      </Menu>
    );

    return (
      <Layout.Header className={styles.Component}>
        <Row>
          <Col md={4} xs={4}>
            <a href="/">
              <img className={styles.Logo} src={require('../assets/logo.png')} alt="Logo" />
            </a>
          </Col>
          <Col md={20} xs={0} className="pull-right">
            <ul className={styles.Actions}>
              {
                currentUser && (
                  <li className={styles.ActionItem}>
                    <NotificationsNavigator />
                  </li>
                )
              }
              <li className={styles.ActionItem}>
                <AuthNavigator
                  hideAccount
                  className={styles.AuthItem}
                  underlineActionItemClass={styles.UnderlineActionItem}
                  hideLogin
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
              <a>
                <Icon
                  type="bars"
                />
              </a>
            </Popover>
          </Col>
        </Row>
      </Layout.Header>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector = connect(
  (reducer: Reducer) => ({
    currentUser: reducer.AuthReducer.currentUser,
  }),
);
/* eslint-enable no-unused-vars */

export default connector(Navigator);
