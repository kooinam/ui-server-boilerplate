/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { getAxios, renderActions, Actioner } from 'awry-utilities';
import { Icon, Card, Dropdown, Menu, Popconfirm, Tag } from 'antd';
import { Link } from 'react-router-dom';

import styles from './StashUserSection.scss';
import User from '../models/User';

class StashUserSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      acceptActioner: new Actioner({
        component: this,
        key: 'acceptActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: (user) => {
          return 'User accepted successfully';
        },
        successCallback: (user) => {
          this.props.replaceItem(user);
        },
        errorMessageGetter: (error) => {
          return 'Failed to accept User';
        },
      }),
      rejectActioner: new Actioner({
        component: this,
        key: 'rejectActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: (result) => {
          return 'Successfully reject User';
        },
        successCallback: (user) => {
          this.props.replaceItem(user);
        },
        errorMessageGetter: (error) => {
          return 'Failed to reject User';
        },
      }),
      kickActioner: new Actioner({
        component: this,
        key: 'kickActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: (result) => {
          return 'Successfully kick User';
        },
        successCallback: (user) => {
          this.props.replaceItem(user);
        },
        errorMessageGetter: (error) => {
          return 'Failed to kick User';
        },
      }),
      makeAdminActioner: new Actioner({
        component: this,
        key: 'makeAdminActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: (result) => {
          return 'Successfully make User as admin';
        },
        successCallback: (user) => {
          this.props.replaceItem(user);
        },
        errorMessageGetter: (error) => {
          return 'Failed to make User as admin';
        },
      }),
      makeMemberActioner: new Actioner({
        component: this,
        key: 'makeMemberActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: (result) => {
          return 'Successfully make User as member';
        },
        successCallback: (user) => {
          this.props.replaceItem(user);
        },
        errorMessageGetter: (error) => {
          return 'Failed to make User as member';
        },
      }),
    };
  }

  accept = (user) => {
    this.state.acceptActioner.do(`/stashes/${this.props.stash.id}/users/${user.id}/accept.json`);
  }

  reject = (user) => {
    this.state.rejectActioner.do(`/stashes/${this.props.stash.id}/users/${user.id}/reject.json`);
  }

  makeAdmin = (user) => {
    this.state.makeAdminActioner.do(`/stashes/${this.props.stash.id}/users/${user.id}/make_admin.json`);
  }

  makeMember = (user) => {
    this.state.makeMemberActioner.do(`/stashes/${this.props.stash.id}/users/${user.id}/make_member.json`);
  }

  kick = (user) => {
    this.state.kickActioner.do(`/stashes/${this.props.stash.id}/users/${user.id}/kick.json`);
  }

  renderActions = (user) => {
    const { stash } = this.props;
    const { acceptActioner, rejectActioner } = this.state;

    const manageActions = renderActions([{
      component: (
        <Menu.Item key="edit">
          <Popconfirm
            title={`Are you sure you want to make ${user.username} as member?`}
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={
              () => {
                this.makeMember(user)
              }
            }
          >
            <a
              className={styles.ActionItem}
            >
              <Icon type="edit" />
              &nbsp;&nbsp;Make member
            </a>
          </Popconfirm>
        </Menu.Item>
      ),
      canAccess: stash.canMakeMember(user),
    }, {
      component: (
        <Menu.Item key="edit">
          <Popconfirm
            title={`Are you sure you want to make ${user.username} as admin?`}
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={
              () => {
                this.makeAdmin(user)
              }
            }
          >
            <a
              className={styles.ActionItem}
            >
              <Icon type="edit" />
              &nbsp;&nbsp;Make Admin
            </a>
          </Popconfirm>
        </Menu.Item>
      ),
      canAccess: stash.canMakeAdmin(user),
    }, {
      component: (
        <Menu.Item key="leave">
          <Popconfirm
            title={`Are you sure you want to kick ${user.username}?`}
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={
              () => {
                this.kick(user)
              }
            }
          >
            <a className={styles.ActionItem}>
              <Icon type="close" />
              &nbsp;&nbsp;Kick
            </a>
          </Popconfirm>
        </Menu.Item>
      ),
      canAccess: stash.canKick(user),
    }]);

    const menu = (
      <Menu>
        {manageActions}
      </Menu>
    );

    const actions = [{
      component: (
        <a
          key="reject"
          className="link-primary link-danger"
          onClick={
            () => {
              this.reject(user);
            }
          }
        >
          {
            (rejectActioner.isLoading) ? (
              <Icon type="loading" />
            ) : (
              <Icon type="close" />
            )
          }
        </a>
      ),
      canAccess: stash.canAccept(user),
    }, {
      component: (
        <a
          key="accept"
          className="link-primary link-success"
          onClick={
            () => {
              this.accept(user);
            }
          }
        >
          {
            (acceptActioner.isLoading) ? (
              <Icon type="loading" />
            ) : (
              <Icon type="check" />
            )
          }
        </a>
      ),
      canAccess: stash.canAccept(user),
    }, {
      component: (
        <Dropdown overlay={menu} key="actions">
          <a className={styles.DropdownLink}>
            <Icon type="ellipsis" />
          </a>
        </Dropdown>
      ),
      canAccess: manageActions.length > 0,
    }];

    return renderActions(actions);
  }

  render() {
    const { stash, user } = this.props;

    return (
      <Card
        className={styles.Component}
      >
        <div>
          <div className={styles.UserActions}>
            {this.renderActions(user)}
          </div>
          <Link to={`/users/${user.id}`} target="_blank">
            <div className={styles.UserAvatar}>
              <img src={user.avatar_image_attachment.standard_url} />
            </div>
          </Link>
          <div className={styles.UserUsername}>
            <Link className={'link-primary'} to={`/users/${user.id}`} target="_blank">
              {user.username}
            </Link>
            <div>
              <Tag color="#2db7f5">
                {user.role}
              </Tag>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(StashUserSection);
