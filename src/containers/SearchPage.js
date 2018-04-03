/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { getAxios, ItemLoader, LoaderContent, setupBreadcrumbIdentifiers, matchRouteParams, matchRouteProperty, BaseRouteComponent } from 'awry-utilities';

import styles from './SearchPage.scss';
import StashesSection from '../components/StashesSection';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    const { matchedRoutes } = this.props;
    const term = matchRouteParams(matchedRoutes, 'term');
    this.props.dispatch(setupBreadcrumbIdentifiers({
      term: term,
    }));

    this.state = {};
  }

  render() {
    return (
      <div className={styles.Container}>
        <StashesSection
          urlPrefix=""
        />
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(SearchPage);
