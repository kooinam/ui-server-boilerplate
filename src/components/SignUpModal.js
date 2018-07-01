/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';

import SignUpForm from './SignUpForm'
import styles from './SignUpModal.scss';

class SignUpModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Modal
        className={styles.Component}
        width={300}
        maskClosable={false}
        title="SIGN UP"
        visible={this.props.modalParams.visible}
        footer={null}
        onCancel={this.props.hideModal}
      >
        <div className={styles.SignUpForm}>
          <SignUpForm
            onAuthenticated={
              () => {
                this.props.hideModal();
                if (this.props.onAuthenticated) {
                  this.props.onAuthenticated();
                }
              }
            }
          />
        </div>
        <hr className="hr-lg" />
        <div className={styles.LoginLink}>
          ALREADY HAVE AN ACCOUNT?
          <Button type="primary" className={`btn-secondary btn-block`} onClick={this.props.onClickSignIn}>
            LOGIN
          </Button>
        </div>
      </Modal>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector = connect(
  (reducer: Reducer) => ({ }),
);
/* eslint-enable no-unused-vars */

export default connector(SignUpModal);
