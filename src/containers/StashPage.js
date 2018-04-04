/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { getAxios, ModalParams, renderActions, Actioner } from 'awry-utilities';
import { Icon, Button, Popconfirm, Dropdown, Menu, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import pluralize from 'pluralize';
import AutoLinkText from 'react-autolink-text2';

import styles from './StashPage.scss';
import Stash from '../models/Stash';
import EditStashModal from '../components/EditStashModal';
import ManageStashUsersModal from '../components/ManageStashUsersModal';
import SheetsSection from '../components/SheetsSection';
import StashUsersSection from '../components/StashUsersSection';
import { showSignInModal } from '../actions/auth';

class StashPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editStashModalParams: new ModalParams({
        component: this,
        key: 'editStashModalParams',
      }),
      manageStashUsersModalParams: new ModalParams({
        component: this,
        key: 'manageStashUsersModalParams',
      }),
      joinStashActioner: new Actioner({
        component: this,
        key: 'joinStashActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'post',
        itemName: 'result',
        ItemKlass: Object,
        successMessageGetter: (result) => {
          return 'Joined Stash successfully';
        },
        successCallback: (stash) => {
          this.props.loadItem();
        },
        errorMessageGetter: (error) => {
          return 'Failed to join Stash';
        },
      }),
      leaveStashActioner: new Actioner({
        component: this,
        key: 'leaveStashActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'result',
        ItemKlass: Object,
        successMessageGetter: (result) => {
          return 'Left Stash successfully';
        },
        successCallback: (stash) => {
          this.props.loadItem();
        },
        errorMessageGetter: (error) => {
          return 'Failed to leave Stash';
        },
      }),
      cancelJoinStashActioner: new Actioner({
        component: this,
        key: 'cancelJoinStashActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'result',
        ItemKlass: Object,
        successMessageGetter: (result) => {
          return 'Cancelled joining Stash successfully';
        },
        successCallback: (stash) => {
          this.props.loadItem();
        },
        errorMessageGetter: (error) => {
          return 'Failed to cancel joining Stash';
        },
      }),
    };
  }

  joinStash = () => {
    const { stash, currentUser } = this.props;

    if (!currentUser) {
      this.props.dispatch(showSignInModal());
    } else {
      this.state.joinStashActioner.do(`/stashes/${stash.id}/users.json`);
    }
  }

  leaveStash = () => {
    const { stash } = this.props;

    this.state.leaveStashActioner.do(`/stashes/${stash.id}/users/${this.props.currentUser.id}/leave.json`);
  }

  cancelJoinStash = () => {
    const { stash } = this.props;

    this.state.cancelJoinStashActioner.do(`/stashes/${stash.id}/users/${this.props.currentUser.id}/cancel.json`);
  }

  renderActions = (stash) => {
    const { editStashModalParams, leaveStashActioner, joinStashActioner, cancelJoinStashActioner } = this.state;
    const manageActions = renderActions([{
      component: (
        <Menu.Item key="edit">
          <a className={styles.ActionItem} onClick={this.state.editStashModalParams.show}>
            <Icon type="edit" />
            &nbsp;&nbsp;Edit
          </a>
        </Menu.Item>
      ),
      canAccess: stash.canLeave(),
    }, {
      component: (
        <Menu.Item key="leave">
          <Popconfirm
            title="Are you sure？"
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={this.leaveStash}
          >
            <a className={styles.ActionItem}>
              <Icon type="logout" />
              &nbsp;&nbsp;Leave
            </a>
          </Popconfirm>
        </Menu.Item>
      ),
      canAccess: stash.canLeave(),
    }]);

    const menu = (
      <Menu>
        {manageActions}
      </Menu>
    );

    const actions = [{
      component: (
        <Button key="joining" className="btn-secondary" icon="close" onClick={this.cancelJoinStash} loading={cancelJoinStashActioner.isLoading}>
          Requesting
        </Button>
      ),
      canAccess: stash.canCancelJoin(),
    }, {
      component: (
        <Button key="join" icon="login" className="btn-primary" onClick={this.joinStash} loading={joinStashActioner.isLoading}>
          Join Stash
        </Button>
      ),
      canAccess: stash.canJoin(),
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

  renderSheets = (stash) => {
    return (
      <SheetsSection stash={stash} urlPrefix={this.props.urlPrefix} />
    );
  }

  renderUsers = (stash) => {
    return (
      <StashUsersSection stash={stash} urlPrefix={this.props.urlPrefix} isList={true} />
    );
  }

  renderItem = (stash) => {
    const { baseStyles } = this.props;
    const description = (stash.hasDescription()) ? (
      <AutoLinkText text={stash.description} linkProps={{target: '_blank'}} />
    ) : (
      <div className="help-text">
        <span>
          Description is empty...
        </span>
        &nbsp;
        {
          stash.canAdmin() && (
            <span>
              Try&nbsp;
              <a
                onClick={this.state.editStashModalParams.show}
              >
                adding
              </a>
              &nbsp;one?
            </span>
          )
        }
      </div>
    );

    return (
      <div>
        <div className={styles.Overview}>
          <div className={`${baseStyles.Header} ${baseStyles.HeaderOne}`}>
            <div className={baseStyles.Actions}>
              {this.renderActions(stash)}
            </div>
            <div className={baseStyles.Cover}>
              <img src={stash.cover_image_attachment.thumb_url} />
            </div>
            <div className={baseStyles.Title}>
              {stash.name}
            </div>
          </div>
          <hr className="hr" />
          <div className={styles.Miscs}>
            {
              stash.is_private && (
                <Tooltip title="Only member can view content">
                  <Icon type="lock" className={styles.SmallMisc} />
                </Tooltip>
              )
            }
            <span className={styles.Misc}>
              <Icon type="user" />
              {stash.users_count}
            </span>
            <span className={styles.Misc}>
              <Icon type="copy" />
              {stash.sheets_count}
            </span>
          </div>
          <div className={styles.Description}>
            {description}
          </div>
        </div>
        <div className={styles.Users}>
          {this.renderUsers(stash)}
          <div className={baseStyles.ViewAllTwo}>
            >&nbsp;
            <Link to={`${this.props.urlPrefix}/users`} className="link-secondary">
              View all&nbsp;
              {stash.users_count}
              &nbsp;
              {pluralize('member', stash.users_count)}
              {
                (stash.join_requests_count && stash.join_requests_count > 0) ? (
                  <span>
                    &nbsp;(
                    {stash.join_requests_count} join requests)
                  </span>
                ) : (
                  <span />
                )
              }
            </Link>
          </div>
        </div>
        <div className={styles.Sheets}>
          <div className={`${baseStyles.Header} ${baseStyles.HeaderTwo}`}>
            <div className={baseStyles.Actions}>
            </div>
            <div className={baseStyles.TitleSm}>
              Sheets
            </div>
            <Link to={`${this.props.urlPrefix}/sheets`} className={baseStyles.ViewAllOne}>
              <Button className="btn-tertiary btn-rounded" icon="bars">
                View all
              </Button>
            </Link>
          </div>
          <hr className="hr-sm" />
          {this.renderSheets(stash)}
          <div className={baseStyles.ViewAllTwo}>
            >&nbsp;
            <Link to={`${this.props.urlPrefix}/sheets`} className="link-secondary">
              View all&nbsp;
              {stash.sheets_count}
              &nbsp;{pluralize('sheet', stash.sheets_count)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { editStashModalParams, manageStashUsersModalParams } = this.state;
    const { stash } = this.props;

    return (
      <div className={styles.Container}>
        <EditStashModal
          key={editStashModalParams.uuid}
          modalParams={editStashModalParams}
          stash={stash}
          loadItem={this.props.loadItem}
        />
        <ManageStashUsersModal
          key={manageStashUsersModalParams.uuid}
          modalParams={manageStashUsersModalParams}
          stash={stash}
          loadItem={this.props.loadItem}
        />
        {this.renderItem(stash)}
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({
    currentUser: reducer.AuthReducer.currentUser,
  }),
);
/* eslint-enable no-unused-vars */

export default connector(StashPage);
