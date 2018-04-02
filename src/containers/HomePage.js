/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import styles from './HomePage.scss';
import StashesSection from '../components/StashesSection';

class HomePage extends Component {
  constructor(props) {
    super(props);

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

export default connector(HomePage);
