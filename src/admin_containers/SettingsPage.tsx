import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAxios, ItemLoader, ModalParams, ErrorContainer, BaseRouteComponent, DetailsContainer } from 'awry-utilities-2';
import { Card, Tabs, Spin, Row, Col, Button } from 'antd';
import { push } from 'react-router-redux';

import Settings from '../models/Settings';
import EditSettingsModal from '../admin_components/EditSettingsModal';

const styles = require('./SettingsPage.scss');

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('admin'),
        itemName: 'settings',
        ItemKlass: Settings,
        url: '/settings.json',
      }),
      editSettingsModalParams: new ModalParams({
        component: this,
        key: 'editSettingsModalParams',
      }),
      activeTabKey: null,
    };

    setTimeout(() => {
      if (this.state.activeTabKey === null) {
        this.handleClickTab('');
      }
    }, 100);

    this.loadItem = this.state.itemLoader.loadItem.bind(this);
  }

  componentDidMount() {
    this.loadItem();
  }

  state: any;
  props: any;
  loadItem: any;

  handleClickTab = (tab) => {
    this.props.dispatch(push(`/settings/${tab}`));
  }

  handleMount = (component) => {
    if (this.state.activeTabKey !== component.props.routeProps.tabKey) {
      this.setState({
        activeTabKey: component.props.routeProps.tabKey,
      });
    }
  }

  renderItem = () => {
    if (this.state.itemLoader.isError) {
      return (
        <ErrorContainer
          key={this.state.itemLoader.uuid}
          spinning={this.state.itemLoader.isLoading}
          onRetry={this.loadItem}
        />
      );
    }

    const settings = this.state.itemLoader.item;

    const details = [{
      title: 'Client Host',
      value: settings.client_host,
      size: 'lg',
    }, {
      title: 'Sender Email',
      value: settings.sender_email,
    }, {
      title: 'BCC Email',
      value: settings.bcc_email,
    }];

    return (
      <Tabs
        onTabClick={this.handleClickTab}
        activeKey={this.state.activeTabKey}
      >
        <Tabs.TabPane tab="Settings" key="">
          <Spin spinning={this.state.itemLoader.isLoading}>
            <EditSettingsModal
              key={this.state.editSettingsModalParams.uuid}
              modalParams={this.state.editSettingsModalParams}
              settings={settings}
              onSuccess={this.loadItem}
            />
            <Row>
              <Col md={12} className="actions-listing">
                <Button shape="circle" icon="reload" onClick={this.loadItem} />
              </Col>
              <Col md={12} className="pull-right actions-listing">
                <Button shape="circle" onClick={this.state.editSettingsModalParams.show} icon="edit" type="primary" />
              </Col>
            </Row>
            <Row className="ant-card-content">
              <DetailsContainer details={details} />
            </Row>
          </Spin>
        </Tabs.TabPane>
      </Tabs>
    );
  }

  render() {
    return (
      <div className={styles.Container}>
        <Card title={null} loading={this.state.itemLoader.isFirstLoading()} className="ant-card-lg">
          {this.renderItem()}
        </Card>
        <BaseRouteComponent {...this.props} onMount={this.handleMount} />
      </div>
    );
  }
}

export default SettingsPage;
