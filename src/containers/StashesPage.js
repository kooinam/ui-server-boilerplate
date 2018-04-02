/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { matchRouteProperty } from 'awry-utilities';

import styles from './StashesPage.scss';
import StashesSection from '../components/StashesSection';

class StashesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urlPrefix: (matchRouteProperty(this.props.matchedRoutes, 'urlPrefix') || ''),
      scope: matchRouteProperty(this.props.matchedRoutes, 'scope'),
    };
  }

  render() {
    const { urlPrefix, scope} = this.state;

    return (
      <div className={styles.Container}>
        <StashesSection
          urlPrefix={urlPrefix}
          scope={scope}
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

export default connector(StashesPage);
