/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import type { Connector } from 'react-redux';
import { ItemLoader, getAxios } from 'awry-utilities';
import { Row, Col } from 'antd';

import styles from './LinkPreviewSection.scss';
import LinkPreview from '../models/LinkPreview';

class LinkPreviewSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('toro-client'),
        itemName: 'link_preview',
        ItemKlass: LinkPreview,
        url: `/link_previews.json`,
        isLoading: false,
        callback: () => {
          if (this.props.reload) {
            this.props.reload();
          }
        }
      }),
    };
  }

  componentDidMount = () => {
    this.loadItem();
  }

  loadItem = () => {
    const { link } = this.props;
    const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;

    if (regex.test(link)) {
      this.state.itemLoader.loadItem({
        link: link,
      });
    }
  }

  render() {
    const { link, vertical } = this.props;
    const { itemLoader } = this.state;
    const linkPreview = itemLoader.item;

    if (vertical) {
      return (
        <Spin spinning={itemLoader.isLoading}>
          {
            (linkPreview.id) ? (
              <Row className={`${styles.Component} ${styles.Unbordered} ${this.props.className}`} gutter={8}>
                {
                  linkPreview.image_src && (
                    <Col span={24}>
                      <img src={linkPreview.image_src} />
                    </Col>
                  )
                }
                <Col span={24}>
                  <div className={styles.Title}>
                    {linkPreview.title}
                  </div>
                </Col>
              </Row>
            ) : null
          }
        </Spin>
      );
    }

    return (
      <Spin spinning={itemLoader.isLoading}>
        <a href={linkPreview.url} target="_blank">
          {
            (linkPreview.id) ? (
              <Row className={`${styles.Component} ${styles.Bordered} ${this.props.className}`} gutter={8}>
                {
                  linkPreview.image_src && (
                    <Col span={12}>
                      <img src={linkPreview.image_src} />
                    </Col>
                  )
                }
                <Col span={(linkPreview.image_src) ? 12 : 24}>
                  <div className={styles.Title}>
                    {linkPreview.title}
                  </div>
                  <div className={styles.Description}>
                    {linkPreview.description}
                  </div>
                </Col>
              </Row>
            ) : null
          }
        </a>
      </Spin>
    );
  }
}

const connector = connect(
  (state) => {
    return {};
  }
);

export default connector(LinkPreviewSection);
