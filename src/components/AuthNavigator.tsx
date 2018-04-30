/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import { Popover, Menu, Icon, message } from 'antd';
import { ModalParams, Actioner, getAxios, getMessageDuration } from 'awry-utilities-2';
import { Link } from 'react-router-dom';

import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import { authenticated, showSignInModal, hideSignInModal } from '../actions/auth';
import User from '../models/User';

const styles = require('./AuthNavigator.scss');

class AuthNavigator extends React.Component {
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
        axiosGetter: () => getAxios('auth'),
        method: 'delete',
        ItemKlass: User,
        itemName: 'user',
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
      }),
      authenticateActioner: new Actioner({
        component: this,
        key: 'authenticateActioner',
        axiosGetter: () => getAxios('auth'),
        method: 'post',
        itemName: 'user',
        ItemKlass: User,
        successCallback: (user) => {
          this.props.dispatch(authenticated(user));
        },
        errorCallback: (error) => {
          if (error && error.response && error.response.status !== 500) {
            this.props.dispatch(authenticated(null));
          } else {
            this.props.dispatch(authenticated(undefined));
          }
        },
      }),
      popoverVisible: false,
    };
  }

  props: any;
  state: any;

  componentDidMount() {
    const token = User.getToken();
    if (token && token.length > 0) {
      this.state.authenticateActioner.do('/sessions/authenticate.json');
    } else {
      this.props.dispatch(authenticated(undefined));
    }
  }

  componentWillReceiveProps(props) {
    if (props.signInModalVisible && this.state.signInModalParams.visible === false) {
      this.state.signInModalParams.show();
    }

    if (props.signInModalVisible === false && this.state.signInModalParams.visible) {
      this.state.signInModalParams.dismiss();
    }
  }

  handleClickSignUp = () => {
    this.hideSignInModal(this.props.onAuthenticated);

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

  hideSignInModal = (onAuthenticated) => {
    this.props.dispatch(hideSignInModal(onAuthenticated));
  }

  render() {
    const { authState, currentUser, hideAccount, hideLogin } = this.props;

    if (!authState || authState === 'authenticating') {
      return null;
    }

    let content = null;

    if (this.props.inline) {
      if (currentUser) {
        content = (
          <Menu
            mode="inline"
            selectedKeys={[]}
            onSelect={this.props.onSelect}
            className={`${this.props.className} ${styles.InlineComponent}`}
          >
            <Menu.SubMenu title={<span>{currentUser.email}</span>}>
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
      } else if (!hideLogin) {
        content = (
          <Menu
            mode="inline"
            selectedKeys={[]}
            onSelect={this.props.onSelect}
          >
            <Menu.Item>
              <a className={`${styles.InlineComponent} ${this.props.className}`} onClick={this.state.signInModalParams.show} role="button" tabIndex={0}>
                <SignInModal
                  {...this.state.signInModalParams.churn()}
                  onClickSignUp={this.handleClickSignUp}
                />
                <SignUpModal
                  {...this.state.signUpModalParams.churn()}
                  onClickSignIn={this.handleClickSignIn}
                />
                LOGIN
              </a>
            </Menu.Item>
          </Menu>
        );
      }
    } else {
      if (currentUser) {
        const menu = (
          <Menu selectedKeys={[]} className={styles.Menu}>
            {
              (!hideAccount) ? (
                <Menu.Item>
                  <Link to="/me" onClick={this.hidePopover}>
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

        content = (
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
            <a className={`${this.props.className} ${styles.Component}`}>
              {currentUser.email}
              &nbsp;
              <Icon type="down" />
            </a>
          </Popover>
        );
      } else if (!hideLogin) {
        content = (
          <React.Fragment>
            <SignInModal
              {...this.state.signInModalParams.churn()}
              onClickSignUp={this.handleClickSignUp}
              hideModal={this.hideSignInModal}
              onAuthenticated={this.props.onAuthenticated}
            />
            <SignUpModal
              {...this.state.signUpModalParams.churn()}
              onClickSignIn={this.handleClickSignIn}
              onAuthenticated={this.props.onAuthenticated}
            />
            <a
              key={1}
              className={`underline-link ${styles.Component} ${this.props.className}`}
              onClick={this.showSignInModal}
              role="button"
              tabIndex={0}
              >
              LOG IN
            </a>
            {
              this
            }
            <a key={2} className={`underline-link ${styles.Component} ${this.props.className}`} onClick={this.state.signUpModalParams.show} role="button" tabIndex={0}>
              CREATE ACCOUNT
            </a>
          </React.Fragment>
        );
      }
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

const connector = connect(
  (state) => {
    return {
      currentUser: state.AuthReducer.currentUser,
      authState: state.AuthReducer.state,
      signInModalVisible: state.AuthReducer.signInModalVisible,
      onAuthenticated: state.AuthReducer.onAuthenticated,
    };
  },
);

export default connector(AuthNavigator);
