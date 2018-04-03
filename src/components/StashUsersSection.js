/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { LoaderContent, TableParams, getAxios, ModalParams } from 'awry-utilities';
import Masonry from 'react-masonry-component';
import { Icon, Tooltip, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import styles from './StashUsersSection.scss';
import User from '../models/User';
import InviteUserModal from './InviteUserModal';
import StashUserSection from './StashUserSection';

class StashUsersSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('toro-client'),
        itemsName: 'users',
        ItemKlass: User,
        url: `/stashes/${this.props.stash.id}/users.json`,
        pagination: {
          per_page: 8,
        },
        scope: this.props.scope,
      }),
      inviteUserModalParams: new ModalParams({
        component: this,
        key: 'inviteUserModalParams',
      }),
    };
  }

  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    this.state.tableParams.loadItems();
  }

  renderItems = () => {
    const { stash, isList } = this.props;
    const { tableParams, inviteUserModalParams } = this.state;
    const masonryOptions = {
      transitionDuration: 0.5,
    };

    let masonry = null;

    if (tableParams.items.length === 0) {
      masonry = (
        <div className="help-text">
          <span>
            No member found...
          </span>
          &nbsp;
          {
            stash.canInvite() && (
              <span>
                Try&nbsp;
                <a
                  onClick={inviteUserModalParams.show}
                >
                  inviting
                </a>
                &nbsp;one?
              </span>
            )
          }
        </div>
      );
    } else {
      if (isList) {
        masonry = (
          <Masonry
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          >
            {
              tableParams.items.map((item) => {
                return (
                  <Link className={styles.UserLink} to={`/users/${item.id}`} target="_blank" key={item.id}>
                    <Tooltip title={item.username}>
                      <div className={styles.UserAvatar}>
                        <img src={item.avatar_image_attachment.standard_url} />
                      </div>
                    </Tooltip>
                  </Link>
                );
              })
            }
          </Masonry>
        );
      } else {
        masonry = (
          <Row>
            <Masonry
              options={masonryOptions} // default {}
              disableImagesLoaded={false} // default false
              updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            >
              {
                tableParams.items.map((item) => {
                  return (
                    <Col xs={24} md={12} key={item.id}>
                      <StashUserSection
                        stash={stash}
                        user={item}
                        replaceItem={
                          (newItem) => {
                            const { items } = this.state.tableParams;
                            const index = _.findIndex(items, (item) => {
                              return item.id === newItem.id;
                            });
                            if (index >= 0) {
                              items.splice(index, 1, newItem);
                            }
                            this.state.tableParams.items = items;
                            this.setState({
                              tableParams: this.state.tableParams,
                            });
                          }
                        }
                      />
                    </Col>
                  );
                })
              }
            </Masonry>
          </Row>
        );
      }
    }

    return (
      <div className={styles.Users}>
        {masonry}
      </div>
    );
  }

  render() {
    const { stash } = this.props;
    const { tableParams, inviteUserModalParams } = this.state;

    return (
      <div className={styles.Component}>
        <InviteUserModal
          key={inviteUserModalParams.uuid}
          modalParams={inviteUserModalParams}
          stash={stash}
        />
        <LoaderContent
          noTextCenter
          firstLoading={tableParams.isFirstLoading()}
          loading={tableParams.isLoading}
          errors={{
            errorStatus: tableParams.errorStatus,
          }}
          onRetry={this.loadItems}
        >
          {this.renderItems()}
        </LoaderContent>
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(StashUsersSection);
