/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { matchRouteParams, ItemLoader, getAxios, LoaderContent, formatDate, formatTime, renderActions, Actioner, ModalParams } from 'awry-utilities';
import { Modal, Row, Col, Carousel, Dropdown, Menu, Button, Icon, Popconfirm } from 'antd';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';

import styles from './SheetPage.scss';
import SheetsSection from '../components/SheetsSection';
import EditSheetModal from '../components/EditSheetModal';
import Sheet from '../models/Sheet';
import { deleteSheet } from '../actions/sheet';

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
        successCallback: () => {
          this.props.dispatch(push(`${this.props.urlPrefix}/sheets`));
          this.props.dispatch(deleteSheet(this.state.itemLoader.item));
        },
        errorMessageGetter: (error) => {
          return `Failed to delete Sheet`;
        },
      }),
      editSheetModalParams: new ModalParams({
        component: this,
        key: 'editSheetModalParams',
      }),
      nextItemLoader: new ItemLoader({
        component: this,
        key: 'nextItemLoader',
        axiosGetter: () => getAxios('toro-client'),
        itemName: 'sheet',
        ItemKlass: Sheet,
        url: `/stashes/${this.props.stash.id}/sheets/${sheetId}/next.json`,
        callback: (sheet) => {
          this.props.dispatch(push(`${this.props.urlPrefix}/sheets/${sheet.id}`));
        },
      }),
      previousItemLoader: new ItemLoader({
        component: this,
        key: 'previousItemLoader',
        axiosGetter: () => getAxios('toro-client'),
        itemName: 'sheet',
        ItemKlass: Sheet,
        url: `/stashes/${this.props.stash.id}/sheets/${sheetId}/previous.json`,
        callback: (sheet) => {
          this.props.dispatch(push(`${this.props.urlPrefix}/sheets/${sheet.id}`));
        },
      }),
      attachmentIndex: 0,
    };
  }

  componentWillMount() {
    this.loadItem();
  }


  loadItem = () => {
    this.state.itemLoader.loadItem();
  }

  goLeft = () => {
    if (!this.state.previousItemLoader.isLoading) {
      this.state.previousItemLoader.loadItem();
    }
  }

  goRight = () => {
    if (!this.state.nextItemLoader.isLoading) {
      this.state.nextItemLoader.loadItem();
    }
  }

  goTo = (slide) => {
    this.slider.refs.slick.slickGoTo(slide);
  }

  handleCancel = () => {
    this.props.dispatch(push(`${this.props.urlPrefix}/sheets`));
  }

  handleDeleteSheet = () => {
    const { stash } = this.props;
    const { itemLoader } = this.state;

    this.state.deleteSheetActioner.do(`/stashes/${stash.id}/sheets/${itemLoader.item.id}.json`);
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

    if (attachments.length === 0) {
      return null;
    }

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
    const { deleteSheetActioner, editSheetModalParams } = this.state;

    const actions = renderActions([{
      component: (
        <Menu.Item key="edit_sheet">
          <a
            onClick={editSheetModalParams.show}
            className={styles.ActionItem}
          >
            <Icon type="edit" />
            &nbsp;Edit
          </a>
        </Menu.Item>
      ),
      canAccess: sheet.canDelete(),
    }, {
      component: (
        <Menu.Item key="delete_sheet">
          <Popconfirm
            title="Are you sure？"
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={this.handleDeleteSheet}
          >
            <a className={styles.ActionItem}>
              <Icon type="close" />
              &nbsp;Delete
            </a>
          </Popconfirm>
        </Menu.Item>
      ),
      canAccess: sheet.canDelete(),
    }]);

    if (actions.length === 0) {
      return null;
    }

    const menu = (
      <Menu>
        {actions}
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <a className={styles.DropdownLink}>
          <Icon type="ellipsis" />
        </a>
      </Dropdown>
    );
  }


  render() {
    const { stash, baseStyles } = this.props;
    const { itemLoader, editSheetModalParams } = this.state;
    const item = itemLoader.item;

    const title = (item.hasTitle()) ? (
      <div>
        {item.title}
      </div>
    ) : (
      <div className="help-text">
        No title found...
      </div>
    );

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
      <div
        className={styles.Container}
      >
        <a className={styles.CloseButton} onClick={this.handleCancel}>
          <Icon type="close" />
        </a>
        <a className={styles.LeftButton} onClick={this.goLeft}>
          <Icon type="left" />
        </a>
        <a className={styles.RightButton} onClick={this.goRight}>
          <Icon type="right" />
        </a>
        <Modal
          className={styles.Modal}
          visible={true}
          footer={null}
          onCancel={this.handleCancel}
          width={920}
          closable={false}
        >
          <EditSheetModal
            key={editSheetModalParams.uuid}
            modalParams={editSheetModalParams}
            sheet={item}
            stash={stash}
            loadItem={this.loadItem}
          />
          <LoaderContent
            firstLoading={itemLoader.isFirstLoading()}
            loading={itemLoader.isLoading}
            errors={{
              errorStatus: itemLoader.errorStatus,
            }}
            onRetry={this.loadItem}
          >
            <Row>
              <Col sm={24}>
                <div className={styles.Actions}>
                  {this.renderActions(item)}
                </div>
                <div className="clearfix" />
              </Col>
              <Col sm={12} className={styles.LeftSection}>
                {this.renderAttachments(item)}
                {this.renderAuthor(item)}
              </Col>
              <Col sm={12} className={styles.RightSection}>
                <div className={styles.Title}>
                  {title}
                </div>
                <div className={styles.Description}>
                  {description}
                </div>
              </Col>
            </Row>
          </LoaderContent>
        </Modal>
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(SheetPage);
