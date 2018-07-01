import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, Button, Tag } from 'antd';

const styles = require('./ActivityExtrasModal.scss');

class ActorChangesSection extends React.Component {
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
        {activity.actor_changes.map((actorChange) => {
          return (
            <div key={actorChange.id}>
              <Tag color="#108ee9">
                {actorChange.key}
              </Tag>
              <small>
                {actorChange.value}
              </small>
            </div>
          );
        })}
      </React.Fragment>
    )
  }
}

class ActivityActorChangessModal extends React.Component {
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
      <Modal footer={footer} maskClosable={false} title="Changes" visible={this.props.modalParams.visible} onCancel={this.handleCancel} cancelText="Cancel" className={styles.Component}>
        <ActorChangesSection activity={activity} />
      </Modal>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(ActivityActorChangessModal);
export {
  ActorChangesSection,
}