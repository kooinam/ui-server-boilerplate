import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Form } from 'antd';
import { Actioner, getAxios } from 'awry-utilities-2';

import User from '../models/User';
import { UserInputs } from './NewUserModal';

const styles = require('./EditUserModal.scss');

class EditUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actioner: new Actioner({
        component: this,
        key: 'actioner',
        axiosGetter: () => getAxios('admin'),
        method: 'patch',
        itemName: 'user',
        ItemKlass: User,
        successMessageGetter: (user) => {
          return `User ${user.email} updated successfully`;
        },
        successCallback: (user) => {
          this.props.modalParams.dismiss();
          if (this.props.onSuccess) {
            this.props.onSuccess(user);
          }
        },
        errorMessageGetter: (error) => {
          return `Failed to update User ${this.props.user.email}`;
        },
      }),
    };
  }

  props: any;
  state: any;

  handleCancel = () => {
    this.props.modalParams.dismiss();
  }

  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        return false;
      }

      const attributes = (this.props.form.getFieldsValue());
      const params = {
        user: attributes,
      };

      this.state.actioner.do(`/users/${this.props.user.id}.json`, params);
      return true;
    });
  }

  render() {
    const { user, form } = this.props;
    const { actioner } = this.state;

    return (
      <Modal maskClosable={false} title="Edit User" visible={this.props.modalParams.visible} onCancel={this.handleCancel} onOk={this.handleOk} okText="Confirm" cancelText="Cancel" confirmLoading={this.state.actioner.isLoading} className={styles.Component}>
        <Form>
          <UserInputs {...{ user, form, actioner, edit: true }} />
        </Form>
      </Modal>
    );
  }
}

const connector = connect(
  (reducer) => {
    return {};
  }
);

export default connector(Form.create()(EditUserModal));
