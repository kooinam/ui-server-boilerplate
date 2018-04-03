/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import styles from './StashUsersPage.scss';
import StashUsersSection from '../components/StashUsersSection';

class StashRequestingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { stash, urlPrefix } = this.props;

    return (
      <StashUsersSection stash={stash} urlPrefix={urlPrefix} scope="requesting" />
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(StashRequestingsPage);