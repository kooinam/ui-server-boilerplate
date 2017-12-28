/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import type { Connector } from 'react-redux';

import SignUpForm from './SignUpForm'
import styles from './SignUpModal.scss';

type Props = {
  modalParams: Object,
};

class SignUpModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  props: Props;

  render() {
    return (
      <Modal
        className={styles.Component}
        width={300}
        maskClosable={false}
        title="SIGN UP"
        visible={this.props.modalParams.visible}
        footer={null}
        onCancel={this.props.modalParams.dismiss}
      >
        <div className={styles.SignUpForm}>
          <SignUpForm
            onAuthenticated={this.props.modalParams.dismiss}
          />
        </div>
        <hr />
        <div className={styles.LoginLink}>
          ALREADY HAVE AN ACCOUNT?
          <Button type="primary" className={`btn-primary btn-block`} onClick={this.props.onClickSignIn}>
            LOGIN
          </Button>
        </div>
      </Modal>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({ }),
);
/* eslint-enable no-unused-vars */

export default connector(SignUpModal);
