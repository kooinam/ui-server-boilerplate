import * as React from 'react';
import { connect } from 'react-redux';
import { getAxios, ItemLoader, setupBreadcrumbIdentifiers, ErrorContainer, BaseRouteComponent } from 'awry-utilities-2';
import { Card, Tabs, Spin } from 'antd';
import { push } from 'react-router-redux';

import Session from '../models/Session';
import SessionSection from '../components/SessionSection';
import SessionActivitiesPage from '../containers/SessionActivitiesPage';

const styles = require('./SessionPage.scss');

class SessionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('admin'),
        itemName: 'session',
        ItemKlass: Session,
        url: `/sessions/${this.props.match.params.sessionId}.json`,
        callback: () => {
          this.props.dispatch(setupBreadcrumbIdentifiers({
            sessionId: this.state.itemLoader.item.id,
          }));
        },
      }),
      activeTabKey: null,
    };

    setTimeout(() => {
      if (this.state.activeTabKey === null) {
        this.handleClickTab('');
      }
    }, 100);

    this.loadItem = this.state.itemLoader.loadItem;
  }

  componentDidMount() {
    this.props.dispatch(setupBreadcrumbIdentifiers({
      sessionId: '',
    }));

    this.loadItem();
  }

  props: any;
  state: any;
  loadItem: any;

  handleClickTab = (tab) => {
    this.props.dispatch(push(`/sessions/${this.props.match.params.sessionId}/${tab}`));
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

    return (
      <Tabs
        onTabClick={this.handleClickTab}
        activeKey={this.state.activeTabKey}
      >
        <Tabs.TabPane tab="Session" key="">
          <Spin spinning={this.state.itemLoader.isLoading}>
            <SessionSection session={this.state.itemLoader.item} loadItem={this.loadItem} />
          </Spin>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Activities" key="activities">
          <SessionActivitiesPage session={this.state.itemLoader.item} loadItem={this.loadItem} />
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

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(SessionPage);
