/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Row, Col, Layout, Popover, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';

import styles from './Navigator.scss';
import AuthNavigator from './AuthNavigator';
import SearchNavigator from './SearchNavigator';
import NewSheetNavigator from './NewSheetNavigator';

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
        {
          currentUser && (
            <Menu.Item>
              <Link to="/me/stashes" className="link">
                My Stashes
              </Link>
            </Menu.Item>
          )
        }
      </Menu>
    );

    return (
      <Layout.Header className={styles.Component}>
        <Row>
          <Col sm={3} xs={6}>
            <a href="/">
              <img className={styles.Logo} src={require('../assets/logo.png')} alt="Logo" />
            </a>
          </Col>
          <Col sm={10} xs={14}>
            <SearchNavigator />
          </Col>
          <Col sm={3} xs={0}>
            <NewSheetNavigator />
          </Col>
          <Col sm={8} xs={0} className="pull-right">
            <ul className={styles.Actions}>
              {
                currentUser && (
                  <li className={styles.ActionItem}>
                    <Link to="/me/stashes" className={`link ${styles.StashLink} `}>
                      My Stashes
                    </Link>
                  </li>
                )
              }
              <li className={styles.ActionItem}>
                <AuthNavigator
                  className={styles.AuthItem}
                />
              </li>
            </ul>
          </Col>
          <Col sm={0} xs={4} className={styles.Popover}>
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
