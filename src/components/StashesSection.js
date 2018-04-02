/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { TableParams, getAxios, LoaderContent, ModalParams } from 'awry-utilities';
import Masonry from 'react-masonry-component';
import { Icon, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import styles from './StashesSection.scss';
import Stash from '../models/Stash';
import NewStashModal from '../components/NewStashModal';

class StashesSection extends Component {
  // static tableParams = (component, params, query, url) => {
  //   const newQuery = queryString.parse(query);
  //   const page = (newQuery.page) ? parseInt(newQuery.page, 10) : 1;

  //   return new TableParams({
  //     component,
  //     key: 'tableParams',
  //     axiosGetter: () => getAxios('commerce-client'),
  //     itemsName: 'products',
  //     ItemKlass: Product,
  //     url: (url) ? url : '/products.json',
  //     pagination: {
  //       total: 0,
  //       current: page || 1,
  //       per_page: 12,
  //     },
  //     filter: {},
  //     scope: 'name_asc',
  //     ssrKey: 'products',
  //   });
  // };

  constructor(props) {
    super(props);

    this.state = {
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('toro-client'),
        itemsName: 'stashes',
        ItemKlass: Stash,
        url: '/stashes.json',
        pagination: {
          per_page: 12,
        },
        scope: this.props.scope,
      }),
      modalParams: new ModalParams({
        component: this,
        key: 'modalParams',
      }),
    };
  }

  componentWillMount = () => {
    this.loadItems();
  }

  loadItems = () => {
    this.state.tableParams.loadItems();
  }

  renderItems = () => {
    const { tableParams, modalParams } = this.state;
    const masonryOptions = {
      transitionDuration: 0.5,
    };

    const masonry = (
      <Row>
        <Masonry
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          <Col sm={12} xs={24} md={8} lg={6}>
            <Card
              className={styles.StashCard}
            >
              <Link
                className={`link-primary ${styles.StashLink} ${styles.AddStashLink}`}
                to="#"
                onClick={modalParams.show}
              >
                <div className={styles.AddStash}>
                  <Icon
                    type="plus"
                  />
                  <div>
                    Stash
                  </div>
                </div>
              </Link>
            </Card>
          </Col>
          {
            tableParams.items.map((item) => {
              return (
                <Col sm={12} xs={24} lg={6} md={8} key={item.id}>
                  <Card
                    className={styles.StashCard}
                  >
                    <div className={styles.StashLink}>
                      <Link className="link-primary" to={`${this.props.urlPrefix}/stashes/${item.id}`}>
                        <div className={styles.StashCover}>
                          <img src={item.cover_image_attachment.standard_url} />
                        </div>
                      </Link>
                      <div className={styles.StashDetails}>
                        <Link className="link-primary" to={`${this.props.urlPrefix}/stashes/${item.id}`}>
                          <div className={styles.StashTitle}>
                            {item.name}
                          </div>
                        </Link>
                        <div className={styles.StashMiscs}>
                          <span className={styles.StashMisc}>
                            <Icon type="user" />
                            {item.users_count}
                          </span>
                          <span className={styles.StashMisc}>
                            <Icon type="copy" />
                            {item.sheets_count}
                          </span>
                          {
                            item.is_private && (
                              <span className={styles.StashMisc}>
                                <Icon type="lock" />
                              </span>
                            )
                          }
                        </div>
                        <div className="clearfix" />
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })
          }
        </Masonry>
      </Row>
    );

    return (
      <div>
        {masonry}
      </div>
    );
  }

  render() {
    const { tableParams, modalParams } = this.state;

    return (
      <div className={styles.Component}>
        <NewStashModal
          key={modalParams.uuid}
          modalParams={modalParams}
          stash={new Stash()}
          urlPrefix={this.props.urlPrefix}
        />
        <LoaderContent
          firstLoading={tableParams.isFirstLoading()}
          loading={tableParams.isLoading}
          isError={tableParams.isError}
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

export default connector(StashesSection);
