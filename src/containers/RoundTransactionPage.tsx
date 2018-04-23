import * as React from 'react';
import { connect } from 'react-redux';
import { getAxios, ItemLoader, BaseRouteComponent, matchRouteParams, LoaderContent } from 'awry-utilities-2';
import { Card, Tabs } from 'antd';
import { push } from 'react-router-redux';

import RoundTransaction from '../models/RoundTransaction';
import RoundTransactionSection from '../components/RoundTransactionSection';

const styles = require('./RoundTransactionPage.scss');

class RoundTransactionPage extends React.Component {
  constructor(props) {
    super(props);

    const { playerId, gameId, roundId } = this.props;

    this.state = {
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('thronetec-admin'),
        itemName: 'round_transaction',
        ItemKlass: RoundTransaction,
        url: `/round_transactions.json?player_id=${playerId}&game_id=${gameId}&round_id=${roundId}`,
        errorMessageGetter: (error) => {
          return error.data.error_message;
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
    this.loadItem();
  }

  props: any;
  state: any;
  loadItem: any;

  handleClickTab = (tab) => {
    const { formatRoundTransactionPath, playerId, gameId, roundId } = this.props;

    this.props.dispatch(push(`${formatRoundTransactionPath(playerId, gameId, roundId)}/${tab}`));
  }

  handleMount = (component) => {
    if (this.state.activeTabKey !== component.props.routeProps.tabKey) {
      this.setState({
        activeTabKey: component.props.routeProps.tabKey,
      });
    }
  }

  renderItem = () => {
    return (
      <Tabs
        onTabClick={this.handleClickTab}
        activeKey={this.state.activeTabKey}
      >
        <Tabs.TabPane tab="Round Transaction" key="">
          <RoundTransactionSection roundTransaction={this.state.itemLoader.item} loadItem={this.loadItem} />
        </Tabs.TabPane>
      </Tabs>
    );
  }

  render() {
    const { itemLoader } = this.state;

    return (
      <div className={styles.Container}>
        <LoaderContent
          noTextCenter
          firstLoading={itemLoader.isFirstLoading()}
          loading={itemLoader.isLoading}
          errors={{
            errorStatus: itemLoader.errorStatus,
          }}
          onRetry={this.loadItem}
        >
          {this.renderItem()}
        </LoaderContent>
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

export default connector(RoundTransactionPage);
