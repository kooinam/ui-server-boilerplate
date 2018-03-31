/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { matchRouteParams, ItemLoader, getAxios, LoaderContent, formatDate, formatTime, renderActions, Actioner } from 'awry-utilities';
import { Modal, Row, Col, Carousel, Dropdown, Menu, Button, Icon } from 'antd';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';

import styles from './SheetPage.scss';
import SheetsSection from '../components/SheetsSection';
import Sheet from '../models/Sheet';

class SheetPage extends Component {
  constructor(props) {
    super(props);

    const { matchedRoutes } = this.props;
    const sheetId = matchRouteParams(matchedRoutes, 'sheetId');

    this.state = {
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('toro-client'),
        itemName: 'sheet',
        ItemKlass: Sheet,
        url: `/stashes/${this.props.stash.id}/sheets/${sheetId}.json`,
        callback: (item) => {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 200);
        },
      }),
      deleteSheetActioner: new Actioner({
        component: this,
        key: 'deleteSheetActioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'delete',
        itemName: 'result',
        ItemKlass: Object,
        successMessageGetter: (result) => {
          return `Sheet deleted successfully`;
        },
        successCallback: (stash) => {
          this.props.dispatch(push(`${this.props.urlPrefix}/sheets`));
        },
        errorMessageGetter: (error) => {
          return `Failed to delete Sheet`;
        },
      }),
      attachmentIndex: 0,
    };
  }

  componentWillMount = () => {
    this.loadItem();
  }


  loadItem = () => {
    this.state.itemLoader.loadItem();
  }

  deleteSheet = () => {
    const { stash } = this.props;
    const { itemLoader } = this.state;

    this.state.deleteSheetActioner.do(`/stashes/${stash.id}/sheets/${itemLoader.item.id}.json`);
  }

  goTo = (slide) => {
    this.slider.refs.slick.slickGoTo(slide);
  }

  handleCancel = () => {
    this.props.dispatch(push(`${this.props.urlPrefix}/sheets`));
  }

  renderAttachment = (attachment) => {
    let renderer = null;
    if (attachment.isImage()) {
      renderer = (
        <img src={attachment.large_url} />
      );
    }

    return (
      <div key={attachment.id} className={styles.Slide}>
        {renderer}
      </div>
    );
  }

  renderAttachments = (sheet) => {
    const { attachments } = sheet;

    return (
      <div>
        <Carousel
          adaptiveHeight={true}
          ref={c => this.slider = c }
          className={styles.Slider}
          dots={false}
          slidesToShow={1}
          slidesToScroll={1}
          infinite={false}
          arrows={attachments.length > 1}
          afterChange={
            (index) => {
              this.setState({
                attachmentIndex: index,
              });
            }
          }
        >
          {
            attachments.map((attachment) => {
              return this.renderAttachment(attachment);
            })
          }
        </Carousel>
        <div className={styles.Thumbs}>
          {
            attachments.map((attachment, index) => {
              return (
                <a
                  className={`${styles.Thumb} ${((this.state.attachmentIndex) === index) ? styles.Active : ''}`}
                  key={attachment.id}
                  onClick={
                    () => {
                      this.goTo(index);
                    }
                  }
                >
                  <img src={attachment.thumb_url} />
                </a>
              );
            })
          }
        </div>
      </div>
    );
  }

  renderAuthor = (sheet) => {
    const { created_at, user, stash } = sheet;

    return (
      <div className={styles.Author}>
        Published on&nbsp;
        {dateFormat(created_at, 'dd mmm, yyyy')}
        <br />
        in&nbsp;
        <Link to={`${this.props.urlPrefix}`} target="_blank" className="link-tertiary">
          {stash.name}
        </Link>
        &nbsp;by&nbsp;
        <Link to={`/users/${user.username}`} target="_blank" className="link-tertiary">
          @{user.username}
        </Link>
      </div>
    );
  }

  renderActions = (sheet) => {
    const { deleteSheetActioner } = this.state;

    const actions = [{
      component: (
        <Menu.Item key="delete_sheet">
          <a onClick={this.deleteSheet}>
            <Icon type="close" />
          </a>
        </Menu.Item>
      ),
      canAccess: sheet.canDelete(),
    }];

    const menu = (
      <Menu>
        {renderActions(actions)}
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <Button className={styles.DropdownLink}>
          Actions&nbsp;
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }


  render() {
    const { stash, baseStyles } = this.props;
    const { itemLoader } = this.state;
    const item = itemLoader.item;

    const description = (item.hasDescription()) ? (
      <div>
        {item.description}
      </div>
    ) : (
      <div className="help-text">
        No description found...
      </div>
    );

    return (
      <Modal
        className={styles.Container}
        visible={true}
        footer={null}
        onCancel={this.handleCancel}
        width={920}
        closable={false}
      >
        <LoaderContent
          firstLoading={itemLoader.isFirstLoading()}
          loading={itemLoader.isLoading}
          isError={itemLoader.isError}
          onRetry={this.loadItem}
        >
          <Row>
            <Col sm={12} className={styles.LeftSection}>
              {this.renderAttachments(item)}
              {this.renderAuthor(item)}
            </Col>
            <Col sm={12} className={styles.RightSection}>
              <div className={styles.Actions}>
                {this.renderActions(item)}
              </div>
              <div className="clearfix" />
              <div className={styles.Description}>
                {description}
              </div>
            </Col>
          </Row>
        </LoaderContent>
      </Modal>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(SheetPage);
