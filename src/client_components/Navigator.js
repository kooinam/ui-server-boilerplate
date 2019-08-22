/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Layout, Popover, Icon, Menu } from 'antd';

import styles from './Navigator.scss';
import AuthNavigator from '../components/AuthNavigator';

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
              <li className={styles.ActionItem}>
                <AuthNavigator
                  hideAccount
                  className={styles.AuthItem}
                  underlineActionItemClass={styles.UnderlineActionItem}
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
              <a
                className={styles.PopoverToggle}
              >
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
