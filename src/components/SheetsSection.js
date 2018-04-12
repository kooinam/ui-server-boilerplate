/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { LoaderContent, TableParams, getAxios, ModalParams } from 'awry-utilities';
import Masonry from 'react-masonry-component';
import { Icon, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import TextTruncate from 'react-text-truncate';
import _ from 'lodash';

import styles from './SheetsSection.scss';
import Sheet from '../models/Sheet';
import NewSheetModal from '../components/NewSheetModal';
import LinkPreviewSection from './LinkPreviewSection';

class SheetsSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableParams: new TableParams({
        component: this,
        key: 'tableParams',
        axiosGetter: () => getAxios('toro-client'),
        itemsName: 'sheets',
        ItemKlass: Sheet,
        url: `/stashes/${this.props.stash.id}/sheets.json`,
        pagination: {
          per_page: 8,
        },
      }),
      newSheetModalParams: new ModalParams({
        component: this,
        key: 'newSheetModalParams',
      }),
    };
  }

  componentDidMount() {
    this.loadItems();
  }

  componentDidUpdate(prevProps) {
    const { createSheet, updateSheet, deleteSheet } = this.props;

    if (createSheet && prevProps.createSheet !== createSheet) {
      if (this.props.stash.id === createSheet.stash_id) {
        const { items } = this.state.tableParams;
        items.splice(0, 0, createSheet);

        this.state.tableParams.items = items;
        this.setState({
          tableParams: this.state.tableParams,
        });
        setTimeout(() => {
          this.setState({
            tableParams: this.state.tableParams,
          });
        }, 500);
      }
    } else if (updateSheet && prevProps.updateSheet !== updateSheet) {
      const { items } = this.state.tableParams;
      const index = _.findIndex(items, (item) => {
        return item.id === updateSheet.id;
      });
      if (index >= 0) {
        items.splice(index, 1, updateSheet);
      }
      this.state.tableParams.items = items;
      this.setState({
        tableParams: this.state.tableParams,
      });
    } else if (deleteSheet && prevProps.deleteSheet !== deleteSheet) {
      const { items } = this.state.tableParams;
      const index = _.findIndex(items, (item) => {
        return item.id === deleteSheet.id;
      });
      if (index >= 0) {
        items.splice(index, 1);
      }
      this.state.tableParams.items = items;
      this.setState({
        tableParams: this.state.tableParams,
      });
    }
  }

  loadItems = () => {
    this.state.tableParams.loadItems();
  }

  renderItems = () => {
    const { stash } = this.props;
    const { tableParams, newSheetModalParams } = this.state;
    const masonryOptions = {
      transitionDuration: 0.5,
    };

    let masonry = null;

    if (tableParams.items.length === 0) {
      masonry = (
        <div className="help-text">
          <span>
            Stash is empty...
          </span>
          &nbsp;
          {
            stash.canPost() && (
              <span>
                Try&nbsp;
                <a
                  onClick={newSheetModalParams.show}
                >
                  adding
                </a>
                &nbsp;one?
              </span>
            )
          }
        </div>
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
                let sheetCover = null;

                if (item.cover_attachment.isImage()) {
                  sheetCover = (
                    <img src={item.cover_attachment.standard_url} />
                  );
                } else if (item.cover_attachment.isLink()) {
                  sheetCover = (
                    <LinkPreviewSection
                      link={item.cover_attachment.link}
                      vertical
                      reload={
                        () => {
                          this.setState({});
                        }
                      }
                    />
                  );
                }

                const title = (item.hasTitle()) ? (
                  <div>
                    <TextTruncate
                      line={2}
                      truncateText="…"
                      text={item.title}
                    />
                  </div>
                ) : (
                  <div className="help-text">
                    No title found...
                  </div>
                );

                return (
                  <Col sm={12} xs={24} lg={6} md={8} key={item.id}>
                    <Card
                      className={styles.SheetCard}
                    >
                      <div className={styles.SheetLink}>
                        <Link className="link-primary" to={`${this.props.urlPrefix}/sheets/${item.id}`}>
                          <div className={styles.SheetCover}>
                            {sheetCover}
                          </div>
                        </Link>
                        <div className={styles.SheetDetails}>
                          <Link to={`${this.props.urlPrefix}/sheets/${item.id}`}>
                            <div className={styles.SheetTitle}>
                              {title}
                            </div>
                          </Link>
                          <div className={styles.SheetMiscs}>
                            <span className={styles.SheetMisc}>
                              <Icon type="paper-clip" />
                              {item.attachments_count}
                            </span>
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
    }

    return (
      <div className={styles.Sheets}>
        {masonry}
      </div>
    );
  }

  render() {
    const { stash } = this.props;
    const { tableParams, newSheetModalParams } = this.state;

    return (
      <div className={styles.Component}>
        <NewSheetModal
          key={newSheetModalParams.uuid}
          modalParams={newSheetModalParams}
          sheet={new Sheet()}
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
  (reducer) => ({
    updateSheet: reducer.SheetsReducer.updateSheet,
    deleteSheet: reducer.SheetsReducer.deleteSheet,
    createSheet: reducer.SheetsReducer.createSheet,
  }),
);
/* eslint-enable no-unused-vars */

export default connector(SheetsSection);
