import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, Button, Tag } from 'antd';

import ActivitySection from './ActivitySection';

const styles = require('./ActivityModal.scss');

class ActivityModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  handleCancel = () => {
    this.props.modalParams.dismiss();
  }

  render() {
    const { activity } = this.props;

    const footer = [(
      <Button key="cancel" onClick={this.handleCancel}>Cancel</Button>
    )];

    return (
      <Modal footer={footer} maskClosable={false} title="Activities" visible={this.props.modalParams.visible} onCancel={this.handleCancel} cancelText="Cancel" className={styles.Component} width={800}>
        <ActivitySection activity={activity} />
      </Modal>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(ActivityModal);
