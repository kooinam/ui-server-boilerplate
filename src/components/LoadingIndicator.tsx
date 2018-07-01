import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Spin } from 'antd';

const styles = require('./LoadingIndicator.scss');

class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    return (
      <Modal maskClosable={false} title={null} visible={this.props.modalParams.visible} footer={null} className={styles.Component}>
        <Spin />
      </Modal>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(LoadingIndicator);
