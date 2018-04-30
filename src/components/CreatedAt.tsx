import * as React from 'react';
import { connect } from 'react-redux';
import { formatDate, formatTime } from 'awry-utilities-2';

const styles = require('./CreatedAt.scss');

class CreatedAt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    const { createdAt, inline } = this.props;

    if (inline) {
      return (
        <div>
          <small>
            {formatDate(createdAt)}
          </small>
          &nbsp;
          <small>
            {formatTime(createdAt)}
          </small>
        </div>
      );
    }

    return (
      <div>
        <small>
          {formatTime(createdAt)}
        </small>
        <br />
        {formatDate(createdAt)}
      </div>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(CreatedAt);
