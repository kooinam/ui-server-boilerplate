/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import type { Connector } from 'react-redux';
import { Link } from 'react-router-dom';

import type { Reducer } from '../../types';
import SignInForm from './SignInForm';
import styles from './SignInModal.scss';

type Props = {
  modalParams: Object,
};

class SignInModal extends React.Component {
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
        title="LOGIN"
        visible={this.props.modalParams.visible}
        footer={null}
        onCancel={this.props.modalParams.dismiss}
      >
        <div className={styles.SignInForm}>
          <SignInForm
            onAuthenticated={this.props.modalParams.dismiss}
          />
          <Link
            to="/forget_password"
            target="_blank"
            className={styles.ForgetPassword}
          >
            Forget Password?
          </Link>
        </div>
        <hr />
        <div className={styles.SignUpLink}>
          DON'T HAVE AN ACCOUNT?
          <Button type="primary" className={`btn-primary btn-block`} onClick={this.props.onClickSignUp}>
            CREATE ACCOUNT
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

export default connector(SignInModal);
