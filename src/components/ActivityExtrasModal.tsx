import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, Button, Tag } from 'antd';

const styles = require('./ActivityExtrasModal.scss');

class ExtrasSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: any;
  state: any;

  render() {
    const { activity } = this.props;

    return (
      <React.Fragment>
        {activity.extras.map((extra) => {
          return (
            <div key={extra.id}>
              <Tag color="#108ee9">
                {extra.key}
              </Tag>
              <small>
                {extra.value}
              </small>
            </div>
          );
        })}
      </React.Fragment>
    )
  }
}

class ActivityExtrasModal extends React.Component {
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
      <Modal footer={footer} maskClosable={false} title="Extras" visible={this.props.modalParams.visible} onCancel={this.handleCancel} cancelText="Cancel" className={styles.Component}>
        <ExtrasSection activity={activity} />
      </Modal>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(ActivityExtrasModal);
export {
  ExtrasSection,
}