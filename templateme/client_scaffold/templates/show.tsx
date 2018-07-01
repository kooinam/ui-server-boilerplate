import * as React from 'react';
import { connect } from 'react-redux';
import { getAxios, ItemLoader, setupBreadcrumbIdentifiers, ErrorContainer, BaseRouteComponent } from 'awry-utilities-2';
import { Card, Tabs, Spin } from 'antd';
import { push } from 'react-router-redux';

import <%= name.capitalize() %> from '../models/<%= name.capitalize() %>';
import <%= name.capitalize() %>Section from '../client_components/<%= name.capitalize() %>Section';

const styles = require('./<%= name.capitalize() %>Page.scss');

class <%= name.capitalize() %>Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('<%= axiosName %>'),
        itemName: '<%= name %>',
        ItemKlass: <%= name.capitalize() %>,
        url: `/stores/${this.props.storeId}/<%= name.pluralize() %>/${this.props.match.params.<%= routeField %>}.json`,
        callback: () => {
          this.props.dispatch(setupBreadcrumbIdentifiers({
            <%= breadcrumbField %>: this.state.itemLoader.item.<%= titleField %>,
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
      <%= breadcrumbField %>: '',
    }));

    this.loadItem();
  }

  props: any;
  state: any;
  loadItem: any;

  handleClickTab = (tab) => {
    this.props.dispatch(push(`<%= pathPrefix %>/stores/${this.props.storeId}/<%= name.pluralize() %>/${this.props.match.params.<%= routeField %>}/${tab}`));
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
        <Tabs.TabPane tab="<%= name.split().capitalize() %>" key="">
          <Spin spinning={this.state.itemLoader.isLoading}>
            <<%= name.capitalize() %>Section <%= name.camelcase() %>={this.state.itemLoader.item} loadItem={this.loadItem} storeId={this.props.storeId} />
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

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(<%= name.capitalize() %>Page);
