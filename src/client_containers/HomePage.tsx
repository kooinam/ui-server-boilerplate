import * as React from 'react';
import { connect } from 'react-redux';

const styles = require('./HomePage.scss');

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    return (
      <div
        className={styles.Container}
      >
      </div>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(HomePage);