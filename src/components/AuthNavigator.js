/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { Popover, Menu, Icon, message } from 'antd';
import { ModalParams, Actioner, getAxios, getMessageDuration } from 'awry-utilities';
import { Link } from 'react-router-dom';

import styles from './AuthNavigator.scss';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import { authenticated, showSignInModal, hideSignInModal } from '../actions/auth';
import User from '../models/User';

class AuthNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signInModalParams: new ModalParams({
        component: this,
        key: 'signInModalParams',
      }),
      signUpModalParams: new ModalParams({
        component: this,
        key: 'signUpModalParams',
      }),
      logOutActioner: new Actioner({
        component: this,
        key: 'logOutActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'delete',
        ItemKlass: User,
        itemName: 'user',
        /* eslint-disable no-unused-vars */
        successMessageGetter: user =>
          'Goodbye',
        successCallback: (user) => {
          // this.props.dispatch(loggedOut())
          this.props.dispatch(authenticated(null));
        },
        errorMessageGetter: error =>
          'Failed to Log Out',
        errorCallback: (error) => {
          // this.props.dispatch(loggedOut())
        },
        /* eslint-enable no-unused-vars */
      }),
      authenticateActioner: new Actioner({
        component: this,
        key: 'authenticateActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'post',
        itemName: 'user',
        ItemKlass: User,
        successCallback: (user) => {
          this.props.dispatch(authenticated(user));
        },
        errorCallback: (error) => {
          if (error && error.response) {
            this.props.dispatch(authenticated(null));
          }
        },
      }),
      popoverVisible: false,
    };
  }

  componentDidMount = () => {
    const token = User.getToken();
    if (token && token.length > 0) {
      this.state.authenticateActioner.do('/sessions/authenticate.json');
    } else {
      this.props.dispatch(authenticated(undefined));
    }
  }

  componentWillReceiveProps = (props) => {
    if (props.signInModalVisible && this.state.signInModalParams.visible === false) {
      this.state.signInModalParams.show();
    }

    if (props.signInModalVisible === false && this.state.signInModalParams.visible) {
      this.state.signInModalParams.dismiss();
    }
  }

  handleClickSignUp = () => {
    this.hideSignInModal();

    setTimeout(() => {
      this.state.signUpModalParams.show();
    }, 300);
  }

  handleClickSignIn = () => {
    this.state.signUpModalParams.dismiss();

    setTimeout(() => {
      this.showSignInModal();
      // this.state.signInModalParams.show();
    }, 300);
  }

  handleClickLogOut = () => {
    this.props.dispatch(authenticated(null));
    message.success('See you soon!', getMessageDuration());
    this.hidePopover();
  }

  hidePopover = () => {
    this.setState({
      popoverVisible: false,
    });
  }

  showSignInModal = () => {
    this.props.dispatch(showSignInModal());
  }

  hideSignInModal = () => {
    this.props.dispatch(hideSignInModal());
  }

  render() {
    const { authState, currentUser, hideAccount } = this.props;

    if (!authState || authState === 'authenticating') {
      return null;
    }

    if (!this.props.inline) {
      if (currentUser) {
        const menu = (
          <Menu selectedKeys={[]} className={styles.Menu}>
            <Menu.Item disabled>
              {currentUser.email}
            </Menu.Item>
            {
              (!hideAccount) ? (
                <Menu.Item>
                  <Link to="/account" onClick={this.hidePopover}>
                    Account
                  </Link>
                </Menu.Item>
              ) : null
            }
            <Menu.Item>
              <a role="button" tabIndex={0} onClick={this.handleClickLogOut}>
                Log Out
              </a>
            </Menu.Item>
          </Menu>
        );

        return (
          <Popover
            overlayClassName={styles.Popover}
            content={menu}
            placement="bottomRight"
            visible={this.state.popoverVisible}
            onVisibleChange={
              (popoverVisible) => {
                this.setState({
                  popoverVisible,
                });
              }
            }
          >
            <a className={`${styles.Component} ${this.props.className}`}>
              <Icon type="user" className={styles.User} />
              &nbsp;
              <Icon type="down" />
            </a>
          </Popover>
        );
      }

      return [(
        <a key={1} className={`${styles.Component} ${this.props.className}`} onClick={this.showSignInModal} role="button" tabIndex={0}>
          <SignInModal
            key={this.state.signInModalParams.uuid}
            modalParams={this.state.signInModalParams}
            onClickSignUp={this.handleClickSignUp}
            hideModal={this.hideSignInModal}
          />
          <SignUpModal
            key={this.state.signUpModalParams.uuid}
            modalParams={this.state.signUpModalParams}
            onClickSignIn={this.handleClickSignIn}
          />
          LOG IN
        </a>
      ), (
        <a key={2} className={`${styles.Component} ${this.props.className}`} onClick={this.state.signUpModalParams.show} role="button" tabIndex={0}>
          CREATE ACCOUNT
        </a>
      )];
    }

    if (currentUser) {
      return (
        <Menu
          mode="inline"
          selectedKeys={[]}
          onSelect={this.props.onSelect}
          className={`${styles.InlineComponent} ${this.props.className}`}
        >
          <Menu.SubMenu title={<span><Icon type="user" className={styles.User} />{currentUser.email}</span>}>
            {
              (!hideAccount) ? (
                <Menu.Item>
                  <Link to="/account" onClick={this.hidePopover} className={`${styles.InlineComponent} ${this.props.className}`}>
                    Account
                  </Link>
                </Menu.Item>
              ) : null
            }
            <Menu.Item>
              <a role="button" tabIndex={0} onClick={this.handleClickLogOut} className={`${styles.InlineComponent} ${this.props.className}`}>
                Log Out
              </a>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      );
    }

    return (
      <Menu
        mode="inline"
        selectedKeys={[]}
        onSelect={this.props.onSelect}
      >
        <Menu.Item>
          <a className={`${styles.InlineComponent} ${this.props.className}`} onClick={this.state.signInModalParams.show} role="button" tabIndex={0}>
            <SignInModal
              key={this.state.signInModalParams.uuid}
              modalParams={this.state.signInModalParams}
              onClickSignUp={this.handleClickSignUp}
            />
            <SignUpModal
              key={this.state.signUpModalParams.uuid}
              modalParams={this.state.signUpModalParams}
              onClickSignIn={this.handleClickSignIn}
            />
            LOGIN
          </a>
        </Menu.Item>
      </Menu>
    );
  }
}

const connector = connect(
  (state) => {
    return {
      currentUser: state.AuthReducer.currentUser,
      authState: state.AuthReducer.state,
      signInModalVisible: state.AuthReducer.signInModalVisible,
    };
  },
);

export default connector(AuthNavigator);
