/* @flow */

import React from 'react';
import Helmet from 'react-helmet';

import styles from './NotFoundPage.scss';

export default () => (
  <div className={styles.Container}>
    <Helmet title="Oops" />
    <p>Oops, Page was not found!</p>
  </div>
);
