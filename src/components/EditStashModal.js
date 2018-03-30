/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'antd';
import type { Connector } from 'react-redux';
import { getAxios, Actioner } from 'awry-utilities';
import { push } from 'react-router-redux';

import type { Reducer } from '../../types';
import styles from './EditStashModal.scss';
import Stash from '../models/Stash';
import { CommonStashFormInputs } from './NewStashModal';

class EditStashModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'stash',
        ItemKlass: Stash,
        successMessageGetter: (stash) => {
          return `Stash ${stash.name} updated successfully`;
        },
        successCallback: (stash) => {
          this.props.modalParams.dismiss();
          this.props.loadItem();
        },
        errorMessageGetter: (error) => {
          return `Failed to update Stash`;
        },
      }),
      attachmentId: null,
      isUploading: false,
    };
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { attachmentId } = this.state;

    form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = form.getFieldsValue();
      const params = {
        stash: attributes,
        attachment_id: attachmentId,
      };

      this.state.actioner.do(`/stashes/${this.props.stash.id}.json`, params);

      return true;
    });
  }

  render() {
    const { modalParams, stash, form } = this.props;
    const { actioner, isUploading } = this.state;

    const footer = [(
      <Button
        key="cancel"
        className="btn-tertiary"
        onClick={modalParams.dismiss}
      >
        Cancel
      </Button>
    ), (
      <Button
        key="ok"
        className="btn-primary"
        onClick={this.handleSubmit}
        loading={actioner.isLoading}
        disabled={isUploading}
      >
        OK
      </Button>
    )];

    return (
      <Modal
        className={styles.Component}
        maskClosable={false}
        title={`Edit Stash ${stash.name}`}
        visible={modalParams.visible}
        footer={footer}
        onCancel={modalParams.dismiss}
      >
        <Form>
          <CommonStashFormInputs {...{ component: this, actioner, stash, form }} />
        </Form>
      </Modal>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({ }),
);
/* eslint-enable no-unused-vars */

export default connector(Form.create()(EditStashModal));
