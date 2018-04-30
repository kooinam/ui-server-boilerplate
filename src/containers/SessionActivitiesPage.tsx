import * as React from 'react';
import { connect } from 'react-redux';

import ActivitiesSection from '../components/ActivitiesSection';

const styles = require('./SessionActivitiesPage.scss');

class SessionsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    return (
      <div className={styles.Container}>
        <ActivitiesSection sessionId={this.props.session.id} />
      </div>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(SessionsPage);
