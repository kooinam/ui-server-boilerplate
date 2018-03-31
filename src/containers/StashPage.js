/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { getAxios, ModalParams, renderActions, Actioner } from 'awry-utilities';
import { Icon, Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

import styles from './StashPage.scss';
import Stash from '../models/Stash';
import EditStashModal from '../components/EditStashModal';
import SheetsSection from '../components/SheetsSection';

class StashPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editStashModalParams: new ModalParams({
        component: this,
        key: 'editStashModalParams',
      }),
      joinStashActioner: new Actioner({
        component: this,
        key: 'joinStashActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'post',
        itemName: 'result',
        ItemKlass: Object,
        successMessageGetter: (result) => {
          return `Successfully joined Stash`;
        },
        successCallback: (stash) => {
          this.props.loadItem();
        },
        errorMessageGetter: (error) => {
          return `Failed to joined Stash`;
        },
      }),
      leaveStashActioner: new Actioner({
        component: this,
        key: 'leaveStashActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'delete',
        itemName: 'result',
        ItemKlass: Object,
        successMessageGetter: (result) => {
          return `Leave Stash successfully`;
        },
        successCallback: (stash) => {
          this.props.loadItem();
        },
        errorMessageGetter: (error) => {
          return `Failed to leave Stash`;
        },
      }),
    };
  }

  joinStash = () => {
    const { editStashModalParams } = this.state;
    const { stash } = this.props;

    this.state.leaveStashActioner.do(`/stashes/${stash.id}/stash_users.json`);
  }

  leaveStash = () => {
    const { editStashModalParams } = this.state;
    const { stash } = this.props;

    this.state.leaveStashActioner.do(`/stashes/${stash.id}/stash_users/${this.props.currentUser.id}.json`);
  }

  renderActions = (stash) => {
    const { editStashModalParams, leaveStashActioner, joinStashActioner } = this.state;

    const actions = [{
      component: (
        <Button key="join" icon="login" className="btn-primary" onClick={this.joinStash} loading={joinStashActioner.isLoading}>
          Join Stash
        </Button>
      ),
      canAccess: stash.canJoin(),
    }, {
      component: (
        <Button key="manage" icon="setting" className="btn-primary" onClick={editStashModalParams.show}>
          Manage
        </Button>
      ),
      canAccess: stash.canAdmin(),
    }, {
      component: (
        <Popconfirm
          key="leave"
          title="Are you sure？"
          okText="Confirm"
          cancelText="Cancel"
          onConfirm={this.leaveStash}
        >
          <Button icon="logout" className="btn-tertiary" loading={leaveStashActioner.isLoading}>
            Leave Stash
          </Button>
        </Popconfirm>
      ),
      canAccess: stash.canLeave(),
    }];

    return renderActions(actions);
  }

  renderSheets = (stash) => {
    return (
      <SheetsSection stash={stash} urlPrefix={this.props.urlPrefix} />
    );
  }

  renderItem = (stash) => {
    const { baseStyles } = this.props;
    const description = (stash.hasDescription()) ? (
      <div>
        {stash.description}
      </div>
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
            <span className={styles.Misc}>
              <Icon type="user" />
              {stash.users_count}
            </span>
            <span className={styles.Misc}>
              <Icon type="copy" />
              {stash.sheets_count}
            </span>
            {
              stash.is_private && (
                <span className={styles.Misc}>
                  <Icon type="lock" />
                </span>
              )
            }
          </div>
          <div className={styles.Description}>
            {description}
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
              &nbsp;sheets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { editStashModalParams } = this.state;
    const { stash } = this.props;

    return (
      <div className={styles.Container}>
        <EditStashModal
          key={editStashModalParams.uuid}
          modalParams={editStashModalParams}
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
