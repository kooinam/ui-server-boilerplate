/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import styles from './SearchPage.scss';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={styles.Container}>
        SEARCHING...
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
