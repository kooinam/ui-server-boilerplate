/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { getAxios, ItemLoader, LoaderContent, setupBreadcrumbIdentifiers, matchRouteParams, matchRouteProperty, BaseRouteComponent } from 'awry-utilities';

import styles from './BaseStashPage.scss';
import Stash from '../models/Stash';

class BaseStashPage extends Component {
  constructor(props) {
    super(props);

    const { matchedRoutes } = this.props;
    const stashId = matchRouteParams(matchedRoutes, 'stashId');

    this.state = {
      itemLoader: new ItemLoader({
        component: this,
        key: 'itemLoader',
        axiosGetter: () => getAxios('toro-client'),
        itemName: 'stash',
        ItemKlass: Stash,
        url: `/stashes/${stashId}.json`,
        callback: (item) => {
          this.props.dispatch(setupBreadcrumbIdentifiers({
            stashName: item.name,
          }));
        },
      }),
      urlPrefix: `${(matchRouteProperty(this.props.matchedRoutes, 'urlPrefix') || '')}/stashes/${stashId}`,
    };
  }

  componentWillMount = () => {
    this.loadItem();
  }

  loadItem = () => {
    this.state.itemLoader.loadItem();
  }

  render() {
    const { itemLoader, editStashModalParams, urlPrefix } = this.state;
    const stash = itemLoader.item;

    return (
      <div className={styles.Container}>
        <LoaderContent
          firstLoading={itemLoader.isFirstLoading()}
          loading={itemLoader.isLoading}
          isError={itemLoader.isError}
          onRetry={this.loadItem}
        >
          <BaseRouteComponent {...this.props} matchedRoutes={this.props.matchedRoutes} loadItem={this.loadItem} stash={stash} urlPrefix={urlPrefix} baseStyles={styles} />
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

export default connector(BaseStashPage);
