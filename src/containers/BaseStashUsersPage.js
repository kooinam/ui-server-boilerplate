/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { BaseRouteComponent, matchRouteParams, renderActions, ModalParams, matchRouteProperty } from 'awry-utilities';
import { Button, Row, Col, Card } from 'antd';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';

import styles from './BaseStashUsersPage.scss';
import StashUsersSection from '../components/StashUsersSection';
import InviteUserModal from '../components/InviteUserModal';

class BaseStashUsersPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inviteUserModalParams: new ModalParams({
        component: this,
        key: 'inviteUserModalParams',
      }),
    };
  }

  renderActions = (stash) => {
    const { inviteUserModalParams } = this.state;
    const actions = [{
      component: (
        <Button key="post" icon="plus" className="btn-primary" onClick={inviteUserModalParams.show}>
          Invite
        </Button>
      ),
      canAccess: stash.canInvite(),
    }];

    return renderActions(actions);
  }

  render() {
    const { stash, baseStyles, urlPrefix, matchedRoutes, scope } = this.props;
    const { inviteUserModalParams } = this.state;

    const tabKey = matchRouteProperty(this.props.matchedRoutes, 'tabKey');

    return (
      <div className={styles.Container}>
        <InviteUserModal
          key={inviteUserModalParams.uuid}
          modalParams={inviteUserModalParams}
          stash={stash}
        />
        <div className={styles.Users}>
          <div className={`${baseStyles.Header} ${baseStyles.HeaderOne}`}>
            <div className={baseStyles.Actions}>
              {this.renderActions(stash)}
            </div>
            <div className={baseStyles.Cover}>
              <img src={stash.cover_image_attachment.thumb_url} />
            </div>
            <div className={baseStyles.Title}>
              {stash.name}
              's Members
              <span className={baseStyles.UsersCount}>
                (
                {stash.users_count}
                &nbsp;
                {pluralize('member', stash.users_count)}
                )
              </span>
            </div>
          </div>
        </div>
        <hr className="hr" />
        <Row gutter={16}>
          <Col sm={8} md={6} lg={5}>
            <Card className={styles.LeftSection}>
              <Link to={`${urlPrefix}/users`} className={`link-primary ${styles.Link} ${(tabKey === 'members') ? styles.Active : ''}`}>
                All members
              </Link>
              {
                stash.canAdmin() && (
                  <Link to={`${urlPrefix}/users/requesting`} className={`link-primary ${styles.Link} ${(tabKey === 'requesting') ? styles.Active : ''}`}>
                    Requesting&nbsp;(
                    {stash.join_requests_count}
                    )
                  </Link>
                )
              }
            </Card>
          </Col>
          <Col sm={16} md={18} lg={19}>
            <BaseRouteComponent
              {...this.props}
              stash={stash}
              urlPrefix={urlPrefix}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(BaseStashUsersPage);