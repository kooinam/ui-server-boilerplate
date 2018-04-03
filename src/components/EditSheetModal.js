/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Row, Col, Icon } from 'antd';
import type { Connector } from 'react-redux';
import { getAxios, Actioner } from 'awry-utilities';
import { push } from 'react-router-redux';

import type { Reducer } from '../../types';
import styles from './EditSheetModal.scss';
import Sheet from '../models/Sheet';
import { SheetInputs } from './NewSheetModal';
import { updateSheet } from '../actions/sheet';

class EditSheetModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('toro-client'),
        method: 'patch',
        itemName: 'sheet',
        ItemKlass: Sheet,
        successMessageGetter: (sheet) => {
          return 'Sheet updated successfully';
        },
        successCallback: (sheet) => {
          this.props.modalParams.dismiss();
          this.props.loadItem();
          this.props.dispatch(updateSheet(sheet));
        },
        errorMessageGetter: (error) => {
          return `Failed to update Sheet`;
        },
      }),
    };
  }

  handleSubmit = () => {
    const { form, stash, sheet } = this.props;

    form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = form.getFieldsValue();
      const params = {
        sheet: attributes,
      };

      this.state.actioner.do(`stashes/${stash.id}/sheets/${sheet.id}.json`, params);

      return true;
    });
  }

  render() {
    const { modalParams, sheet, form } = this.props;
    const { actioner } = this.state;

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
      >
        OK
      </Button>
    )];

    return (
      <Modal
        className={styles.Component}
        maskClosable={false}
        title="Edit Sheet"
        visible={modalParams.visible}
        footer={footer}
        onCancel={modalParams.dismiss}
      >
        <Form>
          <SheetInputs {...{ sheet, form ,actioner, edit: true, component: this, }} />
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

export default connector(Form.create()(EditSheetModal));
