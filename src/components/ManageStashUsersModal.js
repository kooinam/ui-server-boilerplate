/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Row, Col, Upload, Icon, Input } from 'antd';
import type { Connector } from 'react-redux';
import { getAxios, getBaseUrl, getHeadersSetter, getFieldError, Actioner, FilterSelect, TableParams } from 'awry-utilities';
import { push } from 'react-router-redux';

import type { Reducer } from '../../types';
import styles from './ManageStashUsersModal.scss';
import Sheet from '../models/Sheet';
import Stash from '../models/Stash';

class ManageStashUsersModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'post',
        itemName: 'sheet',
        ItemKlass: Sheet,
        successMessageGetter: (sheet) => {
          return 'Sheet created successfully';
        },
        successCallback: (sheet) => {
          this.props.modalParams.dismiss();
        },
        errorMessageGetter: (error) => {
          return `Failed to create Sheet`;
        },
      }),
      attachmentIds: [],
      isUploading: false,
      uploading: [],
    };
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { attachmentIds } = this.state;

    form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = form.getFieldsValue();
      const params = {
        sheet: attributes,
        attachment_ids: attachmentIds,
      };
      if (params.sheet.stash_id) {
        params.sheet.stash_id = params.sheet.stash_id.key;
      }

      this.state.actioner.do('/sheets.json', params);

      return true;
    });
  }

  render() {
    const { modalParams, stash, sheet, form } = this.props;
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
        width={800}
        maskClosable={false}
        title="Create Sheet"
        visible={modalParams.visible}
        footer={footer}
        onCancel={modalParams.dismiss}
      >
        <Form>
        </Form>
      </Modal>
    );
  }
}

/* eslint-disable no-unused-vars */
const connector: Connector<{}, Props> = connect(
  (reducer: Reducer) => ({}),
);
/* eslint-enable no-unused-vars */

export default connector(Form.create()(ManageStashUsersModal));
