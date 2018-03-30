/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { getAxios, ItemLoader, LoaderContent, setupBreadcrumbIdentifiers, matchRouteParams, ModalParams, renderActions, Actioner, matchRouteProperty } from 'awry-utilities';
import { Icon, Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

import styles from './StashPage.scss';
import Stash from '../models/Stash';
import EditStashModal from '../components/EditStashModal';
import SheetsSection from '../components/SheetsSection';

class StashPage extends Component {
  constructor(props) {
    super(props);

    const { matchedRoutes } = this.props;
    const stashId = matchRouteParams(matchedRoutes, 'stashId');

    this.state = {
      editStashModalParams: new ModalParams({
        component: this,
        key: 'editStashModalParams',
      }),
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('toro-client'),
        itemName: 'stash',
        ItemKlass: Stash,
        url: `/stashes/${stashId}.json`,
        callback: (item) => {
          this.props.dispatch(setupBreadcrumbIdentifiers({
            stashName: item.name,
          }));
        },
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
          this.loadItem();
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
          this.loadItem();
        },
        errorMessageGetter: (error) => {
          return `Failed to leave Stash`;
        },
      }),
      urlPrefix: `${(matchRouteProperty(this.props.matchedRoutes, 'urlPrefix') || '')}/stashes/${stashId}`,
    };
  }

  componentWillMount = () => {
    this.loadItem();
  }

  loadItem = () => {
    this.state.itemLoader.loadItem();
  }

  joinStash = () => {
    const { itemLoader, editStashModalParams } = this.state;
    const stash = itemLoader.item;

    this.state.leaveStashActioner.do(`/stashes/${stash.id}/stash_users.json`);
  }

  leaveStash = () => {
    const { itemLoader, editStashModalParams } = this.state;
    const stash = itemLoader.item;

    this.state.leaveStashActioner.do(`/stashes/${stash.id}/stash_users/${this.props.currentUser.id}.json`);
  }

  renderActions = (stash) => {
    const { editStashModalParams, leaveStashActioner, joinStashActioner } = this.state;

    const actions = [{
      component: (
        <Button key="join" icon="login" className="btn-primary" onClick={this.state.joinStash} loading={joinStashActioner.isLoading}>
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
      <SheetsSection stash={stash} urlPrefix={this.state.urlPrefix} />
    );
  }

  renderItem = (stash) => {
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
          <div className={`${styles.Header} ${styles.HeaderOne}`}>
            <div className={styles.Actions}>
              {this.renderActions(stash)}
            </div>
            <div className={styles.Cover}>
              <img src={stash.cover_image_attachment.thumb_url} />
            </div>
            <div className={styles.Title}>
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
              <Icon type="file-text" />
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
          <div className={`${styles.Header} ${styles.HeaderTwo}`}>
            <div className={styles.Actions}>
            </div>
            <div className={styles.TitleSm}>
              Sheets
            </div>
            <Link to={`${this.state.urlPrefix}/sheets`} className={styles.ViewAllOne}>
              <Button className="btn-quaternary btn-rounded" icon="bars">
                View all
              </Button>
            </Link>
          </div>
          <hr className="hr-sm" />
          {this.renderSheets(stash)}
          <div className={styles.ViewAllTwo}>
            >&nbsp;
            <Link to={`${this.state.urlPrefix}/sheets`} className="link-secondary">
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
    const { itemLoader, editStashModalParams } = this.state;
    const stash = itemLoader.item;

    return (
      <div className={styles.Container}>
        <EditStashModal
          key={editStashModalParams.uuid}
          modalParams={editStashModalParams}
          stash={stash}
          loadItem={this.loadItem}
        />
        <LoaderContent
          firstLoading={itemLoader.isFirstLoading()}
          loading={itemLoader.isLoading}
          isError={itemLoader.isError}
          onRetry={this.loadItem}
        >
          {this.renderItem(stash)}
        </LoaderContent>
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
